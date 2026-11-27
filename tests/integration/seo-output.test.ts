import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const dist = resolve(process.cwd(), "dist");

function readOutput(relativePath: string): string {
  const filePath = resolve(dist, relativePath);

  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

function expectMetadata(
  relativePath: string,
  language: string,
  canonical: string,
) {
  const html = readOutput(relativePath);

  expect(html).toContain(`<html lang="${language}"`);
  expect(html).toMatch(/<title>[^<]+<\/title>/);
  expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  expect(html).toContain(`<link rel="canonical" href="${canonical}"`);
  expect(html).toContain(`hreflang="${language}"`);
}

describe("generated SEO output", () => {
  it("contains only the expected public page set", () => {
    for (const page of [
      ["index.html", "en", "https://okoct.com/"],
      ["th/index.html", "th", "https://okoct.com/th/"],
      ["en/index.html", "en", "https://okoct.com/en/"],
      ["zh/index.html", "zh-Hans", "https://okoct.com/zh/"],
      ["th/about/index.html", "th", "https://okoct.com/th/about/"],
      ["en/about/index.html", "en", "https://okoct.com/en/about/"],
      ["zh/about/index.html", "zh-Hans", "https://okoct.com/zh/about/"],
      ["th/safety/index.html", "th", "https://okoct.com/th/safety/"],
      ["en/safety/index.html", "en", "https://okoct.com/en/safety/"],
    ] as const) {
      expectMetadata(page[0], page[1], page[2]);
    }

    expect(readOutput("zh/safety/index.html")).toBe("");
  });

  it("publishes a locale-aware sitemap and robots policy", () => {
    const sitemap = readOutput("sitemap.xml");
    const robots = readOutput("robots.txt");

    expect(sitemap).toContain("https://okoct.com/th/");
    expect(sitemap).toContain("https://okoct.com/en/about/");
    expect(sitemap).not.toContain("https://okoct.com/zh/safety/");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://okoct.com/sitemap.xml");
  });

  it("does not expose the draft fixture in generated content", () => {
    const html = [
      readOutput("index.html"),
      readOutput("th/index.html"),
      readOutput("en/index.html"),
      readOutput("zh/index.html"),
      readOutput("sitemap.xml"),
    ].join("\n");

    expect(html).not.toContain("V0.1 test content");
    expect(html).not.toContain("v0-1-test-content");
  });
});
