import { describe, expect, it } from "vitest";

import { SITE_CONFIG } from "../../src/config/site";

describe("SITE_CONFIG", () => {
  it("exposes the OKOCT project identity and supported locales", () => {
    expect(SITE_CONFIG.name).toBe("OKOCT Health");
    expect(SITE_CONFIG.domain).toBe("okoct.com");
    expect(SITE_CONFIG.defaultLocale).toBe("th");
    expect(SITE_CONFIG.locales).toEqual(["th", "en", "zh-Hans"]);
    expect(SITE_CONFIG.version).toBe("0.1.0");
  });

  it("does not expose credentials or private environment values", () => {
    const serializedConfig = JSON.stringify(SITE_CONFIG);

    expect(serializedConfig).not.toMatch(
      /secret|token|password|private[_-]?key/i,
    );
    expect(serializedConfig).not.toContain("process.env");
  });
});
