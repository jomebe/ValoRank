"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import type { CategoryId } from "@/lib/types";
import { cn, formatCompactNumber } from "@/lib/utils";

export function VoteButton({
  itemId,
  categoryId,
  initialCount,
  initialVoted,
  compact = false,
}: {
  itemId: string;
  categoryId: CategoryId;
  initialCount: number;
  initialVoted: boolean;
  compact?: boolean;
}) {
  const { user, openLogin } = useAuth();
  const { locale, dictionary: t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);

  const toggleVote = async () => {
    if (!user) {
      openLogin();
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast.error(t.vote.configurationMissing);
      return;
    }

    const previousVoted = voted;
    const previousCount = count;
    const nextVoted = !voted;
    setVoted(nextVoted);
    setCount((value) => Math.max(0, value + (nextVoted ? 1 : -1)));

    const result = nextVoted
      ? await supabase.from("votes").insert({
          user_id: user.id,
          item_id: itemId,
          category_id: categoryId,
        })
      : await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId);

    if (result.error) {
      setVoted(previousVoted);
      setCount(previousCount);
      toast.error(t.vote.failed);
      return;
    }

    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={() => void toggleVote()}
      disabled={isPending}
      aria-pressed={voted}
      aria-label={voted ? t.vote.remove : t.vote.action}
      className={cn(
        "group flex items-center justify-center gap-2 rounded-xl border font-bold transition duration-200",
        compact ? "h-10 min-w-[88px] px-3 text-xs" : "h-12 px-5 text-sm",
        voted
          ? "border-[#ff5d6c]/45 bg-[#ff4655] text-white shadow-[0_10px_30px_rgba(255,70,85,.16)]"
          : "border-white/10 bg-white/[0.045] text-white/72 hover:border-[#ff5d6c]/35 hover:bg-[#ff4655]/10 hover:text-white",
        isPending && "cursor-wait opacity-70",
      )}
    >
      {voted ? (
        <Check className="size-4" strokeWidth={2.7} />
      ) : (
        <ChevronUp
          className="size-4 transition-transform group-hover:-translate-y-0.5"
          strokeWidth={2.7}
        />
      )}
      <span>{compact ? formatCompactNumber(count, locale) : t.vote.action}</span>
      {!compact && (
        <span className={voted ? "text-white/70" : "text-white/38"}>
          {formatCompactNumber(count, locale)}
        </span>
      )}
    </button>
  );
}
