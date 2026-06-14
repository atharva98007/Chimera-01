"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function CosmicAmbient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {isDark ? (
        <>
          <motion.div
            className="absolute -left-[20%] top-[10%] h-[55vh] w-[55vw] rounded-full bg-cyan-500/[0.07] blur-[120px]"
            animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[15%] bottom-[5%] h-[50vh] w-[50vw] rounded-full bg-violet-600/[0.08] blur-[110px]"
            animate={{ x: [0, -35, 0], y: [0, -25, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute left-[30%] top-[45%] h-[35vh] w-[35vw] rounded-full bg-rose-500/[0.04] blur-[100px]"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_45%,black,transparent)]"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <motion.div
            className="absolute left-1/2 top-0 h-[40vh] w-[80vw] -translate-x-1/2 rounded-full bg-blue-400/[0.06] blur-[100px]"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Subtle scan lines */}
      <motion.div
        className={cn(
          "absolute left-0 right-0 h-px",
          isDark ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "via-zinc-300/50"
        )}
        animate={{ top: ["20%", "80%", "20%"], opacity: [0, 0.5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
