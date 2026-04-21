import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUIState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  playerVolume: number;
  setPlayerVolume: (volume: number) => void;
  playerMuted: boolean;
  togglePlayerMuted: () => void;
  preferredQuality: "auto" | "1080p" | "720p" | "480p";
  setPreferredQuality: (quality: "auto" | "1080p" | "720p" | "480p") => void;
}

export const useUIStore = create<IUIState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
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
