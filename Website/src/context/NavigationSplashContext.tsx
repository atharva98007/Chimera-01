"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { SplashScreen } from "@/components/splash/SplashScreen";

type NavigationSplashContextValue = {
  triggerSplash: () => void;
};

const NavigationSplashContext = createContext<NavigationSplashContextValue>({
  triggerSplash: () => {},
});

export function useNavigationSplash() {
  return useContext(NavigationSplashContext);
}

export function NavigationSplashProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showNavSplash, setShowNavSplash] = useState(false);
  const skipNextRef = useRef(true);
  const prevPathRef = useRef(pathname);

  const triggerSplash = useCallback(() => {
    setShowNavSplash(true);
  }, []);

  const completeSplash = useCallback(() => {
    setShowNavSplash(false);
  }, []);

  useEffect(() => {
    if (skipNextRef.current) {
      skipNextRef.current = false;
      prevPathRef.current = pathname;
      return;
    }
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setShowNavSplash(true);
    }
  }, [pathname]);

  return (
    <NavigationSplashContext.Provider value={{ triggerSplash }}>
      {showNavSplash && <SplashScreen mode="nav" onComplete={completeSplash} />}
      {children}
    </NavigationSplashContext.Provider>
  );
}
