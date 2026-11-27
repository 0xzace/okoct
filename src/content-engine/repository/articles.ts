import type { Locale } from "../../i18n/config";
import type { ArticleEntity, Reference } from "../schemas/entities";
import { getEntityById, type EntityRepositoryContext } from "./entities";
import { evaluatePublication } from "../publication/gate";

export type ArticleRepositoryContext = EntityRepositoryContext;
export type ArticleFilters = {
  locale?: Locale;
  topicId?: string;
  clusterId?: string;
  type?: ArticleEntity["type"];
  indexable?: boolean;
};

function isPublicArticle(article: ArticleEntity): boolean {
  return (
    article.state === "published" &&
    article.visibility === "public" &&
    article.indexable &&
    article.seo.index
  );
}

function isProductionArticle(
  article: ArticleEntity,
  context: ArticleRepositoryContext,
): boolean {
  return context.publication
    ? evaluatePublication(article, context.publication).allowed
    : isPublicArticle(article);
}

export function getArticle(
  id: string,
  context: ArticleRepositoryContext,
): ArticleEntity | undefined {
  const article = context.articles.find((entry) => entry.id === id);

  return article && isProductionArticle(article, context) ? article : undefined;
}

export function listArticles(
  filters: ArticleFilters = {},
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  return context.articles.filter((article) => {
    if (!isProductionArticle(article, context)) return false;
    if (filters.locale && article.locale !== filters.locale) return false;
    if (filters.topicId && article.topicId !== filters.topicId) return false;
    if (filters.clusterId && article.clusterId !== filters.clusterId)
      return false;
    if (filters.type && article.type !== filters.type) return false;
    if (
      filters.indexable !== undefined &&
      article.indexable !== filters.indexable
    )
      return false;
    return true;
  });
}

export function getPublishedArticles(
  context: ArticleRepositoryContext,
  locale?: Locale,
): ArticleEntity[] {
  return listArticles(locale ? { locale } : {}, context);
}

export function getIndexableArticles(
  context: ArticleRepositoryContext,
  locale?: Locale,
): ArticleEntity[] {
  return listArticles(
    locale ? { locale, indexable: true } : { indexable: true },
    context,
  );
}

export function getRelatedArticles(
  articleOrId: ArticleEntity | string,
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  const article =
    typeof articleOrId === "string"
      ? getArticle(articleOrId, context)
      : articleOrId;

  if (!article) return [];

  return article.relatedArticleIds
    .map((id) => getArticle(id, context))
    .filter((entry): entry is ArticleEntity => entry !== undefined);
}

export function getArticleReferences(
  articleOrId: ArticleEntity | string,
  context: ArticleRepositoryContext,
): Reference[] {
  const article =
    typeof articleOrId === "string"
      ? getArticle(articleOrId, context)
      : articleOrId;

  if (!article) return [];

  return article.referenceIds
    .map((id) => getEntityById(context.references, id))
    .filter((entry): entry is Reference => entry !== undefined);
}

export function getArticleTranslations(
  translationKey: string,
  context: ArticleRepositoryContext,
): ArticleEntity[] {
  return listArticles({}, context).filter(
    (article) => article.translationKey === translationKey,
  );
}

export function getFeaturedArticles(
  context: ArticleRepositoryContext,
  locale: Locale,
): ArticleEntity[] {
  return listArticles({ locale, type: "pillar" }, context);
}

export function getLatestArticles(
  context: ArticleRepositoryContext,
  locale?: Locale,
): ArticleEntity[] {
  return listArticles(locale ? { locale } : {}, context).sort(
    (first, second) =>
      (second.publishedAt?.getTime() ?? 0) -
      (first.publishedAt?.getTime() ?? 0),
  );
}
