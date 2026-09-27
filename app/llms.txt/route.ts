import { siteOverviewMarkdown } from "@/lib/content/markdown";
import { contentCacheControl } from "@/lib/security/headers";

export async function GET(): Promise<Response> {
  const body = await siteOverviewMarkdown();
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": contentCacheControl(),
    },
  });
}
