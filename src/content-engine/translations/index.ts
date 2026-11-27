import {
  listArticles,
  type ArticleRepositoryContext,
} from "../repository/articles";
import type { ArticleEntity } from "../schemas/entities";

export function getPublishedTranslationGroup(
  translationKey: string,
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  return listArticles({}, context).filter(
    (article) => article.translationKey === translationKey,
  );
}
