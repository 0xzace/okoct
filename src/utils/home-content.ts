import type { Locale } from "../i18n/config";
import type { ArticleFrontmatter } from "../schemas/content";
import { getPublicContent } from "./publication";
import type { PublicationContext } from "../content-engine/publication/gate";

export function getPublishedArticlesForLocale(
  entries: readonly ArticleFrontmatter[],
  locale: Locale,
  context?: PublicationContext,
): ArticleFrontmatter[] {
  return getPublicContent(entries, context).filter(
    (entry) => entry.locale === locale,
  );
}
