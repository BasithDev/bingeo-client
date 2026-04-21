import { apiConfig } from "../config/api.config";
import { apiClient } from "./client";

const { identity } = apiConfig.endpoints;

interface IAuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription: "free" | "premium";
}

interface ILoginResponse {
  user: IAuthUser;
}

interface IRegisterResponse {
  userId: string;
  message: string;
}

interface IMeResponse {
  user: IAuthUser & { phone: string | null; avatar: string | null };
}

export const authService = {
  register(data: { email: string; password: string; name: string }) {
    return apiClient.post<IRegisterResponse>(identity.register, data);
  },

  verifyOtp(data: { userId: string; otp: string }) {
    return apiClient.post<ILoginResponse>(identity.verifyOtp, data);
  },

  resendOtp(data: { userId: string }) {
    return apiClient.post<{ message: string }>(identity.resendOtp, data);
  },

  login(data: { email: string; password: string }) {
    return apiClient.post<ILoginResponse>(identity.login, data);
  },

  logout() {
    return apiClient.post<{ message: string }>(identity.logout);
  },

  refresh() {
    return apiClient.post<ILoginResponse>(identity.refresh);
  },

  getMe() {
    return apiClient.get<IMeResponse>(identity.me);
  },

  forgotPassword(data: { email: string }) {
    return apiClient.post<{ userId: string; message: string }>(identity.forgotPassword, data);
  },

  resetPassword(data: { userId: string; otp: string; newPassword: string }) {
    return apiClient.post<{ message: string }>(identity.resetPassword, data);
  },
};
