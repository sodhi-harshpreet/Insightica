"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-sm font-medium text-muted-foreground">
        {isDark ? "Dark" : "Light"}
      </span>

      {/* Toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-300
          ${isDark ? "bg-[#0b2a3a]" : "bg-[#fdeebd]"}
        `}
      >
        <div
          className={`
            absolute top-1 left-1 w-4 h-4 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${isDark ? "translate-x-6 bg-[#2bb0ff]" : "bg-[#f5c542]"}
          `}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-white" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </button>
    </div>
  );
}
