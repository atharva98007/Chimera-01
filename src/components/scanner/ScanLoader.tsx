"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ScanSession } from "@/hooks/useScanSession";

export function ScanLoader({ session }: { session: ScanSession }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const { logs, progress, phaseLabel, status } = session;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: APPLE_EASE }}
      className={cn("overflow-hidden rounded-3xl border p-6", t.glass)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className={cn("text-[10px] uppercase tracking-widest", t.muted)}>Live engine</p>
          <p className={cn("mt-1 text-lg font-light", t.text)}>{phaseLabel}</p>
        </div>
        <p className={cn("font-mono text-xl tabular-nums font-light", t.accent)}>
          {Math.round(progress)}%
        </p>
      </div>

      <div
        className={cn(
          "relative mb-5 h-48 overflow-hidden rounded-2xl border",
          isDark ? "border-white/[0.06] bg-black/40" : "border-zinc-200 bg-zinc-50"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-30",
            isDark
              ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:18px_18px]"
              : "bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:18px_18px]"
          )}
        />
        <motion.div
          className={cn(
            "absolute left-0 right-0 h-px",
            isDark ? "bg-white/40 shadow-[0_0_16px_rgba(255,255,255,0.3)]" : "bg-zinc-400"
          )}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: APPLE_EASE }}
        />
      </div>

      <div className={cn("max-h-44 overflow-y-auto rounded-xl border p-4 font-mono text-xs", t.panel)}>
        <p className={cn("mb-2 text-[10px] uppercase tracking-widest", t.muted)}>{status}</p>
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("py-0.5", t.terminal)}
            >
              <span className="opacity-35">›</span> {log.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
