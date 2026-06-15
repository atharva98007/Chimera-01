"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useLowPerf } from "@/hooks/useLowPerf";

export type ScanTextureVariant = "url" | "email" | "sandbox" | "agentic";

const IMAGE_MAP: Record<ScanTextureVariant, string> = {
  url: "/animations/url-scan.png",
  email: "/animations/email-scan.png",
  sandbox: "/animations/sandbox-scan.png",
  agentic: "/animations/agentic-scan.png",
};

const GRADIENT_MAP: Record<ScanTextureVariant, string> = {
  url: "from-cyan-500/25 via-blue-600/10 to-violet-600/20",
  email: "from-violet-500/25 via-fuchsia-500/10 to-cyan-500/15",
  sandbox: "from-emerald-500/20 via-cyan-500/15 to-blue-600/20",
  agentic: "from-amber-500/15 via-violet-500/20 to-cyan-500/15",
};

type Props = {
  variant: ScanTextureVariant;
  className?: string;
};

export function ScanTextureBackground({ variant, className }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [useImage, setUseImage] = useState(false);
  const lowPerf = useLowPerf();

  useEffect(() => {
    const img = new window.Image();
    img.src = IMAGE_MAP[variant];
    img.onload = () => setUseImage(true);
    img.onerror = () => setUseImage(false);
  }, [variant]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {!lowPerf && useImage && (
        <motion.div
          className="absolute inset-[-10%] opacity-[0.07] dark:opacity-[0.09]"
          animate={{ scale: [1, 1.04, 1], x: ["0%", "1.5%", "0%"], y: ["0%", "-1%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={IMAGE_MAP[variant]}
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </motion.div>
      )}

      {!lowPerf ? (
        <>
          <motion.div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-40",
              GRADIENT_MAP[variant],
              !isDark && "opacity-25"
            )}
            animate={{ opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className={cn(
              "absolute inset-0",
              isDark
                ? "bg-[repeating-linear-gradient(90deg,transparent,transparent_72px,rgba(34,211,238,0.03)_72px,rgba(34,211,238,0.03)_73px)]"
                : "bg-[repeating-linear-gradient(90deg,transparent,transparent_72px,rgba(29,78,216,0.04)_72px,rgba(29,78,216,0.04)_73px)]"
            )}
            animate={{ x: ["0%", "-72px"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className={cn(
              "absolute -left-1/4 top-1/4 h-64 w-64 rounded-full blur-3xl",
              isDark ? "bg-cyan-400/10" : "bg-blue-500/10"
            )}
            animate={{ x: ["0%", "120%", "0%"], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "absolute -right-1/4 bottom-1/4 h-72 w-72 rounded-full blur-3xl",
              isDark ? "bg-violet-500/10" : "bg-violet-400/10"
            )}
            animate={{ x: ["0%", "-100%", "0%"], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </>
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-40",
            GRADIENT_MAP[variant],
            !isDark && "opacity-25"
          )}
        />
      )}
    </div>
  );
}
