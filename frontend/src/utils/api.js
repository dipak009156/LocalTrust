import axios from 'axios';
import { TAB_SESSION_ID } from './sentinelClient';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT + tab-unique session ID on every request ───────────────────────
// x-session-id is read by sentinelGuard for blacklist checks.
// TAB_SESSION_ID is a UUID unique per browser tab (stored in sessionStorage),
// so concurrent-session detection works even when two tabs share the same JWT.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-session-id'] = TAB_SESSION_ID;
    return config;
});

// ── Handle 401 — clear token and redirect to login ───────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('lt_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;