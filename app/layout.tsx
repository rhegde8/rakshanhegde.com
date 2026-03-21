import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — builds things that actually work.`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${siteConfig.name} — builds things that actually work.`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — builds things that actually work.`,
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
      <body className={`${bodyFont.variable} ${codeFont.variable} bg-bg text-text antialiased`}>
        <JsonLdScript data={[buildPersonJsonLd(), buildWebsiteJsonLd()]} />
        {children}
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
