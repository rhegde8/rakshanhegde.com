import type { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config/site";
import { OG_SIZE, renderOgImage } from "@/lib/og/template";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage(): Promise<ImageResponse> {
  return renderOgImage({
    label: "rakshan hegde",
    title: "builds things that actually work.",
    subtitle: siteConfig.role,
    command: "whoami",
  });
}
