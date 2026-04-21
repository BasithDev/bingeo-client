import { create } from "zustand";
import { authService } from "@/services/api";

interface IAuthState {
  isAuthenticated: boolean;
  /** True only during login/logout API calls — for UI spinners */
  isLoading: boolean;
  isInitializing: boolean;

  user: {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
    subscription: "free" | "premium";
  } | null;

  setUser: (user: IAuthState["user"]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<IAuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
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
  
      set({ user: null, isAuthenticated: false, isLoading: false, isInitializing: false });
    }
  },
}));
