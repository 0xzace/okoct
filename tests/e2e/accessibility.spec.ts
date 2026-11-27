import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("localized homepages have no automated axe violations", async ({
  page,
}) => {
  for (const path of ["/th/", "/en/", "/zh/"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations, `${path} has axe violations`).toEqual([]);
  }
});

test("search page has no automated axe violations", async ({ page }) => {
  await page.goto("/en/search/");
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations, "/en/search/ has axe violations").toEqual([]);
});

test("opened mobile menu has no automated axe violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  await page.locator("[data-site-menu] summary").click();

  const results = await new AxeBuilder({ page })
    .include("[data-site-menu]")
    .analyze();

  expect(results.violations, "opened mobile menu has axe violations").toEqual(
    [],
  );
});
