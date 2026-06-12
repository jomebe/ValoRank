"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { useAuth } from "@/components/providers/auth-provider";
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

function fromRow(row: ItemRow): Omit<RankingItem, "rank"> {
  return {
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
  };
}

export default function ItemPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [item, setItem] = useState<RankingItem | null>(null);
  const [related, setRelated] = useState<RankingItem[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    const supabase = createClient();
    if (!id || !supabase) {
      return;
    }

    void (async () => {
      const { data } = await supabase
        .from("items")
        .select(
          "id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count)",
        )
        .eq("id", id)
        .maybeSingle();
      if (!data) {
        return;
      }

      const current = fromRow(data as unknown as ItemRow);
      const { data: rows } = await supabase
        .from("items")
        .select(
          "id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count)",
        )
        .eq("category_id", current.categoryId)
        .limit(120);
      const ranked = rankItems(
        ((rows || []) as unknown as ItemRow[]).map(fromRow),
      );
      setItem(
        ranked.find((candidate) => candidate.id === current.id) || {
          ...current,
          rank: 1,
        },
      );
      setRelated(ranked.filter((candidate) => candidate.id !== current.id));

      if (user) {
        const { data: votes } = await supabase
          .from("votes")
          .select("item_id")
          .eq("user_id", user.id);
        setVotedIds((votes || []).map((vote) => vote.item_id));
      }
    })();
  }, [searchParams, user]);

  if (!item) {
    return <main className="page-shell min-h-[70vh]" />;
  }

  return (
    <ItemDetail
      item={item}
      relatedItems={related}
      votedItemIds={votedIds}
    />
  );
}
