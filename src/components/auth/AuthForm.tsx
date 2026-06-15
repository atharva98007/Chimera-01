"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

type AuthFormProps = {
  mode: "login" | "signup";
};

function PasswordStrength({ password }: { password: string }) {
  const { theme } = useTheme();
  const t = themeTokens[theme];

  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[!@#$%^&*]/.test(password) },
  ];

  const strength = checks.filter((c) => c.pass).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 space-y-2"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < strength ? colors[strength - 1] : "bg-zinc-700"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", t.muted)}>
        Strength:{" "}
        <span
          className={cn(
            "font-medium",
            strength === 4
              ? "text-emerald-400"
              : strength >= 2
                ? "text-yellow-400"
                : "text-red-400"
          )}
        >
          {labels[strength - 1] ?? "Very weak"}
        </span>
      </p>
    </motion.div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const router = useRouter();
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return false;
    }
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        setError("Full name is required.");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      if (isLogin) {
        setSuccess("Login successful! Redirecting…");
        // Store minimal user info (in production use next-auth or JWT)
        sessionStorage.setItem("chimera_user", JSON.stringify(data.user));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("chimera_user_changed"));
        }
        setTimeout(() => router.push("/"), 1200);
      } else {
        setSuccess("Account created! Redirecting…");
        sessionStorage.setItem(
          "chimera_user",
          JSON.stringify({
            id: data.userId ?? "",
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
          })
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("chimera_user_changed"));
        }
        setTimeout(() => router.push("/"), 1800);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: APPLE_EASE }}
      className={cn("mx-auto max-w-md rounded-3xl border p-8", t.glass)}
    >
      {/* Status banners */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm",
              isDark
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm",
              isDark
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        {!isLogin && (
          <div>
            <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Defender"
              disabled={isLoading}
              className={cn(
                "w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors",
                t.input,
                t.text
              )}
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            disabled={isLoading}
            className={cn(
              "w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors",
              t.input,
              t.text
            )}
          />
        </div>

        {/* Password */}
        <div>
          <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className={cn(
                "w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors",
                t.input,
                t.text
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={cn("absolute right-3 top-1/2 -translate-y-1/2 p-1", t.muted)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {!isLogin && <PasswordStrength password={formData.password} />}
        </div>

        {/* Confirm Password */}
        {!isLogin && (
          <div>
            <label className={cn("mb-2 block text-xs uppercase tracking-widest", t.label)}>
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors",
                  t.input,
                  t.text,
                  formData.confirmPassword &&
                    formData.confirmPassword !== formData.password &&
                    "border-red-500/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 p-1", t.muted)}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
              <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>
        )}

        {/* Forgot password link */}
        {isLogin && (
          <div className="flex justify-end">
            <button type="button" className={cn("text-xs underline-offset-2 hover:underline", t.muted)}>
              Forgot password?
            </button>
          </div>
        )}

        <MagneticButton
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isLogin ? "Signing in…" : "Creating account…"}
            </>
          ) : isLogin ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </MagneticButton>
      </form>

      <p className={cn("mt-6 text-center text-sm", t.muted)}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className={cn("font-medium underline-offset-4 hover:underline", t.accent)}
        >
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </motion.div>
  );
}
