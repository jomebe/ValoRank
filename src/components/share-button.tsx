"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/locale-provider";

export function ShareButton({ title }: { title: string }) {
  const { dictionary: t } = useLocale();

  const share = async () => {
    const data = { title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t.item.linkCopied);
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/9 bg-white/[0.035] px-5 text-sm font-bold text-white/65 transition hover:bg-white/[0.065] hover:text-white"
    >
      <Share2 className="size-4" />
      {t.item.share}
    </button>
  );
}
