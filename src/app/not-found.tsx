"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export default function NotFound() {
  const { dictionary: t } = useLocale();

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <p className="text-8xl font-black tracking-[-0.08em] text-white/[0.07]">
          404
        </p>
        <h1 className="-mt-5 text-2xl font-black text-white">
          {t.common.errorTitle}
        </h1>
        <p className="mt-3 text-sm text-white/38">
          {t.common.errorDescription}
        </p>
        <Link
          href="/rankings"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black"
        >
          <ArrowLeft className="size-3.5" />
          {t.nav.rankings}
        </Link>
      </div>
    </main>
  );
}
