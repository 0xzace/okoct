import { describe, expect, it } from "vitest";

import { validateEntitySet } from "../../../src/content-engine/schemas/validation";

describe("entity relationship validation", () => {
  it("reports duplicate ids, slugs, titles, and missing references", () => {
    const issues = validateEntitySet(
      [
        {
          id: "ART-1",
          slug: "same-slug",
          title: "Same title",
          topicId: "TOP-001",
        },
        {
          id: "ART-1",
          slug: "same-slug",
          title: "Same title",
          topicId: "TOP-999",
        },
      ],
      {
        id: (item) => item.id,
        slug: (item) => item.slug,
        title: (item) => item.title,
        references: [
          {
            field: "topicId",
            values: (item) => [item.topicId],
            availableIds: new Set(["TOP-001"]),
          },
        ],
      },
    );

    expect(issues.map((issue) => issue.code)).toEqual([
      "duplicate-id",
      "duplicate-slug",
      "duplicate-title",
      "missing-reference",
    ]);
  });
});
