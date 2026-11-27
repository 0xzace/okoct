import { describe, expect, it } from "vitest";

import { buildSeoMetadata } from "../../src/seo/metadata";
import { getHreflangLinks, toAbsoluteUrl } from "../../src/seo/urls";
import { buildWebPageJsonLd } from "../../src/seo/structured-data";

describe("SEO metadata", () => {
  it("normalizes relative paths into absolute trailing-slash URLs", () => {
    expect(toAbsoluteUrl("/th/about")).toBe("https://okoct.com/th/about/");
    expect(toAbsoluteUrl("https://okoct.com/en/")).toBe(
      "https://okoct.com/en/",
    );
  });

  it("rejects URLs outside the configured site origin", () => {
    expect(() => toAbsoluteUrl("https://example.com/unsafe")).toThrow(
      /configured site origin/,
    );
  });

  it("creates a self-referencing canonical and reciprocal alternates", () => {
    const metadata = buildSeoMetadata({
      route: "about",
      locale: "en",
      title: "About OKOCT Health",
      description:
        "Learn about the scope and editorial boundaries of OKOCT Health.",
    });

    expect(metadata.canonical).toBe("https://okoct.com/en/about/");
    expect(metadata.robots).toBe("index,follow");
    expect(metadata.alternates).toEqual([
      { hreflang: "th", href: "https://okoct.com/th/about/" },
      { hreflang: "en", href: "https://okoct.com/en/about/" },
      { hreflang: "zh-Hans", href: "https://okoct.com/zh/about/" },
      { hreflang: "x-default", href: "https://okoct.com/" },
    ]);
    expect(getHreflangLinks("safety")).toEqual([
      { hreflang: "th", href: "https://okoct.com/th/safety/" },
      { hreflang: "en", href: "https://okoct.com/en/safety/" },
    ]);
  });

  it("supports noindex pages without changing page content metadata", () => {
    const metadata = buildSeoMetadata({
      route: "home",
      locale: "th",
      title: "Test page",
      description: "A test page.",
      indexable: false,
    });

    expect(metadata.robots).toBe("noindex,nofollow");
    expect(metadata.title).toBe("Test page");
  });

  it("supports a root language-entry canonical separate from localized pages", () => {
    const metadata = buildSeoMetadata({
      route: "home",
      locale: "en",
      title: "OKOCT Health",
      description: "Choose a language.",
      canonicalPath: "/",
    });

    expect(metadata.canonical).toBe("https://okoct.com/");
  });

  it("builds truthful WebPage JSON-LD without medical claims", () => {
    const jsonLd = buildWebPageJsonLd({
      title: "About OKOCT Health",
      description: "An independent health knowledge website.",
      url: "https://okoct.com/en/about/",
      locale: "en",
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "About OKOCT Health",
      inLanguage: "en",
      url: "https://okoct.com/en/about/",
    });
    expect(JSON.stringify(jsonLd)).not.toMatch(
      /doctor|hospital|guarantee|cure/i,
    );
  });
});
