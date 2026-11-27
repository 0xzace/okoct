import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  analyzeCrawl,
  analyzeSite,
  compareReports,
  crawlHttp,
  evaluateQualityGate,
  renderReports,
  writeJson,
} from "./engine.mjs";

const [, , command = "audit", ...args] = process.argv;

function option(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? (args[index + 1] ?? fallback) : fallback;
}

const dist = resolve(option("dist", "dist"));
const origin = option("origin", "https://okoct.com");
const httpUrl = option("url", "");
const outputDir = resolve(option("out", "seo-lab/reports"));
const baselinePath = resolve(
  option("baseline", "seo-lab/baselines/seo-audit.json"),
);

async function loadReport(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function buildReport() {
  const report = httpUrl
    ? analyzeCrawl({
        crawl: await crawlHttp({ origin: httpUrl }),
        origin: httpUrl,
      })
    : await analyzeSite({ dist, origin });
  await renderReports(report, outputDir);
  return report;
}

function printSummary(report, gate = evaluateQualityGate(report)) {
  console.log(`SEO audit: ${gate.passed ? "PASS" : "BLOCK"}`);
  console.log(`Crawled URLs: ${report.summary.crawledUrls}`);
  console.log(`Indexable URLs: ${report.summary.indexableUrls}`);
  console.log(`Critical: ${report.summary.Critical}`);
  console.log(`Errors: ${report.summary.Error}`);
  console.log(`Warnings: ${report.summary.Warning}`);
  if (!gate.passed)
    for (const issue of gate.blockingIssues)
      console.error(
        `[${issue.severity}] ${issue.ruleId} ${issue.url}: ${issue.description}`,
      );
}

async function run() {
  if (command === "crawl") {
    const report = await buildReport();
    await writeJson(resolve(`${outputDir}/crawl-report.json`), {
      crawledUrls: report.crawledUrls,
      pages: report.pages,
      source: report.source,
    });
    printSummary(report, { passed: true, blockingIssues: [] });
    return;
  }

  if (
    command === "audit" ||
    command === "report" ||
    command === "gate" ||
    [
      "metadata",
      "indexability",
      "canonical",
      "sitemap",
      "robots",
      "structured-data",
      "hreflang",
      "links",
      "redirects",
      "images",
      "duplicates",
      "keywords",
      "performance",
    ].includes(command)
  ) {
    const report = await buildReport();
    if (command !== "audit" && command !== "report" && command !== "gate") {
      const categoryMap = {
        metadata: "Metadata",
        indexability: null,
        canonical: "Canonical",
        sitemap: "Sitemap",
        robots: "Robots",
        "structured-data": "Structured Data",
        hreflang: "Hreflang",
        links: "Internal Links",
        redirects: "Redirects",
        images: "Images",
        duplicates: "Content",
        keywords: "Keywords",
        performance: null,
      };
      const issues = categoryMap[command]
        ? report.issues.filter(
            (issue) => issue.category === categoryMap[command],
          )
        : [];
      console.log(`${command}: ${issues.length} issue(s)`);
      for (const issue of issues)
        console.log(
          `[${issue.severity}] ${issue.ruleId} ${issue.url}: ${issue.description}`,
        );
      return;
    }
    const gate = evaluateQualityGate(report);
    printSummary(report, gate);
    if (command === "gate" && !gate.passed) process.exitCode = 1;
    return;
  }

  if (command === "baseline") {
    const report = await buildReport();
    await writeJson(baselinePath, report);
    console.log(`SEO baseline written: ${baselinePath}`);
    return;
  }

  if (command === "compare") {
    const baseline = await loadReport(baselinePath);
    const current = await buildReport();
    const comparison = compareReports({ baseline, current });
    await writeJson(resolve(`${outputDir}/seo-regression.json`), comparison);
    console.log(`SEO regression: ${comparison.passed ? "PASS" : "BLOCK"}`);
    console.log(`New issues: ${comparison.newIssues.length}`);
    console.log(`Resolved issues: ${comparison.resolvedIssues.length}`);
    console.log(`Changed issues: ${comparison.changedIssues.length}`);
    if (!comparison.passed) process.exitCode = 1;
    return;
  }

  throw new Error(`Unknown SEO command: ${command}`);
}

run().catch((error) => {
  console.error(
    `[seo] ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
