import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        accent
          ? "border-[#ff5d6c]/18 bg-[#ff4655]/8"
          : "border-white/[0.065] bg-white/[0.025]",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>
        <Icon
          className={cn("size-4", accent ? "text-[#ff6673]" : "text-white/20")}
        />
      </div>
      <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  );
}
