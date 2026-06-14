"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scanUrl } from "@/lib/chimera-api";
import type { ScanEvaluation } from "@/lib/scan-engine";
import {
  TIMELINE_LOGS,
  TOTAL_SCAN_MS,
  type ScanStatus,
  type TerminalLog,
} from "@/lib/scan-timeline";

export type { ScanStatus };

export type DashboardTab = "quick" | "deep" | "map";

export function useScanSession() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScanEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("quick");
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<number[]>([]);
  const logIdRef = useRef(0);
  const scanningRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isBusy = status === "connecting" || status === "analyzing";

  const runScan = useCallback(
    (inputUrl: string) => {
      const trimmed = inputUrl.trim();
      if (!trimmed || scanningRef.current) return;

      scanningRef.current = true;
      clearTimers();
      setUrl(trimmed);
      setResult(null);
      setError(null);
      setLogs([]);
      setProgress(0);
      setActiveTab("quick");
      setStatus("connecting");

      const start = performance.now();

      TIMELINE_LOGS.forEach((entry) => {
        const timerId = window.setTimeout(() => {
          if (entry.phase === "connecting") setStatus("connecting");
          if (entry.phase === "analyzing") setStatus("analyzing");
          if (entry.phase === "done") setStatus("done");

          setLogs((prev) => [
            ...prev,
            {
              ...entry,
              id: `log-${++logIdRef.current}`,
            },
          ]);

          setProgress(Math.min(100, (entry.at / TOTAL_SCAN_MS) * 100));
        }, entry.at);
        timersRef.current.push(timerId);
      });

      const progressTimer = window.setInterval(() => {
        const elapsed = performance.now() - start;
        setProgress(Math.min(99, (elapsed / TOTAL_SCAN_MS) * 100));
      }, 50);
      timersRef.current.push(progressTimer as unknown as number);

      const finishScan = (evaluation: ScanEvaluation | null, scanError: string | null) => {
        window.clearInterval(progressTimer);
        scanningRef.current = false;

        if (scanError) {
          setError(scanError);
          setStatus("idle");
          setProgress(0);
          setLogs((prev) => [
            ...prev,
            {
              id: `log-${++logIdRef.current}`,
              at: TOTAL_SCAN_MS,
              phase: "done",
              message: `Error: ${scanError}`,
            },
          ]);
          return;
        }

        if (evaluation) {
          setResult(evaluation);
          setStatus("done");
          setProgress(100);
          setLogs((prev) => [
            ...prev,
            {
              id: `log-${++logIdRef.current}`,
              at: TOTAL_SCAN_MS,
              phase: "done",
              message: `${TOTAL_SCAN_MS}ms: Verdict — ${evaluation.headline}`,
            },
          ]);
        }
      };

      const minDelay = new Promise<void>((resolve) => {
        const doneTimer = window.setTimeout(resolve, TOTAL_SCAN_MS);
        timersRef.current.push(doneTimer);
      });

      Promise.all([minDelay, scanUrl(trimmed)])
        .then(([, evaluation]) => finishScan(evaluation, null))
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Scan failed";
          finishScan(null, message);
        });
    },
    [clearTimers]
  );

  const reset = useCallback(() => {
    clearTimers();
    scanningRef.current = false;
    setStatus("idle");
    setResult(null);
    setError(null);
    setLogs([]);
    setProgress(0);
  }, [clearTimers]);

  const phaseLabel = useMemo(() => {
    switch (status) {
      case "connecting":
        return "Connecting to threat engine";
      case "analyzing":
        return "Deep analysis in progress";
      case "done":
        return "Scan complete";
      default:
        return error ? "Scan failed" : "Awaiting target URL";
    }
  }, [status, error]);

  return {
    status,
    url,
    setUrl,
    result,
    error,
    logs,
    activeTab,
    setActiveTab,
    progress,
    phaseLabel,
    runScan,
    reset,
    isBusy,
  };
}

export type ScanSession = ReturnType<typeof useScanSession>;
