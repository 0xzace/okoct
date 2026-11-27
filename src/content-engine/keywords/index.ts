import type { Keyword } from "../schemas/entities";

export type KeywordIssue = {
  code: "primary-keyword-conflict";
  message: string;
};

export function mapKeyword(
  keywordId: string,
  pageId: string,
  keywords: readonly Keyword[],
): Keyword | undefined {
  const keyword = keywords.find((entry) => entry.id === keywordId);
  if (
    !keyword ||
    keyword.status === "rejected" ||
    keyword.status === "archived"
  )
    return undefined;

  return { ...keyword, primaryPageId: pageId, status: "mapped" };
}

export function detectKeywordConflicts(
  keywords: readonly Keyword[],
): KeywordIssue[] {
  const seen = new Map<string, string>();
  const issues: KeywordIssue[] = [];

  for (const keyword of keywords) {
    if (keyword.status !== "mapped" || !keyword.primaryPageId) continue;
    const previous = seen.get(keyword.primaryPageId);
    if (previous) {
      issues.push({
        code: "primary-keyword-conflict",
        message: `${keyword.primaryPageId} is mapped from both ${previous} and ${keyword.id}.`,
      });
    } else {
      seen.set(keyword.primaryPageId, keyword.id);
    }
  }

  return issues;
}
