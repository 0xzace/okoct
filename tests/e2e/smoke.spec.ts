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

  const themeControl = page.locator("#theme-select-desktop");

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
  await page.locator("#theme-select-desktop").selectOption("dark");
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

test("homepage exposes the editorial sections and truthful empty states", async ({
  page,
}) => {
  await page.goto("/en/");

  await expect(
    page.getByRole("heading", {
      name: "Understand the science of weight management",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("search", { name: "Search knowledge" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Start with the question you want to understand",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Reviewed content is being prepared" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "GLP-1 and weight management" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Sources should be traceable" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "General knowledge is not personal care",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Careful reading starts at the source" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("V0.1 test content");
});

test("Thai and Chinese homepages keep localized content within the viewport", async ({
  page,
}) => {
  for (const path of ["/th/", "/zh/"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await expect(page.getByRole("main")).toBeVisible();
  }
});

test("search page is explicit about its indexability and content state", async ({
  page,
}) => {
  await page.goto("/en/search/");

  await expect(
    page.getByRole("heading", { name: "Search knowledge" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  await expect(
    page.getByRole("heading", {
      name: /No approved health articles are published yet/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("search", { name: "Search OKOCT Health" }),
  ).toBeVisible();
});

test("search terms stay out of the URL", async ({ page }) => {
  await page.goto("/en/search/");
  const search = page.getByRole("search", { name: "Search OKOCT Health" });

  await search.getByRole("searchbox").fill("health information");
  await search.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\/en\/search\/$/);
});

test("secondary pages keep a shared horizontal gutter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ["/en/about/", "/en/safety/"]) {
    await page.goto(path);
    const paddingLeft = await page
      .locator("main")
      .evaluate((element) => getComputedStyle(element).paddingLeft);

    expect(paddingLeft).toBe("20px");
  }
});
