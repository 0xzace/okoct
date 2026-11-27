import { describe, expect, it } from "vitest";

import {
  ARTICLE_CONTENT_STATES,
  articleSchema,
  contentStateSchema,
  type ArticleFrontmatter,
} from "../../src/schemas/content";
import {
  getPublicContent,
  isPublishableContent,
} from "../../src/utils/publication";

const reviewedArticle = {
  title: "Reviewed educational article",
  description: "An article with explicit review evidence.",
  locale: "en" as const,
  state: "published" as const,
  visibility: "public" as const,
  indexable: true,
  sources: ["https://example.com/reference"],
  author: "Verified author",
  medicalReviewer: "Verified medical reviewer",
  factCheckedAt: "2026-11-20",
  medicallyReviewedAt: "2026-11-21",
  complianceReviewedAt: "2026-11-22",
  translationReviewedAt: "2026-11-23",
  publishedAt: "2026-11-24",
};

describe("content lifecycle schema", () => {
  it("accepts every required lifecycle state", () => {
    for (const state of ARTICLE_CONTENT_STATES) {
      expect(contentStateSchema.safeParse(state).success).toBe(true);
    }
  });

  it("keeps the V0.1 draft fixture out of publication", () => {
    const draft = {
      title: "Test-only content",
      description: "This fixture must never be public.",
      locale: "th" as const,
      state: "draft" as const,
      visibility: "test-only" as const,
      indexable: false,
      sources: [],
    };

    expect(articleSchema.safeParse(draft).success).toBe(true);
    expect(isPublishableContent(draft)).toBe(false);
  });

  it("rejects a published entry without source and review evidence", () => {
    const incomplete = {
      ...reviewedArticle,
      sources: [],
      medicallyReviewedAt: undefined,
    };

    expect(articleSchema.safeParse(incomplete).success).toBe(false);
    expect(isPublishableContent(incomplete)).toBe(false);
  });

  it("accepts only a fully reviewed public entry for publication", () => {
    const parsed = articleSchema.parse(reviewedArticle) as ArticleFrontmatter;

    expect(isPublishableContent(parsed)).toBe(true);
    expect(getPublicContent([parsed])).toEqual([parsed]);
  });
});
