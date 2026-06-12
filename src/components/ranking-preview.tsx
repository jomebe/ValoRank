"use client";

import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { ItemImage } from "@/components/item-image";
import { useLocale } from "@/components/providers/locale-provider";
import type { RankingItem } from "@/lib/types";
import { cn, formatCompactNumber, getItemName } from "@/lib/utils";

export function RankingPreview({ items }: { items: RankingItem[] }) {
  const { locale, dictionary: t } = useLocale();

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/[0.075] bg-[#0f141b] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/[0.065] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#ff4655] shadow-[0_0_14px_#ff4655]" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">
            {t.home.trending}
          </span>
        </div>
        <Link
          href="/rankings"
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 hover:text-white"
        >
          {t.home.fullRankings}
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="divide-y divide-white/[0.055]">
        {items.slice(0, 6).map((item, index) => {
          const name = getItemName(item, locale);
          return (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="group grid grid-cols-[28px_46px_1fr_auto] items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.025]"
            >
              <span
                className={cn(
                  "text-center text-xs font-black",
                  index === 0 ? "text-[#f2c961]" : "text-white/28",
                )}
              >
                {index === 0 ? <Crown className="mx-auto size-3.5" /> : index + 1}
              </span>
              {item.categoryId === "titles" ? (
                <div className="grid size-11 place-items-center rounded-xl bg-[#172019] px-1 text-center text-[8px] font-black leading-tight text-[#9ee493]">
                  {String(item.extra.titleText || name).slice(0, 10)}
                </div>
              ) : (
                <ItemImage
                  src={item.imageUrl}
                  alt={name}
                  className="size-11 rounded-xl"
                  imageClassName={cn(
                    "p-1.5",
                    item.categoryId === "agents" && "object-cover p-0",
                  )}
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white/82 transition group-hover:text-white">
                  {name}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                  {t.categories[item.categoryId].short}
                </p>
              </div>
              <span className="text-xs font-bold tabular-nums text-white/40">
                {formatCompactNumber(item.voteCount, locale)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
