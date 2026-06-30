/**
 * sentinelGuard.js — Backend middleware for Sentinel Layer integration.
 *
 * Factory middleware: call sentinelGuard('action_name') on any route
 * you want to protect. It will:
 *   1. Check the in-memory session blacklist (fast, no API call)
 *   2. Skip everything if SENTINEL_SHADOW_MODE=true (observe only)
 *   3. Forward request telemetry to the Sentinel /evaluate API (server-to-server)
 *   4. Enforce the returned verdict: ALLOW → next() | BLOCK/TERMINATE → 403 | REQUIRE_MFA → 200+flag
 *
 * Fail-open: if Sentinel is unreachable, the request passes through.
 * Your app must never go down because Sentinel is down.
 */

const axios = require('axios');
const logger = require('../utils/logger');
const sessionBlacklist = require('../utils/sessionBlacklist');

// ── Per-user verdict cache (2-second debounce) ─────────────────────────────────
// Prevents hammering /evaluate when a single user action fires multiple API calls
// in rapid succession (e.g. booking flow). Key: userId, Value: { verdict, ts }.
const verdictCache = new Map();
const CACHE_TTL_MS = 200; // reduced from 2000ms — rapid requests must reach Sentinel individually

function getCachedVerdict(userId, sessionId, actionType) {
    const key = `${userId}:${sessionId}:${actionType}`;
    const entry = verdictCache.get(key);
    if (entry && (Date.now() - entry.ts) < CACHE_TTL_MS) return entry.verdict;
    verdictCache.delete(key);
    return null;
}

function setCachedVerdict(userId, sessionId, actionType, verdict) {
    // BUG-008 FIX: include sessionId in cache key so different sessions
    // for the same user don't share a single cache entry.
    const key = `${userId}:${sessionId}:${actionType}`;
    verdictCache.set(key, { verdict, ts: Date.now() });
    // Auto-cleanup to prevent unbounded memory growth
    setTimeout(() => verdictCache.delete(key), CACHE_TTL_MS + 100);
}

const sentinelGuard = (actionType = 'generic_action') => {
    return async (req, res, next) => {
        try {
            // ── Resolve session ID ──────────────────────────────────────────────
            // securePost.js sends x-session-id; fall back to Authorization JWT.
            // Truncate long JWTs to avoid DB column overflow in Sentinel.
            const rawSessionId = req.headers['x-session-id'] || req.headers.authorization || '';
            const sessionId = rawSessionId.length > 128
                ? rawSessionId.slice(-128)
                : rawSessionId;

            // ── Resolve user ID (set by requireAuth before this middleware) ─────
            const userId = req.user?.id || 'anonymous';

            // ── 1. Blacklist check ─────────────────────────────────────────────
            // Sessions terminated by this middleware or by the webhook route are
            // added to the blacklist. Checking here avoids a Sentinel API call.
            if (sessionId && sessionBlacklist.has(sessionId)) {
                return res.status(403).json({
                    success: false,
                    sentinelVerdict: 'TERMINATE_SESSION',
                    message: 'Your session has been terminated due to suspicious activity. Please log in again.',
                });
            }

            const isShadowMode = process.env.SENTINEL_SHADOW_MODE === 'true';

            // ── 3. Extract telemetry injected by securePost.js ─────────────────
            const { sentinelTelemetry } = req.body || {};

            // ── 4. Call Sentinel /evaluate (server-to-server) ──────────────────
            // Check cache first — if this user was evaluated in the last 2s, reuse verdict.
            let recommended_action = getCachedVerdict(userId, sessionId, actionType);

            if (!recommended_action) {
                const response = await axios.post(
                    process.env.SENTINEL_API_URL,
                    {
                        user_id: String(userId),
                        session_id: String(sessionId),
                        action: { type: actionType },
                        network: {
                            ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
                                || req.socket?.remoteAddress
                                || '127.0.0.1',
                            user_agent: req.headers['user-agent'] || 'unknown',
                        },
                        // geo: only include fields that have real values
                        ...((() => {
                            const lat = parseFloat(sentinelTelemetry?.geo?.lat || req.headers['x-geo-lat']);
                            const lon = parseFloat(sentinelTelemetry?.geo?.lon || req.headers['x-geo-lon']);
                            const country = sentinelTelemetry?.geo?.country || req.headers['x-geo-country'];
                            const geo = {};
                            if (!isNaN(lat)) geo.lat = lat;
                            if (!isNaN(lon)) geo.lon = lon;
                            if (country) geo.country = country;
                            return Object.keys(geo).length ? { geo } : {};
                        })()),
                        device: sentinelTelemetry?.device || {},
                        behavioral: {
                            typing_speed: parseFloat(sentinelTelemetry?.behavioral?.typing_speed) || 0,
                            mouse_velocity: parseFloat(sentinelTelemetry?.behavioral?.mouse_velocity) || 0,
                            time_on_page: parseInt(sentinelTelemetry?.behavioral?.time_on_page) || 0,
                        },
                        flags: {
                            is_vpn: req.headers['x-is-vpn'] === 'true' || false,
                        },
                    },
                    {
                        headers: {
                            'X-Sentinel-Key': process.env.SENTINEL_SECRET_KEY,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000,
                    }
                );

                const risk = response.data?.risk;
                recommended_action = response.data?.recommended_action ?? 'ALLOW';
                logger.info(`[Sentinel] ${actionType} | User: ${userId} | Score: ${risk?.score ?? 'n/a'} | Verdict: ${recommended_action}`);
                setCachedVerdict(userId, sessionId, actionType, recommended_action);
            } else {
                logger.info(`[Sentinel] ${actionType} | User: ${userId} | Verdict: ${recommended_action} (cached)`);
            }


            if (isShadowMode && recommended_action !== 'ALLOW') {
                logger.info(`[Sentinel] SHADOW MODE — Would have enforced: ${recommended_action}`);
                return next();
            }

            switch (recommended_action) {

                case 'TERMINATE_SESSION':
                    // Critical — blacklist this session so all future requests are
                    // blocked instantly without another Sentinel call.
                    sessionBlacklist.add(sessionId);
                    return res.status(403).json({
                        success: false,
                        sentinelVerdict: 'TERMINATE_SESSION',
                        message: 'Your session has been terminated due to suspicious activity. Please log in again.',
                    });

                case 'BLOCK':
                    // High risk — block this specific action, session stays alive.
                    return res.status(403).json({
                        success: false,
                        sentinelVerdict: 'BLOCK',
                        message: 'This action was blocked due to unusual activity. Please try again.',
                    });

                case 'REQUIRE_MFA':
                case 'STEP_UP_AUTH':
                    // Medium risk — frontend shows OTP step-up modal, then retries.
                    return res.status(200).json({
                        success: false,
                        sentinelVerdict: 'STEP_UP_AUTH',
                        stepUpRequired: true,
                        message: 'Verification required to complete this action.',
                    });

                default:
                    // ALLOW — pass to controller
                    return next();
            }

        } catch (err) {
            // Fail-open: Sentinel is unreachable or threw — let request through.
            const errBody = err.response?.data ? JSON.stringify(err.response.data) : '';
            const status  = err.response?.status ?? 'no-response';
            logger.error(`[Sentinel] Fail-open (${actionType}) HTTP ${status}: ${err.message} ${errBody}`);
            return next();
        }
    };
};

module.exports = sentinelGuard;
