"use client";

import { cn } from "@/lib/utils";

export function FilterTabs({
  values,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {values.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "h-9 shrink-0 rounded-full border px-4 text-xs font-semibold transition",
            value === option
              ? "border-white bg-white text-[#0b0e13]"
              : "border-white/8 bg-white/[0.025] text-white/42 hover:border-white/14 hover:text-white/75",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
