"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Bot, Box, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ScanEvaluation } from "@/lib/scan-engine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SecurityAnalysisGrid } from "@/components/scanner/SecurityAnalysisGrid";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: APPLE_EASE } },
};

export function ScanResults({
  result,
  onScanAnother,
}: {
  result: ScanEvaluation;
  onScanAnother: () => void;
}) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const bad = result.verdict === "malicious";
  const caution = result.riskClass === "warning";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.article
        variants={item}
        className={cn(
          "rounded-3xl border p-8",
          t.glass,
          bad
            ? isDark
              ? "border-red-500/15"
              : "border-red-200/80"
            : caution
              ? isDark
                ? "border-amber-500/15"
                : "border-amber-200/80"
              : isDark
                ? "border-emerald-500/10"
                : "border-emerald-200/60"
        )}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="flex gap-4">
            {bad ? (
              <AlertTriangle className="h-9 w-9 text-red-400/80" strokeWidth={1.25} />
            ) : caution ? (
              <AlertTriangle className="h-9 w-9 text-amber-400/80" strokeWidth={1.25} />
            ) : (
              <CheckCircle2 className="h-9 w-9 text-emerald-400/80" strokeWidth={1.25} />
            )}
            <div>
              <p className={cn("text-[10px] font-semibold uppercase tracking-[0.3em]", t.muted)}>
                Verdict
              </p>
              <h2 className={cn("mt-1 text-2xl font-light tracking-tight", t.text)}>
                {result.headline}
              </h2>
              <p className={cn("mt-2 max-w-lg text-sm leading-relaxed", t.muted)}>
                {result.summary}
              </p>
              {result.latencyMs != null && (
                <p className={cn("mt-2 text-xs", t.muted)}>
                  Analysis completed in {Math.round(result.latencyMs)}ms · Risk score {result.riskScore}%
                </p>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className={cn("text-5xl font-light tabular-nums", bad ? "text-red-400/90" : caution ? "text-amber-400/90" : t.accent)}>
              {result.safetyScore}
            </p>
            <p className={cn("text-xs uppercase tracking-widest", t.muted)}>Safety score</p>
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
          <MagneticButton variant="ghost" onClick={onScanAnother}>
            Scan another URL
          </MagneticButton>
          <Link href="/agentic?from=scan">
            <MagneticButton variant="ghost">
              <Bot className="h-4 w-4" />
              Agentic defense
            </MagneticButton>
          </Link>
          <Link href="/sandboxing?from=scan">
            <MagneticButton variant="ghost">
              <Box className="h-4 w-4" />
              Run in sandbox
            </MagneticButton>
          </Link>
        </div>
      </motion.article>

      <motion.div variants={item} className={cn("rounded-3xl border p-6", t.glass)}>
        <h3 className={cn("mb-5 text-lg font-medium", t.text)}>Security Analysis</h3>
        <SecurityAnalysisGrid result={result} />
      </motion.div>
    </motion.div>
  );
}
