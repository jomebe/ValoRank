"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Box, Sparkles, UsersRound } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { ItemImage } from "@/components/item-image";
import { useLocale } from "@/components/providers/locale-provider";
import { RankingPreview } from "@/components/ranking-preview";
import { StatCard } from "@/components/stat-card";
import { categories } from "@/lib/categories";
import type { RankingItem, SiteStats } from "@/lib/types";
import { formatCompactNumber, getItemName } from "@/lib/utils";

export function HomeContent({
  topItems,
  stats,
}: {
  topItems: RankingItem[];
  stats: SiteStats;
}) {
  const { locale, dictionary: t } = useLocale();
  const heroItems = topItems.slice(0, 3);

  return (
    <main>
      <section className="hero-grid relative overflow-hidden border-b border-white/[0.055]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_35%,rgba(255,70,85,.11),transparent_32%),radial-gradient(circle_at_12%_15%,rgba(78,207,225,.055),transparent_25%)]" />
        <div className="page-shell relative grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[.96fr_1.04fr] lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
              <span className="size-1.5 rounded-full bg-[#ff4655] shadow-[0_0_12px_#ff4655]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/48">
                {t.home.eyebrow}
              </span>
            </div>
            <h1 className="mt-7 max-w-3xl text-[clamp(3.35rem,8vw,6.7rem)] font-black leading-[.87] tracking-[-0.075em] text-white">
              <span className="block">{t.home.titleTop}</span>
              <span className="hero-accent block">{t.home.titleAccent}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/46 md:text-lg md:leading-8">
              {t.home.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/rankings"
                className="group flex h-13 items-center justify-center gap-2 rounded-xl bg-[#ff4655] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#ff5d6c]"
              >
                {t.home.explore}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/rankings/skins"
                className="flex h-13 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/[0.065] hover:text-white"
              >
                <BarChart3 className="size-4" />
                {t.home.liveBoard}
              </Link>
            </div>
            <div className="mt-11 grid max-w-xl grid-cols-3 gap-2.5">
              <StatCard
                label={t.home.votesCast}
                value={formatCompactNumber(stats.votes, locale)}
                icon={BarChart3}
                accent
              />
              <StatCard
                label={t.home.rankedItems}
                value={formatCompactNumber(stats.items, locale)}
                icon={Box}
              />
              <StatCard
                label={t.home.voters}
                value={formatCompactNumber(stats.users, locale)}
                icon={UsersRound}
              />
            </div>
          </div>
          <div className="relative mx-auto hidden min-h-[590px] w-full max-w-[610px] lg:block">
            <div className="absolute left-[11%] top-[4%] z-20 rounded-full border border-white/10 bg-[#0c1016]/85 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/48 backdrop-blur">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-[#65d9e8]" />
              {t.home.pulse}
            </div>
            {heroItems.map((item, index) => {
              const positions = [
                "left-[4%] top-[14%] z-10 rotate-[-5deg]",
                "right-[0%] top-[3%] z-0 rotate-[5deg]",
                "bottom-[1%] left-[23%] z-20 rotate-[1deg]",
              ];
              return (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className={`absolute w-[56%] overflow-hidden rounded-[26px] border border-white/10 bg-[#111720] shadow-2xl shadow-black/45 transition duration-500 hover:z-30 hover:rotate-0 hover:scale-[1.035] ${positions[index]}`}
                >
                  <ItemImage
                    src={item.imageUrl}
                    alt={getItemName(item, locale)}
                    priority={index === 0}
                    className="aspect-[.92/1]"
                    imageClassName={
                      item.categoryId === "agents"
                        ? "object-cover object-top"
                        : "p-8"
                    }
                  />
                  <div className="border-t border-white/7 bg-[#10151d]/95 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#ff6673]">
                          #{index + 1} · {t.categories[item.categoryId].short}
                        </p>
                        <p className="mt-1.5 truncate text-sm font-extrabold text-white">
                          {getItemName(item, locale)}
                        </p>
                      </div>
                      <Sparkles className="size-4 shrink-0 text-white/20" />
                    </div>
                  </div>
                </Link>
              );
            })}
            <div className="absolute bottom-[8%] right-[0%] size-32 rounded-full border border-[#ff4655]/12" />
            <div className="absolute bottom-[12%] right-[4%] size-20 rounded-full border border-white/6" />
          </div>
        </div>
      </section>

      <section className="page-shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="eyebrow">{t.home.trending}</p>
            <h2 className="section-title mt-4">{t.home.trending}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/42">
              {t.home.trendingDescription}
            </p>
          </div>
          <RankingPreview items={topItems} />
        </div>
      </section>

      <section
        id="categories"
        className="border-y border-white/[0.055] bg-[#0a0d12]"
      >
        <div className="page-shell py-20 md:py-28">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">{t.nav.categories}</p>
            <h2 className="section-title mt-4">{t.home.browse}</h2>
            <p className="mt-4 text-sm leading-7 text-white/42">
              {t.home.browseDescription}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={
                  index < 2
                    ? "lg:col-span-3"
                    : index === 2
                      ? "lg:col-span-2"
                      : "lg:col-span-2"
                }
              >
                <CategoryCard category={category} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
