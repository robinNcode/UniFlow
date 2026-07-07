import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

/**
 * Centralized Axios instance with interceptors for:
 * 1. Auto-attaching JWT Bearer token from Zustand auth store
 * 2. 401 handling — clears auth and redirects to /login with return path
 * 3. 5xx / network error mapping — generic user-friendly message
 */
const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and 5xx
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        // Clear auth state and redirect to login with return path
        useAuthStore.getState().logout();
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      if (status && status >= 500) {
        console.error('[Server Error]', error.response?.data);
        return Promise.reject(new Error('Something went wrong on our end. Please try again.'));
      }

      // For 4xx errors, pass through the backend error message if available
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        return Promise.reject(new Error(backendMessage));
      }
    }

    // Network error
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
