import { SITE_CONFIG } from "../config/site";

export const DEFAULT_LOCALE = SITE_CONFIG.defaultLocale;
export const SUPPORTED_LOCALES = SITE_CONFIG.locales;
export const LOCALE_PREFIXES = SITE_CONFIG.localePrefixes;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type LocalePrefix = (typeof LOCALE_PREFIXES)[Locale];

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export { getDictionary } from "./dictionaries";
