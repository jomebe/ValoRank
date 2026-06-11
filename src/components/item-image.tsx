"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ItemImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative grid overflow-hidden bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,.11),transparent_58%),#111721]",
        className,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn("object-contain", imageClassName)}
          onError={() => setFailed(true)}
          priority={priority}
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <div className="flex flex-col items-center gap-3 text-white/20">
            <span className="grid size-14 place-items-center rounded-2xl border border-white/7 bg-white/[0.025]">
              <ImageOff className="size-5" />
            </span>
            <span className="text-2xl font-black uppercase tracking-[-0.04em]">
              {alt.slice(0, 2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
