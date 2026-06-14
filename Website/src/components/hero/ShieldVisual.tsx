"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { APPLE_EASE } from "@/lib/motion";

export function ShieldVisual({ className }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full border",
            isDark ? "border-cyan-400/20" : "border-blue-600/15"
          )}
          style={{ width: 140 + i * 48, height: 140 + i * 48 }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
      <motion.div
        className={cn(
          "relative flex h-24 w-24 items-center justify-center rounded-2xl",
          isDark
            ? "bg-white/[0.03] border border-white/10 shadow-[0_0_80px_rgba(34,211,238,0.12)]"
            : "bg-white border border-zinc-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        )}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: APPLE_EASE }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-xl border border-dashed border-white/10"
        />
        <Shield
          className={cn(
            "relative h-10 w-10",
            isDark ? "text-cyan-100/90" : "text-zinc-800"
          )}
          strokeWidth={1.25}
        />
      </motion.div>
    </div>
  );
}
