import { describe, expect, it } from "vitest";

import { deduplicateReferences } from "../../../src/content-engine/references/registry";
import { validateReference } from "../../../src/content-engine/references/validation";
import type { Reference } from "../../../src/content-engine/schemas/entities";

function reference(overrides: Partial<Reference> = {}): Reference {
  return {
    id: "REF-000001",
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
    verification: { status: "pending", verifiedAt: null, verifiedBy: null },
    license: { status: "unknown" },
    notes: "",
    ...overrides,
  };
}

describe("reference engine", () => {
  it("requires a URL or DOI and reports pending verification separately", () => {
    expect(
      validateReference(reference({ url: null, doi: null })).map(
        (issue) => issue.code,
      ),
    ).toContain("missing-locator");
    expect(
      validateReference(reference()).some(
        (issue) => issue.code === "not-medically-verified",
      ),
    ).toBe(true);
    expect(
      validateReference(
        reference({
          verification: {
            status: "verified",
            verifiedAt: new Date("2026-11-27"),
            verifiedBy: "reviewer",
          },
        }),
      ),
    ).toEqual([]);
  });

  it("deduplicates references by canonical URL or DOI", () => {
    const result = deduplicateReferences([
      reference({ id: "REF-000001" }),
      reference({
        id: "REF-000002",
        url: "https://example.com/source#section",
      }),
      reference({ id: "REF-000003", url: null, doi: "10.1000/example" }),
      reference({ id: "REF-000004", url: null, doi: "10.1000/example" }),
    ]);

    expect(result.map((entry) => entry.id)).toEqual([
      "REF-000001",
      "REF-000003",
    ]);
  });
});
