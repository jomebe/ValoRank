import { createAdminClient, upsertInBatches } from "./shared";

const API = "https://vlr.orlandomm.net/api/v1";
const PAGE_SIZE = 100;
const CONCURRENCY = 64;

type PlayerSummary = {
  id: string;
  url: string;
  name: string;
  teamTag: string | null;
  country: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
      if (response.ok) {
        return response.json() as Promise<T>;
      }
      if (attempt === 3) {
        throw new Error(`${url} failed with HTTP ${response.status}`);
      }
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  throw new Error(`${url} failed`);
}

async function fetchPlayerImage(url: string) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
      if (response.ok) {
        const html = await response.text();
        return (
          html.match(
            /<meta\s+property="og:image"\s+content="(https:\/\/owcdn\.net\/img\/[^"]+)"/i,
          )?.[1] || null
        );
      }
    } catch {
      // A missing preview must not abort the full player sync.
    }
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  return null;
}

async function main() {
  const firstPage = await fetchJson<{
    data: PlayerSummary[];
    pagination: { totalPages: number };
  }>(
    `${API}/players?limit=${PAGE_SIZE}&page=1`,
  );
  const players = [...firstPage.data];
  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await fetchJson<{ data: PlayerSummary[] }>(
      `${API}/players?limit=${PAGE_SIZE}&page=${page}`,
    );
    players.push(...response.data);
  }
  const images = new Map<string, string | null>();

  for (let index = 0; index < players.length; index += CONCURRENCY) {
    const batch = players.slice(index, index + CONCURRENCY);
    const responses = await Promise.all(
      batch.map(async (player) => ({
        id: player.id,
        image: await fetchPlayerImage(player.url),
      })),
    );
    responses.forEach(({ id, image }) => images.set(id, image));
  }

  const rows = players.map((player) => ({
      external_id: `vlr-${player.id}`,
      category_id: "players",
      name_en: player.name,
      name_ko: player.name,
      description_en: `Professional VALORANT player from ${player.country}.`,
      description_ko: `${player.country} 출신 프로 VALORANT 선수.`,
      image_url: images.get(player.id) || null,
      extra: {
        team: player.teamTag || "Free Agent",
        region: player.country,
      },
      source: "vlresports",
    }));

  if (!rows.length) {
    throw new Error("Player API returned no usable players.");
  }

  const supabase = createAdminClient();
  const { data: existingPlayers, error: existingError } = await supabase
    .from("items")
    .select("external_id,image_url")
    .eq("category_id", "players")
    .not("image_url", "is", null);
  if (existingError) {
    throw new Error(`Existing player load failed: ${existingError.message}`);
  }
  const existingImages = new Map(
    (existingPlayers || []).map((player) => [
      player.external_id,
      player.image_url,
    ]),
  );
  rows.forEach((row) => {
    row.image_url =
      row.image_url || existingImages.get(row.external_id) || null;
  });

  await upsertInBatches("items", rows, "category_id,external_id");

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("category_id", "players")
    .eq("source", "manual");
  if (error) {
    throw new Error(`Old player cleanup failed: ${error.message}`);
  }

  console.log(
    `Player sync complete: ${rows.length} players, ${rows.filter((row) => row.image_url).length} photos.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
