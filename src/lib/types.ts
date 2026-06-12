export type Locale = "en" | "ko";

export type CategoryId =
  | "skins"
  | "agents"
  | "sprays"
  | "buddies"
  | "flex"
  | "playercards"
  | "titles"
  | "players";

export type SortOption = "votes-desc" | "votes-asc" | "name" | "newest";

export type ItemExtra = {
  weapon?: string;
  role?: string;
  region?: string;
  team?: string;
  tier?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export type RankingItem = {
  id: string;
  externalId: string | null;
  categoryId: CategoryId;
  nameEn: string;
  nameKo: string | null;
  descriptionEn: string | null;
  descriptionKo: string | null;
  imageUrl: string | null;
  extra: ItemExtra;
  source: string;
  createdAt: string;
  voteCount: number;
  rank: number;
  tied?: boolean;
};

export type SiteStats = {
  votes: number;
  items: number;
  users: number;
};

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  preferred_locale: Locale;
  created_at: string;
};

export type ProPlayerSeed = {
  id: string;
  name: string;
  team: string;
  region: string;
  imageUrl: string;
  descriptionEn: string;
  descriptionKo: string;
};
