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

const axios            = require('axios');
const logger           = require('../utils/logger');
const sessionBlacklist = require('../utils/sessionBlacklist');

const sentinelGuard = (actionType = 'generic_action') => {
    return async (req, res, next) => {
        try {
            // ── Resolve session ID ──────────────────────────────────────────────
            // securePost.js sends x-session-id; fall back to Authorization JWT.
            // Truncate long JWTs to avoid DB column overflow in Sentinel.
            const rawSessionId = req.headers['x-session-id'] || req.headers.authorization || '';
            const sessionId    = rawSessionId.length > 128
                ? rawSessionId.slice(-128)
                : rawSessionId;

            // ── Resolve user ID (set by requireAuth before this middleware) ─────
            const userId = req.user?.id || 'anonymous';

            // ── 1. Blacklist check ─────────────────────────────────────────────
            // Sessions terminated by this middleware or by the webhook route are
            // added to the blacklist. Checking here avoids a Sentinel API call.
            if (sessionId && sessionBlacklist.has(sessionId)) {
                return res.status(403).json({
                    success:         false,
                    sentinelVerdict: 'TERMINATE_SESSION',
                    message:         'Your session has been terminated due to suspicious activity. Please log in again.',
                });
            }

            // ── 2. Shadow mode ─────────────────────────────────────────────────
            // When SENTINEL_SHADOW_MODE=true, Sentinel collects data but never
            // blocks. Use this for the first 2 weeks to build behavioral baselines.
            if (process.env.SENTINEL_SHADOW_MODE === 'true') {
                return next();
            }

            // ── 3. Extract telemetry injected by securePost.js ─────────────────
            const { sentinelTelemetry } = req.body;

            // ── 4. Call Sentinel /evaluate (server-to-server) ──────────────────
            const response = await axios.post(
                process.env.SENTINEL_API_URL,   // e.g. http://localhost:3001/evaluate
                {
                    user_id:    String(userId),
                    session_id: String(sessionId),
                    action:     { type: actionType },
                    network: {
                        ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
                                    || req.socket?.remoteAddress
                                    || '127.0.0.1',
                        user_agent: req.headers['user-agent'] || 'unknown',
                    },
                    device:   sentinelTelemetry?.device || {},
                    behavioral: {
                        typing_speed:   parseFloat(sentinelTelemetry?.behavioral?.typing_speed)  || 0,
                        mouse_velocity: parseFloat(sentinelTelemetry?.behavioral?.mouse_velocity) || 0,
                        time_on_page:   parseInt(sentinelTelemetry?.behavioral?.time_on_page)     || 0,
                    },
                },
                {
                    headers: {
                        'X-Sentinel-Key': process.env.SENTINEL_SECRET_KEY,  // confirmed header name from Sentinel auth.js
                        'Content-Type':   'application/json',
                    },
                    timeout: 15000,   // 15s — Sentinel may run cold-start DB queries
                }
            );

            // ── 5. Enforce verdict ─────────────────────────────────────────────
            // recommended_action confirmed from Sentinel services/evaluate.js response
            const { recommended_action, risk } = response.data;
            logger.info(`[Sentinel] ${actionType} | User: ${userId} | Score: ${risk?.score ?? 'n/a'} | Verdict: ${recommended_action}`);

            switch (recommended_action) {

                case 'TERMINATE_SESSION':
                    // Critical — blacklist this session so all future requests are
                    // blocked instantly without another Sentinel call.
                    sessionBlacklist.add(sessionId);
                    return res.status(403).json({
                        success:         false,
                        sentinelVerdict: 'TERMINATE_SESSION',
                        message:         'Your session has been terminated due to suspicious activity. Please log in again.',
                    });

                case 'BLOCK':
                    // High risk — block this specific action, session stays alive.
                    return res.status(403).json({
                        success:         false,
                        sentinelVerdict: 'BLOCK',
                        message:         'This action was blocked due to unusual activity. Please try again.',
                    });

                case 'REQUIRE_MFA':
                case 'STEP_UP_AUTH':
                    // Medium risk — frontend shows OTP step-up modal, then retries.
                    return res.status(200).json({
                        success:         false,
                        sentinelVerdict: 'STEP_UP_AUTH',
                        stepUpRequired:  true,
                        message:         'Verification required to complete this action.',
                    });

                default:
                    // ALLOW — pass to controller
                    return next();
            }

        } catch (err) {
            // Fail-open: Sentinel is unreachable or threw — let request through.
            logger.error(`[Sentinel] Fail-open (${actionType}): ${err.message}`);
            return next();
        }
    };
};

module.exports = sentinelGuard;
