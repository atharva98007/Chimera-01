"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { EmailSession } from "@/hooks/useEmailSession";

export function EmailLoader({ session }: { session: EmailSession }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const { logs, progress, phaseLabel } = session;

  return (
    <div className={cn("rounded-3xl border p-6", t.glass)}>
      <div className="mb-4 flex justify-between">
        <p className={cn("text-sm", t.muted)}>{phaseLabel}</p>
        <p className={cn("font-mono text-sm tabular-nums", t.accent)}>{Math.round(progress)}%</p>
      </div>
      <div
        className={cn(
          "relative mb-5 h-40 overflow-hidden rounded-2xl",
          isDark ? "bg-black/40 border border-white/[0.06]" : "bg-zinc-50 border border-zinc-200"
        )}
      >
        <motion.div
          className={cn(
            "absolute left-0 right-0 h-px",
            isDark ? "bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.5)]" : "bg-blue-600/50"
          )}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: APPLE_EASE }}
        />
      </div>
      <div className={cn("rounded-xl border p-4 font-mono text-xs", t.panel)}>
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.p
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("py-0.5", t.terminal)}
            >
              <span className="opacity-40">›</span> {log.message}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
