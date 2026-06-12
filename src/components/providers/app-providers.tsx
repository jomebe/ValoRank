"use client";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Locale } from "@/lib/types";

export function AppProviders({
  children,
  initialLocale,
  initialUser,
}: {
  children: ReactNode;
  initialLocale: Locale;
  initialUser: User | null;
}) {
  return (
    <ThemeProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
