import { createAdminClient } from "./shared";

const API = "https://vlr.orlandomm.net/api/v1";
const CONCURRENCY = 5;

type PlayerDetail = {
  data?: {
    info?: {
      img?: string | null;
    };
  };
};

async function getImage(playerId: string) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`${API}/players/${playerId}`, {
        signal: AbortSignal.timeout(20_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as PlayerDetail;
        return payload.data?.info?.img || null;
      }
    } catch {
      // Retry transient VLR API failures.
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
  }
  return null;
}

async function main() {
  const supabase = createAdminClient();
  const { data: players, error } = await supabase
    .from("items")
    .select("id,external_id")
    .eq("category_id", "players")
    .is("image_url", null);

  if (error) {
    throw new Error(`Player load failed: ${error.message}`);
  }

  let updated = 0;
  for (let index = 0; index < players.length; index += CONCURRENCY) {
    const batch = players.slice(index, index + CONCURRENCY);
    const images = await Promise.all(
      batch.map(async (player) => ({
        id: player.id,
        image: await getImage(player.external_id.replace(/^vlr-/, "")),
      })),
    );

    await Promise.all(
      images
        .filter(
          (result): result is { id: string; image: string } =>
            Boolean(result.image),
        )
        .map(async (result) => {
          const { error: updateError } = await supabase
            .from("items")
            .update({ image_url: result.image })
            .eq("id", result.id);
          if (updateError) {
            throw new Error(`Photo update failed: ${updateError.message}`);
          }
          updated += 1;
        }),
    );

    if ((index + CONCURRENCY) % 50 === 0) {
      console.log(`${Math.min(index + CONCURRENCY, players.length)}/${players.length}`);
    }
  }

  console.log(`Player photo sync complete: ${updated}/${players.length} updated.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
