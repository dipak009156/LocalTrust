import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})


api.interceptors.request.use(async (config) => {

  // Get Firebase auth instance
  const auth = getAuth()

  // Check if someone is logged in
  if (auth.currentUser) {

    // Get their current token
    // false = use cached token if not expired (faster)
    // Firebase auto-refreshes if expired
    const token = await auth.currentUser.getIdToken(false)

    // Attach to request header
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



api.interceptors.response.use(

  // SUCCESS — return response unchanged
  (response) => response,

  // ERROR — handle specific cases
  async (error) => {

    if (error.response?.status === 401) {
      // Token rejected by server
      // Could be expired — try forcing a refresh once
      const auth = getAuth()

      if (auth.currentUser) {
        try {
          // true = force refresh — get brand new token
          const newToken = await auth.currentUser.getIdToken(true)

          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newToken}`
          return axios(error.config)

        } catch {
          // Refresh failed — user needs to login again
          window.location.href = '/'
        }
      } else {
        // No user logged in at all — send to home
        window.location.href = '/'
      }
    }

    // For all other errors — pass them through
    // Your catch blocks in components handle them
    return Promise.reject(error)
  }
)

export default api