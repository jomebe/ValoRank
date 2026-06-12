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
  onVoteChange,
}: {
  itemId: string;
  categoryId: CategoryId;
  initialCount: number;
  initialVoted: boolean;
  compact?: boolean;
  onVoteChange?: (voted: boolean) => void;
}) {
  const { user, openLogin } = useAuth();
  const { locale, dictionary: t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [votedOverride, setVotedOverride] = useState<boolean | null>(null);
  const [count, setCount] = useState(initialCount);
  const [isSaving, setIsSaving] = useState(false);
  const voted = votedOverride ?? initialVoted;

  const toggleVote = async () => {
    if (isSaving) {
      return;
    }

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
    setIsSaving(true);
    setVotedOverride(nextVoted);
    setCount((value) => Math.max(0, value + (nextVoted ? 1 : -1)));

    const result = nextVoted
      ? await supabase
          .from("votes")
          .insert({
            user_id: user.id,
            item_id: itemId,
            category_id: categoryId,
          })
          .select("id")
          .single()
      : await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId)
          .select("id")
          .single();

    if (result.error) {
      if (nextVoted && result.error.code === "23505") {
        setVotedOverride(true);
        setCount(previousCount);
        setIsSaving(false);
        return;
      }
      setVotedOverride(previousVoted);
      setCount(previousCount);
      setIsSaving(false);
      toast.error(t.vote.failed);
      return;
    }

    onVoteChange?.(nextVoted);
    setIsSaving(false);
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={() => void toggleVote()}
      disabled={isPending || isSaving}
      aria-pressed={voted}
      aria-label={voted ? t.vote.remove : t.vote.action}
      className={cn(
        "group flex items-center justify-center gap-2 rounded-xl border font-bold transition duration-200",
        compact ? "h-10 min-w-[88px] px-3 text-xs" : "h-12 px-5 text-sm",
        voted
          ? "border-[#ff5d6c]/45 bg-[#ff4655] text-white shadow-[0_10px_30px_rgba(255,70,85,.16)]"
          : "border-white/10 bg-white/[0.045] text-white/72 hover:border-[#ff5d6c]/35 hover:bg-[#ff4655]/10 hover:text-white",
        (isPending || isSaving) && "cursor-wait opacity-70",
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
