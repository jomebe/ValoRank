import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, RankingItem } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getItemName(item: RankingItem, locale: Locale) {
  return locale === "ko" && item.nameKo ? item.nameKo : item.nameEn;
}

export function getItemDescription(item: RankingItem, locale: Locale) {
  if (locale === "ko") {
    return item.descriptionKo || item.descriptionEn;
  }
  return item.descriptionEn || item.descriptionKo;
}

export function formatCompactNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function rankItems(items: Omit<RankingItem, "rank">[]): RankingItem[] {
  const sorted = [...items].sort(
    (a, b) =>
      b.voteCount - a.voteCount ||
      a.nameEn.localeCompare(b.nameEn, "en", { sensitivity: "base" }),
  );
  const counts = new Map<number, number>();
  sorted.forEach((item) => {
    counts.set(item.voteCount, (counts.get(item.voteCount) || 0) + 1);
  });

  let rank = 0;
  let previousVotes: number | null = null;
  return sorted.map((item) => {
    if (previousVotes !== item.voteCount) {
      rank += 1;
      previousVotes = item.voteCount;
    }
    return {
      ...item,
      rank,
      tied: (counts.get(item.voteCount) || 0) > 1,
    };
  });
}
