import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "pnpm build && pnpm exec astro preview --host 127.0.0.1 --port 4322 && trap 'pnpm exec astro preview stop >/dev/null 2>&1 || true' EXIT && tail -f /dev/null",
    url: "http://127.0.0.1:4322/th/",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
