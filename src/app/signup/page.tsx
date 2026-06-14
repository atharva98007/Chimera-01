"use client";

import { PageShell } from "@/components/pages/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <PageShell
      eyebrow="Get started"
      title="Create account"
      description="Join Chimera to save scan results, configure alerts, and collaborate with your security team."
      texture="email"
    >
      <AuthForm mode="signup" />
    </PageShell>
  );
}
