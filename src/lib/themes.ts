export type ThemeMode = "dark" | "light";

export { SCAN_API, URL_SCAN_ENDPOINT } from "@/lib/api-config";

/** Refined design tokens — muted luxury, not neon-cartoon */
export const themeTokens = {
  dark: {
    bg: "from-[#050505] via-[#08080f] to-[#000000]",
    text: "text-zinc-100",
    muted: "text-zinc-500",
    label: "text-zinc-400",
    accent: "text-cyan-200/90",
    accentMuted: "text-cyan-500/60",
    accentBorder: "border-white/[0.08]",
    glass:
      "bg-zinc-950/40 border border-white/[0.06] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]",
    glassHover: "hover:border-white/[0.12] hover:bg-zinc-950/55",
    panel: "bg-black/30 border border-white/[0.05]",
    input:
      "bg-black/50 border border-white/[0.08] focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 text-zinc-100 placeholder:text-zinc-500",
    terminal: "text-emerald-400/80",
    btnPrimary:
      "bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-950 hover:from-white hover:to-zinc-200",
    btnGhost:
      "border border-white/10 text-zinc-300 hover:bg-white/[0.04] hover:border-white/20",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.08)]",
    ring: "ring-cyan-500/20",
  },
  light: {
    bg: "from-white via-zinc-50 to-zinc-100",
    text: "text-zinc-900",
    muted: "text-zinc-500",
    label: "text-zinc-600",
    accent: "text-blue-900",
    accentMuted: "text-blue-600/70",
    accentBorder: "border-zinc-200/80",
    glass:
      "bg-white/75 border border-zinc-200/90 backdrop-blur-2xl shadow-[0_12px_48px_rgba(15,23,42,0.06)]",
    glassHover: "hover:border-zinc-300 hover:shadow-[0_16px_56px_rgba(15,23,42,0.08)]",
    panel: "bg-white/90 border border-zinc-200/80",
    input:
      "bg-white border border-zinc-200 focus:border-blue-600/40 focus:ring-1 focus:ring-blue-600/15 text-zinc-900 placeholder:text-zinc-400",
    terminal: "text-emerald-700",
    btnPrimary:
      "bg-zinc-900 text-white hover:bg-zinc-800",
    btnGhost:
      "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
    glow: "shadow-[0_12px_40px_rgba(15,23,42,0.08)]",
    ring: "ring-blue-600/15",
  },
} as const;
