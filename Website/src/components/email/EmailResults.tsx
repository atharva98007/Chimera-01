"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Bot, Box, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { EmailEvaluation } from "@/lib/email-engine";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function EmailResults({
  result,
  onReset,
}: {
  result: EmailEvaluation;
  onReset: () => void;
}) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const bad = result.verdict === "malicious";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: APPLE_EASE }}
      className={cn(
        "rounded-3xl border p-8",
        t.glass,
        bad
          ? isDark
            ? "border-red-500/20"
            : "border-red-200"
          : isDark
            ? "border-emerald-500/15"
            : "border-emerald-200/80"
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {bad ? (
            <AlertTriangle className="h-10 w-10 text-red-400/90" strokeWidth={1.25} />
          ) : (
            <CheckCircle2 className="h-10 w-10 text-emerald-400/90" strokeWidth={1.25} />
          )}
          <div>
            <p className={cn("text-[10px] font-semibold uppercase tracking-[0.3em]", t.muted)}>
              Email verdict
            </p>
            <h3 className={cn("mt-1 text-2xl font-light tracking-tight", t.text)}>
              {result.headline}
            </h3>
            <p className={cn("mt-2 max-w-lg text-sm leading-relaxed", t.muted)}>{result.summary}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-4xl font-light tabular-nums", bad ? "text-red-400/90" : t.accent)}>
            {result.safetyScore}
          </p>
          <p className={cn("text-xs uppercase tracking-widest", t.muted)}>Safety</p>
        </div>
      </div>

      {result.flags.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-6">
          {result.flags.map((f) => (
            <li key={f} className={cn("text-sm", isDark ? "text-red-300/80" : "text-red-700")}>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <MagneticButton themeMode={theme} variant="ghost" onClick={onReset}>
          Check another email
        </MagneticButton>
        <Link href="/agentic?from=email">
          <MagneticButton themeMode={theme} variant="ghost">
            <Bot className="h-4 w-4" />
            Agentic defense
          </MagneticButton>
        </Link>
        <Link href="/sandboxing?from=email">
          <MagneticButton themeMode={theme} variant="ghost">
            <Box className="h-4 w-4" />
            Run in sandbox
          </MagneticButton>
        </Link>
      </div>
    </motion.article>
  );
}
