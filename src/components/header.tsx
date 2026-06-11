"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  const { dictionary: t } = useLocale();
  const { user, openLogin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/rankings", label: t.nav.rankings },
    { href: "/#categories", label: t.nav.categories },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.055] bg-[#080b10]/82 backdrop-blur-xl">
      <div className="page-shell flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/50 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {user ? (
            <UserMenu />
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="h-10 rounded-full bg-[#ff4655] px-5 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#ff5d6c]"
            >
              {t.nav.signIn}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-full border border-white/8 text-white md:hidden"
          aria-label={t.common.menu}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/6 bg-[#0d1117] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-white/70 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-4">
            <LanguageSwitcher />
            {user ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openLogin();
                }}
                className="h-10 rounded-full bg-[#ff4655] px-5 text-xs font-bold text-white"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
