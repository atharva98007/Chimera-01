import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Chimera — Phishing Link Scanner",
  description:
    "AI-powered phishing detection with cinematic dark and light themes. Scan URLs, analyze threats, stay secure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-slate-500 dark:border-white/10 [data-theme=light]:border-slate-200 [data-theme=light]:text-slate-600">
            <p>© {new Date().getFullYear()} Chimera — Smart Phishing Detection</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
