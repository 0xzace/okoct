import { expect, test } from "@playwright/test";

test("root language entry exposes only real localized routes", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /OKOCT Health/i }),
  ).toBeVisible();
  const languageEntry = page.getByRole("navigation", {
    name: "Choose a language",
  });

  await expect(
    languageEntry.getByRole("link", { name: /ไทย/ }),
  ).toHaveAttribute("href", "/th/");
  await expect(
    languageEntry.getByRole("link", { name: /English/ }),
  ).toHaveAttribute("href", "/en/");
  await expect(
    languageEntry.getByRole("link", { name: /简体中文/ }),
  ).toHaveAttribute("href", "/zh/");
});

test("localized home pages expose language-aware metadata and navigation", async ({
  page,
}) => {
  for (const route of [
    { path: "/th/", language: "th", canonical: "https://okoct.com/th/" },
    { path: "/en/", language: "en", canonical: "https://okoct.com/en/" },
    { path: "/zh/", language: "zh-Hans", canonical: "https://okoct.com/zh/" },
  ]) {
    await page.goto(route.path);

    await expect(page.locator("html")).toHaveAttribute("lang", route.language);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      route.canonical,
    );
    await expect(page.locator("header nav").first()).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  }
});

test("theme control remains keyboard accessible", async ({ page }) => {
  await page.goto("/en/");

  const themeControl = page.locator("[data-theme-control]");

  await themeControl.focus();
  await expect(themeControl).toBeFocused();
  await expect(themeControl).toHaveAttribute("aria-label", /Theme/i);
});

test("brand navigation exposes a localized skip link and search entry", async ({
  page,
}) => {
  await page.goto("/zh/");

  await expect(
    page.getByRole("banner").getByRole("link", { name: "OKOCT Health" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "跳转到正文" })).toHaveAttribute(
    "href",
    "#main-content",
  );
  await expect(
    page.getByRole("banner").getByRole("link", { name: "搜索" }),
  ).toHaveAttribute("href", "/zh/search/");
});

test("theme preference persists and focus styling remains visible", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.locator("[data-theme-control]").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const aboutLink = page
    .getByRole("banner")
    .getByRole("link", { name: "About" });
  await aboutLink.focus();
  await expect(aboutLink).toBeFocused();
  await expect
    .poll(() =>
      aboutLink.evaluate((element) => getComputedStyle(element).boxShadow),
    )
    .not.toBe("none");
});

test("safety page states non-clinical boundaries", async ({ page }) => {
  await page.goto("/en/safety/");

  await expect(
    page.getByRole("heading", { name: /Safety and compliance boundaries/i }),
  ).toBeVisible();
  await expect(page.getByText(/does not diagnose conditions/i)).toBeVisible();
  await expect(page.getByText(/does not .*sell medicines/i)).toBeVisible();
});
