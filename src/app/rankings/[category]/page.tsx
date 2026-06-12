import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRankingContent } from "@/components/category-ranking-content";
import { categories, isCategoryId } from "@/lib/categories";
import { getCategoryItems } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map(({ id }) => ({ category: id }));
}

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

  const items = await getCategoryItems(category);

  return (
    <CategoryRankingContent
      categoryId={category}
      items={items}
      votedItemIds={[]}
    />
  );
}
