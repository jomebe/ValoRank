"use client";

import { CategoryCard } from "@/components/category-card";
import { useLocale } from "@/components/providers/locale-provider";
import { categories } from "@/lib/categories";

export function RankingsOverview() {
  const { dictionary: t } = useLocale();

  return (
    <main className="page-shell py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">{t.rankings.allCategories}</p>
        <h1 className="page-title mt-4">{t.rankings.title}</h1>
        <p className="mt-4 text-base leading-7 text-white/43">
          {t.rankings.description}
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <div key={category.id}>
            <CategoryCard category={category} index={index} />
          </div>
        ))}
      </div>
    </main>
  );
}
