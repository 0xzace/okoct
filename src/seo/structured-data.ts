import { SITE_CONFIG } from "../config/site";
import type { Locale } from "../i18n/config";

export type WebPageJsonLdInput = {
  title: string;
  description: string;
  url: string;
  locale: Locale;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildWebSiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description,
  } as const;
}

export function buildWebPageJsonLd(input: WebPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: input.locale,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  } as const;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
}
