"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import type { CategoryDefinition } from "@/lib/categories";

export function CategoryCard({
  category,
  index,
}: {
  category: CategoryDefinition;
  index: number;
}) {
  const { dictionary: t } = useLocale();
  const content = t.categories[category.id];
  const Icon = category.icon;

  return (
    <Link
      href={`/rankings/${category.id}`}
      className="group relative min-h-[250px] overflow-hidden rounded-[24px] border border-white/[0.075] bg-[#10151c] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15"
    >
      <div
        className="absolute -right-12 -top-12 size-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-20"
        style={{ backgroundColor: category.accent }}
      />
      <span className="absolute right-5 top-4 text-6xl font-black tracking-[-0.08em] text-white/[0.025]">
        0{index + 1}
      </span>
      <div
        className="grid size-11 place-items-center rounded-[14px] border border-white/8"
        style={{ color: category.accent, backgroundColor: `${category.accent}12` }}
      >
        <Icon className="size-5" strokeWidth={1.8} />
      </div>
      <div className="absolute inset-x-6 bottom-6">
        <h3 className="text-xl font-black tracking-[-0.035em] text-white">
          {content.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
          {content.description}
        </p>
        <span className="mt-5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white/58 transition group-hover:text-white">
          {t.home.liveBoard}
          <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
