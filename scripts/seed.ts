import { readFile } from "node:fs/promises";
import path from "node:path";
import { upsertInBatches } from "./shared";
import type { ProPlayerSeed } from "../src/lib/types";

const categories = [
  {
    id: "skins",
    name_en: "Weapon Skins",
    name_ko: "무기 스킨",
    description_en:
      "Premium finishes, iconic animations, and the sound designs worth equipping.",
    description_ko: "완성도 높은 외형, 애니메이션과 사운드를 갖춘 최고의 스킨.",
  },
  {
    id: "agents",
    name_en: "Agents",
    name_ko: "요원 선호도",
    description_en:
      "Rank the agents that make the biggest impact in your matches.",
    description_ko: "매치의 흐름을 바꾸고 가장 큰 영향력을 발휘하는 요원.",
  },
  {
    id: "sprays",
    name_en: "Sprays",
    name_ko: "스프레이",
    description_en:
      "The funniest, sharpest, and most recognizable sprays in the collection.",
    description_ko: "재미와 개성이 살아있는 가장 인상적인 스프레이.",
  },
  {
    id: "buddies",
    name_en: "Gun Buddies",
    name_ko: "총기 장식",
    description_en:
      "Rank the charms that add personality to every weapon loadout.",
    description_ko: "무기 장비에 개성을 더하는 최고의 총기 장식.",
  },
  {
    id: "flex",
    name_en: "Flex Items",
    name_ko: "플렉스 아이템",
    description_en:
      "Rank the handheld flex cosmetics made for showing off in a match.",
    description_ko: "게임 안에서 직접 꺼내 자랑할 수 있는 플렉스 아이템.",
  },
  {
    id: "playercards",
    name_en: "Player Cards",
    name_ko: "플레이어 카드",
    description_en:
      "Rank the artwork that gives every VALORANT profile its identity.",
    description_ko: "VALORANT 프로필의 개성을 완성하는 최고의 카드 아트.",
  },
  {
    id: "players",
    name_en: "Pro Players",
    name_ko: "발로란트 선수",
    description_en:
      "The stars, champions, and clutch performers defining competitive VALORANT.",
    description_ko: "경쟁전의 역사를 만들고 있는 스타, 챔피언, 클러치 플레이어.",
  },
];

async function main() {
  await upsertInBatches("categories", categories, "id");

  const file = await readFile(
    path.join(process.cwd(), "seed", "pro-players.json"),
    "utf8",
  );
  const players = JSON.parse(file) as ProPlayerSeed[];
  const playerRows = players.map((player) => ({
    external_id: player.id,
    category_id: "players",
    name_en: player.name,
    name_ko: player.name,
    description_en: player.descriptionEn,
    description_ko: player.descriptionKo,
    image_url: player.imageUrl || null,
    extra: {
      team: player.team,
      region: player.region,
    },
    source: "manual",
  }));

  await upsertInBatches(
    "items",
    playerRows,
    "category_id,external_id",
  );
  console.log(
    `Seed complete: ${categories.length} categories, ${playerRows.length} pro players.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
