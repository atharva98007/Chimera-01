"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Activity, Globe2, Radar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { themeTokens } from "@/lib/themes";
import { APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TabPanels } from "./TabPanels";
import type { ScanSession, DashboardTab } from "@/hooks/useScanSession";
import { useNavigationSplash } from "@/context/NavigationSplashContext";
import { useLowPerf } from "@/hooks/useLowPerf";

const TABS: { id: DashboardTab; label: string; icon: typeof Radar }[] = [
  { id: "quick", label: "Quick Scan", icon: Radar },
  { id: "deep", label: "Deep Analysis", icon: Activity },
  { id: "map", label: "Global Threat Map", icon: Globe2 },
];

type Props = {
  session: ScanSession;
};

export function ScanConsole({ session }: Props) {
  const lowPerf = useLowPerf();
  const { theme } = useTheme();
  const t = themeTokens[theme];
  const { activeTab, setActiveTab, isBusy } = session;
  const { triggerSplash } = useNavigationSplash();

  const handleTab = (id: DashboardTab) => {
    if (id === activeTab) return;
    triggerSplash();
    setActiveTab(id);
  };

  return (
    <div className={cn("rounded-3xl border p-4 sm:p-6", t.glass)}>
      <LayoutGroup id="scan-tabs">
        <div
          className={cn(
            "mb-6 flex flex-wrap gap-2 rounded-2xl border p-1.5",
            theme === "dark" ? "border-white/10 bg-black/30" : "border-slate-200/80 bg-white/50"
          )}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={isBusy && tab.id !== "quick"}
                onClick={() => handleTab(tab.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors min-w-[140px]",
                  active ? t.text : t.muted,
                  isBusy && tab.id !== "quick" && "opacity-40 cursor-not-allowed"
                )}
              >
                {active && (
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 rounded-xl transition-all duration-300",
                      theme === "dark"
                        ? "bg-white/[0.06] border border-white/10"
                        : "bg-zinc-900/5 border border-zinc-300"
                    )}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {lowPerf ? (
        <div>
          <TabPanels session={session} tab={activeTab} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isBusy ? "-busy" : session.status)}
            initial={{ opacity: 0, x: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -28, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: APPLE_EASE }}
          >
            <TabPanels session={session} tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
