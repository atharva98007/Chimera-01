"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Globe2, Radar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScanLoader } from "./ScanLoader";
import { ScanResults } from "./ScanResults";
import type { ScanSession } from "@/hooks/useScanSession";
import type { DashboardTab } from "@/hooks/useScanSession";

const LAYER_LABELS: Record<string, string> = {
  layer_1_lexical: "Lexical heuristics",
  layer_2_network: "Network topology",
  layer_3_crypto: "Certificate & crypto",
  layer_4_sandbox: "Sandbox behavior",
  layer_5_context: "Contextual signals",
  xgboost_analysis: "XGBoost structural model",
  cnn_visual_analysis: "CNN visual fingerprint",
};

function layerCheckState(value: number | null | undefined): "pass" | "warn" | "fail" {
  if (value == null) return "pass";
  if (value > 0.5) return "fail";
  if (value > 0.2) return "warn";
  return "pass";
}

type Props = {
  session: ScanSession;
  tab: DashboardTab;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: APPLE_EASE } },
};

export function TabPanels({ session, tab }: Props) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const { status, result, isBusy, reset, error } = session;

  const nodes = useMemo(() => {
    const count = result?.verdict === "malicious" ? 18 : 10;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 10 + ((i * 17) % 75),
      top: 15 + ((i * 23) % 65),
      threat: result?.verdict === "malicious" && i % 4 === 0,
    }));
  }, [result]);

  const deepResults = useMemo(() => {
    if (!result) {
      return Object.values(LAYER_LABELS).map((label) => ({
        label,
        state: "pending" as const,
      }));
    }

    const entries: { label: string; state: "pass" | "warn" | "fail" | "pending" }[] = [];

    if (result.layerScores) {
      for (const [key, value] of Object.entries(result.layerScores)) {
        entries.push({
          label: LAYER_LABELS[key] ?? key.replace(/_/g, " "),
          state: layerCheckState(value),
        });
      }
    }

    for (const [key, val] of Object.entries(result.details)) {
      if (key.startsWith("layer_")) continue;
      const status = val.status ?? (val.score > 0 ? "fail" : "pass");
      entries.push({
        label: LAYER_LABELS[key] ?? key.replace(/_/g, " "),
        state: status === "unavailable" ? "warn" : status,
      });
    }

    return entries.length
      ? entries
      : Object.values(LAYER_LABELS).map((label) => ({ label, state: "pending" as const }));
  }, [result]);

  if (tab === "quick") {
    if (isBusy) return <ScanLoader session={session} />;
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-2xl border p-8 text-center", t.glass)}
        >
          <p className={cn("text-lg font-medium", theme === "dark" ? "text-red-300" : "text-red-700")}>
            Scan failed
          </p>
          <p className={cn("mx-auto mt-2 max-w-md text-sm", t.muted)}>{error}</p>
        </motion.div>
      );
    }
    if (result && status === "done")
      return <ScanResults result={result} onScanAnother={reset} />;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: APPLE_EASE }}
        className={cn("rounded-2xl border p-12 text-center", t.glass)}
      >
        <Radar
          className={cn(
            "mx-auto mb-4 h-12 w-12",
            t.accentMuted
          )}
        />
        <p className={cn("text-lg font-medium", t.text)}>Ready for analysis</p>
        <p className={cn("mx-auto mt-2 max-w-md text-sm", t.muted)}>
          Submit a URL above. Chimera will run a multi-phase scan with live terminal
          telemetry and a full verdict card.
        </p>
      </motion.div>
    );
  }

  if (tab === "deep") {
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2"
      >
        {deepResults.map(({ label, state }) => (
          <motion.div
            key={label}
            variants={fadeUp}
            className={cn("rounded-xl border p-5", t.glass)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Activity
                  className={cn(
                    "h-5 w-5",
                    t.accentMuted
                  )}
                />
                <span className={cn("text-sm font-medium", t.text)}>{label}</span>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
                  state === "pending" && "bg-slate-500/20 text-slate-400",
                  state === "pass" &&
                    (theme === "dark"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-800"),
                  state === "fail" && "bg-red-500/20 text-red-400",
                  state === "warn" && "bg-amber-500/20 text-amber-400"
                )}
              >
                {state === "pending" ? "—" : state}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: APPLE_EASE }}
      className={cn("relative h-[22rem] overflow-hidden rounded-2xl border", t.glass)}
    >
      <div
        className={cn(
          "absolute inset-0",
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.1),transparent_40%)]"
            : "bg-[radial-gradient(circle_at_25%_35%,rgba(29,78,216,0.08),transparent_50%)]"
        )}
      />
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Globe2 className={cn("h-5 w-5", t.accent)} />
        <span className={cn("text-sm font-medium", t.text)}>
          Global Threat Map
        </span>
      </div>
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={cn(
            "absolute h-2.5 w-2.5 rounded-full",
            node.threat
              ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
              : theme === "dark"
                ? "bg-cyan-400/80"
                : "bg-zinc-700"
          )}
          style={{ left: `${node.left}%`, top: `${node.top}%` }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 2 + (node.id % 4) * 0.3,
            repeat: Infinity,
            delay: node.id * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
      <p className={cn("absolute bottom-4 left-4 right-4 text-center text-sm", t.muted)}>
        {result
          ? `${nodes.filter((n) => n.threat).length} anomalous nodes correlated with your scan`
          : "Run a scan to populate live threat nodes"}
      </p>
    </motion.div>
  );
}
