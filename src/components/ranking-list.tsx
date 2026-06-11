"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { useLocale } from "@/components/providers/locale-provider";
import { RankingCard } from "@/components/ranking-card";
import { SearchBar } from "@/components/search-bar";
import type { CategoryId, RankingItem, SortOption } from "@/lib/types";
import { getItemName } from "@/lib/utils";

function getFilterValues(item: RankingItem, categoryId: CategoryId) {
  if (categoryId === "skins") {
    return item.extra.weapon ? [item.extra.weapon] : [];
  }
  if (categoryId === "agents") {
    return item.extra.role ? [item.extra.role] : [];
  }
  if (categoryId === "players") {
    return [item.extra.region, item.extra.team].filter(
      (value): value is string => Boolean(value),
    );
  }
  return [];
}

export function RankingList({
  items,
  categoryId,
  votedItemIds,
}: {
  items: RankingItem[];
  categoryId: CategoryId;
  votedItemIds: string[];
}) {
  const { locale, dictionary: t } = useLocale();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("votes");
  const [filter, setFilter] = useState(t.rankings.allFilters);
  const [visibleCount, setVisibleCount] = useState(48);

  const filterOptions = useMemo(() => {
    const values = items
      .flatMap((item) => getFilterValues(item, categoryId));
    return [t.rankings.allFilters, ...Array.from(new Set(values)).sort()];
  }, [categoryId, items, t.rankings.allFilters]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...items]
      .filter((item) => {
        const matchesQuery =
          !normalizedQuery ||
          item.nameEn.toLocaleLowerCase().includes(normalizedQuery) ||
          item.nameKo?.toLocaleLowerCase().includes(normalizedQuery);
        const matchesFilter =
          filter === t.rankings.allFilters ||
          getFilterValues(item, categoryId).includes(filter);
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === "name") {
          return getItemName(a, locale).localeCompare(
            getItemName(b, locale),
            locale,
          );
        }
        if (sort === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return a.rank - b.rank;
      });
  }, [
    categoryId,
    filter,
    items,
    locale,
    query,
    sort,
    t.rankings.allFilters,
  ]);

  const reset = () => {
    setQuery("");
    setFilter(t.rankings.allFilters);
    setVisibleCount(48);
  };

  const displayedItems = visibleItems.slice(0, visibleCount);

  return (
    <div>
      <div className="rounded-[22px] border border-white/[0.07] bg-[#10141b]/80 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_190px]">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t.rankings.searchPlaceholder}
            clearLabel={t.rankings.clearFilters}
          />
          <label className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="h-12 w-full appearance-none rounded-xl border border-white/8 bg-[#151a22] pl-11 pr-4 text-sm font-semibold text-white/65 outline-none focus:border-[#ff5d6c]/40"
            >
              <option value="votes">{t.rankings.sortVotes}</option>
              <option value="name">{t.rankings.sortName}</option>
              <option value="newest">{t.rankings.sortNewest}</option>
            </select>
          </label>
        </div>
        {filterOptions.length > 1 && (
          <div className="mt-4 border-t border-white/[0.055] pt-4">
            <FilterTabs
              values={filterOptions}
              value={filter}
              onChange={setFilter}
            />
          </div>
        )}
      </div>
      <div className="mb-5 mt-7 flex items-center justify-between">
        <p className="text-xs font-semibold text-white/35">
          <span className="text-white/70">{visibleItems.length}</span>{" "}
          {t.rankings.results}
        </p>
        <p className="text-[11px] text-white/28">
          {t.rankings.updated} ·{" "}
          {new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date())}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.length ? (
          displayedItems.map((item) => (
            <RankingCard
              key={item.id}
              item={item}
              voted={votedItemIds.includes(item.id)}
            />
          ))
        ) : (
          <EmptyState onClear={reset} />
        )}
      </div>
      {displayedItems.length < visibleItems.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 48)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            {locale === "ko" ? "더 보기" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
