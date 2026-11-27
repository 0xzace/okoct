import { describe, expect, it } from "vitest";

import {
  getPublicArticlePaths,
  getPublicTopicPaths,
} from "../../src/content-engine/page-paths";
import type {
  ArticleEntity,
  PublicationApproval,
  Reference,
  ReviewRecord,
  Reviewer,
  Author,
  Topic,
} from "../../src/content-engine/schemas/entities";

const article = (overrides: Partial<ArticleEntity> = {}): ArticleEntity => ({
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
  reviewRecordIds: ["REVREC-001", "REVREC-002", "REVREC-003", "REVREC-004"],
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
});

const context = {
  authors: [
    {
      id: "AUTH-001",
      name: "Verified author",
      locale: "en",
      verified: true,
      publicBio: null,
    },
  ] as Author[],
  reviewers: [
    {
      id: "REV-001",
      name: "Verified reviewer",
      locale: "en",
      verified: true,
      publicBio: null,
      role: "medical-reviewer",
    },
  ] as Reviewer[],
  references: [
    {
      id: "REF-001",
      type: "government-publication",
      title: "Official",
      publisher: "Authority",
      authors: [],
      url: "https://example.com/source",
      doi: null,
      publicationDate: null,
      accessedAt: new Date("2026-11-27"),
      jurisdiction: "TH",
      language: "en",
      verification: {
        status: "verified",
        verifiedAt: new Date("2026-11-27"),
        verifiedBy: "reviewer",
      },
      license: { status: "unknown" },
      notes: "",
    },
  ] as Reference[],
  reviews: ["fact-check", "medical", "compliance", "language"].map(
    (reviewType, index) => ({
      id: `REVREC-00${index + 1}`,
      articleId: "ART-000001-EN",
      articleRevision: 1,
      contentHash: "hash-1",
      reviewerId: "REV-001",
      reviewType: reviewType as ReviewRecord["reviewType"],
      status: "valid",
      decision: "approve",
      reviewedAt: new Date("2026-11-21"),
      expiresAt: new Date("2026-12-21"),
      scope: ["body"],
      comments: [],
      evidence: ["REF-001"],
    }),
  ) as ReviewRecord[],
  approvals: [
    {
      id: "APPROVAL-001",
      articleId: "ART-000001-EN",
      articleRevision: 1,
      contentHash: "hash-1",
      approvedBy: "editor",
      approvedAt: new Date("2026-11-22"),
      status: "approved",
    },
  ] as PublicationApproval[],
  now: new Date("2026-11-27"),
};

describe("article and topic page paths", () => {
  it("creates paths only for fully publishable articles", () => {
    const paths = getPublicArticlePaths(
      [
        article(),
        article({
          id: "ART-000002-EN",
          slug: "draft",
          state: "draft",
          visibility: "test-only",
          indexable: false,
        }),
      ],
      context,
      "en",
    );
    expect(paths.map((path) => path.slug)).toEqual(["weight-loss-injections"]);
  });

  it("creates no topic path without published coverage", () => {
    const topics: Topic[] = [
      {
        id: "TOP-001",
        slug: "weight-loss-injections",
        locale: "en",
        title: "Weight Loss Injections",
        description: "Topic",
        state: "planned",
        priority: "P0",
      },
    ];
    expect(
      getPublicTopicPaths(
        topics,
        [
          article({
            state: "draft",
            visibility: "test-only",
            indexable: false,
          }),
        ],
        context,
        "en",
      ),
    ).toEqual([]);
  });
});
