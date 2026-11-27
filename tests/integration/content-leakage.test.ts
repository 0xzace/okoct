import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { getContentHreflangLinks } from "../../src/seo/content";
import { getSitemapUrls } from "../../src/seo/sitemap";

describe("public content leakage protection", () => {
  it("does not create sitemap or hreflang entries without published translations", () => {
    const context = {
      authors: [],
      reviewers: [],
      references: [],
      reviews: [],
      approvals: [],
    };
    expect(getContentHreflangLinks("ART-000001", [], context)).toEqual([]);
    expect(
      getSitemapUrls({ articles: [], context }).some((url) =>
        url.includes("/articles/"),
      ),
    ).toBe(false);
  });

  it("keeps private editorial markers out of the generated public artifact", () => {
    const dist = resolve(process.cwd(), "dist");
    if (!existsSync(dist)) return;
    const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
    expect(sitemap).not.toMatch(/editorial|REVREC|APPROVAL|BRIEF-000001/i);
  });
});
