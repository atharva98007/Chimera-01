"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  ScanTextureBackground,
  type ScanTextureVariant,
} from "@/components/background/ScanTextureBackground";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  texture?: ScanTextureVariant;
};

export function PageShell({ eyebrow, title, description, children, texture }: PageShellProps) {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden pt-28 pb-20">
      {texture && <ScanTextureBackground variant={texture} />}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE }}
          className="mb-12 text-center"
        >
          <p className={cn("text-[11px] font-medium uppercase tracking-[0.35em]", t.muted)}>
            {eyebrow}
          </p>
          <h1 className={cn("mt-4 text-4xl font-light tracking-tight sm:text-5xl", t.text)}>
            {title}
          </h1>
          <p className={cn("mx-auto mt-4 max-w-2xl text-base leading-relaxed", t.muted)}>
            {description}
          </p>
        </motion.header>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: APPLE_EASE }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
