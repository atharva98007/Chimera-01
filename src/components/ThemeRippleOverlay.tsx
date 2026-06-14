"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeRippleOverlay() {
  const { isTransitioning, rippleOrigin, rippleTarget } = useTheme();
  const [size, setSize] = useState(3000);

  useEffect(() => {
    const update = () =>
      setSize(Math.max(window.innerWidth, window.innerHeight) * 2.5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!rippleOrigin || !rippleTarget) return null;

  const fill =
    rippleTarget === "dark"
      ? "radial-gradient(circle, #050505 0%, #000000 100%)"
      : "radial-gradient(circle, #ffffff 0%, #f8f9fa 100%)";

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              left: rippleOrigin.x,
              top: rippleOrigin.y,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              background: fill,
            }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
