import { describe, expect, it } from "vitest";

import { filterPublicBuild } from "../../../src/content-engine/publication/build-filter";
import { evaluatePublication } from "../../../src/content-engine/publication/gate";
import { computeContentHash } from "../../../src/content-engine/review/invalidation";
import type {
  ArticleEntity,
  Author,
  PublicationApproval,
  Reference,
  ReviewRecord,
  Reviewer,
} from "../../../src/content-engine/schemas/entities";

const hash = computeContentHash("Body", { title: "Title" });

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
    contentHash: hash,
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
  };
}

const authors: Author[] = [
  {
    id: "AUTH-001",
    name: "Verified author",
    locale: "en",
    verified: true,
    publicBio: null,
  },
];
const reviewers: Reviewer[] = [
  {
    id: "REV-001",
    name: "Verified reviewer",
    locale: "en",
    verified: true,
    publicBio: null,
    role: "medical-reviewer",
  },
];
const references: Reference[] = [
  {
    id: "REF-001",
    type: "government-publication",
    title: "Official publication",
    publisher: "Public authority",
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
];
const reviews: ReviewRecord[] = [
  "fact-check",
  "medical",
  "compliance",
  "language",
].map((reviewType, index) => ({
  id: `REVREC-00${index + 1}`,
  articleId: "ART-000001-EN",
  articleRevision: 1,
  contentHash: hash,
  reviewerId: "REV-001",
  reviewType: reviewType as ReviewRecord["reviewType"],
  status: "valid",
  decision: "approve",
  reviewedAt: new Date("2026-11-21"),
  expiresAt: new Date("2026-12-21"),
  scope: ["body"],
  comments: [],
  evidence: ["REF-001"],
}));
const approvals: PublicationApproval[] = [
  {
    id: "APPROVAL-001",
    articleId: "ART-000001-EN",
    articleRevision: 1,
    contentHash: hash,
    approvedBy: "editor",
    approvedAt: new Date("2026-11-22"),
    status: "approved",
  },
];

const context = {
  authors,
  reviewers,
  references,
  reviews,
  approvals,
  now: new Date("2026-11-27"),
};

describe("publication gate", () => {
  it("allows a fully evidenced synthetic reviewed fixture", () => {
    expect(evaluatePublication(article(), context)).toMatchObject({
      allowed: true,
      errors: [],
    });
  });

  it("rejects missing, expired, stale, and incomplete evidence", () => {
    expect(
      evaluatePublication(article({ reviewRecordIds: [] }), context).allowed,
    ).toBe(false);
    expect(
      evaluatePublication(
        article({
          state: "withdrawn",
          visibility: "test-only",
          indexable: false,
        }),
        context,
      ).allowed,
    ).toBe(false);
    expect(
      evaluatePublication(
        article({ contentHash: "changed" }),
        context,
      ).errors.join(" "),
    ).toMatch(/hash|review|approval/i);
    expect(
      evaluatePublication(article({ publicationApprovalId: null }), context)
        .allowed,
    ).toBe(false);
  });

  it("filters the production build fail-closed", () => {
    expect(
      filterPublicBuild(
        [
          article(),
          article({
            id: "ART-000002-EN",
            state: "draft",
            visibility: "test-only",
            indexable: false,
          }),
        ],
        context,
      ),
    ).toHaveLength(1);
  });
});
