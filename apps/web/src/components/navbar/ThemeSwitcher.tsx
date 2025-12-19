"use client";

import { MoonIcon, SunIcon } from "@/components/svg";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex items-center justify-center w-10 h-10 rounded-lg
        bg-charcoal/50 border border-charcoal/80
        text-silver hover:text-ivory hover:border-smoke
        transition-all duration-200 cursor-pointer
      "
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
