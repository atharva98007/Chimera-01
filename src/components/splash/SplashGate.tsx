"use client";

import { SplashScreen, useSplashGate } from "@/components/splash/SplashScreen";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const { showSplash, ready, completeSplash } = useSplashGate();

  return (
    <>
      {showSplash && <SplashScreen mode="intro" onComplete={completeSplash} />}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: showSplash ? 0 : 1 }}
      >
        {children}
      </div>
    </>
  );
}
