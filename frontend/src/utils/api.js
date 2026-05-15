import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT from localStorage on every request ────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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