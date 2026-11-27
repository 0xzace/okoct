import type { ArticleEntity } from "../schemas/entities";
import {
  getArticle,
  type ArticleRepositoryContext,
} from "../repository/articles";

export function resolvePublishedArticleRelationships(
  article: ArticleEntity,
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  return article.relatedArticleIds
    .map((id) => getArticle(id, context))
    .filter((entry): entry is ArticleEntity => entry !== undefined);
}
