"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/types";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);

  const setLocale = (nextLocale: Locale) => {
    updateLocale(nextLocale);
    window.localStorage.setItem("valorank-locale", nextLocale);
    document.cookie = `valorank-locale=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = nextLocale;

    const supabase = createClient();
    if (supabase) {
      void supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          void supabase
            .from("profiles")
            .update({ preferred_locale: nextLocale })
            .eq("id", data.user.id);
        }
      });
    }
  };

  const value = useMemo(
    () => ({
      locale,
      dictionary: dictionaries[locale],
      setLocale,
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
