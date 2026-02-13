import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "./ui.store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      theme: "system",
      sidebarCollapsed: false,
      playerVolume: 1,
      playerMuted: false,
      preferredQuality: "auto",
    });
  });

  describe("theme", () => {
    it("should default to system", () => {
      expect(useUIStore.getState().theme).toBe("system");
    });

    it("should set theme to dark", () => {
      useUIStore.getState().setTheme("dark");
      expect(useUIStore.getState().theme).toBe("dark");
    });

    it("should set theme to light", () => {
      useUIStore.getState().setTheme("light");
      expect(useUIStore.getState().theme).toBe("light");
    });
  });

  describe("sidebar", () => {
    it("should default to not collapsed", () => {
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });

    it("should toggle sidebar", () => {
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe("player preferences", () => {
    it("should default to volume 1 and unmuted", () => {
      const state = useUIStore.getState();
      expect(state.playerVolume).toBe(1);
      expect(state.playerMuted).toBe(false);
    });

    it("should set player volume", () => {
      useUIStore.getState().setPlayerVolume(0.5);
      expect(useUIStore.getState().playerVolume).toBe(0.5);
    });

    it("should toggle player muted", () => {
      useUIStore.getState().togglePlayerMuted();
      expect(useUIStore.getState().playerMuted).toBe(true);

      useUIStore.getState().togglePlayerMuted();
      expect(useUIStore.getState().playerMuted).toBe(false);
    });

    it("should default to auto quality", () => {
      expect(useUIStore.getState().preferredQuality).toBe("auto");
    });

    it("should set preferred quality", () => {
      useUIStore.getState().setPreferredQuality("1080p");
      expect(useUIStore.getState().preferredQuality).toBe("1080p");

      useUIStore.getState().setPreferredQuality("720p");
      expect(useUIStore.getState().preferredQuality).toBe("720p");
    });
  });
});
