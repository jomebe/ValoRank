"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LogIn, Vote } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { RankingCard } from "@/components/ranking-card";
import { createClient } from "@/lib/supabase/client";
import type { CategoryId, RankingItem } from "@/lib/types";
import { rankItems } from "@/lib/utils";

type ItemRow = {
  id: string;
  external_id: string | null;
  category_id: CategoryId;
  name_en: string;
  name_ko: string | null;
  description_en: string | null;
  description_ko: string | null;
  image_url: string | null;
  extra: RankingItem["extra"] | null;
  source: string | null;
  created_at: string;
  votes?: Array<{ count: number }> | null;
};

export function ProfileContent({ items: initialItems }: { items: RankingItem[] }) {
  const { user, openLogin } = useAuth();
  const { dictionary: t } = useLocale();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const supabase = createClient();
    if (!user || !supabase) {
      return;
    }

    void supabase
      .from("votes")
      .select(
        "items(id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count))",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = (data || [])
          .map((vote) => vote.items)
          .filter(Boolean) as unknown as ItemRow[];
        setItems(
          rankItems(
            rows.map((row) => ({
              id: row.id,
              externalId: row.external_id,
              categoryId: row.category_id,
              nameEn: row.name_en,
              nameKo: row.name_ko,
              descriptionEn: row.description_en,
              descriptionKo: row.description_ko,
              imageUrl: row.image_url,
              extra: row.extra || {},
              source: row.source || "manual",
              createdAt: row.created_at,
              voteCount: row.votes?.[0]?.count || 0,
            })),
          ),
        );
      });
  }, [user]);

  if (!user) {
    return (
      <main className="page-shell grid min-h-[70vh] place-items-center py-16 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#ff4655]/10 text-[#ff6673]">
            <LogIn className="size-5" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-white">
            {t.profile.signedOutTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/40">
            {t.profile.signedOutDescription}
          </p>
          <button
            type="button"
            onClick={openLogin}
            className="mt-6 h-11 rounded-full bg-[#ff4655] px-6 text-xs font-bold text-white"
          >
            {t.nav.signIn}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-[70vh] py-16 md:py-24">
      <p className="eyebrow">{t.nav.profile}</p>
      <h1 className="page-title mt-4">{t.profile.title}</h1>
      <p className="mt-4 text-base text-white/42">{t.profile.description}</p>
      {items.length ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <RankingCard key={item.id} item={item} voted />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid min-h-72 place-items-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.018] text-center">
          <div>
            <Vote className="mx-auto size-6 text-white/22" />
            <h2 className="mt-4 text-lg font-bold text-white">
              {t.profile.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-white/38">
              {t.profile.emptyDescription}
            </p>
            <Link
              href="/rankings"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#ff6673]"
            >
              {t.home.explore}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
