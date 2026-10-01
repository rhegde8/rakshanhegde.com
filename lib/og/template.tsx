import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";
export const OG_SIZE = { width: 1200, height: 630 };
type OgTemplateOptions = { label: string; title: string; subtitle?: string };
export async function renderOgImage({
  label,
  title,
  subtitle,
}: OgTemplateOptions): Promise<ImageResponse> {
  const font = await readFile(path.join(process.cwd(), "assets", "fonts", "InstrumentSans-OG.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "44px 64px",
        backgroundColor: "#101415",
        color: "#eeeee7",
        fontFamily: "Instrument Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #303b3a",
          paddingBottom: 25,
        }}
      >
        <span style={{ fontSize: 32 }}>Rakshan Hegde /</span>
        <span style={{ fontSize: 20, color: "#8de3d1" }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          gap: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 57 : title.length > 38 ? 65 : 82,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 1050,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 26, lineHeight: 1.4, color: "#a1adaa", maxWidth: 1000 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #303b3a",
          paddingTop: 21,
          fontSize: 20,
        }}
      >
        <span style={{ color: "#8de3d1" }}>Software / AI / Cybersecurity</span>
        <span>{new URL(siteConfig.url).host}</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "Instrument Sans", data: font, weight: 500, style: "normal" }] },
  );
}
