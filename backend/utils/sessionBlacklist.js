/**
 * sessionBlacklist.js — In-memory Set of terminated session IDs.
 *
 * When sentinelGuard or the webhook route terminates a session, the session ID
 * is added here. On every subsequent request, sentinelGuard checks this Set
 * before making an API call to Sentinel — instant 403 with zero latency.
 *
 * Note: this is process-local. If you run multiple backend instances behind a
 * load balancer, replace this with a Redis SET for cross-instance eviction.
 */

const blacklist = new Set();

module.exports = {
    /** Add a session ID to the blacklist. */
    add(sessionId) {
        if (sessionId) blacklist.add(sessionId);
    },

    /** Check if a session ID is blacklisted. */
    has(sessionId) {
        return sessionId ? blacklist.has(sessionId) : false;
    },

    /** Remove a session ID (e.g. after user re-authenticates). */
    remove(sessionId) {
        blacklist.delete(sessionId);
    },

    /** Number of blacklisted sessions (for monitoring). */
    get size() {
        return blacklist.size;
    },
};
