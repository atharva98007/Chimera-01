import { useEffect, useState } from "react";

export function useLowPerf() {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent || "");
      const deviceMemory = (navigator as any).deviceMemory || 0;
      const lowMem = deviceMemory > 0 ? deviceMemory < 2 : false;
      setLow(isReduced || isMobile || lowMem);
    } catch {
      setLow(false);
    }
  }, []);

  return low;
}
