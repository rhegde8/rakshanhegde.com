import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLdScript } from "@/components/JsonLdScript";
import { siteConfig } from "@/lib/config/site";
import { buildPersonJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const editorial = localFont({
  src: [
    { path: "../assets/fonts/Newsreader.woff2", weight: "200 800", style: "normal" },
    { path: "../assets/fonts/Newsreader-Italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
});
const utility = localFont({
  src: "../assets/fonts/InstrumentSans.woff2",
  weight: "400 700",
  variable: "--font-utility",
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
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: { types: { "application/rss+xml": "/writing/rss.xml" } },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${editorial.variable} ${utility.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <JsonLdScript data={[buildPersonJsonLd(), buildWebsiteJsonLd()]} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
