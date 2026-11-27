import { describe, expect, it } from "vitest";

import type { ArticleFrontmatter } from "../../src/schemas/content";
import { getPublishedArticlesForLocale } from "../../src/utils/home-content";

const reviewedArticle: ArticleFrontmatter = {
  title: "Reviewed educational article",
  description: "An article with explicit review evidence.",
  locale: "en",
  state: "published",
  visibility: "public",
  indexable: true,
  sources: ["https://example.com/reference"],
  author: "Verified author",
  medicalReviewer: "Verified medical reviewer",
  factCheckedAt: new Date("2026-11-20"),
  medicallyReviewedAt: new Date("2026-11-21"),
  complianceReviewedAt: new Date("2026-11-22"),
  translationReviewedAt: new Date("2026-11-23"),
  publishedAt: new Date("2026-11-24"),
  updatedAt: undefined,
};

describe("homepage publication filtering", () => {
  it("returns only fully publishable entries for the requested locale", () => {
    const thaiArticle: ArticleFrontmatter = {
      ...reviewedArticle,
      title: "บทความสุขภาพที่ผ่านการตรวจสอบ",
      locale: "th",
    };

    expect(
      getPublishedArticlesForLocale([reviewedArticle, thaiArticle], "en"),
    ).toEqual([reviewedArticle]);
  });

  it("excludes draft and test-only entries even when their locale matches", () => {
    const draftArticle: ArticleFrontmatter = {
      ...reviewedArticle,
      title: "Test-only draft",
      state: "draft",
      visibility: "test-only",
      indexable: false,
      sources: [],
      author: undefined,
      medicalReviewer: undefined,
      factCheckedAt: undefined,
      medicallyReviewedAt: undefined,
      complianceReviewedAt: undefined,
      translationReviewedAt: undefined,
      publishedAt: undefined,
      updatedAt: undefined,
    };

    expect(getPublishedArticlesForLocale([draftArticle], "en")).toEqual([]);
  });
});
