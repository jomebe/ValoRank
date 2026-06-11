import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import {
  getCategoryItems,
  getItemById,
  getUserVotedItemIds,
} from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) {
    return {};
  }
  return {
    title: item.nameEn,
    description:
      item.descriptionEn ||
      `Vote for ${item.nameEn} on the VALORANK community leaderboard.`,
    openGraph: {
      title: `${item.nameEn} | VALORANK`,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  };
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const [categoryItems, votedItemIds] = await Promise.all([
    getCategoryItems(item.categoryId),
    getUserVotedItemIds(user?.id || null),
  ]);
  const relatedItems = categoryItems.filter(
    (candidate) => candidate.id !== item.id,
  );

  return (
    <ItemDetail
      item={item}
      relatedItems={relatedItems}
      votedItemIds={votedItemIds}
    />
  );
}
