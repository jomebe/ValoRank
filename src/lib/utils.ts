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
  return [...items]
    .sort(
      (a, b) =>
        b.voteCount - a.voteCount ||
        a.nameEn.localeCompare(b.nameEn, "en", { sensitivity: "base" }),
    )
    .map((item, index) => ({ ...item, rank: index + 1 }));
}
