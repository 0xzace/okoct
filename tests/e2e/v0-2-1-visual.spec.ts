import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("homepage keeps the new weight-management hierarchy at every required width", async ({
  page,
}) => {
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");

    await expect(
      page.getByRole("heading", {
        name: "Understand the science of weight management",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});

test("dark theme and reduced motion keep the abstract hero readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/en/");

  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(page.locator(".hero-horizon")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator("astro-dev-toolbar")).toHaveCount(0);
});
