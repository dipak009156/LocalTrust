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

// ── Tab-scoped session ID ─────────────────────────────────────────────────────
// Each browser tab/window gets a unique ID stored in sessionStorage.
// sessionStorage is NOT shared between tabs (unlike localStorage), so
// even if two tabs are logged in as the same user, Sentinel sees two distinct
// session IDs — enabling concurrent-session detection.
function getOrCreateTabSessionId() {
    const key = 'sentinel_tab_session_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
        // crypto.randomUUID() is available in all modern browsers
        id = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(key, id);
    }
    return id;
}

export const TAB_SESSION_ID = getOrCreateTabSessionId();

// One shared instance — starts collecting mouse + keyboard data immediately.
export const sentinel = new SentinelSDK({
    // VITE_SENTINEL_ENDPOINT: the Sentinel /evaluate URL.
    // LocalTrust backend makes the actual server-to-server call — this endpoint
    // is used only by the SDK to structure its telemetry snapshot.
    endpoint: import.meta.env.VITE_SENTINEL_ENDPOINT || 'http://localhost:3001/evaluate',
    apiKey:   import.meta.env.VITE_SENTINEL_API_KEY,
});

// Pre-set the tab session ID immediately so it's always available
sentinel.setSessionId(TAB_SESSION_ID);

/**
 * Call this immediately after a successful login / OTP verification.
 * Binds the user's ID and keeps the tab-unique session ID for Sentinel.
 *
 * @param {string|number} userId   — the account ID from your backend
 * @param {string}        _jwt     — kept for API compat but NOT used as session ID
 */
export function initializeSentinelSession(userId, _jwt) {
    if (userId) sentinel.setUserId(String(userId));
    // Session ID is already set to the tab-unique ID — do not overwrite with JWT
    // so that concurrent-session detection works correctly.
}

// Expose on window for DevTools debugging
if (typeof window !== 'undefined') {
    window.sentinel = sentinel;
    window.__tabSessionId = TAB_SESSION_ID; // handy for DevTools inspection
}
