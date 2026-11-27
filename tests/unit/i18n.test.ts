import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  LOCALE_PREFIXES,
  SUPPORTED_LOCALES,
  getDictionary,
} from "../../src/i18n/config";
import { getLocalizedPath, getRouteLocales } from "../../src/i18n/routes";

describe("internationalization", () => {
  it("maps supported locales to the required URL prefixes", () => {
    expect(DEFAULT_LOCALE).toBe("th");
    expect(SUPPORTED_LOCALES).toEqual(["th", "en", "zh-Hans"]);
    expect(LOCALE_PREFIXES).toEqual({ th: "th", en: "en", "zh-Hans": "zh" });
    expect(getLocalizedPath("home", "zh-Hans")).toBe("/zh/");
    expect(getLocalizedPath("about", "en")).toBe("/en/about/");
  });

  it("returns localized dictionary text", () => {
    expect(getDictionary("th").languageName).toBe("ไทย");
    expect(getDictionary("en").languageName).toBe("English");
    expect(getDictionary("zh-Hans").languageName).toBe("简体中文");
  });

  it("does not create links for a route without a translation", () => {
    expect(getRouteLocales("about")).toEqual(["th", "en", "zh-Hans"]);
    expect(getRouteLocales("safety")).toEqual(["th", "en"]);
    expect(getLocalizedPath("safety", "zh-Hans")).toBeUndefined();
  });

  it("provides complete homepage and search copy for every locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dictionary = getDictionary(locale);

      expect(dictionary.home.topicCards).toHaveLength(3);
      expect(dictionary.home.standardsItems).toHaveLength(3);
      expect(dictionary.home.searchPlaceholder.length).toBeGreaterThan(0);
      expect(dictionary.home.horizon.label.length).toBeGreaterThan(0);
      expect(dictionary.search.noResults.length).toBeGreaterThan(0);
    }

    expect(getLocalizedPath("search", "zh-Hans")).toBe("/zh/search/");
  });
});
