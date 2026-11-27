import { describe, expect, it } from "vitest";

import {
  getArticle,
  getArticleTranslations,
  getIndexableArticles,
  getLatestArticles,
  getPublishedArticles,
  getRelatedArticles,
  type ArticleRepositoryContext,
} from "../../../src/content-engine/repository/articles";
import type { ArticleEntity } from "../../../src/content-engine/schemas/entities";

function article(overrides: Partial<ArticleEntity> = {}): ArticleEntity {
  return {
    id: "ART-000001-EN",
    translationKey: "ART-000001",
    locale: "en",
    slug: "weight-loss-injections",
    type: "pillar",
    title: "Weight Loss Injections",
    description: "Educational information.",
    summary: "Educational information.",
    topicId: "TOP-001",
    clusterId: "CLUSTER-001",
    contentBriefId: "BRIEF-000001",
    state: "published",
    visibility: "public",
    indexable: true,
    revision: 1,
    contentHash: "hash-1",
    authorIds: ["AUTH-001"],
    reviewerIds: ["REV-001"],
    referenceIds: ["REF-001"],
    reviewRecordIds: ["REVREC-001"],
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
    ...overrides,
  };
}

describe("article repository", () => {
  const entries = [
    article(),
    article({
      id: "ART-000002-TH",
      translationKey: "ART-000001",
      locale: "th",
      slug: "pak-ka-lot-nam-nak",
    }),
    article({
      id: "ART-000003-EN",
      translationKey: "ART-000003",
      slug: "draft-article",
      state: "draft",
      visibility: "test-only",
      indexable: false,
    }),
  ];
  const context: ArticleRepositoryContext = { articles: entries };

  it("hides drafts from production queries", () => {
    expect(getArticle("ART-000003-EN", context)).toBeUndefined();
    expect(getPublishedArticles(context).map((entry) => entry.id)).toEqual([
      "ART-000001-EN",
      "ART-000002-TH",
    ]);
  });

  it("filters indexable articles by locale and sorts latest first", () => {
    expect(
      getIndexableArticles(context, "th").map((entry) => entry.locale),
    ).toEqual(["th"]);
    expect(getLatestArticles(context, "en").map((entry) => entry.id)).toEqual([
      "ART-000001-EN",
    ]);
  });

  it("returns only published translations", () => {
    expect(
      getArticleTranslations("ART-000001", context).map(
        (entry) => entry.locale,
      ),
    ).toEqual(["en", "th"]);
  });

  it("does not return unpublished related targets", () => {
    const source = article({ relatedArticleIds: ["ART-000003-EN"] });
    expect(getRelatedArticles(source, context)).toEqual([]);
  });
});
