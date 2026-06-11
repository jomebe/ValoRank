import {
  Bot,
  Crosshair,
  Gamepad2,
  KeyRound,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

export type CategoryDefinition = {
  id: CategoryId;
  icon: LucideIcon;
  accent: string;
  apiPath?: "weapons/skins" | "agents" | "sprays" | "buddies" | "flex";
};

export const categories: CategoryDefinition[] = [
  { id: "skins", icon: Crosshair, accent: "#ff5a6b", apiPath: "weapons/skins" },
  { id: "agents", icon: Swords, accent: "#66d9e8", apiPath: "agents" },
  { id: "sprays", icon: Sparkles, accent: "#a78bfa", apiPath: "sprays" },
  { id: "buddies", icon: KeyRound, accent: "#f6c35b", apiPath: "buddies" },
  { id: "flex", icon: Gamepad2, accent: "#fb8bd0", apiPath: "flex" },
  { id: "players", icon: Bot, accent: "#69a7ff" },
];

export const categoryIds = categories.map((category) => category.id);

export function isCategoryId(value: string): value is CategoryId {
  return categoryIds.includes(value as CategoryId);
}

export function getCategory(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId)!;
}
