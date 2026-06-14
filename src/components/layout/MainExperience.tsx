"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScanSession } from "@/hooks/useScanSession";
import { useEmailSession } from "@/hooks/useEmailSession";
import { AppleScrollHero } from "@/components/scroll/AppleScrollHero";
import { EmailScanner } from "@/components/email/EmailScanner";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProductSwitcher, type ProductMode } from "@/components/home/ProductSwitcher";
import { APPLE_EASE } from "@/lib/motion";
import { ScanTextureBackground } from "@/components/background/ScanTextureBackground";

export function MainExperience() {
  const [mode, setMode] = useState<ProductMode>("url");
  const urlSession = useScanSession();
  const emailSession = useEmailSession();

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#email") setMode("email");
      else if (window.location.hash === "#url" || window.location.hash === "#scanner")
        setMode("url");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const handleMode = (m: ProductMode) => {
    setMode(m);
    window.history.replaceState(null, "", m === "email" ? "/#email" : "/#url");
  };

  return (
    <>
      <div className="flex justify-center px-4 pt-24 pb-6">
        <ProductSwitcher mode={mode} onChange={handleMode} />
      </div>

      <AnimatePresence mode="wait">
        {mode === "url" ? (
          <motion.div
            key="url"
            className="relative"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: APPLE_EASE }}
          >
            <ScanTextureBackground variant="url" />
            <div className="relative z-10">
              <AppleScrollHero session={urlSession} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="email"
            className="relative"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: APPLE_EASE }}
          >
            <ScanTextureBackground variant="email" />
            <div className="relative z-10">
              <EmailHero />
              <EmailScanner session={emailSession} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeaturesSection />
    </>
  );
}

function EmailHero() {
  return (
    <section className="relative px-4 pb-4 pt-4 text-center sm:px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[11px] font-medium uppercase tracking-[0.35em] text-zinc-500"
      >
        Email intelligence
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="mx-auto mt-4 max-w-3xl text-4xl font-light tracking-tight text-zinc-100 sm:text-5xl [data-theme=light]:text-zinc-900"
      >
        Analyze phishing emails
        <span className="block text-zinc-400 [data-theme=light]:text-zinc-600">
          before you reply.
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-4 max-w-xl text-base text-zinc-500"
      >
        Paste content or upload a file. Headers, tone, and links are evaluated in real time.
      </motion.p>
    </section>
  );
}
