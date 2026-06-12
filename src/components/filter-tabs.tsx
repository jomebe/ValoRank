"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    element.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState, values]);

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({
      left: direction * Math.max(240, scrollRef.current.clientWidth * 0.65),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll filters left"
          className="absolute -left-1 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[#171c24] text-white shadow-lg transition hover:bg-[#232a35]"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-1 pb-1"
      >
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
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll filters right"
          className="absolute -right-1 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[#171c24] text-white shadow-lg transition hover:bg-[#232a35]"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}
