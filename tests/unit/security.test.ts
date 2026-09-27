// @vitest-environment node
import { randomUUID } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET as getMarkdown } from "@/app/api/markdown/route";
import { GET as getOverview } from "@/app/llms.txt/route";
import { JsonLdScript } from "@/components/JsonLdScript";
import { securityHeaders } from "@/lib/security/headers";
import { proxy } from "@/proxy";

vi.mock("@/lib/content/markdown", () => ({
  siteOverviewMarkdown: async () => "# Overview",
  projectsIndexMarkdown: async () => "# Projects",
  writingIndexMarkdown: async () => "# Writing",
  projectToMarkdown: () => "# Project",
  writingToMarkdown: () => "# Article",
}));

vi.mock("@/lib/content/loaders", () => ({
  getProjectBySlug: async () => null,
  getWritingBySlug: async () => null,
}));

afterEach(() => vi.unstubAllEnvs());

describe("structured data safety", () => {
  it("keeps a closing script tag in content from creating executable HTML", () => {
    const data = { name: '</script><script>alert("injected")</script>' };
    const html = renderToStaticMarkup(JsonLdScript({ data }));
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    const serialized = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("retains framing protection and disallows production eval and analytics connections", () => {
    const csp = securityHeaders.find((header) => header.key === "Content-Security-Policy")!.value;
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain("font-src 'self'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("vercel-insights.com");
    expect(csp).not.toContain("vercel-scripts.com");
  });
});

describe("markdown negotiation", () => {
  beforeEach(() => vi.stubEnv("SITE_PASSWORD", ""));

  it.each([
    ["text/markdown", true],
    ["text/markdown;q=0", false],
    ["text/html, text/markdown;q=0.5", false],
    ["text/html;q=0.4, text/markdown;q=0.8", true],
    ["text/*;q=0.9, text/markdown;q=0.2", false],
    ["text/html;q=0, */*;q=1, text/markdown;q=0.5", true],
    ["text/markdown;q=invalid", false],
    ["application/text/markdown", false],
    ["*/*", false],
  ])("respects the accepted media types in %s", async (accept, rewrite) => {
    const response = await proxy(
      new NextRequest("https://example.test/projects", {
        headers: { accept },
      }),
    );
    expect(response.headers.has("x-middleware-rewrite")).toBe(rewrite);
    expect(response.headers.get("vary")).toContain("Accept");
  });

  it("rewrites explicit markdown URLs without trusting a client-supplied path header", async () => {
    const request = new NextRequest("https://example.test/projects.md", {
      headers: { "x-markdown-path": "/writing" },
    });
    const response = await proxy(request);
    const destination = new URL(response.headers.get("x-middleware-rewrite")!);
    expect(destination.pathname).toBe("/api/markdown");
    expect(destination.searchParams.get("path")).toBe("/projects");
    // The handler sees the original URL after an internal rewrite, so the proxy's header is what it reads.
    expect(response.headers.get("x-middleware-request-x-markdown-path")).toBe("/projects");

    const markdown = await getMarkdown(
      new NextRequest("https://example.test/projects.md", {
        headers: {
          "x-markdown-path": response.headers.get("x-middleware-request-x-markdown-path")!,
        },
      }),
    );
    expect(await markdown.text()).toBe("# Projects");
    expect(markdown.headers.get("vary")).toBe("Accept");
  });

  it("strips a client-supplied path header from requests it does not rewrite", async () => {
    const response = await proxy(
      new NextRequest("https://example.test/api/markdown?path=/projects", {
        headers: { "x-markdown-path": "/writing" },
      }),
    );
    expect(response.headers.has("x-middleware-rewrite")).toBe(false);
    expect(response.headers.get("x-middleware-override-headers")).not.toContain("x-markdown-path");
    expect(response.headers.has("x-middleware-request-x-markdown-path")).toBe(false);
  });

  it("returns 404 for unsupported paths instead of resolving arbitrary files", async () => {
    const response = await getMarkdown(
      new NextRequest("https://example.test/api/markdown?path=/etc/passwd"),
    );
    expect(response.status).toBe(404);
  });
});

describe("password-protected responses", () => {
  let authorization: string;

  beforeEach(() => {
    const user = randomUUID();
    const password = randomUUID();
    vi.stubEnv("SITE_USERNAME", user);
    vi.stubEnv("SITE_PASSWORD", password);
    authorization = `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
  });

  it.each([undefined, "Basic !!!", "Bearer invalid", "Basic d3Jvbmc6d3Jvbmc="])(
    "rejects missing or invalid authentication (%s) without cacheable content",
    async (auth) => {
      const response = await proxy(
        new NextRequest("https://example.test/projects.md", {
          headers: auth ? { authorization: auth } : {},
        }),
      );
      expect(response.status).toBe(401);
      expect(response.headers.get("www-authenticate")).toContain("Basic");
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(response.headers.has("x-middleware-rewrite")).toBe(false);
    },
  );

  it.each(["/", "/projects.md", "/llms.txt"])(
    "marks authenticated %s responses private",
    async (path) => {
      const response = await proxy(
        new NextRequest(`https://example.test${path}`, {
          headers: { authorization },
        }),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    },
  );

  it("prevents route handlers from overriding authentication with public CDN caching", async () => {
    const responses = await Promise.all([
      getMarkdown(new NextRequest("https://example.test/api/markdown?path=/")),
      getOverview(),
    ]);
    for (const response of responses) {
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
  });

  it("allows public caching only when password protection is disabled", async () => {
    vi.stubEnv("SITE_PASSWORD", "");
    const response = await getOverview();
    expect(response.headers.get("cache-control")).toContain("public");
  });
});
