import type { Metadata } from "next";
import { RankingsOverview } from "@/components/rankings-overview";

export const metadata: Metadata = {
  title: "Community Rankings",
  description:
    "Browse VALORANT community rankings for skins, agents, sprays, collectibles, and pro players.",
  alternates: {
    canonical: "/rankings/",
  },
};

export default function RankingsPage() {
  return <RankingsOverview />;
}
