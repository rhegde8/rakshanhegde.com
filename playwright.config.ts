import { randomUUID } from "node:crypto";

import { defineConfig } from "@playwright/test";

const isCI = process.env.CI === "true";
const useProductionBuild = isCI || process.env.PLAYWRIGHT_USE_BUILD === "true";
// Workers reload this config; inherit the run's token instead of generating a second one.
const testPassword = (process.env.PLAYWRIGHT_AUTH_TOKEN ??= randomUUID());
const testOrigin = "http://localhost:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: testOrigin,
    httpCredentials: { username: "playwright", password: testPassword, origin: testOrigin },
    // Traces capture request headers, including the test server's Authorization header.
    trace: "off",
  },
  webServer: {
    command: useProductionBuild ? "pnpm start --port 3100" : "pnpm dev --port 3100",
    url: testOrigin,
    env: { SITE_USERNAME: "playwright", SITE_PASSWORD: testPassword },
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
