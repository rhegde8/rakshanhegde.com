import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

type OgTemplateOptions = {
  label: string;
  title: string;
  subtitle?: string;
  command: string;
};

async function loadFont(fileName: string): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "assets", "fonts", fileName));
}

export async function renderOgImage({
  label,
  title,
  subtitle,
  command,
}: OgTemplateOptions): Promise<ImageResponse> {
  const [regular, bold] = await Promise.all([
    loadFont("JetBrainsMono-Regular.ttf"),
    loadFont("JetBrainsMono-Bold.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0c0c0c",
        padding: 64,
        fontFamily: "JetBrains Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          border: "1px solid #1e1e1e",
          backgroundColor: "#0f0f0f",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #1e1e1e",
            padding: "20px 32px",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 9999, backgroundColor: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: 9999, backgroundColor: "#febc2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: 9999, backgroundColor: "#28c840" }} />
          <div style={{ display: "flex", marginLeft: 14, color: "#6b7280", fontSize: 22 }}>
            rakshan@dev — zsh
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            padding: "0 56px",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", color: "#00ff88", fontSize: 26, letterSpacing: 6 }}>
            {`// ${label}`}
          </div>
          <div
            style={{
              display: "flex",
              color: "#e2e8f0",
              fontSize: title.length > 32 ? 54 : 68,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", color: "#6b7280", fontSize: 28, lineHeight: 1.4 }}>
              {subtitle.length > 120 ? `${subtitle.slice(0, 117)}…` : subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #1e1e1e",
            padding: "20px 32px",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", color: "#00ff88" }}>{`$ ${command}`}</div>
          <div style={{ display: "flex", color: "#6b7280" }}>{new URL(siteConfig.url).host}</div>
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
