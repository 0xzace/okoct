import { LOCALE_PREFIXES, SUPPORTED_LOCALES, type Locale } from "./config";

export type RouteKey = "home" | "about" | "safety" | "search";

const ROUTE_PATHS: Record<RouteKey, Partial<Record<Locale, string>>> = {
  home: { th: "/", en: "/", "zh-Hans": "/" },
  about: { th: "/about/", en: "/about/", "zh-Hans": "/about/" },
  safety: { th: "/safety/", en: "/safety/" },
  search: { th: "/search/", en: "/search/", "zh-Hans": "/search/" },
};

export function getRouteLocales(route: RouteKey): Locale[] {
  return SUPPORTED_LOCALES.filter(
    (locale) => ROUTE_PATHS[route][locale] !== undefined,
  );
}

export function getLocalizedPath(
  route: RouteKey,
  locale: Locale,
): string | undefined {
  const routePath = ROUTE_PATHS[route][locale];

  if (routePath === undefined) {
    return undefined;
  }

  const prefix = LOCALE_PREFIXES[locale];
  const normalizedRoutePath = routePath.replace(/^\//, "").replace(/\/$/, "");

  return normalizedRoutePath
    ? `/${prefix}/${normalizedRoutePath}/`
    : `/${prefix}/`;
}
