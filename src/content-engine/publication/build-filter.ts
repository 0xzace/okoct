import type { ArticleEntity } from "../schemas/entities";
import { evaluatePublication, type PublicationContext } from "./gate";

export type PublicArticleRecord = ArticleEntity;

export function filterPublicBuild(
  records: readonly ArticleEntity[],
  context: PublicationContext,
): PublicArticleRecord[] {
  return records.filter(
    (record) => evaluatePublication(record, context).allowed,
  );
}
