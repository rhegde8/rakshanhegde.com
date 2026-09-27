import { OG_SIZE, renderOgImage } from "@/lib/og/template";
export const alt = "Rakshan Hegde — Software, security & a curious mind";
export const size = OG_SIZE;
export const contentType = "image/png";
export default async function OpengraphImage() {
  return renderOgImage({
    label: "The personal journal",
    title: "Building systems. Finding their breaking points.",
    subtitle:
      "Software engineering, AI, cybersecurity, and a curiosity for how the universe works.",
  });
}
