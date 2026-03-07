/**
 * Auth Service
 * Centralized auth API calls — login, logout, refresh, register, OTP
 */

import { apiConfig } from "../config/api.config";
import { apiClient } from "./client";

const { identity } = apiConfig.endpoints;

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription: "free" | "premium";
}

interface LoginResponse {
  user: AuthUser;
}

interface RegisterResponse {
  userId: string;
  message: string;
}

interface MeResponse {
  user: AuthUser & { phone: string | null; avatar: string | null };
}

export const authService = {
  /** POST /auth/register — creates account and sends OTP email */
  register(data: { email: string; password: string; name: string }) {
    return apiClient.post<RegisterResponse>(identity.register, data);
  },

  /** POST /auth/verify-otp — verifies OTP and sets httpOnly cookies */
  verifyOtp(data: { userId: string; otp: string }) {
    return apiClient.post<LoginResponse>(identity.verifyOtp, data);
  },

  /** POST /auth/resend-otp — sends a new OTP email */
  resendOtp(data: { userId: string }) {
    return apiClient.post<{ message: string }>(identity.resendOtp, data);
  },

  /** POST /auth/login — sets httpOnly cookies (access_token, refresh_token) */
  login(data: { email: string; password: string }) {
    return apiClient.post<LoginResponse>(identity.login, data);
  },

  /** POST /auth/logout — clears httpOnly cookies */
  logout() {
    return apiClient.post<{ message: string }>(identity.logout);
  },

  /** POST /auth/refresh — rotates tokens via httpOnly cookies */
  refresh() {
    return apiClient.post<LoginResponse>(identity.refresh);
  },

  /** GET /auth/me — returns current user profile */
  getMe() {
    return apiClient.get<MeResponse>(identity.me);
  },

  /** POST /auth/forgot-password — sends password reset OTP email */
  forgotPassword(data: { email: string }) {
    return apiClient.post<{ userId: string; message: string }>(identity.forgotPassword, data);
  },

  /** POST /auth/reset-password — resets password using OTP */
  resetPassword(data: { userId: string; otp: string; newPassword: string }) {
    return apiClient.post<{ message: string }>(identity.resetPassword, data);
  },
};
