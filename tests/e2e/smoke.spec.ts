import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("AI Signals")).toBeVisible();
});

test("projects search and filter works", async ({ page }) => {
  await page.goto("/projects");

  const searchInput = page.getByRole("searchbox", { name: "Search" });
  await searchInput.fill("orchestrator");
  await expect(page.getByRole("heading", { name: "RAG Knowledge Orchestrator" })).toBeVisible();

  await page.getByLabel("Status").selectOption("completed");
  await expect(page.getByText(/showing/i)).toContainText("Showing");
});

test("research page renders entries", async ({ page }) => {
  await page.goto("/research");
  await expect(page.getByRole("heading", { name: "Research" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Agent Memory Strategies Under Latency Constraints" }),
  ).toBeVisible();
});

test("demos page renders video cards", async ({ page }) => {
  await page.goto("/demos");
  await expect(page.getByRole("heading", { name: "Demos" })).toBeVisible();
  await expect(page.locator("iframe, video").first()).toBeVisible();
});
