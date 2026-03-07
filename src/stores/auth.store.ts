import { create } from "zustand";
import { authService } from "@/services/api";

/**
 * Auth state - NOT persisted (tokens managed via httpOnly cookies)
 * On app start, initAuth() calls /api/auth/me to restore the session.
 */
interface AuthState {
  // Auth status
  isAuthenticated: boolean;
  /** True only during login/logout API calls — for UI spinners */
  isLoading: boolean;
  /** True until the first initAuth() completes — route guards wait on this */
  isInitializing: boolean;

  // User info (minimal, from token)
  user: {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
    subscription: "free" | "premium";
  } | null;

  // Actions
  setUser: (user: AuthState["user"]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // starts true — guards wait for this to become false
  user: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  initAuth: async () => {
    try {
      const { user } = await authService.refresh();
      set({ user, isAuthenticated: true, isLoading: false, isInitializing: false });
    } catch {
      // No valid session — cookies expired or missing
      set({ user: null, isAuthenticated: false, isLoading: false, isInitializing: false });
    }
  },
}));
