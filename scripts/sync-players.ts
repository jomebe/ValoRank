import { createAdminClient, upsertInBatches } from "./shared";

const API = "https://vlr.orlandomm.net/api/v1";
const PLAYER_LIMIT = 100;
const CONCURRENCY = 8;

type PlayerSummary = {
  id: string;
};

type PlayerDetail = {
  info: {
    id: string;
    user: string;
    name: string;
    img: string | null;
    country: string;
  };
  team: {
    name: string;
  } | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function main() {
  const list = await fetchJson<{ data: PlayerSummary[] }>(
    `${API}/players?limit=${PLAYER_LIMIT}&page=1`,
  );
  const details: PlayerDetail[] = [];

  for (let index = 0; index < list.data.length; index += CONCURRENCY) {
    const batch = list.data.slice(index, index + CONCURRENCY);
    const responses = await Promise.all(
      batch.map((player) =>
        fetchJson<{ data: PlayerDetail }>(`${API}/players/${player.id}`),
      ),
    );
    details.push(...responses.map((response) => response.data));
  }

  const rows = details
    .filter((player) => player.info.img && player.team?.name)
    .map((player) => ({
      external_id: `vlr-${player.info.id}`,
      category_id: "players",
      name_en: player.info.user,
      name_ko: player.info.user,
      description_en: `${player.info.name} · ${player.info.country}`,
      description_ko: `${player.info.name} · ${player.info.country}`,
      image_url: player.info.img,
      extra: {
        team: player.team!.name,
        region: player.info.country,
      },
      source: "vlresports",
    }));

  if (!rows.length) {
    throw new Error("Player API returned no usable players.");
  }

  await upsertInBatches("items", rows, "category_id,external_id");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("category_id", "players")
    .eq("source", "manual");
  if (error) {
    throw new Error(`Old player cleanup failed: ${error.message}`);
  }

  console.log(`Player sync complete: ${rows.length} players with photos.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
