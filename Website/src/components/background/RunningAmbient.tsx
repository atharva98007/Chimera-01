"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const streaks = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top: `${8 + i * 11}%`,
  width: `${18 + (i % 4) * 12}%`,
  delay: i * 0.7,
  duration: 14 + (i % 3) * 4,
}));

export function RunningAmbient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      {streaks.map((s) => (
        <motion.div
          key={s.id}
          className={cn(
            "absolute h-px",
            isDark
              ? "bg-gradient-to-r from-transparent via-cyan-400/28 to-transparent"
              : "bg-gradient-to-r from-transparent via-blue-500/22 to-transparent"
          )}
          style={{ top: s.top, width: s.width }}
          initial={{ left: "-30%", opacity: 0 }}
          animate={{
            left: ["-30%", "110%"],
            opacity: [0, isDark ? 0.45 : 0.35, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "linear",
            delay: s.delay,
          }}
        />
      ))}

      <motion.div
        className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(255,255,255,0.012)_80px,rgba(255,255,255,0.012)_81px)]"
            : "bg-[repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(15,23,42,0.025)_80px,rgba(15,23,42,0.025)_81px)]"
        )}
        animate={{ x: ["0%", "-80px"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-32",
          isDark
            ? "bg-gradient-to-t from-cyan-500/[0.03] to-transparent"
            : "bg-gradient-to-t from-blue-500/[0.04] to-transparent"
        )}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
