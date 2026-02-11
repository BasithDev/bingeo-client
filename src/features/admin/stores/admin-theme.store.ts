import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminTheme = "light" | "dark";

interface AdminThemeState {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

export const useAdminThemeStore = create<AdminThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme) => {
        document.documentElement.setAttribute("data-admin-theme", theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-admin-theme", next);
        set({ theme: next });
      },
    }),
    {
      name: "bingeo-admin-theme",
      onRehydrate: () => {
        return (state) => {
          if (state) {
            document.documentElement.setAttribute("data-admin-theme", state.theme);
          }
        };
      },
    },
  ),
);
