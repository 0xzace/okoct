import { createHash } from "node:crypto";

import type { ArticleEntity, ReviewRecord } from "../schemas/entities";

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, entry]) => [key, normalize(entry)]),
    );
  }
  return value;
}

export function computeContentHash(
  markdown: string,
  metadata: unknown,
): string {
  return createHash("sha256")
    .update(markdown)
    .update("\n")
    .update(JSON.stringify(normalize(metadata)))
    .digest("hex");
}

export function isReviewCurrent(
  review: ReviewRecord,
  article: Pick<ArticleEntity, "id" | "revision" | "contentHash">,
  now = new Date(),
): boolean {
  if (!review.reviewerId || !article.contentHash) return false;
  if (review.articleId !== article.id) return false;
  if (review.articleRevision !== article.revision) return false;
  if (review.contentHash !== article.contentHash) return false;
  if (review.status !== "valid" || review.decision !== "approve") return false;
  if (!review.reviewedAt) return false;
  if (review.expiresAt && review.expiresAt.getTime() <= now.getTime())
    return false;
  return true;
}
