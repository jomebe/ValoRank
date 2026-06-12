import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "VALOVOTE — Community VALORANT Rankings",
    template: "%s | VALOVOTE",
  },
  description:
    "Vote for the best VALORANT skins, agents, sprays, flex items, and pro players.",
  openGraph: {
    title: "VALOVOTE — Vote for the best of VALORANT",
    description:
      "The fan-powered leaderboard for VALORANT skins, agents, collectibles, and players.",
    type: "website",
    siteName: "VALOVOTE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

function detectLocale(
  cookieLocale: string | undefined,
  country: string | null,
  acceptLanguage: string | null,
): Locale {
  if (cookieLocale === "ko" || cookieLocale === "en") {
    return cookieLocale;
  }
  if (country?.toUpperCase() === "KR") {
    return "ko";
  }
  return acceptLanguage?.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerStore, cookieStore, supabase] = await Promise.all([
    headers(),
    cookies(),
    createClient(),
  ]);
  let initialLocale = detectLocale(
    cookieStore.get("valorank-locale")?.value,
    headerStore.get("x-vercel-ip-country") || headerStore.get("cf-ipcountry"),
    headerStore.get("accept-language"),
  );
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  if (user && !cookieStore.get("valorank-locale") && supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_locale")
      .eq("id", user.id)
      .maybeSingle();
    if (
      profile?.preferred_locale === "ko" ||
      profile?.preferred_locale === "en"
    ) {
      initialLocale = profile.preferred_locale;
    }
  }

  return (
    <html
      lang={initialLocale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders initialLocale={initialLocale} initialUser={user}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
