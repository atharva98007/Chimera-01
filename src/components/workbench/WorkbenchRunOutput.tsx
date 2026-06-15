"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AgenticScanResult, SandboxScanResult, SandboxVerdict } from "@/lib/chimera-api";

function verdictStyles(verdict: SandboxVerdict, isDark: boolean) {
  switch (verdict) {
    case "clean":
      return {
        badge: isDark
          ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
          : "bg-emerald-50 border-emerald-200 text-emerald-800",
        glow: isDark ? "shadow-[0_0_40px_rgba(52,211,153,0.15)]" : "shadow-[0_8px_32px_rgba(16,185,129,0.12)]",
        icon: CheckCircle2,
      };
    case "suspicious":
      return {
        badge: isDark
          ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
          : "bg-amber-50 border-amber-200 text-amber-800",
        glow: isDark ? "shadow-[0_0_40px_rgba(251,191,36,0.12)]" : "shadow-[0_8px_32px_rgba(245,158,11,0.12)]",
        icon: AlertTriangle,
      };
    case "malicious":
      return {
        badge: isDark
          ? "bg-red-500/15 border-red-400/30 text-red-300"
          : "bg-red-50 border-red-200 text-red-800",
        glow: isDark ? "shadow-[0_0_40px_rgba(248,113,113,0.15)]" : "shadow-[0_8px_32px_rgba(239,68,68,0.12)]",
        icon: ShieldAlert,
      };
    default:
      return {
        badge: isDark
          ? "bg-zinc-500/15 border-zinc-400/30 text-zinc-300"
          : "bg-zinc-50 border-zinc-200 text-zinc-700",
        glow: "",
        icon: AlertTriangle,
      };
  }
}

export function SandboxRunOutput({ result }: { result: SandboxScanResult }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const styles = verdictStyles(result.verdict, isDark);
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: APPLE_EASE }}
      className={cn(
        "overflow-hidden rounded-2xl border",
        t.panel,
        styles.glow,
        isDark ? "border-cyan-500/20" : "border-cyan-600/20"
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4",
          isDark ? "border-white/10 bg-black/30" : "border-zinc-200 bg-zinc-50/80"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} />
          <div>
            <p className={cn("text-[10px] font-semibold uppercase tracking-[0.3em]", t.muted)}>
              Sandbox verdict
            </p>
            <p className={cn("mt-0.5 font-mono text-sm", t.text)}>{result.url}</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wider",
            styles.badge
          )}
        >
          {result.verdict}
        </span>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-3">
        <Metric
          label="Confidence"
          value={`${result.confidence}%`}
          highlight={isDark ? "text-cyan-300" : "text-cyan-700"}
          muted={t.muted}
        />
        {result.pageTitle && (
          <Metric label="Page title" value={result.pageTitle} muted={t.muted} text={t.text} />
        )}
        {result.networkConnections != null && (
          <Metric
            label="Network connections"
            value={String(result.networkConnections)}
            highlight={isDark ? "text-violet-300" : "text-violet-700"}
            muted={t.muted}
          />
        )}
      </div>

      {result.indicators.length > 0 && (
        <div className={cn("border-t px-5 py-4", isDark ? "border-white/10" : "border-zinc-200")}>
          <p className={cn("mb-3 text-[10px] font-semibold uppercase tracking-[0.3em]", t.muted)}>
            Behavioral indicators
          </p>
          <ul className="space-y-2">
            {result.indicators.map((indicator) => (
              <li
                key={indicator}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  isDark
                    ? "border-amber-500/20 bg-amber-500/5 text-amber-200/90"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                )}
              >
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.note && (
        <p className={cn("border-t px-5 py-3 text-xs", isDark ? "border-white/10 text-zinc-400" : "border-zinc-200 text-zinc-600")}>
          Note: {result.note}
        </p>
      )}
    </motion.div>
  );
}

export function AgenticRunOutput({ result }: { result: AgenticScanResult }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const safe = result.finalVerdict.toUpperCase().includes("SAFE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: APPLE_EASE }}
      className={cn("overflow-hidden rounded-2xl border", t.panel, isDark ? "border-violet-500/20" : "border-violet-300")}
    >
      <div className={cn("border-b px-5 py-4", isDark ? "border-white/10 bg-black/30" : "border-zinc-200 bg-zinc-50/80")}>
        <p className={cn("text-[10px] font-semibold uppercase tracking-[0.3em]", t.muted)}>
          Agentic verdict
        </p>
        <p className={cn("mt-1 font-mono text-sm", t.text)}>{result.targetUrl}</p>
        <p
          className={cn(
            "mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold uppercase tracking-wide",
            safe
              ? isDark
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
              : isDark
                ? "border-red-400/30 bg-red-500/10 text-red-300"
                : "border-red-200 bg-red-50 text-red-800"
          )}
        >
          {result.finalVerdict}
        </p>
      </div>

      <div className="space-y-2 p-5">
        {result.agents.map((agent) => (
          <div
            key={agent.name}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
              isDark ? "border-white/10 bg-black/20" : "border-zinc-200 bg-white"
            )}
          >
            <span className={t.text}>{agent.name}</span>
            <span className={cn("font-mono", t.accent)}>
              {agent.claim} · {agent.confidence}%
            </span>
          </div>
        ))}
      </div>

      {result.justification && (
        <p className={cn("border-t px-5 py-4 text-sm leading-relaxed", isDark ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-700")}>
          {result.justification}
        </p>
      )}
    </motion.div>
  );
}

function Metric({
  label,
  value,
  muted,
  text,
  highlight,
}: {
  label: string;
  value: string;
  muted: string;
  text?: string;
  highlight?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 [data-theme=light]:border-zinc-200 [data-theme=light]:bg-white">
      <p className={cn("text-[10px] uppercase tracking-widest", muted)}>{label}</p>
      <p className={cn("mt-1 text-lg font-medium tabular-nums", highlight ?? text ?? "")}>{value}</p>
    </div>
  );
}
