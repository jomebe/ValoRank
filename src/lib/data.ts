import { cache } from "react";
import proPlayers from "../../seed/pro-players.json";
import { categories, getCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type {
  CategoryId,
  ItemExtra,
  ProPlayerSeed,
  RankingItem,
  SiteStats,
} from "@/lib/types";
import { rankItems } from "@/lib/utils";

const VALORANT_API = "https://valorant-api.com/v1";

type ValorantResponse<T> = {
  status: number;
  data: T;
};

type ValorantRole = {
  displayName: string;
};

type ValorantItem = {
  uuid: string;
  displayName: string;
  description?: string | null;
  displayIcon?: string | null;
  fullPortraitV2?: string | null;
  fullPortrait?: string | null;
  killfeedPortrait?: string | null;
  contentTierUuid?: string | null;
  role?: ValorantRole | null;
  isPlayableCharacter?: boolean;
};

type ValorantWeapon = {
  displayName: string;
  skins: ValorantItem[];
};

type ItemRow = {
  id: string;
  external_id: string | null;
  category_id: CategoryId;
  name_en: string;
  name_ko: string | null;
  description_en: string | null;
  description_ko: string | null;
  image_url: string | null;
  extra: ItemExtra | null;
  source: string | null;
  created_at: string;
  votes?: Array<{ count: number }> | null;
};

function fromItemRow(row: ItemRow): Omit<RankingItem, "rank"> {
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

async function fetchValorant<T>(path: string, language: "en-US" | "ko-KR") {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `${VALORANT_API}/${path}${separator}language=${language}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Valorant-API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ValorantResponse<T>;
  return payload.data;
}

function fallbackDate() {
  return "2026-01-01T00:00:00.000Z";
}

function isDynamicServerUsage(error: unknown) {
  return (
    error instanceof Error &&
    "digest" in error &&
    error.digest === "DYNAMIC_SERVER_USAGE"
  );
}

async function getLiveSkins() {
  const [enWeapons, koWeapons] = await Promise.all([
    fetchValorant<ValorantWeapon[]>("weapons", "en-US"),
    fetchValorant<ValorantWeapon[]>("weapons", "ko-KR"),
  ]);

  const koNames = new Map<string, string>();
  koWeapons.forEach((weapon) =>
    weapon.skins.forEach((skin) => koNames.set(skin.uuid, skin.displayName)),
  );

  return enWeapons
    .flatMap((weapon) =>
      weapon.skins.map((skin) => ({
        id: skin.uuid,
        externalId: skin.uuid,
        categoryId: "skins" as const,
        nameEn: skin.displayName,
        nameKo: koNames.get(skin.uuid) || null,
        descriptionEn: null,
        descriptionKo: null,
        imageUrl: skin.displayIcon || null,
        extra: {
          weapon: weapon.displayName,
          tier: skin.contentTierUuid || undefined,
        },
        source: "valorant-api",
        createdAt: fallbackDate(),
        voteCount: 0,
      })),
    )
    .filter(
      (skin) =>
        skin.imageUrl &&
        !skin.nameEn.toLowerCase().startsWith("standard "),
    )
    .slice(0, 120);
}

async function getLiveGeneric(
  categoryId: Exclude<CategoryId, "skins" | "players">,
) {
  const apiPath = getCategory(categoryId).apiPath!;
  const query = categoryId === "agents" ? "?isPlayableCharacter=true" : "";
  const [enItems, koItems] = await Promise.all([
    fetchValorant<ValorantItem[]>(`${apiPath}${query}`, "en-US"),
    fetchValorant<ValorantItem[]>(`${apiPath}${query}`, "ko-KR"),
  ]);
  const koMap = new Map(koItems.map((item) => [item.uuid, item]));

  return enItems
    .filter((item) => categoryId !== "agents" || item.isPlayableCharacter)
    .map((item) => {
      const koItem = koMap.get(item.uuid);
      return {
        id: item.uuid,
        externalId: item.uuid,
        categoryId,
        nameEn: item.displayName,
        nameKo: koItem?.displayName || null,
        descriptionEn: item.description || null,
        descriptionKo: koItem?.description || null,
        imageUrl:
          item.fullPortraitV2 ||
          item.fullPortrait ||
          item.displayIcon ||
          item.killfeedPortrait ||
          null,
        extra: {
          role: item.role?.displayName || undefined,
          tier: item.contentTierUuid || undefined,
        },
        source: "valorant-api",
        createdAt: fallbackDate(),
        voteCount: 0,
      };
    })
    .filter((item) => item.imageUrl)
    .slice(0, categoryId === "sprays" ? 120 : 80);
}

function getPlayerSeeds() {
  return (proPlayers as ProPlayerSeed[]).map((player) => ({
    id: player.id,
    externalId: player.id,
    categoryId: "players" as const,
    nameEn: player.name,
    nameKo: player.name,
    descriptionEn: player.descriptionEn,
    descriptionKo: player.descriptionKo,
    imageUrl: player.imageUrl || null,
    extra: { team: player.team, region: player.region },
    source: "manual",
    createdAt: fallbackDate(),
    voteCount: 0,
  }));
}

const getLiveCategoryItems = cache(async (categoryId: CategoryId) => {
  try {
    if (categoryId === "skins") {
      return rankItems(await getLiveSkins());
    }
    if (categoryId === "players") {
      return rankItems(getPlayerSeeds());
    }
    return rankItems(await getLiveGeneric(categoryId));
  } catch (error) {
    if (isDynamicServerUsage(error)) {
      throw error;
    }
    console.error(`Failed to load ${categoryId} from Valorant-API`, error);
    return [];
  }
});

export const getCategoryItems = cache(async (categoryId: CategoryId) => {
  const supabase = await createClient();
  if (!supabase) {
    return getLiveCategoryItems(categoryId);
  }

  const { data, error } = await supabase
    .from("items")
    .select(
      "id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count)",
    )
    .eq("category_id", categoryId);

  if (error) {
    console.error(`Failed to load ${categoryId} from Supabase`, error);
    return [];
  }

  return rankItems(
    ((data || []) as unknown as ItemRow[]).map(fromItemRow),
  );
});

export const getTopItems = cache(async (limit = 10) => {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("items")
      .select(
        "id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count)",
      )
      .limit(120);

    if (!error && data) {
      return rankItems(
        (data as unknown as ItemRow[]).map(fromItemRow),
      ).slice(0, limit);
    }
  }

  const fallbackGroups = await Promise.all(
    categories.map((category) => getLiveCategoryItems(category.id)),
  );
  return rankItems(fallbackGroups.flat().slice(0, 80)).slice(0, limit);
});

export const getSiteStats = cache(async (): Promise<SiteStats> => {
  const supabase = await createClient();
  if (!supabase) {
    const groups = await Promise.all(
      categories.map((category) => getLiveCategoryItems(category.id)),
    );
    return {
      votes: 0,
      items: groups.reduce((total, group) => total + group.length, 0),
      users: 0,
    };
  }

  const [votes, items, profiles] = await Promise.all([
    supabase.from("votes").select("*", { count: "exact", head: true }),
    supabase.from("items").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return {
    votes: votes.count || 0,
    items: items.count || 0,
    users: profiles.count || 0,
  };
});

export const getItemById = cache(async (id: string) => {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("items")
      .select(
        "id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count)",
      )
      .eq("id", id)
      .maybeSingle();

    if (!data) {
      return null;
    }

    const item = fromItemRow(data as unknown as ItemRow);
    const categoryItems = await getCategoryItems(item.categoryId);
    return categoryItems.find((candidate) => candidate.id === id) || null;
  }

  const groups = await Promise.all(
    categories.map((category) => getLiveCategoryItems(category.id)),
  );
  return groups.flat().find((item) => item.id === id) || null;
});

export async function getUserVotedItemIds(userId: string | null) {
  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("votes")
    .select("item_id")
    .eq("user_id", userId);

  return (data || []).map((vote) => vote.item_id as string);
}

export async function getUserVotedItems(userId: string) {
  const supabase = await createClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("votes")
    .select(
      "items(id, external_id, category_id, name_en, name_ko, description_en, description_ko, image_url, extra, source, created_at, votes(count))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load user votes", error);
    return [];
  }

  const rows = (data || [])
    .map((vote) => vote.items)
    .filter(Boolean) as unknown as ItemRow[];

  return rankItems(rows.map(fromItemRow));
}
