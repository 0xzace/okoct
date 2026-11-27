import { SITE_CONFIG } from "../config/site";
import { getLocalizedPath } from "../i18n/routes";
import type { SeoInput, SeoMetadata } from "./types";
import { getHreflangLinks, toAbsoluteUrl } from "./urls";

export function buildSeoMetadata(input: SeoInput): SeoMetadata {
  const localizedPath = getLocalizedPath(input.route, input.locale);

  if (localizedPath === undefined) {
    throw new Error(
      `No localized route exists for ${input.route}/${input.locale}`,
    );
  }

  const canonical = toAbsoluteUrl(input.canonicalPath ?? localizedPath);

  return {
    title: input.title,
    description: input.description,
    canonical,
    robots: input.indexable === false ? "noindex,nofollow" : "index,follow",
    openGraph: {
      type: input.ogType ?? "website",
      title: input.title,
      description: input.description,
      url: canonical,
      locale: input.locale,
      siteName: SITE_CONFIG.name,
      ...(input.image ? { image: toAbsoluteUrl(input.image) } : {}),
    },
    alternates: [
      ...getHreflangLinks(input.route),
      { hreflang: "x-default", href: toAbsoluteUrl("/") },
    ],
  };
}
