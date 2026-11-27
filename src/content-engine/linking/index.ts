import {
  getArticle,
  type ArticleRepositoryContext,
} from "../repository/articles";
import type { ArticleEntity } from "../schemas/entities";

export function resolveInternalLinks(
  articleId: string,
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  const source = getArticle(articleId, context);
  if (!source) return [];

  return source.relatedArticleIds
    .map((id) => getArticle(id, context))
    .filter((entry): entry is ArticleEntity => entry !== undefined)
    .filter((entry) => entry.locale === source.locale);
}
