import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * UI preferences state - persisted to localStorage
 */
interface UIState {
  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Player preferences
  playerVolume: number;
  setPlayerVolume: (volume: number) => void;
  playerMuted: boolean;
  togglePlayerMuted: () => void;
  preferredQuality: "auto" | "1080p" | "720p" | "480p";
  setPreferredQuality: (quality: "auto" | "1080p" | "720p" | "480p") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Player preferences
      playerVolume: 1,
      setPlayerVolume: (volume) => set({ playerVolume: volume }),
      playerMuted: false,
      togglePlayerMuted: () => set((state) => ({ playerMuted: !state.playerMuted })),
      preferredQuality: "auto",
      setPreferredQuality: (quality) => set({ preferredQuality: quality }),
    }),
    {
      name: "bingeo-ui-storage",
    },
  ),
);
