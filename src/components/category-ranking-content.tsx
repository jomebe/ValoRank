"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { RankingList } from "@/components/ranking-list";
import { categories, getCategory } from "@/lib/categories";
import type { CategoryId, RankingItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryRankingContent({
  categoryId,
  items,
  votedItemIds,
}: {
  categoryId: CategoryId;
  items: RankingItem[];
  votedItemIds: string[];
}) {
  const { dictionary: t } = useLocale();
  const category = getCategory(categoryId);
  const Icon = category.icon;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          className="absolute -right-24 -top-24 size-96 rounded-full opacity-[0.07] blur-3xl"
          style={{ backgroundColor: category.accent }}
        />
        <div className="page-shell relative py-14 md:py-20">
          <div className="flex items-start gap-5">
            <span
              className="grid size-13 shrink-0 place-items-center rounded-2xl border border-white/8"
              style={{
                color: category.accent,
                backgroundColor: `${category.accent}12`,
              }}
            >
              <Icon className="size-6" />
            </span>
            <div>
              <p className="eyebrow">{t.rankings.title}</p>
              <h1 className="page-title mt-3">
                {t.categories[categoryId].name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/42 md:text-base">
                {t.categories[categoryId].description}
              </p>
            </div>
          </div>
          <div className="no-scrollbar mt-9 flex gap-2 overflow-x-auto">
            {categories.map((option) => (
              <Link
                key={option.id}
                href={`/rankings/${option.id}`}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition",
                  option.id === categoryId
                    ? "border-white bg-white text-[#0a0d12]"
                    : "border-white/8 bg-white/[0.025] text-white/40 hover:text-white",
                )}
              >
                {t.categories[option.id].short}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell py-10 md:py-14">
        <RankingList
          items={items}
          categoryId={categoryId}
          votedItemIds={votedItemIds}
        />
      </section>
    </main>
  );
}
