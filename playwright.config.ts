import { defineConfig, devices } from "@playwright/test";

const MOCK_PORT = 4177;
const APP_PORT = 3177;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "retain-on-failure",
    launchOptions: {
      // Use a locally installed Chrome when provided, otherwise Playwright's Chromium.
      executablePath: process.env.CHROME_PATH || undefined,
      args: ["--autoplay-policy=no-user-gesture-required"],
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  webServer: [
    {
      command: `node e2e/mock-radio-browser.mjs`,
      url: `http://127.0.0.1:${MOCK_PORT}/json/countries`,
      env: { MOCK_PORT: String(MOCK_PORT) },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run build && npx next start -p ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}/about`,
      timeout: 300_000,
      env: {
        RADIO_BROWSER_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
        NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${APP_PORT}`,
      },
      reuseExistingServer: !process.env.CI,
    },
  ],
});
