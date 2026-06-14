"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eraser, FileUp, Search } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EmailLoader } from "./EmailLoader";
import { EmailResults } from "./EmailResults";
import type { EmailSession } from "@/hooks/useEmailSession";

type Props = { session: EmailSession; embedded?: boolean };

export function EmailScanner({ session, embedded }: Props) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const {
    subject,
    setSubject,
    from,
    setFrom,
    body,
    setBody,
    headers,
    setHeaders,
    inputMode,
    setInputMode,
    runCheck,
    clearForm,
    isBusy,
    status,
    result,
    reset,
    error,
  } = session;

  return (
    <section
      id={embedded ? undefined : "email"}
      className={cn(
        "relative",
        embedded ? "px-0 pb-0 pt-0" : "mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className={cn(
          embedded ? "p-0 border-0 bg-transparent shadow-none" : "rounded-3xl border p-6 sm:p-8",
          !embedded && t.glass,
          !embedded && t.glow
        )}
      >
        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/[0.06] pb-6">
          {(["paste", "upload"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInputMode(mode)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-all",
                inputMode === mode
                  ? isDark
                    ? "bg-white/[0.06] text-zinc-100"
                    : "bg-zinc-900 text-white"
                  : t.muted
              )}
            >
              {mode === "paste" ? "Paste email" : "Upload file"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {inputMode === "paste" ? (
            <motion.div
              key="paste"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.45, ease: APPLE_EASE }}
              className="space-y-5"
            >
              <Field label="Subject" value={subject} onChange={setSubject} disabled={isBusy} />
              <Field label="From" value={from} onChange={setFrom} disabled={isBusy} type="email" />
              <div>
                <label className={cn("mb-2 block text-xs font-medium uppercase tracking-widest", t.label)}>
                  Content
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isBusy}
                  rows={8}
                  placeholder="Paste the full email body..."
                  className={cn("w-full resize-y rounded-xl px-4 py-3 font-mono text-sm outline-none transition-all", t.input, t.text)}
                />
              </div>
              <div>
                <label className={cn("mb-2 block text-xs font-medium uppercase tracking-widest", t.label)}>
                  Headers (optional)
                </label>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  disabled={isBusy}
                  rows={3}
                  className={cn("w-full resize-y rounded-xl px-4 py-3 font-mono text-xs outline-none", t.input, t.text)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.label
              key="upload"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className={cn(
                "flex cursor-pointer flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center transition-colors",
                isDark
                  ? "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                  : "border-zinc-300 hover:border-zinc-400"
              )}
            >
              <FileUp className={cn("mb-4 h-10 w-10", t.accentMuted)} strokeWidth={1.25} />
              <p className={cn("text-sm font-medium", t.text)}>Drop .eml, .msg, or .txt</p>
              <p className={cn("mt-1 text-xs", t.muted)}>Max 10MB — content loads into parser</p>
              <input
                type="file"
                accept=".eml,.msg,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setBody(String(reader.result ?? ""));
                    setInputMode("paste");
                  };
                  reader.readAsText(file);
                }}
              />
            </motion.label>
          )}
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton themeMode={theme} onClick={runCheck} disabled={isBusy}>
            <Search className="h-4 w-4" />
            {isBusy ? "Analyzing…" : "Check email"}
          </MagneticButton>
          <MagneticButton themeMode={theme} variant="ghost" onClick={clearForm} disabled={isBusy}>
            <Eraser className="h-4 w-4" />
            Clear
          </MagneticButton>
        </div>
      </motion.div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {isBusy && (
            <motion.div
              key="load"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: APPLE_EASE }}
            >
              <EmailLoader session={session} />
            </motion.div>
          )}
          {!isBusy && status === "done" && result && (
            <motion.div
              key="res"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: APPLE_EASE }}
            >
              <EmailResults result={result} onReset={reset} />
            </motion.div>
          )}
          {!isBusy && error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl border p-6 text-center",
                t.glass,
                isDark ? "border-red-500/20" : "border-red-200"
              )}
            >
              <p className={cn("text-lg font-medium", isDark ? "text-red-300" : "text-red-700")}>
                Email scan failed
              </p>
              <p className={cn("mt-2 text-sm", t.muted)}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  return (
    <div>
      <label className={cn("mb-2 block text-xs font-medium uppercase tracking-widest", t.label)}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn("w-full rounded-xl px-4 py-3 text-sm outline-none transition-all", t.input, t.text)}
      />
    </div>
  );
}
