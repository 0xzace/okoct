import { LOCALE_PREFIXES, type Locale } from "../i18n/config";
import { getPublishedTranslationGroup } from "../content-engine/translations";
import type { ArticleEntity } from "../content-engine/schemas/entities";
import type { PublicationContext } from "../content-engine/publication/gate";
import type { AlternateLink } from "./types";
import { toAbsoluteUrl } from "./urls";

export function getContentHreflangLinks(
  translationKey: string,
  articles: readonly ArticleEntity[],
  context: PublicationContext,
): AlternateLink[] {
  const links = getPublishedTranslationGroup(translationKey, {
    ...context,
    articles,
  });
  const seen = new Set<Locale>();

  return links.flatMap((article) => {
    if (seen.has(article.locale)) return [];
    seen.add(article.locale);
    return [
      {
        hreflang: article.locale,
        href: toAbsoluteUrl(
          `/${LOCALE_PREFIXES[article.locale]}/articles/${article.slug}/`,
        ),
      },
    ];
  });
}
