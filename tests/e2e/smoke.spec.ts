import { expect, test } from "@playwright/test";

const projects = [
  { slug: "vultrack", title: "VulTrack" },
  { slug: "threatnet", title: "ThreatNet" },
  { slug: "multi-agent-development-harness", title: /multi.agent development harness/i },
] as const;

test("front page presents the engineer and three editorial navigation links", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Finding their breaking points.",
  );
  const navigation = page.getByRole("navigation").first();
  await expect(navigation.getByRole("link")).toHaveText(["Projects", "Writing", "About"]);
  await expect(page.getByRole("link", { name: /^Rakshan Hegde/ }).first()).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("main")).not.toContainText("RAG Knowledge Orchestrator");
  await expect(page.getByRole("textbox", { name: /terminal|attack input/i })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("projects open real detail pages with readable bodies", async ({ page }) => {
  for (const project of projects) {
    await page.goto("/projects");
    const link = page.getByRole("main").locator(`a[href="/projects/${project.slug}"]`).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
    await expect(page.getByRole("main").locator("h2").first()).toBeVisible();
  }
});

test("writing honestly starts empty and the legacy index redirects", async ({ page }) => {
  await page.goto("/research");
  await expect(page).toHaveURL(/\/writing$/);
  await expect(page.getByText("The next page is still unwritten.", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("main").locator('a[href^="/writing/"]:not([href$="rss.xml"])'),
  ).toHaveCount(0);
});

test("about retains real experience and keeps contact links as placeholders", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("main")).toContainText("Sumitomo Mitsui Trust Bank");
  await expect(page.getByRole("main")).toContainText("11:11 Systems");
  for (const label of ["Email", "GitHub", "LinkedIn"]) {
    const placeholder = page.locator('[aria-disabled="true"]').filter({ hasText: label }).first();
    await expect(placeholder).toBeVisible();
    await expect(placeholder).not.toHaveAttribute("href");
  }
  await expect(
    page.locator('a[href^="mailto:"], a[href*="github.com"], a[href*="linkedin.com"]'),
  ).toHaveCount(0);
});

test("keyboard users can skip the masthead and navigate to projects", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.getByRole("main")).toBeFocused();

  await page.goto("/");
  const projectsLink = page.getByRole("navigation").first().getByRole("link", { name: "Projects" });
  for (let step = 0; step < 8; step += 1) {
    await page.keyboard.press("Tab");
    if (await projectsLink.evaluate((link) => link === document.activeElement)) break;
  }
  await expect(projectsLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);
});

for (const width of [320, 390, 1440]) {
  test(`pages fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/projects", "/projects/vultrack", "/writing", "/about"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(dimensions.document, `${path} should not overflow at ${width}px`).toBeLessThanOrEqual(
        dimensions.viewport,
      );
    }
  });
}

test("removed features and missing content return 404", async ({ request }) => {
  for (const path of [
    "/lab",
    "/lab/breach",
    "/lab/descent",
    "/privacy",
    "/terms",
    "/projects/does-not-exist",
    "/writing/does-not-exist",
    "/projects/rag-knowledge-orchestrator",
    "/projects/does-not-exist.md",
    "/writing/does-not-exist.md",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});

test("authentication protects HTML and machine-readable content", async ({ baseURL, request }) => {
  if (!baseURL) throw new Error("The test server baseURL is required.");
  for (const path of ["/", "/projects/vultrack.md", "/llms.txt", "/writing/rss.xml"]) {
    // Playwright request contexts inherit the config's httpCredentials; plain fetch sends none.
    const response = await fetch(new URL(path, baseURL), { redirect: "manual" });
    expect(response.status, path).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
    expect(response.headers.get("cache-control")).toContain("no-store");
    const authenticated = await request.get(path);
    expect(authenticated.ok(), path).toBe(true);
    expect(authenticated.headers()["cache-control"], path).toContain("private");
    expect(authenticated.headers()["cache-control"], path).toContain("no-store");
  }
});

test("markdown, RSS, and sitemap describe the same published work", async ({ request }) => {
  const overview = await request.get("/llms.txt");
  expect(overview.ok()).toBe(true);
  const overviewBody = await overview.text();

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).not.toContain("/lab");

  for (const project of projects) {
    const markdown = await request.get(`/projects/${project.slug}.md`);
    const negotiated = await request.get(`/projects/${project.slug}`, {
      headers: { Accept: "text/markdown" },
    });
    expect(markdown.ok()).toBe(true);
    expect(markdown.headers()["content-type"]).toContain("text/markdown");
    expect(negotiated.headers()["vary"]).toMatch(/\bAccept\b/i);
    const markdownBody = await markdown.text();
    expect(markdownBody.split("\n")[0]).toMatch(
      typeof project.title === "string" ? `# ${project.title}` : project.title,
    );
    expect(markdownBody).toEqual(await negotiated.text());
    expect(overviewBody).toContain(`/projects/${project.slug}.md`);
    expect(sitemapBody).toContain(`/projects/${project.slug}</loc>`);
  }

  const feed = await request.get("/writing/rss.xml");
  expect(feed.ok()).toBe(true);
  expect(feed.headers()["content-type"]).toContain("application/rss+xml");
  expect(await feed.text()).not.toContain("<item>");
});
