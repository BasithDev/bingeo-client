const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000/api";

export const apiConfig = {
  baseUrl: GATEWAY_URL,
  endpoints: {
    identity: {
      base: `${GATEWAY_URL}/identity`,
      login: `${GATEWAY_URL}/identity/auth/login`,
      register: `${GATEWAY_URL}/identity/auth/register`,
      logout: `${GATEWAY_URL}/identity/auth/logout`,
      refresh: `${GATEWAY_URL}/identity/auth/refresh`,
      me: `${GATEWAY_URL}/identity/auth/me`,
      verifyOtp: `${GATEWAY_URL}/identity/auth/verify-otp`,
      resendOtp: `${GATEWAY_URL}/identity/auth/resend-otp`,
      forgotPassword: `${GATEWAY_URL}/identity/auth/forgot-password`,
      resetPassword: `${GATEWAY_URL}/identity/auth/reset-password`,
    },
    admin: {
      users: `${GATEWAY_URL}/identity/admin/users`,
      toggleUserBlock: (userId: string) =>
        `${GATEWAY_URL}/identity/admin/users/${userId}/toggle-block`,
    },
    content: {
      drafts: `${GATEWAY_URL}/content/admin/drafts`,
      draftById: (id: string) => `${GATEWAY_URL}/content/admin/drafts/${id}`,
    },
  },
} as const;
