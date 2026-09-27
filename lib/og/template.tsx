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
  const font = await readFile(path.join(process.cwd(), "assets", "fonts", "Newsreader-OG.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "40px 64px",
        backgroundColor: "#f3eddf",
        color: "#292820",
        fontFamily: "Newsreader",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #292820",
          paddingBottom: 20,
        }}
      >
        <span style={{ fontSize: 46 }}>Rakshan Hegde.</span>
        <span style={{ fontSize: 23, color: "#883e32" }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: title.length > 38 ? 66 : 82,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 30, lineHeight: 1.4, color: "#656052" }}>{subtitle}</div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #b6ad9a",
          paddingTop: 19,
          fontSize: 22,
        }}
      >
        <span>Software, security & a curious mind</span>
        <span>{new URL(siteConfig.url).host}</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "Newsreader", data: font, weight: 500, style: "normal" }] },
  );
}
