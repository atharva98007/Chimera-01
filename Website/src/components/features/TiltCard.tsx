"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children?: ReactNode;
  className?: string;
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
};

export function TiltCard({ children, className, icon, title, description, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const t = themeTokens[theme];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 28 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: APPLE_EASE }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("perspective-1000", className)}
    >
      <div
        className={cn(
          "h-full rounded-2xl border p-6 transition-all duration-500",
          t.glass,
          t.glassHover
        )}
      >
        <div
          className={cn(
            "mb-5 flex h-12 w-12 items-center justify-center rounded-xl border",
            theme === "dark" ? "border-white/[0.06] bg-white/[0.03]" : "border-zinc-200 bg-zinc-50"
          )}
        >
          {icon}
        </div>
        <h3 className={cn("text-base font-medium tracking-tight", t.text)}>{title}</h3>
        <p className={cn("mt-2 text-sm leading-relaxed", t.muted)}>{description}</p>
        {children}
      </div>
    </motion.div>
  );
}
