"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Bot, Brain, GitBranch, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/pages/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DefenseWorkbench } from "@/components/workbench/DefenseWorkbench";

const capabilities = [
  {
    icon: Brain,
    title: "Autonomous triage",
    description: "AI agents classify alerts, correlate IOCs, and surface only what needs human review.",
  },
  {
    icon: GitBranch,
    title: "Multi-step reasoning",
    description: "Chain-of-thought analysis across URL, email, and attachment signals in one workflow.",
  },
  {
    icon: Zap,
    title: "Real-time response",
    description: "Trigger playbooks — block domains, quarantine mail, or notify SOC channels instantly.",
  },
  {
    icon: Sparkles,
    title: "Adaptive learning",
    description: "Agents refine heuristics from your environment while keeping data on-premise.",
  },
];

function AgenticContent() {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  return (
    <PageShell
      eyebrow="Agentic defense"
      title="Autonomous threat agents"
      description="Chimera's agentic layer orchestrates multi-step investigations — from initial scan to automated remediation — without losing analyst control."
      texture="agentic"
    >
      <div className="mb-10">
        <DefenseWorkbench mode="agentic" />
      </div>

      <div className="mb-10 flex justify-center">
        <div className={cn("inline-flex items-center gap-3 rounded-full border px-5 py-2.5", t.glass)}>
          <Bot className={cn("h-5 w-5", t.accentMuted)} strokeWidth={1.5} />
          <span className={cn("text-sm", t.muted)}>Powered by orchestrated AI agents</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {capabilities.map((cap, i) => (
          <motion.article
            key={cap.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: APPLE_EASE }}
            className={cn("rounded-3xl border p-6", t.glass, t.glassHover, "transition-colors duration-500")}
          >
            <cap.icon className={cn("h-6 w-6", t.accentMuted)} strokeWidth={1.5} />
            <h3 className={cn("mt-4 text-lg font-medium", t.text)}>{cap.title}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", t.muted)}>{cap.description}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link href="/#url">
          <MagneticButton>Run a URL scan</MagneticButton>
        </Link>
        <Link href="/sandboxing">
          <MagneticButton variant="ghost">View sandboxing</MagneticButton>
        </Link>
      </div>
    </PageShell>
  );
}

export default function AgenticPage() {
  return (
    <Suspense fallback={null}>
      <AgenticContent />
    </Suspense>
  );
}
