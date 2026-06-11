"use client";

import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function ErrorState({ reset }: { reset?: () => void }) {
  const { dictionary: t } = useLocale();

  return (
    <div className="page-shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <AlertTriangle className="mx-auto size-7 text-[#ff6673]" />
        <h2 className="mt-4 text-xl font-bold text-white">
          {t.common.errorTitle}
        </h2>
        <p className="mt-2 text-sm text-white/40">
          {t.common.errorDescription}
        </p>
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black"
          >
            {t.common.retry}
          </button>
        )}
      </div>
    </div>
  );
}
