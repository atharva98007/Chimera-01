"use client";

import { FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { normalizeScanUrl } from "@/lib/chimera-api";
import { cn } from "@/lib/utils";
import type { ScanSession } from "@/hooks/useScanSession";

type Props = {
  session: ScanSession;
  compact?: boolean;
};

export function ScannerInput({ session, compact }: Props) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const { url, setUrl, runScan, isBusy, status } = session;

  const placeholder = useMemo(
    () =>
      theme === "dark"
        ? "https://secure-login.example.com"
        : "https://your-link-to-verify.com",
    [theme]
  );

  const submitScan = () => {
    const trimmed = url.trim();
    if (!trimmed || isBusy) return;
    runScan(normalizeScanUrl(trimmed));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitScan();
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-2xl border p-2 sm:flex-row sm:items-center",
        t.glass,
        compact ? "max-w-xl" : "max-w-2xl mx-auto",
        t.glow
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: APPLE_EASE }}
    >
      <div className="relative flex-1">
        <Search
          className={cn(
            "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2",
            t.accentMuted
          )}
        />
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitScan();
            }
          }}
          placeholder={placeholder}
          disabled={isBusy}
          aria-label="URL to scan"
          className={cn(
            "w-full rounded-xl py-4 pl-12 pr-4 font-mono text-sm outline-none transition-all duration-500 sm:text-base",
            t.input,
            t.text
          )}
        />
        {theme === "dark" && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10"
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <MagneticButton
        type="button"
        themeMode={theme}
        disabled={isBusy || !url.trim()}
        onClick={submitScan}
        className="w-full sm:w-auto sm:min-w-[148px]"
      >
        {isBusy ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.span>
            {status === "connecting" ? "Connecting…" : "Analyzing…"}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Scan URL
          </>
        )}
      </MagneticButton>
    </motion.form>
  );
}
