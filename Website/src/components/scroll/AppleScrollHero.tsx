"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScannerInput } from "@/components/scanner/ScannerInput";
import { ScanConsole } from "@/components/scanner/ScanConsole";
import { ShieldVisual } from "@/components/hero/ShieldVisual";
import type { ScanSession } from "@/hooks/useScanSession";

type Props = {
  session: ScanSession;
};

export function AppleScrollHero({ session }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
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
              <ScannerInput session={session} compact />
            </div>
          </div>
          <ScanConsole session={session} />
        </div>
      </motion.section>
    );
  }

  return <ScrollHeroExplore session={session} theme={theme} mutedClass={t.muted} />;
}

function ScrollHeroExplore({
  session,
  theme,
  mutedClass,
}: {
  session: ScanSession;
  theme: "dark" | "light";
  mutedClass: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  const heroScale = useTransform(smoothProgress, [0, 0.32], [1, 0.82]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.32], [0, -72]);
  const headlineBlur = useTransform(smoothProgress, [0, 0.25], [0, 6]);
  const blurFilter = useTransform(headlineBlur, (b) => `blur(${b}px)`);

  const maskClip = useTransform(
    smoothProgress,
    [0.12, 0.48],
    ["inset(12% 8% 42% 8% round 32px)", "inset(0% 0% 0% 0% round 24px)"]
  );
  const dashboardScale = useTransform(smoothProgress, [0.12, 0.48], [0.92, 1]);
  const dashboardY = useTransform(smoothProgress, [0.12, 0.48], [80, 0]);
  const gridOpacity = useTransform(smoothProgress, [0.08, 0.35], [0, 1]);
  const canvasExpand = useTransform(smoothProgress, [0, 0.2], [0.6, 1]);
  const canvasFade = useTransform(smoothProgress, [0, 0.15], [0.85, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[220vh]"
      aria-label="Phishing scanner hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ opacity: gridOpacity }}
        >
          <div
            className={cn(
              "absolute inset-0",
              theme === "dark"
                ? "bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
                : "bg-[linear-gradient(rgba(29,78,216,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(29,78,216,0.07)_1px,transparent_1px)] bg-[size:48px_48px]"
            )}
          />
        </motion.div>

        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 z-0",
            theme === "dark" ? "bg-black" : "bg-white"
          )}
          style={{ scale: canvasExpand, opacity: canvasFade }}
        />

        <HeroHeadline
          heroScale={heroScale}
          heroOpacity={heroOpacity}
          heroY={heroY}
          blurFilter={blurFilter}
          session={session}
          theme={theme}
          mutedClass={mutedClass}
        />

        <motion.div
          className="absolute inset-x-4 bottom-4 z-20 mx-auto max-w-5xl sm:inset-x-6 sm:bottom-6 lg:inset-x-8"
          style={{
            clipPath: maskClip,
            scale: dashboardScale,
            y: dashboardY,
          }}
        >
          <ScanConsole session={session} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroHeadline({
  heroScale,
  heroOpacity,
  heroY,
  blurFilter,
  session,
  theme,
  mutedClass,
}: {
  heroScale: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  heroY: MotionValue<number>;
  blurFilter: MotionValue<string>;
  session: ScanSession;
  theme: "dark" | "light";
  mutedClass: string;
}) {
  const isDark = theme === "dark";

  return (
    <motion.div
      className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-16 pb-[42vh] sm:pt-20 lg:flex-row lg:items-center lg:text-left lg:gap-16"
      style={{
        scale: heroScale,
        opacity: heroOpacity,
        y: heroY,
        filter: blurFilter,
      }}
    >
      <div className="flex-1 text-center lg:text-left">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE }}
          className={cn(
            "mb-4 text-[11px] font-medium uppercase tracking-[0.35em]",
            isDark ? "text-zinc-500" : "text-zinc-500"
          )}
        >
          Threat intelligence
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: APPLE_EASE }}
          className={cn(
            "text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl",
            isDark ? "text-zinc-50" : "text-zinc-900"
          )}
        >
          Detect phishing
          <br />
          <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
            before it reaches you.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: APPLE_EASE }}
          className={cn("mt-5 max-w-xl text-base leading-relaxed", mutedClass)}
        >
          Scroll to reveal the analysis console. Paste any URL for a multi-phase
          scan with live telemetry.
        </motion.p>
        <div className="mt-8 w-full max-w-xl lg:mx-0">
          <ScannerInput session={session} />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.25, ease: APPLE_EASE }}
        className="hidden shrink-0 lg:block"
      >
        <ShieldVisual />
      </motion.div>
    </motion.div>
  );
}
