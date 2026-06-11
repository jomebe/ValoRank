"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-white/8 bg-white/[0.035] p-1",
        compact ? "gap-0" : "gap-1",
      )}
    >
      {!compact && <Languages className="ml-2 size-3.5 text-white/45" />}
      {(["en", "ko"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={cn(
            "rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition",
            locale === option
              ? "bg-white text-[#0b0e13]"
              : "text-white/45 hover:text-white",
          )}
          aria-pressed={locale === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
