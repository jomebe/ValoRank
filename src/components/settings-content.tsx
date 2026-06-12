"use client";

import { Check, Languages, Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export function SettingsContent() {
  const { locale, setLocale, dictionary: t } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <main className="page-shell min-h-[70vh] py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">{t.nav.settings}</p>
        <h1 className="page-title mt-4">{t.settings.title}</h1>
        <p className="mt-4 text-base text-white/42">
          {t.settings.description}
        </p>
      </div>
      <div className="mt-10 max-w-2xl space-y-4">
        <section className="rounded-[24px] border border-white/[0.075] bg-[#10141b] p-6">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#65d9e8]/8 text-[#65d9e8]">
              <Languages className="size-4" />
            </span>
            <div>
              <h2 className="font-bold text-white">{t.settings.language}</h2>
              <p className="mt-1 text-sm leading-6 text-white/38">
                {t.settings.languageDescription}
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(["en", "ko"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                className={cn(
                  "flex h-12 items-center justify-between rounded-xl border px-4 text-sm font-bold transition",
                  locale === option
                    ? "border-[#ff5d6c]/35 bg-[#ff4655]/10 text-white"
                    : "border-white/7 bg-white/[0.025] text-white/45 hover:text-white",
                )}
              >
                {option === "en" ? t.settings.english : t.settings.korean}
                {locale === option && <Check className="size-4 text-[#ff6673]" />}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-[24px] border border-white/[0.075] bg-[#10141b] p-6">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white/55">
              <Moon className="size-4" />
            </span>
            <div>
              <h2 className="font-bold text-white">{t.settings.appearance}</h2>
              <p className="mt-1 text-sm leading-6 text-white/38">
                {t.settings.appearanceDescription}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["dark", "light"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTheme(option)}
                    className={cn(
                      "flex h-11 items-center justify-between rounded-xl border px-4 text-xs font-bold transition",
                      theme === option
                        ? "border-[#ff5d6c]/35 bg-[#ff4655]/10 text-white"
                        : "border-white/7 bg-white/[0.025] text-white/45 hover:text-white",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {option === "dark" ? (
                        <Moon className="size-3.5" />
                      ) : (
                        <Sun className="size-3.5" />
                      )}
                      {option === "dark" ? t.settings.dark : t.settings.light}
                    </span>
                    {theme === option && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
