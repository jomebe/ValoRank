import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRankingContent } from "@/components/category-ranking-content";
import { isCategoryId } from "@/lib/categories";
import { getCategoryItems, getUserVotedItemIds } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryId(category)) {
    return {};
  }
  const copy = getDictionary("en").categories[category];
  return {
    title: copy.name,
    description: copy.description,
  };
}

export default async function CategoryRankingPage({ params }: PageProps) {
  const { category } = await params;
  if (!isCategoryId(category)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const [items, votedItemIds] = await Promise.all([
    getCategoryItems(category),
    getUserVotedItemIds(user?.id || null),
  ]);

  return (
    <CategoryRankingContent
      categoryId={category}
      items={items}
      votedItemIds={votedItemIds}
    />
  );
}
