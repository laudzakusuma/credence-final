"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Ubah tema"
      className="
        inline-flex h-10 w-10 items-center justify-center rounded-xl
        border border-slate-200 bg-white text-slate-700 shadow-sm transition
        hover:bg-slate-50
        dark:border-white/10 dark:bg-white/5 dark:text-slate-200
        dark:hover:bg-white/10
      "
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}