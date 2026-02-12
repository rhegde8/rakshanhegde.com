import { defineConfig } from "@playwright/test";

const isCI = process.env.CI === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: isCI ? "pnpm start --port 3000" : "pnpm dev --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
