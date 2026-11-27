import { SITE_CONFIG } from "../config/site";
import { type Locale } from "../i18n/config";
import {
  getLocalizedPath,
  getRouteLocales,
  type RouteKey,
} from "../i18n/routes";
import type { AlternateLink } from "./types";

export function toAbsoluteUrl(path: string): string {
  const url = new URL(path, SITE_CONFIG.url);

  if (url.origin !== SITE_CONFIG.url) {
    throw new Error(`URL must use the configured site origin: ${path}`);
  }

  url.hash = "";

  const lastPathSegment = url.pathname.split("/").at(-1) ?? "";

  if (
    url.pathname !== "/" &&
    !url.pathname.endsWith("/") &&
    !lastPathSegment.includes(".")
  ) {
    url.pathname = `${url.pathname}/`;
  }

  return url.toString();
}

export function getHreflangLinks(route: RouteKey): AlternateLink[] {
  return getRouteLocales(route).flatMap((locale: Locale) => {
    const path = getLocalizedPath(route, locale);

    return path ? [{ hreflang: locale, href: toAbsoluteUrl(path) }] : [];
  });
}
