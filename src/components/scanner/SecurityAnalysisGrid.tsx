"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ScanEvaluation } from "@/lib/scan-engine";
import { buildSecurityAnalysisCards, type AnalysisCardState } from "@/lib/security-analysis";

function stateColor(state: AnalysisCardState, isDark: boolean): string {
  switch (state) {
    case "fail":
      return isDark ? "text-red-400" : "text-red-600";
    case "warn":
      return isDark ? "text-amber-400" : "text-amber-600";
    case "unavailable":
      return isDark ? "text-emerald-400/80" : "text-emerald-600";
    default:
      return isDark ? "text-emerald-400/80" : "text-emerald-600";
  }
}

export function SecurityAnalysisGrid({ result }: { result: ScanEvaluation }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const cards = buildSecurityAnalysisCards(result);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: APPLE_EASE }}
            className={cn(
              "flex items-start gap-4 rounded-2xl border p-5 transition-colors",
              t.panel,
              isDark ? "border-white/[0.06]" : "border-slate-200/80"
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
                isDark
                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                  : "border-blue-200 bg-blue-50 text-blue-600"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h4 className={cn("text-sm font-medium", t.text)}>{card.title}</h4>
              <p className={cn("mt-1 text-sm font-semibold leading-snug", stateColor(card.state, isDark))}>
                {card.message}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
