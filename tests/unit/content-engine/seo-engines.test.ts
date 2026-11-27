import { describe, expect, it } from "vitest";

import { validateBrief } from "../../../src/content-engine/briefs";
import {
  detectKeywordConflicts,
  mapKeyword,
} from "../../../src/content-engine/keywords";
import { resolveInternalLinks } from "../../../src/content-engine/linking";
import { runContentAudit } from "../../../src/content-engine/audit";
import { getPublishedTranslationGroup } from "../../../src/content-engine/translations";
import { getTopicCoverage } from "../../../src/content-engine/topics";
import {
  INITIAL_BRIEFS,
  INITIAL_KEYWORDS,
  INITIAL_TOPICS,
} from "../../../src/content-engine/data/planning";
import type {
  ArticleEntity,
  Keyword,
} from "../../../src/content-engine/schemas/entities";

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

describe("SEO content engines", () => {
  it("reports topic coverage without creating an empty page", () => {
    expect(
      getTopicCoverage("TOP-001", {
        topics: INITIAL_TOPICS,
        articles: [article()],
      }),
    ).toMatchObject({ publishedCount: 1, indexable: true });
    expect(
      getTopicCoverage("TOP-002", { topics: INITIAL_TOPICS, articles: [] }),
    ).toMatchObject({ publishedCount: 0, indexable: false });
  });

  it("maps only eligible keywords and detects primary mapping conflicts", () => {
    expect(
      mapKeyword("KW-EN-0001", "ART-000001-EN", INITIAL_KEYWORDS)?.status,
    ).toBe("mapped");
    expect(
      mapKeyword("KW-EN-0001", "ART-000001-EN", INITIAL_KEYWORDS)?.research
        .searchVolume,
    ).toBeNull();
    const rejected: Keyword = { ...INITIAL_KEYWORDS[0]!, status: "rejected" };
    expect(
      mapKeyword(rejected.id, "ART-000001-EN", [rejected]),
    ).toBeUndefined();
    expect(
      detectKeywordConflicts([
        {
          ...INITIAL_KEYWORDS[0]!,
          status: "mapped",
          primaryPageId: "ART-000001-EN",
        },
        {
          ...INITIAL_KEYWORDS[1]!,
          status: "mapped",
          primaryPageId: "ART-000001-EN",
        },
      ]),
    ).toHaveLength(1);
  });

  it("validates brief acceptance criteria and resolves only public same-locale links", () => {
    expect(validateBrief(INITIAL_BRIEFS[0])).toEqual([]);
    expect(
      validateBrief({ ...INITIAL_BRIEFS[0], acceptanceCriteria: [] }),
    ).toContainEqual(
      expect.objectContaining({ code: "missing-acceptance-criteria" }),
    );
    const draft = article({
      id: "ART-000002-EN",
      slug: "draft",
      state: "draft",
      visibility: "test-only",
      indexable: false,
    });
    const thai = article({ id: "ART-000003-TH", slug: "thai", locale: "th" });
    const source = article({ relatedArticleIds: [draft.id, thai.id] });
    expect(
      resolveInternalLinks(source.id, { articles: [source, draft, thai] }),
    ).toEqual([]);
  });

  it("returns only published translations and audits leakage and broken links", () => {
    const draft = article({
      id: "ART-000002-EN",
      translationKey: "ART-000001",
      slug: "draft",
      state: "draft",
      visibility: "public",
      indexable: true,
    });
    const thai = article({
      id: "ART-000003-TH",
      translationKey: "ART-000001",
      locale: "th",
      slug: "thai",
    });
    const source = article({ relatedArticleIds: [draft.id, "ART-999999-EN"] });
    expect(
      getPublishedTranslationGroup("ART-000001", {
        articles: [source, draft, thai],
      }).map((entry) => entry.locale),
    ).toEqual(["en", "th"]);
    const report = runContentAudit({
      articles: [source, draft, thai],
      keywords: INITIAL_KEYWORDS,
      briefs: INITIAL_BRIEFS,
    });
    expect(report.errors.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "broken-internal-link",
        "unpublished-content-leakage",
      ]),
    );
    expect(report.summary.errors).toBe(report.errors.length);
  });
});
