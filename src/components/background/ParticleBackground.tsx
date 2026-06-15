"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { useTheme } from "@/context/ThemeContext";
import { useLowPerf } from "@/hooks/useLowPerf";

export function ParticleBackground() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const lowPerf = useLowPerf();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);
  const options: ISourceOptions | null = useMemo(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || lowPerf) return null;
    if (theme === "dark") {
      return {
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 45,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { enable: true, mode: "grab" },
            resize: { enable: true },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.12 } },
          },
        },
        particles: {
          color: { value: ["#ffffff", "#a1a1aa", "#67e8f9"] },
          links: {
            color: "#ffffff",
            distance: 120,
            enable: true,
            opacity: 0.06,
            width: 0.5,
          },
          move: { enable: true, speed: 0.35, random: true },
          number: { density: { enable: true, width: 1920, height: 1080 }, value: 35 },
          opacity: { value: { min: 0.08, max: 0.35 } },
          size: { value: { min: 0.4, max: 1.2 } },
        },
        detectRetina: true,
      };
    }

    return {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 45,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: { enable: true },
        },
        modes: { repulse: { distance: 100, duration: 0.35 } },
      },
      particles: {
        color: { value: "#94a3b8" },
        links: { enable: true, distance: 100, opacity: 0.12, width: 0.5, color: "#cbd5e1" },
        move: { enable: true, speed: 0.25 },
        number: { density: { enable: true, width: 1920, height: 1080 }, value: 25 },
        opacity: { value: { min: 0.15, max: 0.4 } },
        size: { value: { min: 0.8, max: 1.5 } },
      },
      detectRetina: true,
    };
  }, [theme, lowPerf]);

  if (!ready || !options) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-80">
      <Particles id="chimera-particles" className="h-full w-full" options={options} />
    </div>
  );
}
