"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { useLocale } from "@/components/providers/locale-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { RankingCard } from "@/components/ranking-card";
import { SearchBar } from "@/components/search-bar";
import type { CategoryId, RankingItem, SortOption } from "@/lib/types";
import { getItemName, rankItems } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function toUnrankedItem(item: RankingItem): Omit<RankingItem, "rank"> {
  return {
    id: item.id,
    externalId: item.externalId,
    categoryId: item.categoryId,
    nameEn: item.nameEn,
    nameKo: item.nameKo,
    descriptionEn: item.descriptionEn,
    descriptionKo: item.descriptionKo,
    imageUrl: item.imageUrl,
    extra: item.extra,
    source: item.source,
    createdAt: item.createdAt,
    voteCount: item.voteCount,
  };
}

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

const VOTE_PAGE_SIZE = 1000;

async function getAllVoteItemIds(
  categoryId: CategoryId,
  userId?: string,
) {
  const supabase = createClient();
  if (!supabase) {
    return [];
  }

  const itemIds: string[] = [];
  for (let from = 0; ; from += VOTE_PAGE_SIZE) {
    let query = supabase
      .from("votes")
      .select("item_id")
      .order("id")
      .range(from, from + VOTE_PAGE_SIZE - 1);

    query = userId
      ? query.eq("user_id", userId)
      : query.eq("category_id", categoryId);

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    itemIds.push(...data.map((vote) => vote.item_id));
    if (data.length < VOTE_PAGE_SIZE) {
      return itemIds;
    }
  }
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
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("votes-desc");
  const [filter, setFilter] = useState(t.rankings.allFilters);
  const [visibleCount, setVisibleCount] = useState(48);
  const [activeVotedIds, setActiveVotedIds] = useState(votedItemIds);
  const [liveItems, setLiveItems] = useState(items);
  const cardPositions = useRef(new Map<string, DOMRect>());

  useEffect(() => {
    let cancelled = false;

    void getAllVoteItemIds(categoryId).then((itemIds) => {
      if (!cancelled) {
        const counts = new Map<string, number>();
        itemIds.forEach((itemId) => {
          counts.set(itemId, (counts.get(itemId) || 0) + 1);
        });
        setLiveItems(
          rankItems(
            items.map((item) => ({
              ...toUnrankedItem(item),
              voteCount: counts.get(item.id) || 0,
            })),
          ),
        );
      }
    });

    if (user) {
      void getAllVoteItemIds(categoryId, user.id).then((itemIds) => {
        if (!cancelled) {
          setActiveVotedIds(itemIds);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [categoryId, items, user]);

  const handleVoteChange = (itemId: string, nextVoted: boolean) => {
    setActiveVotedIds((current) =>
      nextVoted
        ? current.includes(itemId)
          ? current
          : [...current, itemId]
        : current.filter((id) => id !== itemId),
    );
    setLiveItems((current) =>
      rankItems(
        current.map((item) => ({
          ...toUnrankedItem(item),
          voteCount:
            item.id === itemId
              ? Math.max(0, item.voteCount + (nextVoted ? 1 : -1))
              : item.voteCount,
        })),
      ),
    );
  };

  const filterOptions = useMemo(() => {
    const values = liveItems
      .flatMap((item) => getFilterValues(item, categoryId));
    return [t.rankings.allFilters, ...Array.from(new Set(values)).sort()];
  }, [categoryId, liveItems, t.rankings.allFilters]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...liveItems]
      .filter((item) => {
        const matchesQuery =
          !normalizedQuery ||
          item.nameEn.toLocaleLowerCase().includes(normalizedQuery) ||
          item.nameKo?.toLocaleLowerCase().includes(normalizedQuery) ||
          (categoryId === "players" &&
            [item.extra.team, item.extra.region].some((value) =>
              String(value || "")
                .toLocaleLowerCase()
                .includes(normalizedQuery),
            ));
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
        if (sort === "votes-asc") {
          return a.voteCount - b.voteCount || a.rank - b.rank;
        }
        return a.rank - b.rank;
      });
  }, [
    categoryId,
    filter,
    liveItems,
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
  const displayedVotedIds = user ? activeVotedIds : [];

  useLayoutEffect(() => {
    const nextPositions = new Map<string, DOMRect>();
    document.querySelectorAll<HTMLElement>("[data-ranking-card]").forEach((card) => {
      const itemId = card.dataset.rankingCard;
      if (!itemId) {
        return;
      }

      const nextPosition = card.getBoundingClientRect();
      nextPositions.set(itemId, nextPosition);
      const previousPosition = cardPositions.current.get(itemId);
      if (!previousPosition) {
        return;
      }

      const deltaX = previousPosition.left - nextPosition.left;
      const deltaY = previousPosition.top - nextPosition.top;
      if (deltaX || deltaY) {
        card.animate(
          [
            {
              transform: `translate(${deltaX}px, ${deltaY}px)`,
              boxShadow: "0 0 0 rgba(255,70,85,0)",
            },
            {
              transform: "translate(0, 0)",
              boxShadow: "0 0 36px rgba(255,70,85,.22)",
              offset: 0.65,
            },
            {
              transform: "translate(0, 0)",
              boxShadow: "0 0 0 rgba(255,70,85,0)",
            },
          ],
          { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      }
    });
    cardPositions.current = nextPositions;
  }, [displayedItems]);

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
              <option value="votes-desc">{t.rankings.sortVotesDesc}</option>
              <option value="votes-asc">{t.rankings.sortVotesAsc}</option>
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
            <div key={item.id} data-ranking-card={item.id}>
              <RankingCard
                item={item}
                voted={displayedVotedIds.includes(item.id)}
                onVoteChange={handleVoteChange}
              />
            </div>
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
