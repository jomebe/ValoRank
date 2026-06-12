import { upsertInBatches } from "./shared";

const API = "https://valorant-api.com/v1";

type ApiResponse<T> = { data: T };
type LocalizedItem = {
  uuid: string;
  displayName: string;
  description?: string | null;
  displayIcon?: string | null;
  fullTransparentIcon?: string | null;
  fullPortraitV2?: string | null;
  fullPortrait?: string | null;
  contentTierUuid?: string | null;
  isPlayableCharacter?: boolean;
  role?: { displayName: string } | null;
  levels?: Array<{ displayIcon?: string | null }>;
  chromas?: Array<{ fullRender?: string | null }>;
  largeArt?: string | null;
  titleText?: string | null;
};
type Weapon = {
  displayName: string;
  skins: LocalizedItem[];
};

type ItemRow = {
  external_id: string;
  category_id: string;
  name_en: string;
  name_ko: string | null;
  description_en: string | null;
  description_ko: string | null;
  image_url: string | null;
  extra: Record<string, string | null>;
  source: "valorant-api";
};

async function fetchApi<T>(path: string, language: "en-US" | "ko-KR") {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `${API}/${path}${separator}language=${language}`,
  );
  if (!response.ok) {
    throw new Error(`${path} failed with HTTP ${response.status}`);
  }
  return ((await response.json()) as ApiResponse<T>).data;
}

async function syncSkins() {
  const [english, korean] = await Promise.all([
    fetchApi<Weapon[]>("weapons", "en-US"),
    fetchApi<Weapon[]>("weapons", "ko-KR"),
  ]);
  const koMap = new Map<string, string>();
  korean.forEach((weapon) =>
    weapon.skins.forEach((skin) => koMap.set(skin.uuid, skin.displayName)),
  );

  const rows = english
    .flatMap((weapon) =>
      weapon.skins.map<ItemRow>((skin) => ({
        external_id: skin.uuid,
        category_id: "skins",
        name_en: skin.displayName,
        name_ko: koMap.get(skin.uuid) || null,
        description_en: null,
        description_ko: null,
        image_url:
          skin.uuid === "2a049f35-4bcd-af25-21fd-ec942e2d5007"
            ? skin.chromas?.[0]?.fullRender || skin.displayIcon || null
            : skin.displayIcon || skin.chromas?.[0]?.fullRender || null,
        extra: {
          weapon: weapon.displayName,
          tier: skin.contentTierUuid || null,
        },
        source: "valorant-api",
      })),
    )
    .filter(
      (item) =>
        item.image_url &&
        !item.name_en.toLowerCase().startsWith("standard ") &&
        item.name_en !== "Random Favorite Skin",
    );

  await upsertInBatches("items", rows, "category_id,external_id");
  return rows.length;
}

async function syncGeneric(
  categoryId:
    | "agents"
    | "sprays"
    | "buddies"
    | "flex"
    | "playercards"
    | "titles",
  endpoint: string,
) {
  const [english, korean] = await Promise.all([
    fetchApi<LocalizedItem[]>(endpoint, "en-US"),
    fetchApi<LocalizedItem[]>(endpoint, "ko-KR"),
  ]);
  const koMap = new Map(korean.map((item) => [item.uuid, item]));

  const rows = english
    .filter(
      (item) => categoryId !== "agents" || item.isPlayableCharacter === true,
    )
    .map<ItemRow>((item) => {
      const koItem = koMap.get(item.uuid);
      return {
        external_id: item.uuid,
        category_id: categoryId,
        name_en: item.displayName || item.titleText || "Untitled",
        name_ko:
          koItem?.displayName ||
          koItem?.titleText ||
          item.displayName ||
          item.titleText ||
          null,
        description_en: item.description || null,
        description_ko: koItem?.description || null,
        image_url:
          item.largeArt ||
          item.fullPortraitV2 ||
          item.fullPortrait ||
          item.fullTransparentIcon ||
          item.displayIcon ||
          item.levels?.[0]?.displayIcon ||
          null,
        extra: {
          role: item.role?.displayName || null,
          tier: item.contentTierUuid || null,
          titleText: item.titleText || null,
        },
        source: "valorant-api",
      };
    })
    .filter((item) => categoryId === "titles" || item.image_url);

  await upsertInBatches("items", rows, "category_id,external_id");
  return rows.length;
}

async function main() {
  const skins = await syncSkins();
  const agents = await syncGeneric(
    "agents",
    "agents?isPlayableCharacter=true",
  );
  const sprays = await syncGeneric("sprays", "sprays");
  const buddies = await syncGeneric("buddies", "buddies");
  const flex = await syncGeneric("flex", "flex");
  const playercards = await syncGeneric("playercards", "playercards");
  const titles = await syncGeneric("titles", "playertitles");

  console.log(
    `Valorant-API sync complete: ${skins} skins, ${agents} agents, ${sprays} sprays, ${buddies} buddies, ${flex} flex items, ${playercards} player cards, ${titles} titles.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
