import type { Locale } from "../i18n/config";
import type { ArticleEntity, Topic } from "./schemas/entities";
import {
  evaluatePublication,
  type PublicationContext,
} from "./publication/gate";

export type PublicArticlePath = {
  locale: Locale;
  slug: string;
  article: ArticleEntity;
};

export type PublicTopicPath = {
  locale: Locale;
  slug: string;
  topic: Topic;
};

export function getPublicArticlePaths(
  articles: readonly ArticleEntity[],
  context: PublicationContext,
  locale: Locale,
): PublicArticlePath[] {
  return articles
    .filter((article) => article.locale === locale)
    .filter((article) => evaluatePublication(article, context).allowed)
    .map((article) => ({ locale, slug: article.slug, article }));
}

export function getPublicTopicPaths(
  topics: readonly Topic[],
  articles: readonly ArticleEntity[],
  context: PublicationContext,
  locale: Locale,
): PublicTopicPath[] {
  return topics
    .filter((topic) => topic.locale === locale)
    .filter((topic) =>
      articles.some(
        (article) =>
          article.locale === locale &&
          article.topicId === topic.id &&
          evaluatePublication(article, context).allowed,
      ),
    )
    .map((topic) => ({ locale, slug: topic.slug, topic }));
}
