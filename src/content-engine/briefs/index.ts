import { contentBriefSchema, type ContentBrief } from "../schemas/entities";

export type BriefIssue = {
  code: "invalid-brief" | "missing-acceptance-criteria";
  message: string;
};

export function validateBrief(brief: unknown): BriefIssue[] {
  if (
    typeof brief === "object" &&
    brief !== null &&
    "acceptanceCriteria" in brief
  ) {
    const criteria = (brief as { acceptanceCriteria?: unknown })
      .acceptanceCriteria;
    if (!Array.isArray(criteria) || criteria.length === 0) {
      return [
        {
          code: "missing-acceptance-criteria",
          message: "A content brief needs acceptance criteria.",
        },
      ];
    }
  }

  const parsed = contentBriefSchema.safeParse(brief);
  return parsed.success
    ? []
    : [
        {
          code: "invalid-brief",
          message: "Content brief does not match the content brief schema.",
        },
      ];
}

export function isBriefReady(brief: ContentBrief): boolean {
  return validateBrief(brief).length === 0 && brief.status === "ready";
}
