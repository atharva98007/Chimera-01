"use client";

import { Brain, Mail, Fingerprint, Link2, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/features/TiltCard";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Link2 className="h-5 w-5" strokeWidth={1.5} />,
    title: "Real-Time URL Analysis",
    description: "SSL, redirects, domain age, homoglyphs, and threat intel in one pass.",
  },
  {
    icon: <Mail className="h-5 w-5" strokeWidth={1.5} />,
    title: "Email Phishing Checker",
    description: "Headers, urgency language, and embedded links scored in seconds.",
  },
  {
    icon: <Brain className="h-5 w-5" strokeWidth={1.5} />,
    title: "AI Risk Scoring",
    description: "Calibrated verdicts with transparent factor breakdown.",
  },
  {
    icon: <Fingerprint className="h-5 w-5" strokeWidth={1.5} />,
    title: "Threat Fingerprinting",
    description: "Community signals and heuristic anomaly detection.",
  },
  {
    icon: <Lock className="h-5 w-5" strokeWidth={1.5} />,
    title: "Privacy First",
    description: "Client-side evaluation — your targets stay on your machine.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />,
    title: "White-Hat Terminal",
    description: "Built for defenders who need clarity, not noise.",
  },
];

export function FeaturesSection() {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  return (
    <section
      id="features"
      className="relative pt-[100vh] lg:pt-[100vh] lg:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: APPLE_EASE }}
          className="mb-16 text-center"
        >
          <p className={cn("text-[11px] font-medium uppercase tracking-[0.35em]", t.muted)}>
            Capabilities
          </p>
          <h2 className={cn("mt-4 text-3xl font-light tracking-tight sm:text-4xl leading-relaxed", t.text)}>
            Security, refined
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <TiltCard key={f.title} {...f} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
