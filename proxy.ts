import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const encoder = new TextEncoder();

/**
 * Constant-time equality for two equal-length byte arrays.
 */
function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

async function sha256Utf8(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(digest);
}

/**
 * Timing-safe string comparison via SHA-256 digests (fixed 32-byte compare).
 */
async function timingSafeStringEqual(a: string, b: string): Promise<boolean> {
  const [digestA, digestB] = await Promise.all([sha256Utf8(a), sha256Utf8(b)]);
  return timingSafeEqualBytes(digestA, digestB);
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted"',
      "Cache-Control": "private, no-store",
    },
  });
}

/**
 * Content pages that have a markdown representation via /api/markdown.
 * `/` and the two collection roots, plus their detail slugs.
 */
const MARKDOWN_PATH = /^\/(?:(?:projects|writing)(?:\/[a-z0-9-]+)?)?$/;

/**
 * Proxy-owned request header carrying the markdown target to /api/markdown.
 * Route handlers see the original URL after an internal rewrite, so the
 * rewrite's `?path=` never reaches them; a request header does.
 */
const MARKDOWN_PATH_HEADER = "x-markdown-path";

function rewriteToMarkdown(request: NextRequest, targetPath: string): NextResponse {
  const rewriteUrl = new URL("/api/markdown", request.url);
  rewriteUrl.searchParams.set("path", targetPath);
  const headers = new Headers(request.headers);
  headers.set(MARKDOWN_PATH_HEADER, targetPath);
  return NextResponse.rewrite(rewriteUrl, { request: { headers } });
}

/** Continue routing, dropping any client-supplied copy of the proxy-owned header. */
function passThrough(request: NextRequest): NextResponse {
  if (!request.headers.has(MARKDOWN_PATH_HEADER)) {
    return NextResponse.next();
  }
  const headers = new Headers(request.headers);
  headers.delete(MARKDOWN_PATH_HEADER);
  return NextResponse.next({ request: { headers } });
}

function prefersMarkdown(accept: string): boolean {
  const ranges = accept
    .toLowerCase()
    .split(",")
    .map((range) => {
      const [type, ...parameters] = range.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter === undefined ? 1 : Number(qualityParameter.trim().slice(2));
      return {
        type: type?.trim(),
        quality: Number.isFinite(quality) && quality >= 0 && quality <= 1 ? quality : 0,
      };
    });
  const markdown = ranges.find((range) => range.type === "text/markdown");
  if (!markdown || markdown.quality === 0) return false;

  const html = ["text/html", "text/*", "*/*"]
    .map((type) => ranges.find((range) => range.type === type))
    .find((range) => range !== undefined);
  return markdown.quality >= (html?.quality ?? 0);
}

function markdownRewrite(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith(".md")) {
    const targetPath = pathname.slice(0, -3) || "/";
    return MARKDOWN_PATH.test(targetPath) ? rewriteToMarkdown(request, targetPath) : null;
  }

  const accept = request.headers.get("accept") ?? "";
  if (prefersMarkdown(accept) && MARKDOWN_PATH.test(pathname)) {
    return rewriteToMarkdown(request, pathname);
  }

  return null;
}

function contentResponse(request: NextRequest, protectedSite: boolean): NextResponse {
  const response = markdownRewrite(request) ?? passThrough(request);
  if (MARKDOWN_PATH.test(request.nextUrl.pathname)) {
    response.headers.append("Vary", "Accept");
  }
  if (protectedSite) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword === undefined || sitePassword === "") {
    return contentResponse(request, false);
  }

  const expectedUser = process.env.SITE_USERNAME ?? "rakshan";

  const auth = request.headers.get("authorization");
  if (auth === null || !/^Basic /i.test(auth)) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return unauthorized();
  }

  const colon = decoded.indexOf(":");
  const providedUser = colon === -1 ? decoded : decoded.slice(0, colon);
  const providedPassword = colon === -1 ? "" : decoded.slice(colon + 1);

  const [userOk, passwordOk] = await Promise.all([
    timingSafeStringEqual(providedUser, expectedUser),
    timingSafeStringEqual(providedPassword, sitePassword),
  ]);

  if (!userOk || !passwordOk) {
    return unauthorized();
  }

  return contentResponse(request, true);
}

export const config = {
  matcher: ["/((?!_next/|favicon\\.ico).*)"],
};
