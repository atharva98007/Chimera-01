"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Light mode" : "Dark mode"}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={cn(
        "relative flex h-7 w-12 items-center rounded-full border p-0.5 transition-colors",
        isDark ? "border-white/10 bg-black/40" : "border-zinc-200 bg-zinc-100"
      )}
    >
      <motion.div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          isDark ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 text-zinc-100"
        )}
        animate={{ x: isDark ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      >
        {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </motion.div>
    </button>
  );
}
