import type {
  ArticleEntity,
  Author,
  Cluster,
  Reference,
  Reviewer,
  Topic,
} from "../schemas/entities";

export type EntityRepositoryContext = {
  articles: readonly ArticleEntity[];
  topics?: readonly Topic[];
  clusters?: readonly Cluster[];
  authors?: readonly Author[];
  reviewers?: readonly Reviewer[];
  references?: readonly Reference[];
};

export function getEntityById<T extends { id: string }>(
  entities: readonly T[] | undefined,
  id: string,
): T | undefined {
  return entities?.find((entity) => entity.id === id);
}
