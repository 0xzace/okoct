import {
  articleEntitySchema,
  type Author,
  type PublicationApproval,
  type Reference,
  type ReviewRecord,
  type Reviewer,
} from "../schemas/entities";
import { isReviewCurrent } from "../review/invalidation";
import { validateReference } from "../references/validation";

export type PublicationContext = {
  authors: readonly Author[];
  reviewers: readonly Reviewer[];
  references: readonly Reference[];
  reviews: readonly ReviewRecord[];
  approvals: readonly PublicationApproval[];
  now?: Date;
};

export type PublicationDecision = {
  allowed: boolean;
  errors: string[];
  warnings: string[];
};

const REQUIRED_REVIEW_TYPES: ReviewRecord["reviewType"][] = [
  "fact-check",
  "medical",
  "compliance",
  "language",
];

export function evaluatePublication(
  article: unknown,
  context: PublicationContext,
): PublicationDecision {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed = articleEntitySchema.safeParse(article);

  if (!parsed.success) {
    return {
      allowed: false,
      errors: ["Article does not match the publication schema."],
      warnings,
    };
  }

  const value = parsed.data;
  if (value.state !== "published")
    errors.push("Article state must be published.");
  if (value.visibility !== "public")
    errors.push("Article visibility must be public.");
  if (!value.indexable || !value.seo.index)
    errors.push("Article must be explicitly indexable.");

  const authorRecords = value.authorIds.map((id) =>
    context.authors.find((entry) => entry.id === id),
  );
  if (
    value.authorIds.length === 0 ||
    authorRecords.some((entry) => !entry?.verified)
  ) {
    errors.push("Article requires verified author identities.");
  }

  const reviewerRecords = value.reviewerIds.map((id) =>
    context.reviewers.find((entry) => entry.id === id),
  );
  if (
    value.reviewerIds.length === 0 ||
    reviewerRecords.some((entry) => !entry?.verified)
  ) {
    errors.push("Article requires verified reviewer identities.");
  }

  const referenceRecords = value.referenceIds.map((id) =>
    context.references.find((entry) => entry.id === id),
  );
  if (
    value.referenceIds.length === 0 ||
    referenceRecords.some((entry) => !entry)
  ) {
    errors.push("Article requires all referenced sources to exist.");
  }
  for (const reference of referenceRecords) {
    if (!reference) continue;
    for (const issue of validateReference(reference)) {
      errors.push(issue.message);
    }
  }

  const reviewRecords = value.reviewRecordIds.map((id) =>
    context.reviews.find((entry) => entry.id === id),
  );
  for (const reviewType of REQUIRED_REVIEW_TYPES) {
    const review = reviewRecords.find(
      (entry) => entry?.reviewType === reviewType,
    );
    if (!review || !isReviewCurrent(review, value, context.now)) {
      errors.push(`Article requires a current ${reviewType} review.`);
    }
  }

  const approval = context.approvals.find(
    (entry) => entry.id === value.publicationApprovalId,
  );
  if (
    !approval ||
    approval.status !== "approved" ||
    approval.articleId !== value.id ||
    approval.articleRevision !== value.revision ||
    approval.contentHash !== value.contentHash
  ) {
    errors.push("Article requires a matching publication approval.");
  }

  return { allowed: errors.length === 0, errors, warnings };
}
