import { describe, expect, it } from "vitest";

import {
  articleEntitySchema,
  CONTENT_STATES,
  keywordSchema,
  topicSchema,
} from "../../../src/content-engine/schemas/entities";
import {
  INITIAL_BRIEFS,
  INITIAL_CLUSTERS,
  INITIAL_KEYWORDS,
  INITIAL_TOPICS,
} from "../../../src/content-engine/data/planning";

describe("V0.3 entity schemas", () => {
  it("covers the complete lifecycle state vocabulary", () => {
    expect(CONTENT_STATES).toEqual([
      "planned",
      "brief",
      "draft",
      "fact-check-pending",
      "medical-review-pending",
      "compliance-review-pending",
      "translation-review-pending",
      "approved",
      "published",
      "update-required",
      "withdrawn",
      "archived",
    ]);
  });

  it("rejects unsupported locale and malformed slug", () => {
    const result = topicSchema.safeParse({
      id: "TOP-001",
      slug: "Weight Loss Injections",
      locale: "fr",
      title: "Weight Loss Injections",
      description: "A topic.",
      state: "brief",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a published article without publication evidence", () => {
    const result = articleEntitySchema.safeParse({
      id: "ART-000001-TH",
      translationKey: "ART-000001",
      locale: "th",
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
      contentHash: null,
      authorIds: [],
      reviewerIds: [],
      referenceIds: [],
      reviewRecordIds: [],
      publicationApprovalId: null,
      seo: {
        index: true,
        follow: true,
        canonical: "self",
        schemaType: "MedicalWebPage",
      },
    });

    expect(result.success).toBe(false);
  });

  it("keeps unknown keyword research values null", () => {
    const result = keywordSchema.safeParse(INITIAL_KEYWORDS[0]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.research.searchVolume).toBeNull();
      expect(result.data.research.keywordDifficulty).toBeNull();
      expect(result.data.research.cpc).toBeNull();
    }
  });

  it("validates the initial planning fixture counts", () => {
    expect(INITIAL_TOPICS).toHaveLength(8);
    expect(INITIAL_CLUSTERS).toHaveLength(6);
    expect(INITIAL_KEYWORDS).toHaveLength(10);
    expect(INITIAL_BRIEFS).toHaveLength(12);
    expect(
      INITIAL_TOPICS.every((topic) => topicSchema.safeParse(topic).success),
    ).toBe(true);
  });
});
