/**
 * Sentinel Security SDK — LocalTrust integration copy.
 *
 * Source: Sentinel-Layer-General/sdk/sentinel-sdk.js
 * Extended with: canvas device fingerprinting + device metadata fields
 * so Sentinel's devices table and Algorithm 6 (Levenshtein device check)
 * receive richer data.
 *
 * This file is a client-side only module — no Node.js dependencies.
 */
class SentinelSDK {
    constructor(config = {}) {
        this.endpoint  = config.endpoint  || 'http://localhost:3001/evaluate';
        this.apiKey    = config.apiKey    || null;
        this.userId    = config.userId    || 'anonymous';
        this.sessionId = config.sessionId || this._generateSessionId();

        // Behavioral counters — updated live by event listeners
        this.keystrokes      = 0;
        this.typingStartTime = null;
        this.mouseDistance   = 0;
        this.lastMousePos    = null;
        this.pageLoadTime    = Date.now();
        this.mouseMovements  = [];
        this.typingSpeeds    = [];

        // Device fingerprint — computed once at startup
        this.deviceFingerprint = this._generateCanvasFingerprint();
        this.browser           = this._parseBrowser();
        this.os                = this._parseOS();

        // Start passive event listeners
        this._initListeners();
    }

    /** Bind the logged-in user to all future telemetry. Call after login. */
    setUserId(userId)     { this.userId    = userId;    }
    setSessionId(session) { this.sessionId = session;   }

    /**
     * Returns the current telemetry snapshot.
     * Called by securePost.js before every protected request.
     */
    getTelemetry() {
        const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);

        // Typing speed: characters per minute
        let avgTypingSpeed = 0;
        if (this.keystrokes > 1 && this.typingStartTime) {
            const mins = (Date.now() - this.typingStartTime) / 60000;
            if (mins > 0) avgTypingSpeed = Math.round(this.keystrokes / mins);
        }

        // Mouse velocity: pixels per second
        let avgMouseVelocity = 0;
        if (timeOnPage > 0) {
            avgMouseVelocity = Math.round(this.mouseDistance / timeOnPage);
        }

        return {
            user_id:    this.userId,
            session_id: this.sessionId,
            action:     { type: 'page_view' },
            network: {
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            },
            device: {
                fingerprint:       this.deviceFingerprint,
                browser:           this.browser,
                os:                this.os,
                screen_resolution: typeof window    !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
                language:          typeof navigator !== 'undefined' ? navigator.language : 'en',
                timezone:          typeof Intl       !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
            },
            behavioral: {
                typing_speed:   avgTypingSpeed,
                mouse_velocity: avgMouseVelocity,
                time_on_page:   timeOnPage,
            },
        };
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    _generateSessionId() {
        return 'sess_' + Math.random().toString(36).substring(2, 15)
                       + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Canvas fingerprinting: draws an invisible scene and hashes the pixel data.
     * Each browser/GPU/OS combination renders pixels slightly differently,
     * creating a stable device identifier without tracking personal data.
     */
    _generateCanvasFingerprint() {
        if (typeof document === 'undefined') return 'fp_node_env';
        try {
            const canvas = document.createElement('canvas');
            const ctx    = canvas.getContext('2d');
            if (!ctx) return 'fp_no_context';

            ctx.textBaseline = 'top';
            ctx.font         = '14px Arial';
            ctx.fillStyle    = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle    = '#069';
            ctx.fillText('SentinelSecureDeviceToken', 2, 15);
            ctx.fillStyle    = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('SentinelSecureDeviceToken', 4, 17);

            const dataUrl = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataUrl.length; i++) {
                hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
                hash |= 0;
            }
            return 'fp_' + Math.abs(hash).toString(16);
        } catch {
            return 'fp_fallback';
        }
    }

    _parseBrowser() {
        if (typeof navigator === 'undefined') return 'Node';
        const ua = navigator.userAgent;
        if (ua.includes('Firefox'))                      return 'Firefox';
        if (ua.includes('Edg/') || ua.includes('Edge/')) return 'Edge';
        if (ua.includes('Chrome'))                       return 'Chrome';
        if (ua.includes('Safari'))                       return 'Safari';
        return 'Other';
    }

    _parseOS() {
        if (typeof navigator === 'undefined') return 'Node';
        const p = navigator.platform || '';
        if (p.includes('Win'))                           return 'Windows';
        if (p.includes('Mac'))                           return 'MacOS';
        if (p.includes('Linux'))                         return 'Linux';
        if (p.includes('iPhone') || p.includes('iPad')) return 'iOS';
        if (p.includes('Android'))                       return 'Android';
        return 'Other';
    }

    /** Attaches passive listeners that update counters silently in the background. */
    _initListeners() {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        document.addEventListener('mousemove', (e) => {
            const cur = { x: e.clientX, y: e.clientY };
            if (this.lastMousePos) {
                const dx = cur.x - this.lastMousePos.x;
                const dy = cur.y - this.lastMousePos.y;
                this.mouseDistance += Math.sqrt(dx * dx + dy * dy);
            }
            this.lastMousePos = cur;
        });

        document.addEventListener('keydown', () => {
            if (!this.typingStartTime) this.typingStartTime = Date.now();
            this.keystrokes += 1;
        });
    }
}

// Support both CommonJS and ES Modules
if (typeof module !== 'undefined' && module.exports) module.exports = SentinelSDK;
if (typeof window !== 'undefined') window.SentinelSDK = SentinelSDK;
export default SentinelSDK;
