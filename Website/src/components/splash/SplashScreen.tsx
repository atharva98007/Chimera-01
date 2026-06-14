"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APPLE_EASE } from "@/lib/motion";

const LETTERS = "Chimera".split("");
export const SPLASH_KEY = "chimera-splash-shown";

type SplashMode = "intro" | "nav";

const TIMING = {
  intro: { enter: 900, break: 1800, complete: 2600 },
  nav: { enter: 700, break: 1400, complete: 3000 },
} as const;

export function SplashScreen({
  onComplete,
  mode = "intro",
}: {
  onComplete: () => void;
  mode?: SplashMode;
}) {
  const [phase, setPhase] = useState<"enter" | "break" | "exit">("enter");
  const timing = TIMING[mode];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("break"), timing.enter);
    const t2 = setTimeout(() => setPhase("exit"), timing.break);
    const t3 = setTimeout(onComplete, timing.complete);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, timing.break, timing.complete, timing.enter]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: mode === "nav" ? 0.65 : 0.8, ease: APPLE_EASE }}
    >
      <div className="flex items-center justify-center">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            className="inline-block text-5xl font-light tracking-[0.25em] text-zinc-100 sm:text-7xl"
            initial={{ opacity: 0, scale: 0.3, y: 30 }}
            animate={
              phase === "enter"
                ? { opacity: 1, scale: 1, y: 0, rotate: 0, x: 0 }
                : phase === "break"
                  ? mode === "nav"
                    ? {
                        opacity: 0,
                        scale: 0.88,
                        y: -20 - i * 4,
                        x: (i - 3) * 14,
                        rotate: 0,
                      }
                    : {
                        opacity: 0,
                        scale: 0.6,
                        y: -40 - i * 8,
                        x: (i - 3) * 28,
                        rotate: (i - 3) * 12,
                      }
                  : { opacity: 0, scale: 0.4, y: -60 }
            }
            transition={{
              duration: phase === "enter" ? 0.7 : 0.55,
              delay: phase === "enter" ? i * 0.06 : i * 0.03,
              ease: APPLE_EASE,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <AnimatePresence>
        {phase === "enter" && (
          <motion.div
            className="absolute inset-0 bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function useSplashGate() {
  const [phase, setPhase] = useState<"checking" | "splash" | "done">("checking");

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_KEY);
    setPhase(seen ? "done" : "splash");
  }, []);

  const completeSplash = () => {
    sessionStorage.setItem(SPLASH_KEY, "1");
    setPhase("done");
  };

  return {
    showSplash: phase === "splash",
    ready: phase === "done" || phase === "checking",
    completeSplash,
  };
}
