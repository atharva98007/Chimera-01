"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { useLowPerf } from "@/hooks/useLowPerf";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "outline";
  themeMode?: "dark" | "light";
};

export function MagneticButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  themeMode: themeProp,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { theme: ctxTheme } = useTheme();
  const theme = themeProp ?? ctxTheme;
  const t = themeTokens[theme];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22 });
  const springY = useSpring(y, { stiffness: 280, damping: 22 });

  const lowPerf = useLowPerf();

  const handleMove = (e: MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.12);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (lowPerf) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-shadow duration-300",
          variant === "primary" && t.btnPrimary,
          variant === "ghost" && t.btnGhost,
          variant === "outline" && t.btnGhost,
          disabled && "cursor-not-allowed opacity-45",
          className
        )}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-shadow duration-500",
        variant === "primary" && t.btnPrimary,
        variant === "ghost" && t.btnGhost,
        variant === "outline" && t.btnGhost,
        disabled && "cursor-not-allowed opacity-45",
        className
      )}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.4, ease: APPLE_EASE }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 bg-white/10"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
