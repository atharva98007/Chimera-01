"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Bot, Box, Link2, Mail, Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useScanSession } from "@/hooks/useScanSession";
import { useEmailSession } from "@/hooks/useEmailSession";
import { useNavigationSplash } from "@/context/NavigationSplashContext";
import { ScanTextureBackground } from "@/components/background/ScanTextureBackground";
import { ScannerInput } from "@/components/scanner/ScannerInput";
import { ScanConsole } from "@/components/scanner/ScanConsole";
import { EmailScanner } from "@/components/email/EmailScanner";
import { runAgenticScan, runSandboxScan } from "@/lib/chimera-api";
import type { AgenticScanResult, SandboxScanResult } from "@/lib/chimera-api";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AgenticRunOutput, SandboxRunOutput } from "@/components/workbench/WorkbenchRunOutput";

export type WorkbenchMode = "agentic" | "sandbox";

type WorkbenchTab = "url" | "email" | "run";

const tabs: { id: WorkbenchTab; label: string; icon: typeof Link2 }[] = [
  { id: "url", label: "URL Scan", icon: Link2 },
  { id: "email", label: "Email Scan", icon: Mail },
  { id: "run", label: "Run", icon: Play },
];

type Props = {
  mode: WorkbenchMode;
};

export function DefenseWorkbench({ mode }: Props) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const { triggerSplash } = useNavigationSplash();
  const showEmail = mode === "agentic";
  const visibleTabs = showEmail ? tabs : tabs.filter((item) => item.id !== "email");
  const [tab, setTab] = useState<WorkbenchTab>("url");
  const urlSession = useScanSession();
  const emailSession = useEmailSession();
  const [runTarget, setRunTarget] = useState("");
  const [runStatus, setRunStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [sandboxResult, setSandboxResult] = useState<SandboxScanResult | null>(null);
  const [agenticResult, setAgenticResult] = useState<AgenticScanResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const textureVariant = mode === "agentic" ? "agentic" : "sandbox";
  const RunIcon = mode === "agentic" ? Bot : Box;
  const runLabel = mode === "agentic" ? "Agentic scan" : "Sandbox detonation";

  useEffect(() => {
    const from = searchParams.get("from");
    if (from === "email" && showEmail) setTab("email");
    else if (from === "scan") setTab("run");
    else if (from === "url") setTab("url");
  }, [searchParams, showEmail]);

  const handleTab = (next: WorkbenchTab) => {
    if (next === tab) return;
    triggerSplash();
    setTab(next);
  };

  const handleRun = async () => {
    const target = runTarget.trim();
    if (!target || runStatus === "running") return;

    setRunStatus("running");
    setRunError(null);
    setSandboxResult(null);
    setAgenticResult(null);

    try {
      if (mode === "agentic") {
        setAgenticResult(await runAgenticScan(target));
      } else {
        setSandboxResult(await runSandboxScan(target));
      }
      setRunStatus("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setRunError(message);
      setRunStatus("error");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border">
      <ScanTextureBackground variant={textureVariant} />
      <div className={cn("relative z-10 p-4 sm:p-6", t.glass)}>
        <LayoutGroup id={`${mode}-workbench-tabs`}>
          <div
            className={cn(
              "mb-6 flex flex-wrap gap-2 rounded-2xl border p-1.5",
              isDark ? "border-white/10 bg-black/30" : "border-slate-200/80 bg-white/50"
            )}
          >
            {visibleTabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              const label = item.id === "run" ? runLabel : item.label;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTab(item.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium min-w-[120px]",
                    active ? t.text : t.muted
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${mode}-workbench-pill`}
                      className={cn(
                        "absolute inset-0 rounded-xl",
                        isDark
                          ? "bg-white/[0.06] border border-white/10"
                          : "bg-zinc-900/5 border border-zinc-300"
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.id === "run" ? (
                      <RunIcon className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    )}
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: APPLE_EASE }}
          >
            {tab === "url" && (
              <div className="space-y-6">
                <ScannerInput session={urlSession} />
                <ScanConsole session={urlSession} />
              </div>
            )}

            {showEmail && tab === "email" && (
              <EmailScanner session={emailSession} embedded />
            )}

            {tab === "run" && (
              <div className="space-y-5">
                  <p className={cn("text-sm", t.muted)}>
                    {mode === "agentic"
                      ? "Launch an autonomous multi-step investigation on a URL or email artifact."
                      : "Detonate suspicious URLs in an isolated environment."}
                  </p>
                  <input
                    type="text"
                    value={runTarget}
                    onChange={(e) => setRunTarget(e.target.value)}
                    placeholder={
                      mode === "agentic"
                        ? "https://suspicious-link.example or email artifact ID"
                        : "https://payload.example or file hash"
                    }
                    disabled={runStatus === "running"}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 font-mono text-sm outline-none",
                      t.input,
                      t.text
                    )}
                  />
                  <MagneticButton
                    onClick={handleRun}
                    disabled={!runTarget.trim() || runStatus === "running"}
                  >
                    <RunIcon className="h-4 w-4" />
                    {runStatus === "running"
                      ? "Running…"
                      : mode === "agentic"
                        ? "Start agentic scan"
                        : "Start sandbox scan"}
                  </MagneticButton>
                  {runStatus === "running" && (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 font-mono text-xs",
                        t.panel,
                        t.muted
                      )}
                    >
                      <span className={t.accent}>&gt;</span>{" "}
                      {mode === "agentic" ? "Spawning triage agents…" : "Provisioning isolated VM…"}
                    </div>
                  )}
                  {runError && (
                    <p className={cn("text-sm", isDark ? "text-red-300/80" : "text-red-700")}>
                      {runError}
                    </p>
                  )}
                  {runStatus === "done" && sandboxResult && mode === "sandbox" && (
                    <SandboxRunOutput result={sandboxResult} />
                  )}
                  {runStatus === "done" && agenticResult && mode === "agentic" && (
                    <AgenticRunOutput result={agenticResult} />
                  )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
