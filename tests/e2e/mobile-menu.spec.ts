import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/");
  });

  test("opens the localized mobile menu and exposes only real routes", async ({
    page,
  }) => {
    const menu = page.locator("[data-site-menu]");
    const trigger = menu.locator("summary");

    await expect(menu).not.toHaveAttribute("open", "");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    await expect(menu).toHaveAttribute("open", "");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      menu.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
    await expect(menu.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/en/",
    );
    await expect(menu.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/en/about/",
    );
    await expect(
      menu.getByRole("link", { name: "Safety boundaries" }),
    ).toHaveAttribute("href", "/en/safety/");
    await expect(menu.getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      "/en/search/",
    );
    await expect(
      menu.getByRole("navigation", { name: "Language" }),
    ).toBeVisible();
    await expect(menu.locator("[data-theme-control]")).toBeVisible();
    await expect(page.getByRole("link", { name: "GLP-1" })).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
  });

  test("Escape closes the mobile menu and restores focus", async ({ page }) => {
    const menu = page.locator("[data-site-menu]");
    const trigger = menu.locator("summary");

    await trigger.click();
    await expect(menu).toHaveAttribute("open", "");

    await page.keyboard.press("Escape");

    await expect(menu).not.toHaveAttribute("open", "");
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("keeps desktop and mobile theme controls synchronized", async ({
    page,
  }) => {
    const menu = page.locator("[data-site-menu]");

    await menu.locator("summary").click();
    await menu.locator("[data-theme-control]").selectOption("dark");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("#theme-select-desktop")).toHaveValue("dark");
  });
});
