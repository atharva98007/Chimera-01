"use client";

import { Mail, MessageSquare, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/pages/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function ContactPage() {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageShell
      eyebrow="Get in touch"
      title="Contact us"
      description="Questions about Chimera, enterprise deployment, or threat research partnerships — we'd like to hear from you."
      texture="agentic"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className={cn("space-y-4 rounded-3xl border p-6 lg:col-span-2", t.glass)}>
          <div className="flex items-start gap-3">
            <Mail className={cn("mt-0.5 h-5 w-5", t.accentMuted)} strokeWidth={1.5} />
            <div>
              <p className={cn("text-sm font-medium", t.text)}>Email</p>
              <p className={cn("text-sm", t.muted)}>security@chimera.dev</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageSquare className={cn("mt-0.5 h-5 w-5", t.accentMuted)} strokeWidth={1.5} />
            <div>
              <p className={cn("text-sm font-medium", t.text)}>Response time</p>
              <p className={cn("text-sm", t.muted)}>Within 24 hours on business days</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn("space-y-4 rounded-3xl border p-6 lg:col-span-3", t.glass)}
        >
          <div>
            <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className={cn("w-full rounded-xl px-4 py-3 text-sm outline-none", t.input, t.text)}
            />
          </div>
          <div>
            <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className={cn("w-full rounded-xl px-4 py-3 text-sm outline-none", t.input, t.text)}
            />
          </div>
          <div>
            <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
              Message
            </label>
            <textarea
              rows={5}
              placeholder="How can we help?"
              className={cn("w-full resize-none rounded-xl px-4 py-3 text-sm outline-none", t.input, t.text)}
            />
          </div>
          <MagneticButton type="submit">
            <Send className="h-4 w-4" />
            Send message
          </MagneticButton>
        </form>
      </div>
    </PageShell>
  );
}
