"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScannerInput } from "@/components/scanner/ScannerInput";
import { ScanConsole } from "@/components/scanner/ScanConsole";
import { ShieldVisual } from "@/components/hero/ShieldVisual";
import type { ScanSession } from "@/hooks/useScanSession";
import { useLowPerf } from "@/hooks/useLowPerf";

type Props = {
  session: ScanSession;
};

export function AppleScrollHero({ session }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const showResults = session.isBusy || session.status === "done" || Boolean(session.error);

  useEffect(() => {
    if (!showResults) return;
    window.requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [showResults]);

  if (showResults) {
    return (
      <motion.section
        ref={containerRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: APPLE_EASE }}
        className="relative px-4 pb-16 pt-8 sm:px-6"
        aria-label="Phishing scanner results"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <p className={cn("text-[11px] font-medium uppercase tracking-[0.35em]", t.muted)}>
                Threat intelligence
              </p>
              <h1 className={cn("mt-3 text-3xl font-light tracking-tight sm:text-4xl", t.text)}>
                Scan results
              </h1>
              <p className={cn("mt-2 max-w-xl text-sm", t.muted)}>
                Analysis for{" "}
                <span className={cn("font-mono", t.accent)}>{session.url}</span>
              </p>
            </div>
            <div className="w-full max-w-xl shrink-0">
              <div className="relative z-30">
                <ScannerInput session={session} compact />
              </div>
            </div>
          </div>
          <div className="relative z-50 pointer-events-auto">
            <ScanConsole session={session} />
          </div>
        </div>
      </motion.section>
    );
  }

  return <ScrollHeroExplore session={session} theme={theme} mutedClass={t.muted} isMobile={isMobile} />;
}

function ScrollHeroExplore({
  session,
  theme,
  mutedClass,
  isMobile,
}: {
  session: ScanSession;
  theme: "dark" | "light";
  mutedClass: string;
  isMobile: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lowPerf = useLowPerf();

  // Static styles - no scroll animation
  const heroStyles = {
    transform: "translateY(0px) scale(1)",
    opacity: 1,
  };
  const gridStyles = { opacity: 0 };
  const canvasStyles = { transform: "scale(0.6)", opacity: 0.85 };

  return (
      <section
      ref={containerRef}
      className={isMobile ? "relative z-50 h-screen" : "relative z-50 h-screen"}
      aria-label="Phishing scanner hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden z-50">
        {/* solid background overlay to prevent underlying sections showing through */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 z-40",
            theme === "dark" ? "bg-black" : "bg-white"
          )}
        />
        {!isMobile && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0" style={gridStyles}>
              <div
                className={cn(
                  "absolute inset-0",
                  theme === "dark"
                    ? "bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
                    : "bg-[linear-gradient(rgba(29,78,216,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(29,78,216,0.07)_1px,transparent_1px)] bg-[size:48px_48px]"
                )}
              />
            </div>

            <div
              className={cn(
                "pointer-events-none absolute inset-0 z-0",
                theme === "dark" ? "bg-black" : "bg-white"
              )}
              style={canvasStyles}
            />
          </>
        )}

        <HeroHeadline
          heroStyles={heroStyles}
          session={session}
          theme={theme}
          mutedClass={mutedClass}
          isLowPerf={lowPerf}
        />
      </div>

      <div className="relative z-30 mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <ScanConsole session={session} />
      </div>
    </section>
  );
}

function HeroHeadline({
  heroStyles,
  session,
  theme,
  mutedClass,
  isLowPerf,
}: {
  heroStyles: { transform: string; opacity: number };
  session: ScanSession;
  theme: "dark" | "light";
  mutedClass: string;
  isLowPerf?: boolean;
}) {
  const isDark = theme === "dark";

  if (isLowPerf) {
    return (
      <div
        className="relative z-50 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-12 pb-40 sm:pt-16 lg:flex-row lg:items-center lg:text-left lg:gap-12"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex-1 text-center lg:text-left">
          <p className={cn("mb-4 text-[11px] font-medium uppercase tracking-[0.35em]", isDark ? "text-zinc-500" : "text-zinc-500")}>Threat intelligence</p>

          <h1 className={cn("text-3xl font-light leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl", isDark ? "text-zinc-50" : "text-zinc-900")}>Detect phishing<br /><span className={isDark ? "text-zinc-400" : "text-zinc-600"}>before it reaches you.</span></h1>

          <p className={cn("mt-4 max-w-xl text-base leading-relaxed", mutedClass)}>Scroll to reveal the analysis console. Paste any URL for a multi-phase scan with live telemetry.</p>

          <div className="mt-6 w-full max-w-xl lg:mx-0 relative z-30">
            <ScannerInput session={session} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-50 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-8 pb-32 sm:pt-12 sm:pb-20 lg:pt-24 lg:pb-12 lg:flex-row lg:items-center lg:text-left lg:gap-16"
      style={{
        transform: heroStyles.transform,
        opacity: heroStyles.opacity,
        willChange: "transform, opacity",
      }}
    >
      <div className="flex-1 text-center lg:text-left">
        <p
          className={cn(
            "mb-4 text-[11px] font-medium uppercase tracking-[0.35em] transition-opacity duration-500",
            isDark ? "text-zinc-500" : "text-zinc-500"
          )}
        >
          Threat intelligence
        </p>
        <h1
          className={cn(
            "text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl transition-opacity duration-500",
            isDark ? "text-zinc-50" : "text-zinc-900"
          )}
        >
          Detect phishing
          <br />
          <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
            before it reaches you.
          </span>
        </h1>
        <p className={cn("mt-5 max-w-xl text-base leading-relaxed transition-opacity duration-500", mutedClass)}>
          Scroll to reveal the analysis console. Paste any URL for a multi-phase
          scan with live telemetry.
        </p>
        <div className="mt-8 w-full max-w-xl lg:mx-0 relative z-30">
          <ScannerInput session={session} />
        </div>
      </div>
      <div className="hidden shrink-0 lg:block">
        <ShieldVisual />
      </div>
    </div>
  );
}
