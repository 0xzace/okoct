import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type HreflangCode = Locale | "x-default";

export type AlternateLink = {
  hreflang: HreflangCode;
  href: string;
};

export type SeoInput = {
  route: RouteKey;
  locale: Locale;
  title: string;
  description: string;
  indexable?: boolean;
  ogType?: "website" | "article";
  image?: string;
};

export type SeoMetadata = {
  title: string;
  description: string;
  canonical: string;
  robots: "index,follow" | "noindex,nofollow";
  openGraph: {
    type: "website" | "article";
    title: string;
    description: string;
    url: string;
    locale: Locale;
    siteName: string;
    image?: string;
  };
  alternates: AlternateLink[];
};
