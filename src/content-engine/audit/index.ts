import { validateEntitySet, type ValidationIssue } from "../schemas/validation";
import type { ArticleEntity, ContentBrief, Keyword } from "../schemas/entities";

export type AuditIssue = {
  code: string;
  message: string;
  severity: "error" | "warning" | "information";
};

export type AuditReport = {
  errors: AuditIssue[];
  warnings: AuditIssue[];
  information: AuditIssue[];
  summary: { errors: number; warnings: number; information: number };
};

type AuditInput = {
  articles: readonly ArticleEntity[];
  keywords?: readonly Keyword[];
  briefs?: readonly ContentBrief[];
};

function convertValidationIssue(issue: ValidationIssue): AuditIssue {
  return { code: issue.code, message: issue.message, severity: "error" };
}

export function runContentAudit(input: AuditInput): AuditReport {
  const all: AuditIssue[] = [];
  all.push(
    ...validateEntitySet(input.articles, {
      id: (article) => article.id,
      slug: (article) => article.slug,
      title: (article) => article.title,
    }).map(convertValidationIssue),
  );

  for (const article of input.articles) {
    if (
      article.state !== "published" &&
      (article.visibility === "public" || article.indexable)
    ) {
      all.push({
        code: "unpublished-content-leakage",
        message: `${article.id} is not published but is public or indexable.`,
        severity: "error",
      });
    }

    for (const targetId of article.relatedArticleIds) {
      const target = input.articles.find((entry) => entry.id === targetId);
      if (!target) {
        all.push({
          code: "broken-internal-link",
          message: `${article.id} references missing ${targetId}.`,
          severity: "error",
        });
      } else if (
        target.state !== "published" ||
        target.visibility !== "public" ||
        !target.indexable
      ) {
        all.push({
          code: "unpublished-target",
          message: `${article.id} references unpublished ${targetId}.`,
          severity: "error",
        });
      } else if (target.locale !== article.locale) {
        all.push({
          code: "invalid-locale-link",
          message: `${article.id} links to ${targetId} across locales.`,
          severity: "warning",
        });
      }
    }
  }

  const errors = all.filter((issue) => issue.severity === "error");
  const warnings = all.filter((issue) => issue.severity === "warning");
  const information = all.filter((issue) => issue.severity === "information");

  return {
    errors,
    warnings,
    information,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      information: information.length,
    },
  };
}
