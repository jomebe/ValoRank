import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppProviders } from "@/components/providers/app-providers";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { siteUrl } from "@/lib/site";
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
  metadataBase: new URL(siteUrl),
  applicationName: "VALOVOTE",
  creator: "VALOVOTE",
  publisher: "VALOVOTE",
  title: {
    default: "VALOVOTE — Community VALORANT Rankings",
    template: "%s | VALOVOTE",
  },
  description:
    "Vote for the best VALORANT skins, agents, sprays, flex items, and pro players.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VALOVOTE — Vote for the best of VALORANT",
    description:
      "The fan-powered leaderboard for VALORANT skins, agents, collectibles, and players.",
    type: "website",
    siteName: "VALOVOTE",
    url: siteUrl,
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VALOVOTE — Vote for the best of VALORANT",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VALOVOTE — Vote for the best of VALORANT",
    description:
      "The fan-powered leaderboard for VALORANT skins, agents, collectibles, and players.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4407672753126233"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full">
        <Script
          id="website-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: "VALOVOTE",
            alternateName: "발로보트",
            url: siteUrl,
            publisher: {
              "@id": `${siteUrl}/#organization`,
            },
            description:
              "Community voting and rankings for VALORANT skins, agents, collectibles, titles, and pro players.",
            inLanguage: ["ko", "en"],
          })}
        </Script>
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "VALOVOTE",
            alternateName: "발로보트",
            url: siteUrl,
            logo: `${siteUrl}/favicon.svg`,
          })}
        </Script>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGDXMFFSJ0"
        />
        <Script id="google-analytics-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZGDXMFFSJ0');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x5mm4fmstj");
          `}
        </Script>
        <AppProviders initialLocale="ko" initialUser={null}>
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
