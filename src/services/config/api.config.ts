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
      base: API_BASE_URL,
      login: `${API_BASE_URL}/api/auth/login`,
      register: `${API_BASE_URL}/api/auth/register`,
      logout: `${API_BASE_URL}/api/auth/logout`,
      refresh: `${API_BASE_URL}/api/auth/refresh`,
      me: `${API_BASE_URL}/api/auth/me`,
      verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
      resendOtp: `${API_BASE_URL}/api/auth/resend-otp`,
      forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
      resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    },
  },
} as const;
