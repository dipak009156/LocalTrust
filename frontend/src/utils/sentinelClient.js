/**
 * sentinelClient.js — Singleton SDK instance for the entire LocalTrust app.
 *
 * Import { sentinel } anywhere to access the live telemetry tracker.
 * Import { initializeSentinelSession } and call it right after login to bind
 * the user's ID and session token so Sentinel can build per-user baselines.
 *
 * Debug tip: open DevTools and run window.sentinel.getTelemetry() to inspect
 * live behavioral data being collected.
 */
import SentinelSDK from './sentinel-sdk';

// One shared instance — starts collecting mouse + keyboard data immediately.
export const sentinel = new SentinelSDK({
    // VITE_SENTINEL_ENDPOINT: the Sentinel /evaluate URL.
    // LocalTrust backend makes the actual server-to-server call — this endpoint
    // is used only by the SDK to structure its telemetry snapshot.
    endpoint: import.meta.env.VITE_SENTINEL_ENDPOINT || 'http://localhost:3001/evaluate',
    apiKey:   import.meta.env.VITE_SENTINEL_API_KEY,
});

/**
 * Call this immediately after a successful login / OTP verification.
 * Binds the user's ID and JWT (as session ID) to all future telemetry.
 * Without this, Sentinel tracks everything as 'anonymous' and cannot
 * build a per-user behavioral baseline.
 *
 * @param {string|number} userId   — the account ID from your backend
 * @param {string}        sessionId — the JWT token (used as session identifier)
 */
export function initializeSentinelSession(userId, sessionId) {
    if (userId)    sentinel.setUserId(String(userId));
    if (sessionId) sentinel.setSessionId(String(sessionId));
}

// Expose on window for DevTools debugging
if (typeof window !== 'undefined') {
    window.sentinel = sentinel;
}
