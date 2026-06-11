"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { dictionary: t } = useLocale();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) {
    return null;
  }

  const avatarUrl = user.user_metadata.avatar_url as string | undefined;
  const name =
    (user.user_metadata.full_name as string | undefined) || user.email || "";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.035] p-1 pr-2.5 transition hover:border-white/15 hover:bg-white/[0.06]"
        aria-expanded={open}
      >
        <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white/10">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={32} height={32} />
          ) : (
            <UserRound className="size-4 text-white/65" />
          )}
        </span>
        <ChevronDown className="size-3.5 text-white/45" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#151922] p-2 shadow-2xl shadow-black/40">
          <div className="border-b border-white/7 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-white">{name}</p>
            <p className="truncate text-xs text-white/38">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
          >
            <UserRound className="size-4" />
            {t.nav.profile}
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
          >
            <Settings className="size-4" />
            {t.nav.settings}
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#ff7a85] transition hover:bg-[#ff4655]/8"
          >
            <LogOut className="size-4" />
            {t.nav.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
