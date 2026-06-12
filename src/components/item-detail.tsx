"use client";

import Link from "next/link";
import { ArrowLeft, Database, Medal, UsersRound } from "lucide-react";
import { ItemImage } from "@/components/item-image";
import { useLocale } from "@/components/providers/locale-provider";
import { RankingCard } from "@/components/ranking-card";
import { ShareButton } from "@/components/share-button";
import { VoteButton } from "@/components/vote-button";
import type { RankingItem } from "@/lib/types";
import {
  formatCompactNumber,
  getItemDescription,
  getItemName,
} from "@/lib/utils";

export function ItemDetail({
  item,
  relatedItems,
  votedItemIds,
}: {
  item: RankingItem;
  relatedItems: RankingItem[];
  votedItemIds: string[];
}) {
  const { locale, dictionary: t } = useLocale();
  const name = getItemName(item, locale);
  const description =
    getItemDescription(item, locale) ||
    t.categories[item.categoryId].description;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,70,85,.09),transparent_30%),radial-gradient(circle_at_15%_65%,rgba(76,201,220,.06),transparent_28%)]" />
        <div className="page-shell relative py-8 md:py-14">
          <Link
            href={`/rankings/${item.categoryId}`}
            className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-white/38 transition hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            {t.categories[item.categoryId].name}
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-stretch">
            <ItemImage
              src={item.imageUrl}
              alt={name}
              priority
              className="aspect-[1.22/1] min-h-[330px] rounded-[30px] border border-white/[0.075]"
              imageClassName={
                item.categoryId === "agents"
                  ? "object-cover object-top"
                  : "p-10 md:p-16"
              }
            />
            <div className="flex flex-col justify-center rounded-[30px] border border-white/[0.075] bg-[#10141b]/78 p-7 md:p-10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ff6673]">
                {t.categories[item.categoryId].name}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
                {name}
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/45">
                {description}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4">
                  <Medal className="size-4 text-[#f1c75b]" />
                  <p className="mt-3 text-2xl font-black text-white">
                    {item.tied
                      ? locale === "ko"
                        ? `공동 ${item.rank}위`
                        : `Tied #${item.rank}`
                      : `#${item.rank}`}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">
                    {t.item.currentRank}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4">
                  <UsersRound className="size-4 text-[#65d9e8]" />
                  <p className="mt-3 text-2xl font-black text-white">
                    {formatCompactNumber(item.voteCount, locale)}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">
                    {t.item.communityVotes}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <VoteButton
                  itemId={item.id}
                  categoryId={item.categoryId}
                  initialCount={item.voteCount}
                  initialVoted={votedItemIds.includes(item.id)}
                />
                <ShareButton title={name} />
              </div>
              <p className="mt-5 flex items-center gap-2 text-[11px] text-white/25">
                <Database className="size-3.5" />
                {t.item.source}: {item.source}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-16 md:py-20">
        <div className="mb-7">
          <p className="eyebrow">{t.item.inCategory}</p>
          <h2 className="section-title mt-3">{t.item.related}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedItems.slice(0, 4).map((related) => (
            <RankingCard
              key={related.id}
              item={related}
              voted={votedItemIds.includes(related.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
