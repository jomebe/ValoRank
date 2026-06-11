import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="VALOVOTE home"
    >
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-[#ff4655] shadow-[0_0_28px_rgba(255,70,85,.22)]">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-5 text-white transition-transform duration-300 group-hover:scale-110"
        >
          <path
            fill="currentColor"
            d="M3.4 4.2 10.5 19h3L6.8 4.2H3.4Zm7.2 0 4.2 8.6 5.8-8.6h-3.8l-2.3 3.7-1.7-3.7h-2.2Z"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-black tracking-[-0.045em] text-white",
          compact ? "text-base" : "text-lg",
        )}
      >
        VALO<span className="text-[#ff5d6c]">VOTE</span>
      </span>
    </Link>
  );
}
