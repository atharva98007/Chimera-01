"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeRippleOverlay } from "@/components/ThemeRippleOverlay";
import { ParticleBackground } from "@/components/background/ParticleBackground";
import { RunningAmbient } from "@/components/background/RunningAmbient";
import { CosmicAmbient } from "@/components/ambient/CosmicAmbient";
import { SplashGate } from "@/components/splash/SplashGate";
import { NavigationSplashProvider } from "@/context/NavigationSplashContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CosmicAmbient />
      <RunningAmbient />
      <ParticleBackground />
      <NavigationSplashProvider>
        <SplashGate>
          <ThemeRippleOverlay />
          {children}
        </SplashGate>
      </NavigationSplashProvider>
    </ThemeProvider>
  );
}
