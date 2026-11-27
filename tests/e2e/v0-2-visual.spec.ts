import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("homepage fits every required viewport without horizontal overflow", async ({
  page,
}) => {
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.getByRole("main")).toBeVisible();
  }
});

test("dark theme and reduced motion preserve readable content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/zh/");

  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(
    page.getByRole("heading", { name: /在完整语境中理解健康信息/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("keyboard navigation starts with the localized skip link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/th/");

  await page.keyboard.press("Tab");
  await expect(page.locator("a[href='#main-content']")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("captures desktop, mobile, Thai, Chinese and dark theme artifacts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/");
  await page.screenshot({
    path: "output/playwright/v0-2-home-en-desktop-light.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/th/");
  await page.screenshot({
    path: "output/playwright/v0-2-home-th-mobile-light.png",
    fullPage: true,
  });

  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/zh/");
  await page.screenshot({
    path: "output/playwright/v0-2-home-zh-mobile-dark.png",
    fullPage: true,
  });
});
