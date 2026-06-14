"use client";



import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, useScroll, useTransform } from "framer-motion";

import { Shield } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

import { useTheme } from "@/context/ThemeContext";

import { themeTokens } from "@/lib/themes";

import { APPLE_EASE } from "@/lib/motion";

import { cn } from "@/lib/utils";



const navLinks = [

  { href: "/#url", label: "URL Scan" },

  { href: "/#email", label: "Email" },

  { href: "/#features", label: "Features" },

  { href: "/agentic", label: "Agentic" },

  { href: "/sandboxing", label: "Sandboxing" },

  { href: "/contact", label: "Contact" },

];



export function Navbar() {

  const { theme } = useTheme();

  const t = themeTokens[theme];

  const isDark = theme === "dark";

  const router = useRouter();
  const [user, setUser] = useState<{ fullName?: string; email: string } | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const loadUser = () => {
      if (typeof window === "undefined") return;
      const stored = sessionStorage.getItem("chimera_user");
      if (!stored) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    };

    loadUser();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "chimera_user") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("chimera_user");
    setUser(null);
    router.push("/");
  };

  const headerBg = useTransform(

    scrollY,

    [0, 100],

    isDark

      ? ["rgba(5, 5, 5, 0.55)", "rgba(5, 5, 5, 0.92)"]

      : ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.95)"]

  );

  const borderColor = useTransform(

    scrollY,

    [0, 100],

    isDark

      ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)"]

      : ["rgba(0,0,0,0.04)", "rgba(0,0,0,0.08)"]

  );



  return (

    <motion.header

      initial={{ y: -20, opacity: 0 }}

      animate={{ y: 0, opacity: 1 }}

      transition={{ duration: 0.7, ease: APPLE_EASE }}

      style={{ backgroundColor: headerBg, borderBottom: "1px solid", borderColor }}

      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"

    >

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        <Link href="/" className="flex shrink-0 items-center gap-3">

          <div

            className={cn(

              "flex h-9 w-9 items-center justify-center rounded-lg border",

              isDark ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-white"

            )}

          >

            <Shield

              className={cn("h-4 w-4", isDark ? "text-zinc-300" : "text-zinc-700")}

              strokeWidth={1.5}

            />

          </div>

          <span

            className={cn(

              "text-sm font-medium tracking-[0.2em] uppercase",

              isDark ? "text-zinc-300" : "text-zinc-800"

            )}

          >

            Chimera

          </span>

        </Link>



        <ul className="hidden items-center gap-0.5 lg:flex">

          {navLinks.map((link) => (

            <li key={link.href}>

              <Link

                href={link.href}

                className={cn(

                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300",

                  t.muted,

                  isDark ? "hover:text-zinc-100" : "hover:text-zinc-900"

                )}

              >

                {link.label}

              </Link>

            </li>

          ))}

        </ul>



        <div className="flex items-center gap-2 sm:gap-3">

          {user ? (
            <div className="flex items-center gap-3">
              <div
                title={user.fullName ?? user.email}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white",
                  isDark ? "bg-zinc-900" : "bg-slate-900"
                )}
              >
                {(user.fullName?.trim().charAt(0) || user.email.charAt(0)).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300",
                  t.muted,
                  isDark ? "hover:text-zinc-100" : "hover:text-zinc-900"
                )}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 sm:block",
                  t.muted,
                  isDark ? "hover:text-zinc-100" : "hover:text-zinc-900"
                )}
              >
                Log in
              </Link>
              <Link href="/signup">
                <span
                  className={cn(
                    "inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    t.btnPrimary
                  )}
                >
                  Sign up
                </span>
              </Link>
            </>
          )}

          <ThemeToggle />

        </div>

      </nav>

    </motion.header>

  );

}

