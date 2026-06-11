"use client";

import { Logo } from "@/components/logo";
import { useLocale } from "@/components/providers/locale-provider";

export function Footer() {
  const { dictionary: t } = useLocale();

  return (
    <footer className="border-t border-white/[0.055] bg-[#07090d]">
      <div className="page-shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo compact />
          <p className="mt-4 text-sm font-medium text-white/48">
            {t.footer.line}
          </p>
          <p className="mt-2 max-w-xl text-xs leading-5 text-white/28">
            {t.footer.disclaimer}
          </p>
        </div>
        <p className="text-xs text-white/28">{t.footer.data}</p>
      </div>
    </footer>
  );
}
