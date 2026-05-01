import axios from "axios";

const api = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to attach custom JWT
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle session expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Custom JWT expired or invalid
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;