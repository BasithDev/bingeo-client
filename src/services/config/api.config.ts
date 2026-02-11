/**
 * API Configuration
 * Centralized configuration for backend service endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Identity Service
    identity: {
      base: `${API_BASE_URL}/api/identity`,
      login: `${API_BASE_URL}/api/identity/auth/login`,
      register: `${API_BASE_URL}/api/identity/auth/register`,
      logout: `${API_BASE_URL}/api/identity/auth/logout`,
      refresh: `${API_BASE_URL}/api/identity/auth/refresh`,
      profile: `${API_BASE_URL}/api/identity/users/me`,
      devices: `${API_BASE_URL}/api/identity/devices`,
    },

    // Payment Service
    payment: {
      base: `${API_BASE_URL}/api/payment`,
      plans: `${API_BASE_URL}/api/payment/plans`,
      subscription: `${API_BASE_URL}/api/payment/subscription`,
      checkout: `${API_BASE_URL}/api/payment/checkout`,
    },

    // Content Service
    content: {
      base: `${API_BASE_URL}/api/content`,
      movies: `${API_BASE_URL}/api/content/movies`,
      series: `${API_BASE_URL}/api/content/series`,
      categories: `${API_BASE_URL}/api/content/categories`,
      search: `${API_BASE_URL}/api/content/search`,
      watchlist: `${API_BASE_URL}/api/content/watchlist`,
    },

    // Streaming Service
    streaming: {
      base: `${API_BASE_URL}/api/streaming`,
      playback: `${API_BASE_URL}/api/streaming/playback`,
      token: `${API_BASE_URL}/api/streaming/token`,
      progress: `${API_BASE_URL}/api/streaming/progress`,
    },
  },
} as const;
