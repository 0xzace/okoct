import { SITE_CONFIG, type SiteLocale } from "../config/site";
import { getLocalizedPath } from "../i18n/routes";
import { getRouteLocales, type RouteKey } from "../i18n/routes";
import { toAbsoluteUrl } from "./urls";

export type PublicRouteRecord = {
  route: RouteKey;
  locale: SiteLocale;
  path: string;
  url: string;
};

export function getPublicRouteRecords(): PublicRouteRecord[] {
  const records: PublicRouteRecord[] = [];

  for (const route of ["home", "about", "safety"] as const) {
    for (const locale of getRouteLocales(route)) {
      const path = getLocalizedPath(route, locale);

      if (path) {
        records.push({ route, locale, path, url: toAbsoluteUrl(path) });
      }
    }
  }

  return records;
}

export function getSitemapUrls(): string[] {
  return [
    toAbsoluteUrl("/"),
    ...getPublicRouteRecords().map((record) => record.url),
  ];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSitemapXml(): string {
  const urls = getSitemapUrls()
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
}

export function getSitemapUrl(): string {
  return `${SITE_CONFIG.url}/sitemap.xml`;
}
