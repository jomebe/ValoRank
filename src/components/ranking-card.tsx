"use client";

import Link from "next/link";
import { Crown, Trophy } from "lucide-react";
import { ItemImage } from "@/components/item-image";
import { useLocale } from "@/components/providers/locale-provider";
import { VoteButton } from "@/components/vote-button";
import type { RankingItem } from "@/lib/types";
import { cn, getItemName } from "@/lib/utils";

export function RankingCard({
  item,
  voted = false,
  featured = false,
}: {
  item: RankingItem;
  voted?: boolean;
  featured?: boolean;
}) {
  const { locale, dictionary: t } = useLocale();
  const name = getItemName(item, locale);
  const isAgent = item.categoryId === "agents";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[22px] border bg-[#11151c]/86 transition duration-300 hover:-translate-y-1 hover:border-white/16 hover:shadow-2xl hover:shadow-black/20",
        item.rank === 1
          ? "border-[#f1c75b]/38 shadow-[inset_0_1px_0_rgba(255,226,129,.12)]"
          : "border-white/[0.075]",
        featured && "md:col-span-2 md:grid md:grid-cols-[1.3fr_1fr]",
      )}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Link href={`/item/${item.id}`} className="relative block">
        <ItemImage
          src={item.imageUrl}
          alt={name}
          className={cn(
            "aspect-[1.2/1]",
            featured && "md:h-full md:min-h-[280px]",
          )}
          imageClassName={cn(
            "p-8 transition duration-500 group-hover:scale-[1.045]",
            isAgent && "object-cover object-top p-0",
          )}
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={cn(
              "grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-xs font-black backdrop-blur",
              item.rank === 1
                ? "border-[#f1c75b]/40 bg-[#c9932f]/18 text-[#f8d87b]"
                : item.rank <= 3
                  ? "border-white/15 bg-black/35 text-white"
                  : "border-white/8 bg-black/30 text-white/60",
            )}
          >
            {item.rank === 1 ? <Crown className="size-3.5" /> : `#${item.rank}`}
          </span>
          {item.rank <= 3 && (
            <span className="rounded-md bg-black/35 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/55 backdrop-blur">
              {t.home.topPick}
            </span>
          )}
        </div>
      </Link>
      <div className="relative p-4.5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#ff6673]">
              {t.categories[item.categoryId].short}
            </p>
            <Link
              href={`/item/${item.id}`}
              className="line-clamp-1 text-[17px] font-extrabold tracking-[-0.025em] text-white transition group-hover:text-[#ff7a85]"
            >
              {name}
            </Link>
            {(item.extra.weapon || item.extra.role || item.extra.team) && (
              <p className="mt-1 truncate text-xs text-white/35">
                {String(
                  item.extra.weapon || item.extra.role || item.extra.team,
                )}
              </p>
            )}
          </div>
          <Trophy className="mt-1 size-4 shrink-0 text-white/15" />
        </div>
        <VoteButton
          itemId={item.id}
          categoryId={item.categoryId}
          initialCount={item.voteCount}
          initialVoted={voted}
          compact
        />
      </div>
    </article>
  );
}
