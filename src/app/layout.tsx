"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import StripeProvider from "@/components/StripeProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/user") || pathname?.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <StripeProvider>
              {!isDashboard && <Header />}
              <main className="flex-1">{children}</main>
              {!isDashboard && <Footer />}
              <Toaster />
              <Analytics />
            </StripeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
