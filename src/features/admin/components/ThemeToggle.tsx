import { Moon, Sun } from "lucide-react";
import { useAdminThemeStore } from "../stores/admin-theme.store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAdminThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl
        transition-all duration-200 cursor-pointer
        hover:bg-gray-100 dark:hover:bg-white/10
        text-gray-500 dark:text-gray-400"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        } absolute`}
      />
      <Moon
        className={`h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        } absolute`}
      />
    </button>
  );
}
