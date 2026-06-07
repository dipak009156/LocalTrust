/**
 * sentinelWebhookRoute.js — Async threat alert receiver from Sentinel.
 *
 * Sentinel fires a POST to this route when it detects a threat outside of a
 * normal request cycle (e.g. impossible travel detected by background workers).
 *
 * IMPORTANT: The new Sentinel guide uses express.json() (not express.raw()) and
 * signs the payload with JSON.stringify(req.body). This route must therefore be
 * registered AFTER express.json() — unlike the raw-body approach.
 * Sentinel signs with: sha256=HMAC(JSON.stringify(body), webhookSecret)
 * Confirmed from Sentinel backend/src/routes/webhook.js → signPayload(bodyStr, webhook_secret)
 */

const express = require('express');
const crypto  = require('crypto');
const logger  = require('../utils/logger');
const router  = express.Router();

router.post('/', express.json(), async (req, res) => {
    try {
        // ── Verify HMAC signature ──────────────────────────────────────────────
        const signatureHeader = req.headers['x-sentinel-signature'];
        if (!signatureHeader) {
            logger.warn('[Sentinel Webhook] Missing X-Sentinel-Signature header — rejecting');
            return res.status(401).send('Signature missing');
        }

        const secret = process.env.SENTINEL_WEBHOOK_SECRET;
        if (!secret) {
            logger.error('[Sentinel Webhook] SENTINEL_WEBHOOK_SECRET not set in .env');
            return res.status(500).send('Webhook secret not configured');
        }

        // Sentinel signs JSON.stringify(payload) — confirmed from webhook.js signPayload()
        const payloadStr          = JSON.stringify(req.body);
        const expectedSignature   = 'sha256=' + crypto
            .createHmac('sha256', secret)
            .update(payloadStr)
            .digest('hex');

        if (signatureHeader !== expectedSignature) {
            logger.warn('[Sentinel Webhook] Signature mismatch — rejecting');
            return res.status(403).send('Signature verification failed');
        }

        // ── Handle verified payload ────────────────────────────────────────────
        const { event, user_id, session_id, risk_level, recommended_action } = req.body;

        logger.warn(`[Sentinel Webhook] ${event} | User: ${user_id} | Risk: ${risk_level} | Action: ${recommended_action}`);

        // Evict the session when Sentinel signals TERMINATE_SESSION or CRITICAL risk
        if (recommended_action === 'TERMINATE_SESSION' || risk_level === 'CRITICAL') {
            const sessionBlacklist = require('../utils/sessionBlacklist');
            if (session_id) {
                sessionBlacklist.add(session_id);
                logger.error(`[Sentinel Webhook] Session evicted: ${session_id} (user: ${user_id})`);
            }
        }

        // Respond 200 fast — Sentinel retries on timeout
        return res.status(200).send('Webhook processed');

    } catch (err) {
        logger.error('[Sentinel Webhook] Error:', err.message);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
