import { expect, test } from "@playwright/test";

const TOKYO = "11111111-1111-4111-8111-111111111111";

test("home page tunes the world @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tune the");
  await expect(page.getByRole("slider", { name: "Tune to a city" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What's the mood?" })).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Most played stations" }).getByRole("listitem"),
  ).toHaveCount(6);
});

test("dial tunes with the keyboard", async ({ page }) => {
  await page.goto("/");
  const dial = page.getByRole("slider", { name: "Tune to a city" });
  await dial.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dial).toHaveAttribute("aria-valuetext", "Dhaka");
  await expect(page.getByRole("button", { name: "Tune in to Dhaka" })).toBeVisible();
});

test("search filters sync with the URL", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Country").selectOption("JP");
  await expect(page).toHaveURL(/country=JP/);
  const results = page.getByRole("list", { name: "Search results" });
  await expect(results.getByRole("listitem")).toHaveCount(2);
  await expect(results).toContainText("Tokyo Jazz Test FM");

  await page.getByLabel("Station name").fill("osaka");
  await page.getByLabel("Station name").press("Enter");
  await expect(page).toHaveURL(/text=osaka/);
  await expect(results.getByRole("listitem")).toHaveCount(1);

  await page.reload();
  await expect(page.getByLabel("Country")).toHaveValue("JP");
  await expect(page.getByLabel("Station name")).toHaveValue("osaka");
});

test("station page shows details and similar stations", async ({ page }) => {
  await page.goto("/tag/jazz");
  await page.getByRole("link", { name: "Tokyo Jazz Test FM" }).click();
  await expect(page).toHaveURL(new RegExp(`/station/${TOKYO}`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tokyo Jazz Test FM");
  await expect(page.getByRole("heading", { name: "Similar stations" })).toBeVisible();
  await expect(page).toHaveTitle(/Tokyo Jazz Test FM \(Japan\)/);
});

test("play and pause toggle the player @mobile", async ({ page }) => {
  await page.goto(`/station/${TOKYO}`);
  await page.getByRole("button", { name: "Play Tokyo Jazz Test FM" }).first().click();
  const status = page.getByTestId("player-status");
  await expect(status).toHaveText("Live", { timeout: 15_000 });
  await expect(page.getByRole("region", { name: "Player" })).toContainText("Tokyo Jazz Test FM");

  await page
    .getByRole("region", { name: "Player" })
    .getByRole("button", { name: /^Pause/ })
    .click();
  await expect(status).toHaveText("Paused");

  await page.getByRole("button", { name: "Close player" }).click();
  await expect(page.getByRole("region", { name: "Player" })).toHaveCount(0);
});

test("favorites persist after reload", async ({ page }) => {
  await page.goto("/country/fr");
  await page.getByRole("button", { name: "Add Paris Test News to favorites" }).click();
  await page.goto("/favorites");
  const list = page.getByRole("list", { name: "Favorite stations" });
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await page.reload();
  await expect(list).toContainText("Paris Test News");
  await page.getByRole("button", { name: "Remove Paris Test News from favorites" }).click();
  await expect(page.getByText("No presets saved yet")).toBeVisible();
});

test("natural language discovery finds stations", async ({ page }) => {
  await page.goto("/discover?q=calm%20jazz%20from%20japan");
  await expect(page.getByText("Calm · Jazz · Japan")).toBeVisible();
  await expect(page.getByRole("list", { name: "Discovered stations" })).toContainText(
    "Tokyo Jazz Test FM",
  );
});

test("unknown pages render the off the dial screen", async ({ page }) => {
  const response = await page.goto("/station/99999999-9999-4999-8999-999999999999");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Off the dial" })).toBeVisible();
});

test("history fits a phone screen with long station names @mobile", async ({ page }) => {
  // A fixed side gutter for the timestamp used to squeeze the card until the
  // page scrolled sideways, so seed the longest name we have seen in the wild.
  await page.goto("/");
  await page.evaluate(() => {
    const station = {
      id: "22222222-2222-4222-8222-222222222222",
      name: "CAPITAL - The UK's No.1 Hit Music Station",
      streamUrl: "https://example.invalid/stream",
      country: "United Kingdom",
      countryCode: "GB",
      languages: ["english"],
      tags: ["capital", "capital fm", "contemporary hits radio"],
      codec: "MP3",
      bitrate: 128,
      isHls: false,
      votes: 0,
      clickCount: 0,
      lastCheckOk: true,
      source: "radio-browser",
    };
    localStorage.setItem(
      "openradio:history",
      JSON.stringify({ state: { entries: [{ station, playedAt: Date.now() }] }, version: 1 }),
    );
  });

  await page.goto("/history");
  // Direct children only: each card nests a tag list of its own.
  await expect(page.getByRole("list", { name: "Recently played" }).locator("> li")).toHaveCount(1);

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
