/**
 * securePost.js — Sentinel-protected POST wrapper.
 *
 * Drop-in replacement for api.post() on sensitive routes.
 * Attaches the current behavioral telemetry snapshot and the session ID header
 * so sentinelGuard.js on the backend can evaluate the request.
 *
 * Usage:
 *   import { securePost } from '../../utils/securePost';
 *   const result = await securePost('/booking', { categoryId, address });
 *
 * Verdict handling (check result after the call):
 *   result.sentinelVerdict === 'STEP_UP_AUTH'       → show OTP step-up modal
 *   result.sentinelVerdict === 'BLOCK'               → show blocked error
 *   result.sentinelVerdict === 'TERMINATE_SESSION'   → logout user
 *   (no sentinelVerdict field)                       → normal success
 *
 * BLOCK and TERMINATE_SESSION also come back as HTTP 403 which axios throws,
 * so they will be caught by the component's catch(err) block as well.
 */
import api        from './api';
import { sentinel } from './sentinelClient';

/**
 * @param {string} endpoint  — relative path, e.g. '/booking'
 * @param {object} body      — your original request payload
 * @returns {Promise<object>} — response.data (already unwrapped from axios)
 */
export async function securePost(endpoint, body = {}) {
    // Snapshot of all behavioral data collected since page load / last login
    const telemetry = sentinel.getTelemetry();

    const secureBody = {
        ...body,                        // your original fields unchanged
        sentinelTelemetry: {            // sentinelGuard.js reads this exact key
            device: telemetry.device,   // fingerprint, browser, OS, screen, timezone
            behavioral: {
                typing_speed:   parseFloat(telemetry.behavioral?.typing_speed)  || 0,
                mouse_velocity: parseFloat(telemetry.behavioral?.mouse_velocity) || 0,
                time_on_page:   parseInt(telemetry.behavioral?.time_on_page)     || 0,
            },
        },
    };

    // x-session-id lets sentinelGuard identify the session for blacklist checks.
    // We use the SDK's sessionId which was set to the JWT after login.
    const config = {
        headers: { 'x-session-id': sentinel.sessionId },
    };

    // api.post() returns the full Axios response; we return .data for convenience
    const response = await api.post(endpoint, secureBody, config);
    return response.data;
}
