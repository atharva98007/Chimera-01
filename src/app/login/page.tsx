"use client";

import { PageShell } from "@/components/pages/PageShell";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Access your Chimera dashboard, scan history, and team workspace."
      texture="url"
    >
      <AuthForm mode="login" />
    </PageShell>
  );
}
