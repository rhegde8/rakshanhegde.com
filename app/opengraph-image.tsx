import { OG_SIZE, renderOgImage } from "@/lib/og/template";
export const alt = "Rakshan Hegde — Software, AI & security";
export const size = OG_SIZE;
export const contentType = "image/png";
export default async function OpengraphImage() {
  return renderOgImage({
    label: "A personal systems lab",
    title: "I build software, experiment with AI, and figure out how systems break.",
    subtitle: "Security engineer. Curious builder. Currently building SealCheck.",
  });
}
