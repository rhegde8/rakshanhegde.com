import { expect, test } from "@playwright/test";

const projects = [
  { slug: "sealcheck", title: "SealCheck" },
  { slug: "vultrack", title: "VulTrack" },
  { slug: "threatnet", title: "ThreatNet" },
  { slug: "multi-agent-development-harness", title: /multi.agent development harness/i },
] as const;

test("home presents the builder and project navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("systems break.");
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

test("about reflects the latest resume and real contact links", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("main")).toContainText("Sumitomo Mitsui Trust Bank");
  await expect(page.getByRole("main")).toContainText("11:11 Systems");
  await expect(page.getByRole("main")).toContainText("350+ employees");
  await expect(page.getByRole("main")).toContainText("approved bank-wide rollout");
  await expect(page.getByRole("main")).not.toContainText("434 employees");
  await expect(page.getByRole("main")).not.toContainText("400 employees");
  for (const [label, href] of [
    ["Email", "mailto:rakshan.hegde7@gmail.com"],
    ["GitHub", "https://github.com/rhegde8"],
    ["LinkedIn", "https://www.linkedin.com/in/rakshan-hegde"],
  ] as const) {
    await expect(page.getByRole("main").getByRole("link", { name: label }).first()).toHaveAttribute(
      "href",
      href,
    );
  }
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

for (const width of [320, 390, 1440, 2560]) {
  test(`pages fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/projects",
      ...projects.map(({ slug }) => `/projects/${slug}`),
      "/writing",
      "/about",
    ]) {
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

test("systems explorer switches projects and explains selected components", async ({ page }) => {
  await page.goto("/");
  const explorer = page.getByRole("region", { name: "Explore my systems" });
  const choices = explorer.getByRole("group", { name: "Choose a project" });
  await expect(choices.getByRole("button", { name: "SealCheck", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  for (const [label, slug, title] of [
    ["SealCheck", "sealcheck", "SealCheck"],
    ["Agent harness", "multi-agent-development-harness", "Multi-Agent Development Harness"],
    ["VulTrack", "vultrack", "VulTrack"],
    ["ThreatNet", "threatnet", "ThreatNet"],
  ] as const) {
    await choices.getByRole("button", { name: label, exact: true }).click();
    await expect(explorer.getByRole("heading", { level: 2 })).toHaveText(title);
    await expect(explorer.getByRole("link", { name: "Explore project" })).toHaveAttribute(
      "href",
      `/projects/${slug}`,
    );
    const components = explorer.locator(".diagram-node");
    for (const component of await components.all()) {
      await component.focus();
      await page.keyboard.press("Enter");
      await expect(component).toHaveAttribute("aria-pressed", "true");
      const label = await component.locator("strong").innerText();
      await expect(explorer.locator(".inspector-label")).toHaveText(label);
    }
  }
});

test("mobile taps reveal SealCheck components without overlapping controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/sealcheck");
  const nodes = page.locator(".diagram-node");
  const boxes = await nodes.evaluateAll((items) =>
    items.map((item) => {
      const { top, bottom, width, height } = item.getBoundingClientRect();
      return { top, bottom, width, height };
    }),
  );
  expect(boxes).toHaveLength(3);
  for (const [index, box] of boxes.entries()) {
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    const previous = boxes[index - 1];
    if (previous) expect(box.top).toBeGreaterThan(previous.bottom);
  }
  await nodes.last().click();
  await expect(page.locator(".system-inspector")).toContainText("before the model enters");
  await expect(page.getByRole("main")).not.toContainText("Built with");
});

test("reduced motion removes transitions while retaining interaction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page
    .getByRole("group", { name: "Choose a project" })
    .getByRole("button", { name: "ThreatNet" });
  await button.click();
  await expect(page.locator(".explorer-heading")).toContainText("ThreatNet");
  expect(await button.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe(
    "0s",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("project summaries, links, and diagram explanations remain readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("experiment with AI");
    await expect(page.getByRole("group", { name: "Choose a project" })).not.toBeVisible();
    for (const project of projects) {
      await expect(
        page.locator(`#selected-work a[href="/projects/${project.slug}"]`),
      ).toBeVisible();
    }
    await page.goto("/projects/sealcheck");
    await expect(page.locator(".system-fallback")).toBeVisible();
    await expect(page.locator(".system-fallback")).toContainText(/preflight assessment/i);
    await expect(
      page.getByRole("heading", { name: "Before the model enters", exact: true }),
    ).toBeVisible();
  });
});
