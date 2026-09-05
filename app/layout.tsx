import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { JsonLdScript } from "@/components/JsonLdScript";
import { siteConfig } from "@/lib/config/site";
import { buildPersonJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonld";

import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const codeFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${codeFont.variable} ${displayFont.variable} bg-bg text-text antialiased`}
      >
        <JsonLdScript data={[buildPersonJsonLd(), buildWebsiteJsonLd()]} />
        {children}
        <div className="crt-overlay" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
