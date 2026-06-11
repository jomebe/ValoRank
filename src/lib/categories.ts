import {
  Bot,
  Crosshair,
  Gamepad2,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

export type CategoryDefinition = {
  id: CategoryId;
  icon: LucideIcon;
  accent: string;
  apiPath?: "weapons/skins" | "agents" | "sprays" | "buddies";
};

export const categories: CategoryDefinition[] = [
  { id: "skins", icon: Crosshair, accent: "#ff5a6b", apiPath: "weapons/skins" },
  { id: "agents", icon: Swords, accent: "#66d9e8", apiPath: "agents" },
  { id: "sprays", icon: Sparkles, accent: "#a78bfa", apiPath: "sprays" },
  { id: "flex", icon: Gamepad2, accent: "#f6c35b", apiPath: "buddies" },
  { id: "players", icon: Bot, accent: "#69a7ff" },
];

export const categoryIds = categories.map((category) => category.id);

export function isCategoryId(value: string): value is CategoryId {
  return categoryIds.includes(value as CategoryId);
}

export function getCategory(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId)!;
}
