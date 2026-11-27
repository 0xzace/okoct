import type { ArticleEntity, Topic } from "../schemas/entities";

export type TopicCoverage = {
  topicId: string;
  title: string | null;
  publishedCount: number;
  indexable: boolean;
};

export function getTopicCoverage(
  topicId: string,
  context: { topics: readonly Topic[]; articles: readonly ArticleEntity[] },
): TopicCoverage {
  const topic = context.topics.find((entry) => entry.id === topicId);
  const publishedCount = context.articles.filter(
    (article) =>
      article.topicId === topicId &&
      article.state === "published" &&
      article.visibility === "public" &&
      article.indexable &&
      article.seo.index,
  ).length;

  return {
    topicId,
    title: topic?.title ?? null,
    publishedCount,
    indexable: publishedCount > 0,
  };
}
