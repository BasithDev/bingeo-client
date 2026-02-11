import { create } from "zustand";

/**
 * Auth state - NOT persisted (tokens managed via httpOnly cookies)
 */
interface AuthState {
  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;

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
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
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
}));
