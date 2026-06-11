"use client";

import { SearchX } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function EmptyState({ onClear }: { onClear?: () => void }) {
  const { dictionary: t } = useLocale();

  return (
    <div className="col-span-full grid min-h-72 place-items-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.018] p-8 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[0.045] text-white/25">
          <SearchX className="size-5" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-white">
          {t.rankings.emptyTitle}
        </h3>
        <p className="mt-2 text-sm text-white/38">
          {t.rankings.emptyDescription}
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/65 hover:bg-white/5 hover:text-white"
          >
            {t.rankings.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
