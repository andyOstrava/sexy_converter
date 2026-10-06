const { test, expect } = require("@playwright/test");

test("settings page exposes the three theme choices and shared navigation", async ({ page }) => {
  await page.goto("/settings.html");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByLabel("Colour theme")).toHaveValue("light");
  await expect(page.getByRole("link", { name: "SEx:y converter" })).toHaveAttribute("href", "index.html");
  await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByLabel("Colour theme").locator("option")).toHaveText([
    "Light",
    "Dark",
    "Crazy"
  ]);
});

test("navbar navigates between converter and settings", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "settings.html");
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/settings\.html$/);
  await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "SEx:y converter" }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("heading", { name: "Convert a charge" })).toBeVisible();
});

test("theme selection updates the palette and persists between pages", async ({ page }) => {
  await page.goto("/settings.html");
  await page.getByLabel("Colour theme").selectOption("dark");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#30102d");
  await expect(page.locator(".settings-card")).toHaveCSS("background-color", "rgba(42, 20, 39, 0.94)");

  await page.goto("/index.html");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#30102d");
});

test("crazy theme uses magenta as its page background", async ({ page }) => {
  await page.goto("/settings.html");
  await page.getByLabel("Colour theme").selectOption("crazy");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "crazy");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 0, 255)");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#30002d");
});

test("converter calculations and clearing continue to work", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Club receives").fill("100");
  await expect(page.getByLabel("SE charge")).toHaveValue("103.25");

  await page.getByLabel("SE charge").fill("100");
  await expect(page.getByLabel("Club receives")).toHaveValue("96.85");

  await page.getByLabel("SE charge").fill("");
  await expect(page.getByLabel("Club receives")).toHaveValue("");
});

test("service worker caches both pages for offline navigation", async ({ page, context }) => {
  await page.goto("/settings.html");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        throw new Error("Service worker was not registered.");
      }
    });
  });
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);

  const appShell = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const cacheName = cacheNames.find((name) => name.startsWith("sexy-converter-"));
    if (!cacheName) {
      throw new Error("App-shell cache was not created.");
    }
    const cache = await caches.open(cacheName);
    const cachedSettings = await cache.match(new URL("settings.html", location.href).href);
    const cachedHome = await cache.match(new URL("index.html", location.href).href);
    return { cachedSettings: Boolean(cachedSettings), cachedHome: Boolean(cachedHome) };
  });

  expect(appShell).toEqual({ cachedSettings: true, cachedHome: true });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await context.setOffline(true);
  await page.getByRole("link", { name: "SEx:y converter" }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("heading", { name: "Convert a charge" })).toBeVisible();
});
