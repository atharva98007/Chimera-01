"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeMode } from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  isTransitioning: boolean;
  rippleOrigin: { x: number; y: number } | null;
  rippleTarget: ThemeMode | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "chimera-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState<{ x: number; y: number } | null>(null);
  const [rippleTarget, setRippleTarget] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const setTheme = useCallback(
    (next: ThemeMode) => {
      applyTheme(next);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: ThemeMode = theme === "dark" ? "light" : "dark";
      const ox = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
      const oy = origin?.y ?? 80;

      setRippleTarget(next);
      setRippleOrigin({ x: ox, y: oy });
      setIsTransitioning(true);

      window.setTimeout(() => {
        applyTheme(next);
      }, 80);

      window.setTimeout(() => {
        setIsTransitioning(false);
        setRippleOrigin(null);
        setRippleTarget(null);
      }, 900);
    },
    [theme, applyTheme]
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isTransitioning, rippleOrigin, rippleTarget }),
    [theme, setTheme, toggleTheme, isTransitioning, rippleOrigin, rippleTarget]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="min-h-screen"
        data-theme={mounted ? theme : "dark"}
        suppressHydrationWarning
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
