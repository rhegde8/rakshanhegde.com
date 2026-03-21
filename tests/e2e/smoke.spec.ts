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
