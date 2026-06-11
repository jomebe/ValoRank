"use client";

import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder,
  clearLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
}) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.035] pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#ff5d6c]/40 focus:bg-white/[0.05]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-white/35 hover:bg-white/5 hover:text-white"
          aria-label={clearLabel}
        >
          <X className="size-3.5" />
        </button>
      )}
    </label>
  );
}
