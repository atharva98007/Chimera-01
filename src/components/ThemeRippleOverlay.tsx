"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLowPerf } from "@/hooks/useLowPerf";

export function ThemeRippleOverlay() {
  const { isTransitioning, rippleOrigin, rippleTarget } = useTheme();
  const [size, setSize] = useState(2000);
  const lowPerf = useLowPerf();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsMounted(true);
    const update = () =>
      setSize(Math.max(window.innerWidth, window.innerHeight) * 2.5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!isMounted || !rippleOrigin || !rippleTarget) return null;

  const fill =
    rippleTarget === "dark"
      ? "radial-gradient(circle, #050505 0%, #000000 100%)"
      : "radial-gradient(circle, #ffffff 0%, #f8f9fa 100%)";

  // Use scale transform (GPU-accelerated) instead of clipPath for smoother animation.
  // On mobile/low-perf use a smaller size and shorter duration to reduce jank.
  const computedSize = lowPerf ? Math.max(window.innerWidth, window.innerHeight) * 1.6 : size;
  const duration = lowPerf ? 0.45 : 0.85;
  const finalScale = lowPerf ? 1.05 : 1.2;

  const circleStyle: React.CSSProperties = {
    left: rippleOrigin.x,
    top: rippleOrigin.y,
    width: computedSize,
    height: computedSize,
    marginLeft: -computedSize / 2,
    marginTop: -computedSize / 2,
    background: fill,
    willChange: "transform, opacity",
    transformOrigin: "50% 50%",
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div className="pointer-events-none fixed inset-0 z-[9999]" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="absolute rounded-full"
            style={circleStyle}
            initial={{ scale: 0 }}
            animate={{ scale: finalScale }}
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
