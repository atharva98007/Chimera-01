"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Box, Cpu, Eye, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/pages/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DefenseWorkbench } from "@/components/workbench/DefenseWorkbench";

const features = [
  {
    icon: Box,
    title: "Isolated execution",
    description: "Every suspicious URL and attachment runs in a disposable VM — zero risk to your network.",
  },
  {
    icon: Eye,
    title: "Behavioral capture",
    description: "Record DOM mutations, network callbacks, and file drops for full forensic replay.",
  },
  {
    icon: Cpu,
    title: "Multi-OS profiles",
    description: "Windows, macOS, and Linux sandboxes with realistic browser fingerprints.",
  },
  {
    icon: Lock,
    title: "Air-gapped analysis",
    description: "Outbound traffic is intercepted and logged — nothing leaks back to attackers.",
  },
];

const steps = [
  "Submit URL from scan results",
  "Payload detonates in isolated sandbox",
  "Behavior timeline and IOCs generated",
  "Verdict feeds back to agentic layer",
];

function SandboxingContent() {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  return (
    <PageShell
      eyebrow="Deep analysis"
      title="Threat sandboxing"
      description="Go beyond static heuristics. Chimera detonates suspicious payloads in isolated environments and returns full behavioral reports."
      texture="sandbox"
    >
      <div className="mb-10">
        <DefenseWorkbench mode="sandbox" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: APPLE_EASE }}
            className={cn("rounded-3xl border p-6", t.glass, t.glassHover, "transition-colors duration-500")}
          >
            <f.icon className={cn("h-6 w-6", t.accentMuted)} strokeWidth={1.5} />
            <h3 className={cn("mt-4 text-lg font-medium", t.text)}>{f.title}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", t.muted)}>{f.description}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: APPLE_EASE }}
        className={cn("mt-10 rounded-3xl border p-8", t.glass)}
      >
        <div className="mb-6 flex items-center gap-3">
          <Shield className={cn("h-5 w-5", t.accentMuted)} strokeWidth={1.5} />
          <h3 className={cn("text-sm font-medium uppercase tracking-widest", t.label)}>How it works</h3>
        </div>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-4">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  t.panel,
                  t.muted
                )}
              >
                {i + 1}
              </span>
              <p className={cn("pt-0.5 text-sm leading-relaxed", t.text)}>{step}</p>
            </li>
          ))}
        </ol>
      </motion.div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link href="/#url">
          <MagneticButton>Start URL scan</MagneticButton>
        </Link>
        <Link href="/agentic">
          <MagneticButton variant="ghost">Explore agentic defense</MagneticButton>
        </Link>
      </div>
    </PageShell>
  );
}

export default function SandboxingPage() {
  return (
    <Suspense fallback={null}>
      <SandboxingContent />
    </Suspense>
  );
}
