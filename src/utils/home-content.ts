import type { Locale } from "../i18n/config";
import type { ArticleFrontmatter } from "../schemas/content";
import { getPublicContent } from "./publication";

export function getPublishedArticlesForLocale(
  entries: readonly ArticleFrontmatter[],
  locale: Locale,
): ArticleFrontmatter[] {
  return getPublicContent(entries).filter((entry) => entry.locale === locale);
}
