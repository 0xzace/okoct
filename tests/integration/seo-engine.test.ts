import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  analyzeHreflang,
  analyzeImages,
  analyzeRedirects,
  analyzeStructuredData,
  analyzeSite,
  compareReports,
  crawlDist,
  evaluateQualityGate,
  parseHtmlSnapshot,
  renderReports,
} from "../../scripts/seo/engine.mjs";

const ORIGIN = "https://okoct.com";

const validPage = (path: string, title = "OKOCT Health") => `<!doctype html>
<html lang="en"><head>
<title>${title}</title>
<meta name="description" content="Independent health knowledge.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${ORIGIN}${path}">
<link rel="alternate" hreflang="en" href="${ORIGIN}${path}">
<link rel="alternate" hreflang="th" href="${ORIGIN}/th/">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${title}"}</script>
</head><body><main><h1>${title}</h1><a href="/th/">Thai</a></main></body></html>`;

describe("SEO engine", () => {
  it("parses the SEO contract from HTML", () => {
    const page = parseHtmlSnapshot({
      url: `${ORIGIN}/en/`,
      html: `${validPage("/en/")}<img src="/hero.webp" alt="A health diagram" width="640" height="360">`,
    });

    expect(page.title).toBe("OKOCT Health");
    expect(page.description).toBe("Independent health knowledge.");
    expect(page.canonical).toBe(`${ORIGIN}/en/`);
    expect(page.links).toContain(`${ORIGIN}/th/`);
    expect(page.images[0]).toMatchObject({
      alt: "A health diagram",
      width: 640,
    });
    expect(page.jsonLd[0]).toMatchObject({ "@type": "WebPage" });
  });

  it("crawls a static dist directory without leaving the configured origin", async () => {
    const dist = await mkdtemp(join(tmpdir(), "okoct-seo-"));
    await mkdir(join(dist, "en"), { recursive: true });
    await mkdir(join(dist, "th"), { recursive: true });
    await writeFile(join(dist, "index.html"), validPage("/"));
    await writeFile(join(dist, "en", "index.html"), validPage("/en/"));
    await writeFile(join(dist, "th", "index.html"), validPage("/th/"));
    await writeFile(
      join(dist, "robots.txt"),
      "User-agent: *\nAllow: /\nSitemap: https://okoct.com/sitemap.xml\n",
    );
    await writeFile(
      join(dist, "sitemap.xml"),
      `<urlset><url><loc>${ORIGIN}/</loc></url></urlset>`,
    );

    const crawl = await crawlDist({ dist, origin: ORIGIN });

    expect(crawl.pages.map((page) => page.url)).toEqual([
      `${ORIGIN}/`,
      `${ORIGIN}/en/`,
      `${ORIGIN}/th/`,
    ]);
    expect(crawl.robots).toContain("Sitemap:");
    expect(crawl.sitemapUrls).toEqual([`${ORIGIN}/`]);
    expect(crawl.pages.every((page) => page.url.startsWith(ORIGIN))).toBe(true);
  });

  it("reports blocking SEO issues and compares them with a baseline", async () => {
    const dist = await mkdtemp(join(tmpdir(), "okoct-seo-invalid-"));
    await writeFile(
      join(dist, "index.html"),
      `<!doctype html><html lang="en"><head><title>Same</title><meta name="description" content="Same"><link rel="canonical" href="https://evil.example/"></head><body><h1>Same</h1><a href="/missing/">Broken</a></body></html>`,
    );
    await writeFile(join(dist, "about.html"), validPage("/about/", "Same"));
    await writeFile(join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
    await writeFile(
      join(dist, "sitemap.xml"),
      `<urlset><url><loc>${ORIGIN}/</loc></url><url><loc>${ORIGIN}/missing/</loc></url></urlset>`,
    );

    const report = await analyzeSite({ dist, origin: ORIGIN });
    const gate = evaluateQualityGate(report);

    expect(
      report.issues.some((issue) => issue.ruleId === "CANONICAL_ORIGIN"),
    ).toBe(true);
    expect(report.issues.some((issue) => issue.ruleId === "LINK_BROKEN")).toBe(
      true,
    );
    expect(gate.passed).toBe(false);

    const comparison = compareReports({
      baseline: { ...report, issues: [] },
      current: report,
    });
    expect(comparison.newIssues.length).toBe(report.issues.length);
  });

  it("validates structured data, images, hreflang and redirect graphs", () => {
    const source = parseHtmlSnapshot({
      url: `${ORIGIN}/en/`,
      html: `<!doctype html><html lang="en"><head><title>Example</title><link rel="alternate" hreflang="en" href="${ORIGIN}/en/"><link rel="alternate" hreflang="th" href="${ORIGIN}/th/"><link rel="alternate" hreflang="zh-Hans" href="${ORIGIN}/zh/"><script type="application/ld+json">{broken</script></head><body><img src="/hero.webp"><h1>Example</h1></body></html>`,
    });
    const target = parseHtmlSnapshot({
      url: `${ORIGIN}/th/`,
      html: `<!doctype html><html lang="th"><head><title>ตัวอย่าง</title><link rel="alternate" hreflang="en" href="${ORIGIN}/en/"></head><body><h1>ตัวอย่าง</h1></body></html>`,
    });
    const crawl = { origin: ORIGIN, pages: [source, target] };

    expect(
      analyzeStructuredData([source]).map((issue) => issue.ruleId),
    ).toContain("STRUCTURED_DATA_JSON");
    expect(analyzeImages([source]).map((issue) => issue.ruleId)).toContain(
      "IMAGE_ALT_MISSING",
    );
    expect(analyzeHreflang(crawl).map((issue) => issue.ruleId)).toContain(
      "HREFLANG_TARGET",
    );
    expect(
      analyzeRedirects([
        { from: "/a", to: "/b" },
        { from: "/b", to: "/a" },
      ]).map((issue) => issue.ruleId),
    ).toContain("REDIRECT_LOOP");
  });

  it("renders the required reports and preserves regression severity changes", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "okoct-seo-reports-"));
    const report = {
      generatedAt: "2026-11-27T00:00:00.000Z",
      ruleVersion: "0.4.0",
      origin: ORIGIN,
      source: "dist",
      crawledUrls: 1,
      indexability: [],
      pages: [],
      internalLinks: [],
      performance: {
        status: "Pending",
        source: "laboratory-only",
        metrics: [],
      },
      issues: [
        {
          ruleId: "TEST_RULE",
          category: "Test",
          severity: "Warning",
          url: `${ORIGIN}/`,
          description: "test",
          evidence: "same",
          suggestedFix: "fix",
          detectedAt: "2026-11-27T00:00:00.000Z",
          ruleVersion: "0.4.0",
        },
      ],
      summary: {
        crawledUrls: 1,
        indexableUrls: 1,
        brokenLinks: 0,
        Critical: 0,
        Error: 0,
        Warning: 1,
        Notice: 0,
        Info: 0,
      },
    };
    const result = await renderReports(report, outputDir);

    expect(result.files).toContain("SEO-AUDIT-REPORT.md");
    expect(await readFile(join(outputDir, "seo-issues.csv"), "utf8")).toContain(
      "TEST_RULE",
    );
    expect(
      await readFile(join(outputDir, "performance-report.json"), "utf8"),
    ).toContain("Pending");
    expect(
      compareReports({
        baseline: {
          ...report,
          issues: [{ ...report.issues[0], severity: "Error" }],
        },
        current: report,
      }).changedIssues,
    ).toHaveLength(1);
  });
});
