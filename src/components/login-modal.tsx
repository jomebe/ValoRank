"use client";

import { useEffect, useState } from "react";
import { LogIn, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";

export function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { dictionary: t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) {
      toast.error(t.auth.unavailable);
      return;
    }

    setIsLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#05070b]/85 px-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#12161e] p-7 shadow-2xl shadow-black/50"
      >
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#ff4655]/15 blur-3xl" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white"
          aria-label={t.common.close}
        >
          <X className="size-4" />
        </button>
        <div className="relative">
          <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-[#ff4655] text-white shadow-[0_0_30px_rgba(255,70,85,.25)]">
            <LogIn className="size-5" />
          </div>
          <h2
            id="login-title"
            className="text-2xl font-black tracking-[-0.035em] text-white"
          >
            {t.auth.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/52">
            {t.auth.description}
          </p>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 text-sm font-bold text-[#10131a] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.3L6.5 14Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.7 9.7 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z"
              />
            </svg>
            {t.auth.google}
          </button>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/6 bg-white/[0.025] p-3.5 text-xs leading-5 text-white/40">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#65d9e8]" />
            {t.auth.privacy}
          </div>
        </div>
      </div>
    </div>
  );
}
