import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("projects search and filter works", async ({ page }) => {
  await page.goto("/projects");

  const searchInput = page.getByRole("searchbox", { name: "search" });
  await searchInput.fill("orchestrator");
  await expect(page.getByRole("heading", { name: "RAG Knowledge Orchestrator" })).toBeVisible();
});

test("research page renders entries", async ({ page }) => {
  await page.goto("/research");
  await expect(
    page.getByRole("heading", { name: "Agent Memory Strategies Under Latency Constraints" }),
  ).toBeVisible();
});

test("interactive terminal runs commands and navigates", async ({ page }) => {
  await page.goto("/");

  const input = page.getByRole("textbox", { name: "Terminal command input" });
  await input.click();
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText("available commands:")).toBeVisible();

  await input.fill("open about");
  await input.press("Enter");
  await page.waitForURL("**/about");
});

test("command palette opens with ctrl+k and navigates", async ({ page }) => {
  await page.goto("/");

  // The terminal input renders only after hydration; waiting for it guarantees
  // the palette's global key listener is attached before we press the shortcut.
  await expect(page.getByRole("textbox", { name: "Terminal command input" })).toBeVisible({
    timeout: 10_000,
  });
  await page.keyboard.press("ControlOrMeta+k");
  const paletteInput = page.getByRole("textbox", { name: "Search pages and content" });
  await expect(paletteInput).toBeVisible();

  await paletteInput.fill("research");
  await paletteInput.press("Enter");
  await page.waitForURL("**/research");
});

test("llms.txt serves a markdown site overview", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  expect(await response.text()).toContain("## Projects");
});

test("md suffix returns markdown for content pages", async ({ request }) => {
  const response = await request.get("/projects.md");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  expect(await response.text()).toContain("# Projects");
});
