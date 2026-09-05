import type { NextRequest } from "next/server";

import {
  projectToMarkdown,
  projectsIndexMarkdown,
  writingIndexMarkdown,
  writingToMarkdown,
  siteOverviewMarkdown,
} from "@/lib/content/markdown";
import { getProjectBySlug, getWritingBySlug } from "@/lib/content/loaders";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

/**
 * Serves markdown versions of content pages. Reached via the proxy rewrite for
 * `<path>.md` URLs and `Accept: text/markdown` requests — not linked directly.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const path =
    request.headers.get("x-markdown-path") ?? request.nextUrl.searchParams.get("path") ?? "/";
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return markdownResponse(await siteOverviewMarkdown());
  }

  if (segments.length === 1) {
    if (segments[0] === "projects") {
      return markdownResponse(await projectsIndexMarkdown());
    }
    if (segments[0] === "writing") {
      return markdownResponse(await writingIndexMarkdown());
    }
  }

  if (segments.length === 2 && SLUG_PATTERN.test(segments[1]!)) {
    if (segments[0] === "projects") {
      const project = await getProjectBySlug(segments[1]!);
      if (project) {
        return markdownResponse(projectToMarkdown(project));
      }
    }
    if (segments[0] === "writing") {
      const entry = await getWritingBySlug(segments[1]!);
      if (entry) {
        return markdownResponse(writingToMarkdown(entry));
      }
    }
  }

  return new Response("No markdown representation for this path.\n", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
