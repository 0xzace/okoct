import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { getContentHreflangLinks } from "../../src/seo/content";
import { getSitemapUrls } from "../../src/seo/sitemap";
import type { ArticleEntity } from "../../src/content-engine/schemas/entities";

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

  it("does not create hreflang for a published record without review evidence", () => {
    const article = {
      id: "ART-000001-EN",
      translationKey: "ART-000001",
      locale: "en",
      slug: "unreviewed",
      type: "pillar",
      title: "Unreviewed",
      description: "Unreviewed",
      summary: "Unreviewed",
      topicId: "TOP-001",
      clusterId: "CLUSTER-001",
      contentBriefId: "BRIEF-000001",
      state: "published",
      visibility: "public",
      indexable: true,
      revision: 1,
      contentHash: "hash",
      authorIds: ["AUTH-001"],
      reviewerIds: ["REV-001"],
      referenceIds: ["REF-001"],
      reviewRecordIds: [],
      publicationApprovalId: "APPROVAL-001",
      relatedArticleIds: [],
      seo: {
        index: true,
        follow: true,
        canonical: "self",
        schemaType: "MedicalWebPage",
      },
      publishedAt: new Date("2026-11-20"),
      updatedAt: new Date("2026-11-20"),
    } as ArticleEntity;
    const context = {
      authors: [],
      reviewers: [],
      references: [],
      reviews: [],
      approvals: [],
    };
    expect(getContentHreflangLinks("ART-000001", [article], context)).toEqual(
      [],
    );
  });

  it("keeps private editorial markers out of the generated public artifact", () => {
    const dist = resolve(process.cwd(), "dist");
    if (!existsSync(dist)) return;
    const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
    expect(sitemap).not.toMatch(/editorial|REVREC|APPROVAL|BRIEF-000001/i);
  });
});
