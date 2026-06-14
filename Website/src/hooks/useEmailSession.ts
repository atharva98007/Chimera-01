"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scanEmail } from "@/lib/chimera-api";
import type { EmailEvaluation } from "@/lib/email-engine";
import { EMAIL_SCAN_MS, EMAIL_TIMELINE } from "@/lib/email-timeline";
import type { ScanStatus } from "@/lib/scan-timeline";

export function useEmailSession() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState("");
  const [result, setResult] = useState<EmailEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ id: string; message: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const timersRef = useRef<number[]>([]);
  const scanningRef = useRef(false);
  const logId = useRef(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isBusy = status === "connecting" || status === "analyzing";

  const runCheck = useCallback(() => {
    if (scanningRef.current) return;
    if (!subject.trim() && !from.trim() && !body.trim()) return;

    scanningRef.current = true;
    clearTimers();
    setResult(null);
    setError(null);
    setLogs([]);
    setProgress(0);
    setStatus("connecting");

    const payload = {
      subject: subject.trim(),
      from: from.trim(),
      body: body.trim(),
      headers: headers.trim(),
    };

    EMAIL_TIMELINE.forEach((entry) => {
      const id = window.setTimeout(() => {
        if (entry.phase === "connecting") setStatus("connecting");
        if (entry.phase === "analyzing") setStatus("analyzing");
        setLogs((p) => [...p, { id: `e-${++logId.current}`, message: entry.message }]);
        setProgress(Math.min(99, (entry.at / EMAIL_SCAN_MS) * 100));
      }, entry.at);
      timersRef.current.push(id);
    });

    const finishCheck = (evaluation: EmailEvaluation | null, scanError: string | null) => {
      scanningRef.current = false;

      if (scanError) {
        setError(scanError);
        setStatus("idle");
        setProgress(0);
        setLogs((p) => [
          ...p,
          { id: `e-${++logId.current}`, message: `Error: ${scanError}` },
        ]);
        return;
      }

      if (evaluation) {
        setResult(evaluation);
        setStatus("done");
        setProgress(100);
        setLogs((p) => [
          ...p,
          {
            id: `e-${++logId.current}`,
            message: `${EMAIL_SCAN_MS}ms: ${evaluation.headline}`,
          },
        ]);
      }
    };

    const minDelay = new Promise<void>((resolve) => {
      const doneId = window.setTimeout(resolve, EMAIL_SCAN_MS);
      timersRef.current.push(doneId);
    });

    Promise.all([minDelay, scanEmail(payload)])
      .then(([, evaluation]) => finishCheck(evaluation, null))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Email scan failed";
        finishCheck(null, message);
      });
  }, [subject, from, body, headers, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    scanningRef.current = false;
    setStatus("idle");
    setResult(null);
    setError(null);
    setLogs([]);
    setProgress(0);
  }, [clearTimers]);

  const clearForm = useCallback(() => {
    setSubject("");
    setFrom("");
    setBody("");
    setHeaders("");
    reset();
  }, [reset]);

  const phaseLabel = useMemo(() => {
    switch (status) {
      case "connecting":
        return "Parsing headers";
      case "analyzing":
        return "Analyzing content";
      case "done":
        return "Analysis complete";
      default:
        return error ? "Analysis failed" : "Ready";
    }
  }, [status, error]);

  return {
    status,
    subject,
    setSubject,
    from,
    setFrom,
    body,
    setBody,
    headers,
    setHeaders,
    result,
    error,
    logs,
    progress,
    phaseLabel,
    inputMode,
    setInputMode,
    runCheck,
    reset,
    clearForm,
    isBusy,
  };
}

export type EmailSession = ReturnType<typeof useEmailSession>;
