import { HomeContent } from "@/components/home-content";
import { getSiteStats, getTopItems } from "@/lib/data";

export default async function Home() {
  const [topItems, stats] = await Promise.all([getTopItems(10), getSiteStats()]);
  return <HomeContent topItems={topItems} stats={stats} />;
}
