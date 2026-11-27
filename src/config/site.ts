export const SITE_CONFIG = {
  name: "OKOCT Health",
  shortName: "OKOCT",
  domain: "okoct.com",
  url: "https://okoct.com",
  version: "0.1.0",
  defaultLocale: "th",
  locales: ["th", "en", "zh-Hans"],
  localePrefixes: {
    th: "th",
    en: "en",
    "zh-Hans": "zh",
  },
  market: "Thailand",
  productType: "Independent health knowledge website",
  isCommercial: false,
} as const;

export type SiteLocale = (typeof SITE_CONFIG.locales)[number];
