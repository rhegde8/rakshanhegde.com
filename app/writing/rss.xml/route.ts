import { siteConfig } from "@/lib/config/site";
import { getAllWritingEntries } from "@/lib/content/loaders";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(): Promise<Response> {
  const entries = await getAllWritingEntries();

  const items = entries
    .map(
      (entry) => `
      <item>
        <title>${escapeXml(entry.title)}</title>
        <link>${siteConfig.url}/writing/${entry.slug}</link>
        <guid>${siteConfig.url}/writing/${entry.slug}</guid>
        <pubDate>${new Date(entry.updatedAt).toUTCString()}</pubDate>
        <description>${escapeXml(entry.summary)}</description>
      </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} - Writing</title>
    <link>${siteConfig.url}/writing</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
