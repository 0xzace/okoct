import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const publicPages = [
  ["index.html", "en", "https://okoct.com/"],
  ["th/index.html", "th", "https://okoct.com/th/"],
  ["en/index.html", "en", "https://okoct.com/en/"],
  ["zh/index.html", "zh-Hans", "https://okoct.com/zh/"],
  ["th/about/index.html", "th", "https://okoct.com/th/about/"],
  ["en/about/index.html", "en", "https://okoct.com/en/about/"],
  ["zh/about/index.html", "zh-Hans", "https://okoct.com/zh/about/"],
  ["th/safety/index.html", "th", "https://okoct.com/th/safety/"],
  ["en/safety/index.html", "en", "https://okoct.com/en/safety/"],
];
const errors = [];

async function exists(path) {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

async function readOutput(relativePath) {
  const filePath = resolve(dist, relativePath);

  if (!(await exists(filePath))) {
    errors.push(`missing build output: ${relativePath}`);
    return "";
  }

  return readFile(filePath, "utf8");
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function validatePage(relativePath, language, canonical, html) {
  if (!html.includes(`<html lang="${language}"`)) {
    errors.push(`${relativePath}: incorrect html language`);
  }

  if (!/<title>[^<]+<\/title>/.test(html)) {
    errors.push(`${relativePath}: missing title`);
  }

  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    errors.push(`${relativePath}: missing description`);
  }

  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    errors.push(`${relativePath}: incorrect canonical`);
  }

  try {
    const canonicalUrl = new URL(canonical);

    if (
      canonicalUrl.origin !== "https://okoct.com" ||
      (canonicalUrl.pathname !== "/" && !canonicalUrl.pathname.endsWith("/"))
    ) {
      errors.push(`${relativePath}: malformed canonical URL`);
    }
  } catch {
    errors.push(`${relativePath}: malformed canonical URL`);
  }

  if (!html.includes(`hreflang="${language}"`)) {
    errors.push(`${relativePath}: missing self hreflang`);
  }
}

for (const [relativePath, language, canonical] of publicPages) {
  const html = await readOutput(relativePath);

  if (html) {
    validatePage(relativePath, language, canonical, html);
  }
}

const sitemap = await readOutput("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const expectedUrls = publicPages.map(([, , canonical]) => canonical).sort();

if (JSON.stringify(sitemapUrls.sort()) !== JSON.stringify(expectedUrls)) {
  errors.push("sitemap does not exactly match the public page set");
}

const robots = await readOutput("robots.txt");

for (const requiredLine of [
  "User-agent: *",
  "Allow: /",
  "Sitemap: https://okoct.com/sitemap.xml",
]) {
  if (!robots.includes(requiredLine)) {
    errors.push(`robots.txt: missing ${requiredLine}`);
  }
}

if (await exists(dist)) {
  const files = await collectFiles(dist);

  for (const filePath of files) {
    if (!/\.(html|xml|txt|js|css)$/.test(filePath)) {
      continue;
    }

    const content = await readFile(filePath, "utf8");

    if (
      content.includes("V0.1 test content") ||
      content.includes("v0-1-test-content")
    ) {
      errors.push(
        `${relative(process.cwd(), filePath)}: contains excluded test content`,
      );
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[build] error: ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `[build] SEO validation passed: ${publicPages.length} public pages`,
  );
}
