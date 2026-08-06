import { siteOverviewMarkdown } from "@/lib/content/markdown";

export async function GET(): Promise<Response> {
  const body = await siteOverviewMarkdown();
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
