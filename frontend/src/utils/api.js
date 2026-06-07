import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT + session ID on every request ──────────────────────────────────
// x-session-id is read by sentinelGuard for blacklist checks.
// securePost.js also sets it, but having it here ensures it's present on
// all routes including those not using securePost.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lt_token');
    if (token) {
        config.headers.Authorization  = `Bearer ${token}`;
        config.headers['x-session-id'] = token;
    }
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