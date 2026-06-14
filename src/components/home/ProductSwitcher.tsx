"use client";

import { motion, LayoutGroup } from "framer-motion";
import { Link2, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useNavigationSplash } from "@/context/NavigationSplashContext";

export type ProductMode = "url" | "email";

const items: { id: ProductMode; label: string; icon: typeof Link2 }[] = [
  { id: "url", label: "URL Scanner", icon: Link2 },
  { id: "email", label: "Email Checker", icon: Mail },
];

type Props = {
  mode: ProductMode;
  onChange: (m: ProductMode) => void;
};

export function ProductSwitcher({ mode, onChange }: Props) {
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const isDark = theme === "dark";
  const { triggerSplash } = useNavigationSplash();

  const handleChange = (m: ProductMode) => {
    if (m === mode) return;
    triggerSplash();
    onChange(m);
  };

  return (
    <LayoutGroup id="product-switch">
      <div
        className={cn(
          "inline-flex rounded-full border p-1",
          t.glass,
          isDark ? "border-white/[0.08]" : "border-zinc-200"
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleChange(item.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors",
                active ? t.text : t.muted
              )}
            >
              {active && (
                <motion.span
                  layoutId="product-pill"
                  className={cn(
                    "absolute inset-0 rounded-full",
                    isDark
                      ? "bg-white/[0.08] border border-white/10"
                      : "bg-zinc-900 border border-zinc-900"
                  )}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex items-center gap-2",
                  active && !isDark && "text-white"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
