"use client";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
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
    <LocaleProvider initialLocale={initialLocale}>
      <AuthProvider initialUser={initialUser}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#13171f",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#f4f7fb",
            },
          }}
        />
      </AuthProvider>
    </LocaleProvider>
  );
}
