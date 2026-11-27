import { describe, expect, it } from "vitest";

import {
  computeContentHash,
  isReviewCurrent,
} from "../../../src/content-engine/review/invalidation";
import type {
  ArticleEntity,
  ReviewRecord,
} from "../../../src/content-engine/schemas/entities";

const article = {
  id: "ART-000001-EN",
  revision: 2,
  contentHash: computeContentHash("Body", { title: "Title" }),
} as ArticleEntity;

const review: ReviewRecord = {
  id: "REVREC-001",
  articleId: "ART-000001-EN",
  articleRevision: 2,
  contentHash: article.contentHash ?? "",
  reviewerId: "REV-001",
  reviewType: "medical",
  status: "valid",
  decision: "approve",
  reviewedAt: new Date("2026-11-20"),
  expiresAt: new Date("2026-12-20"),
  scope: ["body"],
  comments: [],
  evidence: ["REF-001"],
};

describe("review invalidation", () => {
  it("normalizes equivalent metadata before hashing", () => {
    expect(computeContentHash("Body", { title: "Title", order: 1 })).toBe(
      computeContentHash("Body", { order: 1, title: "Title" }),
    );
  });

  it("requires matching revision and hash", () => {
    expect(isReviewCurrent(review, article, new Date("2026-11-27"))).toBe(true);
    expect(
      isReviewCurrent(
        review,
        { ...article, revision: 3 },
        new Date("2026-11-27"),
      ),
    ).toBe(false);
    expect(
      isReviewCurrent(
        review,
        { ...article, contentHash: "changed" },
        new Date("2026-11-27"),
      ),
    ).toBe(false);
  });

  it("rejects expired and non-approved reviews", () => {
    expect(
      isReviewCurrent(
        { ...review, expiresAt: new Date("2026-11-01") },
        article,
        new Date("2026-11-27"),
      ),
    ).toBe(false);
    expect(
      isReviewCurrent(
        { ...review, decision: "request-changes" },
        article,
        new Date("2026-11-27"),
      ),
    ).toBe(false);
    expect(
      isReviewCurrent(
        { ...review, reviewerId: "" as "REV-001" },
        article,
        new Date("2026-11-27"),
      ),
    ).toBe(false);
  });
});
