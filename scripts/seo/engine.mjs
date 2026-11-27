import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

export const RULE_VERSION = "0.4.0";
export const SEVERITIES = ["Critical", "Error", "Warning", "Notice", "Info"];

function unique(values) {
  return [...new Set(values)];
}

function parseAttributes(source) {
  const attributes = {};
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

function stripHtml(source) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeUrl(value, origin = "https://okoct.com") {
  let url;

  try {
    url = new URL(value, origin);
  } catch {
    return null;
  }

  const configuredOrigin = new URL(origin).origin;
  if (url.origin !== configuredOrigin) return null;

  url.hash = "";
  if (
    url.pathname !== "/" &&
    !url.pathname.endsWith("/") &&
    !extname(url.pathname)
  ) {
    url.pathname += "/";
  }

  return url.toString();
}

function extractTagAttributes(html, tagName) {
  const values = [];
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  let match;

  while ((match = pattern.exec(html)) !== null) {
    values.push(parseAttributes(match[1]));
  }

  return values;
}

function extractMeta(html, name) {
  const metas = extractTagAttributes(html, "meta");
  const entry = metas.find(
    (meta) => (meta.name ?? meta.property ?? "").toLowerCase() === name,
  );
  return entry?.content ?? "";
}

function extractTitle(html) {
  return (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonLd(html) {
  const values = [];
  const errors = [];
  const pattern =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    try {
      values.push(JSON.parse(match[1].trim()));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  return { values, errors };
}

function extractBodyIds(html) {
  return unique(
    [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]),
  );
}

export function parseHtmlSnapshot({ url, html, status = 200, headers = {} }) {
  const origin = new URL(url).origin;
  const jsonLd = extractJsonLd(html);
  const canonicalHref = extractTagAttributes(html, "link").find(
    (attributes) => attributes.rel?.toLowerCase() === "canonical",
  )?.href;
  let canonical = null;
  if (canonicalHref) {
    try {
      canonical = new URL(canonicalHref, url).toString();
    } catch {
      canonical = canonicalHref;
    }
  }
  const linkRefs = extractTagAttributes(html, "a")
    .map((attributes) => attributes.href)
    .filter(Boolean)
    .map((href) => {
      const target = new URL(href, url);
      return {
        href,
        url: normalizeUrl(href, url),
        fragment: target.hash.slice(1),
      };
    });
  const links = linkRefs.map((link) => link.url).filter(Boolean);
  const images = extractTagAttributes(html, "img").map((attributes) => ({
    src: attributes.src ?? "",
    alt: attributes.alt,
    width: attributes.width ? Number(attributes.width) : undefined,
    height: attributes.height ? Number(attributes.height) : undefined,
    loading: attributes.loading,
    fetchpriority: attributes.fetchpriority,
  }));
  const alternates = extractTagAttributes(html, "link")
    .filter(
      (attributes) =>
        attributes.rel?.toLowerCase() === "alternate" && attributes.hreflang,
    )
    .map((attributes) => ({
      hreflang: attributes.hreflang,
      href: normalizeUrl(attributes.href ?? "", url),
    }))
    .filter((alternate) => alternate.href);

  return {
    url: normalizeUrl(url, origin) ?? url,
    status,
    headers,
    html,
    language: html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] ?? "",
    title: extractTitle(html),
    description: extractMeta(html, "description"),
    robots: extractMeta(html, "robots").toLowerCase(),
    canonical,
    alternates,
    links: unique(links),
    linkRefs,
    images,
    jsonLd: jsonLd.values,
    jsonLdErrors: jsonLd.errors,
    headings: [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) =>
      Number(match[1]),
    ),
    bodyText: stripHtml(html),
    bodyIds: extractBodyIds(html),
    noindex: /\bnoindex\b/i.test(extractMeta(html, "robots")),
  };
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    else files.push(path);
  }

  return files.sort();
}

function fileToUrl(filePath, dist, origin) {
  const file = relative(dist, filePath).split(sep).join("/");
  if (!file.endsWith(".html")) return null;
  if (file === "404.html") return null;
  if (file === "index.html") return normalizeUrl("/", origin);
  if (file.endsWith("/index.html"))
    return normalizeUrl(`/${file.slice(0, -"index.html".length)}`, origin);
  return normalizeUrl(`/${file.slice(0, -".html".length)}/`, origin);
}

function extractSitemapUrls(xml, origin) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map((match) => normalizeUrl(match[1].trim(), origin) ?? match[1].trim())
    .filter(Boolean);
}

export async function crawlDist({
  dist,
  origin = "https://okoct.com",
  maxPages = 500,
}) {
  const root = resolve(dist);
  const files = await collectFiles(root);
  const pages = [];
  let robots = "";
  let sitemapXml = "";

  for (const filePath of files) {
    const name = relative(root, filePath).split(sep).join("/");
    if (name === "robots.txt") robots = await readFile(filePath, "utf8");
    if (name === "sitemap.xml") sitemapXml = await readFile(filePath, "utf8");
    const url = fileToUrl(filePath, root, origin);
    if (!url || pages.length >= maxPages) continue;
    pages.push(
      parseHtmlSnapshot({ url, html: await readFile(filePath, "utf8") }),
    );
  }

  pages.sort((first, second) => {
    if (first.url === `${new URL(origin).origin}/`) return -1;
    if (second.url === `${new URL(origin).origin}/`) return 1;
    return first.url.localeCompare(second.url);
  });

  return {
    origin: new URL(origin).origin,
    pages,
    robots,
    sitemapXml,
    sitemapUrls: extractSitemapUrls(sitemapXml, origin),
    discoveredUrls: unique(pages.flatMap((page) => page.links)),
    source: "dist",
  };
}

export async function crawlHttp({
  origin,
  maxPages = 100,
  maxDepth = 5,
  timeoutMs = 5000,
}) {
  const start = normalizeUrl(origin, origin);
  if (!start) throw new Error(`Invalid crawl origin: ${origin}`);
  const queue = [{ url: start, depth: 0 }];
  const seen = new Set();
  const pages = [];
  const headers = { accept: "text/html,application/xhtml+xml" };
  const controllerFor = () => AbortSignal.timeout(timeoutMs);

  while (queue.length > 0 && pages.length < maxPages) {
    const next = queue.shift();
    if (!next || seen.has(next.url) || next.depth > maxDepth) continue;
    seen.add(next.url);
    const response = await fetch(next.url, {
      headers,
      signal: controllerFor(),
    });
    const html = response.headers.get("content-type")?.includes("html")
      ? await response.text()
      : "";
    if (!html) continue;
    const page = parseHtmlSnapshot({
      url: next.url,
      html,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });
    pages.push(page);
    for (const link of page.links) {
      if (new URL(link).origin === new URL(origin).origin && !seen.has(link)) {
        queue.push({ url: link, depth: next.depth + 1 });
      }
    }
  }

  return {
    origin: new URL(origin).origin,
    pages,
    robots: "",
    sitemapXml: "",
    sitemapUrls: [],
    discoveredUrls: unique(pages.flatMap((page) => page.links)),
    source: "http",
  };
}

function makeIssue({
  ruleId,
  category,
  severity,
  url = "",
  description,
  evidence,
  suggestedFix,
}) {
  return {
    ruleId,
    category,
    severity,
    url,
    description,
    evidence,
    suggestedFix,
    detectedAt: new Date().toISOString(),
    ruleVersion: RULE_VERSION,
  };
}

export function analyzeMetadata(pages) {
  const issues = [];
  const titles = new Map();
  const descriptions = new Map();

  for (const page of pages) {
    if (page.noindex || page.status !== 200) continue;
    if (!page.title) {
      issues.push(
        makeIssue({
          ruleId: "META_TITLE_MISSING",
          category: "Metadata",
          severity: "Error",
          url: page.url,
          description: "Indexable page has no title.",
          evidence: "title is empty",
          suggestedFix: "Add a unique descriptive title.",
        }),
      );
    } else {
      titles.set(page.title, [...(titles.get(page.title) ?? []), page.url]);
    }
    if (!page.description) {
      issues.push(
        makeIssue({
          ruleId: "META_DESCRIPTION_MISSING",
          category: "Metadata",
          severity: "Error",
          url: page.url,
          description: "Indexable page has no meta description.",
          evidence: "description is empty",
          suggestedFix: "Add an accurate localized meta description.",
        }),
      );
    } else {
      descriptions.set(page.description, [
        ...(descriptions.get(page.description) ?? []),
        page.url,
      ]);
    }
  }

  for (const [title, urls] of titles) {
    if (urls.length < 2) continue;
    issues.push(
      makeIssue({
        ruleId: "META_TITLE_DUPLICATE",
        category: "Metadata",
        severity: "Warning",
        url: urls[0],
        description: "Multiple indexable pages share a title.",
        evidence: `${JSON.stringify({ title, urls })}`,
        suggestedFix: "Make titles specific to each page.",
      }),
    );
  }
  for (const [description, urls] of descriptions) {
    if (urls.length < 2) continue;
    issues.push(
      makeIssue({
        ruleId: "META_DESCRIPTION_DUPLICATE",
        category: "Metadata",
        severity: "Warning",
        url: urls[0],
        description: "Multiple indexable pages share a description.",
        evidence: `${JSON.stringify({ description, urls })}`,
        suggestedFix: "Make descriptions specific to each page.",
      }),
    );
  }

  return issues;
}

export function analyzeIndexability(pages) {
  return pages.map((page) => ({
    url: page.url,
    status: page.status,
    state:
      page.status >= 300 && page.status < 400
        ? "Redirected"
        : page.status !== 200
          ? "Unavailable"
          : page.noindex
            ? "Non-indexable"
            : "Indexable",
    reason: page.noindex
      ? "robots meta noindex"
      : page.status !== 200
        ? `HTTP ${page.status}`
        : "eligible by local technical checks",
  }));
}

export function analyzeCanonical(pages, origin = "https://okoct.com") {
  const issues = [];
  const urls = new Set(pages.map((page) => page.url));
  for (const page of pages) {
    if (page.noindex || page.status !== 200) continue;
    if (!page.canonical) {
      issues.push(
        makeIssue({
          ruleId: "CANONICAL_MISSING",
          category: "Canonical",
          severity: "Error",
          url: page.url,
          description: "Indexable page has no canonical URL.",
          evidence: "canonical is missing",
          suggestedFix: "Add a self-referencing canonical URL.",
        }),
      );
      continue;
    }
    if (new URL(page.canonical).origin !== new URL(origin).origin) {
      issues.push(
        makeIssue({
          ruleId: "CANONICAL_ORIGIN",
          category: "Canonical",
          severity: "Error",
          url: page.url,
          description: "Canonical URL uses a different origin.",
          evidence: page.canonical,
          suggestedFix: "Use the configured site origin.",
        }),
      );
    }
    if (!urls.has(page.canonical)) {
      issues.push(
        makeIssue({
          ruleId: "CANONICAL_TARGET",
          category: "Canonical",
          severity: "Error",
          url: page.url,
          description: "Canonical target is not present in the crawl.",
          evidence: page.canonical,
          suggestedFix: "Point canonical to an existing eligible URL.",
        }),
      );
    }
  }
  return issues;
}

export function analyzeSitemap(crawl) {
  const issues = [];
  const sitemapUrls = crawl.sitemapUrls;
  const seen = new Set();
  for (const url of sitemapUrls) {
    if (seen.has(url))
      issues.push(
        makeIssue({
          ruleId: "SITEMAP_DUPLICATE",
          category: "Sitemap",
          severity: "Error",
          url,
          description: "Sitemap contains a duplicate URL.",
          evidence: url,
          suggestedFix: "Emit each eligible URL once.",
        }),
      );
    seen.add(url);
    const page = crawl.pages.find((entry) => entry.url === url);
    if (!page)
      issues.push(
        makeIssue({
          ruleId: "SITEMAP_TARGET",
          category: "Sitemap",
          severity: "Error",
          url,
          description: "Sitemap URL was not found in the crawl.",
          evidence: url,
          suggestedFix: "Remove unavailable or redirect URLs from the sitemap.",
        }),
      );
    else if (page.noindex || page.status !== 200)
      issues.push(
        makeIssue({
          ruleId: "SITEMAP_NON_INDEXABLE",
          category: "Sitemap",
          severity: "Error",
          url,
          description: "Sitemap contains a non-indexable page.",
          evidence: `${page.status} ${page.robots}`,
          suggestedFix: "Include only published, indexable pages.",
        }),
      );
  }
  const expected = crawl.pages
    .filter((page) => page.status === 200 && !page.noindex)
    .map((page) => page.url);
  for (const url of expected) {
    if (!seen.has(url))
      issues.push(
        makeIssue({
          ruleId: "SITEMAP_MISSING",
          category: "Sitemap",
          severity: "Warning",
          url,
          description: "Eligible page is missing from the sitemap.",
          evidence: url,
          suggestedFix: "Add the eligible page to the sitemap.",
        }),
      );
  }
  return issues;
}

export function analyzeRobots(crawl) {
  const issues = [];
  if (!/^User-agent:\s*\*/im.test(crawl.robots))
    issues.push(
      makeIssue({
        ruleId: "ROBOTS_USER_AGENT",
        category: "Robots",
        severity: "Error",
        description: "robots.txt is missing a wildcard user-agent rule.",
        evidence: crawl.robots || "robots.txt is empty",
        suggestedFix: "Declare User-agent: *.",
      }),
    );
  if (!/^Sitemap:\s*\S+/im.test(crawl.robots))
    issues.push(
      makeIssue({
        ruleId: "ROBOTS_SITEMAP",
        category: "Robots",
        severity: "Warning",
        description: "robots.txt does not declare a sitemap.",
        evidence: crawl.robots || "robots.txt is empty",
        suggestedFix: "Declare the production sitemap URL.",
      }),
    );
  if (/^Disallow:\s*\/\s*$/im.test(crawl.robots))
    issues.push(
      makeIssue({
        ruleId: "ROBOTS_BLOCK_ALL",
        category: "Robots",
        severity: "Error",
        description: "robots.txt blocks the entire site.",
        evidence: "Disallow: /",
        suggestedFix: "Use an environment-appropriate crawl policy.",
      }),
    );
  return issues;
}

export function analyzeStructuredData(pages) {
  const issues = [];
  for (const page of pages) {
    for (const error of page.jsonLdErrors)
      issues.push(
        makeIssue({
          ruleId: "STRUCTURED_DATA_JSON",
          category: "Structured Data",
          severity: "Error",
          url: page.url,
          description: "JSON-LD is not valid JSON.",
          evidence: error,
          suggestedFix: "Emit valid JSON-LD from actual page data.",
        }),
      );
    for (const value of page.jsonLd) {
      const entries = Array.isArray(value) ? value : [value];
      for (const entry of entries) {
        if (entry?.["@context"] !== "https://schema.org" || !entry?.["@type"])
          issues.push(
            makeIssue({
              ruleId: "STRUCTURED_DATA_SCHEMA",
              category: "Structured Data",
              severity: "Error",
              url: page.url,
              description: "JSON-LD does not identify a Schema.org type.",
              evidence: JSON.stringify(entry),
              suggestedFix:
                "Use a valid Schema.org context and type supported by the real content.",
            }),
          );
      }
    }
  }
  return issues;
}

export function analyzeInternalLinks(crawl) {
  const issues = [];
  const pages = new Set(crawl.pages.map((page) => page.url));
  const inbound = new Map(crawl.pages.map((page) => [page.url, 0]));
  for (const page of crawl.pages) {
    for (const linkRef of page.linkRefs ??
      page.links.map((url) => ({ url, fragment: "" }))) {
      const link = linkRef.url;
      if (!link) continue;
      if (!pages.has(link)) {
        issues.push(
          makeIssue({
            ruleId: "LINK_BROKEN",
            category: "Internal Links",
            severity: "Error",
            url: page.url,
            description: "Internal link target was not found in the crawl.",
            evidence: link,
            suggestedFix: "Fix the link or publish the target page.",
          }),
        );
      } else inbound.set(link, (inbound.get(link) ?? 0) + 1);
      if (linkRef.fragment) {
        const target = crawl.pages.find((candidate) => candidate.url === link);
        if (target && !target.bodyIds.includes(linkRef.fragment)) {
          issues.push(
            makeIssue({
              ruleId: "LINK_ANCHOR_INVALID",
              category: "Internal Links",
              severity: "Warning",
              url: page.url,
              description:
                "Internal link anchor does not exist on the target page.",
              evidence: `${link}#${linkRef.fragment}`,
              suggestedFix: "Fix the fragment or add the referenced target id.",
            }),
          );
        }
      }
    }
  }
  for (const [url, count] of inbound)
    if (count === 0 && url !== `${crawl.origin}/`)
      issues.push(
        makeIssue({
          ruleId: "LINK_ORPHAN",
          category: "Internal Links",
          severity: "Warning",
          url,
          description: "Page has no inbound internal links.",
          evidence: "inbound links: 0",
          suggestedFix: "Add a meaningful contextual link where appropriate.",
        }),
      );
  return issues;
}

export function analyzeHreflang(crawl) {
  const issues = [];
  const pages = new Set(crawl.pages.map((page) => page.url));
  const allowed = new Set(["th", "en", "zh-Hans", "x-default"]);
  for (const page of crawl.pages) {
    if (page.noindex || page.status !== 200) continue;
    const locales = new Set();
    for (const alternate of page.alternates) {
      if (!allowed.has(alternate.hreflang))
        issues.push(
          makeIssue({
            ruleId: "HREFLANG_LOCALE",
            category: "Hreflang",
            severity: "Error",
            url: page.url,
            description: "Hreflang uses an unsupported locale.",
            evidence: alternate.hreflang,
            suggestedFix: "Use an approved locale code.",
          }),
        );
      if (locales.has(alternate.hreflang))
        issues.push(
          makeIssue({
            ruleId: "HREFLANG_DUPLICATE",
            category: "Hreflang",
            severity: "Error",
            url: page.url,
            description: "Page has duplicate hreflang locale entries.",
            evidence: alternate.hreflang,
            suggestedFix: "Emit one target per locale.",
          }),
        );
      locales.add(alternate.hreflang);
      if (!pages.has(alternate.href))
        issues.push(
          makeIssue({
            ruleId: "HREFLANG_TARGET",
            category: "Hreflang",
            severity: "Error",
            url: page.url,
            description: "Hreflang target is not available in the crawl.",
            evidence: alternate.href,
            suggestedFix:
              "Remove the relation or publish the reviewed translation.",
          }),
        );
      const target = crawl.pages.find((entry) => entry.url === alternate.href);
      if (
        alternate.hreflang !== "x-default" &&
        target &&
        !target.alternates.some((entry) => entry.href === page.url)
      )
        issues.push(
          makeIssue({
            ruleId: "HREFLANG_RECIPROCAL",
            category: "Hreflang",
            severity: "Error",
            url: page.url,
            description: "Hreflang relation is not reciprocal.",
            evidence: `${page.url} -> ${alternate.href}`,
            suggestedFix: "Add the reciprocal alternate relation.",
          }),
        );
    }
    if (
      !page.noindex &&
      page.status === 200 &&
      page.alternates.length > 0 &&
      !page.alternates.some((entry) => entry.href === page.url)
    )
      issues.push(
        makeIssue({
          ruleId: "HREFLANG_SELF",
          category: "Hreflang",
          severity: "Error",
          url: page.url,
          description: "Localized page is missing a self hreflang reference.",
          evidence: page.url,
          suggestedFix: "Include the page's own locale and URL.",
        }),
      );
  }
  return issues;
}

export function analyzeImages(pages) {
  const issues = [];
  for (const page of pages)
    for (const image of page.images) {
      if (image.alt === undefined)
        issues.push(
          makeIssue({
            ruleId: "IMAGE_ALT_MISSING",
            category: "Images",
            severity: "Error",
            url: page.url,
            description: "Image has no alt attribute.",
            evidence: image.src,
            suggestedFix:
              "Add meaningful alt text or an empty alt for a decorative image.",
          }),
        );
      if (!image.width || !image.height)
        issues.push(
          makeIssue({
            ruleId: "IMAGE_DIMENSIONS_MISSING",
            category: "Images",
            severity: "Warning",
            url: page.url,
            description: "Image has no intrinsic dimensions.",
            evidence: image.src,
            suggestedFix: "Provide dimensions or use Astro image metadata.",
          }),
        );
    }
  return issues;
}

function normalizedBody(page) {
  return page.bodyText
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, "url")
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzeDuplicates(pages) {
  const issues = [];
  const byLocale = new Map();
  for (const page of pages) {
    const locale = page.language || "unknown";
    const hash = normalizedBody(page);
    const key = `${locale}:${hash}`;
    byLocale.set(key, [...(byLocale.get(key) ?? []), page.url]);
  }
  for (const [key, urls] of byLocale)
    if (urls.length > 1)
      issues.push(
        makeIssue({
          ruleId: "DUPLICATE_BODY",
          category: "Content",
          severity: "Warning",
          url: urls[0],
          description: "Same-locale pages have identical normalized body text.",
          evidence: JSON.stringify({ key: key.slice(0, 48), urls }),
          suggestedFix:
            "Review whether the pages should be consolidated or differentiated.",
        }),
      );
  return issues;
}

export function analyzeKeywordMappings(mappings = []) {
  const issues = [];
  const primary = new Map();
  for (const mapping of mappings) {
    if (!mapping.primary) continue;
    primary.set(mapping.keyword, [
      ...(primary.get(mapping.keyword) ?? []),
      mapping.url,
    ]);
  }
  for (const [keyword, urls] of primary)
    if (unique(urls).length > 1)
      issues.push(
        makeIssue({
          ruleId: "KEYWORD_MULTIPLE_PRIMARY",
          category: "Keywords",
          severity: "Notice",
          url: urls[0],
          description: "A keyword has multiple primary page candidates.",
          evidence: JSON.stringify({ keyword, urls }),
          suggestedFix:
            "Review intent and choose one primary page candidate; this is not proof of ranking cannibalization.",
        }),
      );
  return issues;
}

export function analyzeRedirects(redirects = []) {
  const issues = [];
  const graph = new Map(
    redirects.map((redirect) => [redirect.from, redirect.to]),
  );
  for (const redirect of redirects) {
    const visited = new Set([redirect.from]);
    let target = redirect.to;
    let hops = 0;
    while (graph.has(target) && hops < 100) {
      if (visited.has(target)) {
        issues.push(
          makeIssue({
            ruleId: "REDIRECT_LOOP",
            category: "Redirects",
            severity: "Error",
            url: redirect.from,
            description: "Redirect rules form a loop.",
            evidence: [...visited, target].join(" -> "),
            suggestedFix: "Break the redirect cycle.",
          }),
        );
        break;
      }
      visited.add(target);
      target = graph.get(target);
      hops += 1;
    }
    if (hops > 0 && ![...visited].includes(target))
      issues.push(
        makeIssue({
          ruleId: "REDIRECT_CHAIN",
          category: "Redirects",
          severity: "Warning",
          url: redirect.from,
          description: "Redirect rules form a chain.",
          evidence: `${redirect.from} -> ${redirect.to} -> ${target}`,
          suggestedFix: "Point the old URL directly to the final destination.",
        }),
      );
  }
  return issues;
}

export function analyzeCompliance(crawl) {
  const issues = [];
  const markers =
    /editorial\/|seo-lab\/|REVREC-|APPROVAL-|BRIEF-\d+|review-pending|V0\.1 test content|v0-1-test-content/i;
  for (const page of crawl.pages)
    if (markers.test(page.html))
      issues.push(
        makeIssue({
          ruleId: "CONTENT_LEAKAGE",
          category: "Compliance",
          severity: "Critical",
          url: page.url,
          description:
            "Public crawl output contains an internal or unapproved content marker.",
          evidence: page.html.match(markers)?.[0] ?? "marker",
          suggestedFix:
            "Remove the unapproved content from the public build and publication inputs.",
        }),
      );
  return issues;
}

export function performancePending() {
  return {
    status: "Pending",
    source: "laboratory-only",
    metrics: [],
    note: "No field Core Web Vitals or real-user INP data is inferred from this local audit.",
  };
}

/**
 * @param {{ crawl: object, origin?: string, mappings?: Array<{ keyword?: string, url?: string, primary?: boolean }>, redirects?: Array<{ from: string, to: string }>, performance?: object }} options
 */
export function analyzeCrawl({
  crawl,
  origin = crawl.origin,
  mappings = [],
  redirects = [],
  performance,
} = {}) {
  const indexability = analyzeIndexability(crawl.pages);
  const linkIssues = analyzeInternalLinks(crawl);
  const issues = [
    ...analyzeMetadata(crawl.pages),
    ...analyzeCanonical(crawl.pages, origin),
    ...analyzeSitemap(crawl),
    ...analyzeRobots(crawl),
    ...analyzeStructuredData(crawl.pages),
    ...linkIssues,
    ...analyzeHreflang(crawl),
    ...analyzeImages(crawl.pages),
    ...analyzeDuplicates(crawl.pages),
    ...analyzeKeywordMappings(mappings),
    ...analyzeRedirects(redirects),
    ...analyzeCompliance(crawl),
  ];
  const counts = Object.fromEntries(
    SEVERITIES.map((severity) => [
      severity,
      issues.filter((issue) => issue.severity === severity).length,
    ]),
  );
  return {
    generatedAt: new Date().toISOString(),
    ruleVersion: RULE_VERSION,
    origin: new URL(origin).origin,
    source: crawl.source,
    crawledUrls: crawl.pages.length,
    indexability,
    pages: crawl.pages.map((page) => ({
      url: page.url,
      status: page.status,
      language: page.language,
      title: page.title,
      description: page.description,
      canonical: page.canonical,
      noindex: page.noindex,
      links: page.links,
      alternates: page.alternates,
    })),
    internalLinks: crawl.pages.map((page) => ({
      url: page.url,
      outbound: page.links,
      inbound: crawl.pages
        .filter((candidate) => candidate.links.includes(page.url))
        .map((candidate) => candidate.url),
    })),
    performance: performance ?? performancePending(),
    issues,
    summary: {
      crawledUrls: crawl.pages.length,
      indexableUrls: indexability.filter((entry) => entry.state === "Indexable")
        .length,
      brokenLinks: linkIssues.filter((issue) => issue.ruleId === "LINK_BROKEN")
        .length,
      ...counts,
    },
  };
}

/**
 * @param {{ dist?: string, origin?: string, mappings?: Array<{ keyword?: string, url?: string, primary?: boolean }>, redirects?: Array<{ from: string, to: string }>, performance?: object }} options
 */
export async function analyzeSite({
  dist = "dist",
  origin = "https://okoct.com",
  mappings = [],
  redirects = [],
  performance,
} = {}) {
  const crawl = await crawlDist({ dist, origin });
  return analyzeCrawl({ crawl, origin, mappings, redirects, performance });
}

export function evaluateQualityGate(
  report,
  { blockSeverities = ["Critical", "Error"] } = {},
) {
  const blockingIssues = report.issues.filter((issue) =>
    blockSeverities.includes(issue.severity),
  );
  return {
    passed: blockingIssues.length === 0,
    blockingIssues,
    checkedAt: new Date().toISOString(),
    policy: { blockSeverities },
  };
}

function issueKey(issue) {
  return `${issue.ruleId}|${issue.url}|${issue.evidence}`;
}

export function compareReports({ baseline, current }) {
  const before = new Map(
    baseline.issues.map((issue) => [issueKey(issue), issue]),
  );
  const after = new Map(
    current.issues.map((issue) => [issueKey(issue), issue]),
  );
  const newIssues = [...after.entries()]
    .filter(([key]) => !before.has(key))
    .map(([, issue]) => issue);
  const resolvedIssues = [...before.entries()]
    .filter(([key]) => !after.has(key))
    .map(([, issue]) => issue);
  const changedIssues = [];
  for (const [key, issue] of after) {
    const old = before.get(key);
    if (old && old.severity !== issue.severity)
      changedIssues.push({ before: old, after: issue });
  }
  return {
    generatedAt: new Date().toISOString(),
    baselineGeneratedAt: baseline.generatedAt,
    currentGeneratedAt: current.generatedAt,
    newIssues,
    resolvedIssues,
    changedIssues,
    passed: newIssues.every(
      (issue) => !["Critical", "Error"].includes(issue.severity),
    ),
  };
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${(text ?? "").replaceAll('"', '""')}"`;
}

export async function renderReports(report, outputDir) {
  const dir = resolve(outputDir);
  const gate = evaluateQualityGate(report);
  const summary = {
    ...report.summary,
    qualityGate: gate.passed ? "PASS" : "BLOCK",
    generatedAt: report.generatedAt,
    ruleVersion: report.ruleVersion,
  };
  const csv = [
    "ruleId,category,severity,url,description,evidence,suggestedFix",
    ...report.issues.map((issue) =>
      [
        issue.ruleId,
        issue.category,
        issue.severity,
        issue.url,
        issue.description,
        issue.evidence,
        issue.suggestedFix,
      ]
        .map(csvCell)
        .join(","),
    ),
  ].join("\n");
  const files = {
    "SEO-AUDIT-REPORT.md": `# OKOCT Health SEO Audit Report\n\n- Generated: ${report.generatedAt}\n- Crawled URLs: ${report.summary.crawledUrls}\n- Indexable URLs: ${report.summary.indexableUrls}\n- Critical: ${report.summary.Critical}\n- Errors: ${report.summary.Error}\n- Warnings: ${report.summary.Warning}\n- SEO Quality Gate: ${gate.passed ? "PASS" : "BLOCK"}\n\n## Issues\n\n${report.issues.length ? report.issues.map((issue) => `- [${issue.severity}] ${issue.ruleId} ${issue.url}: ${issue.description} — ${issue.evidence}`).join("\n") : "No issues detected."}\n`,
    "seo-audit.json": JSON.stringify(report, null, 2),
    "seo-issues.csv": csv,
    "seo-summary.json": JSON.stringify(summary, null, 2),
    "crawl-report.json": JSON.stringify(
      {
        crawledUrls: report.crawledUrls,
        pages: report.pages,
        source: report.source,
      },
      null,
      2,
    ),
    "internal-links.json": JSON.stringify(report.internalLinks, null, 2),
    "indexability-report.json": JSON.stringify(report.indexability, null, 2),
    "performance-report.json": JSON.stringify(report.performance, null, 2),
  };
  await import("node:fs/promises").then(({ mkdir }) =>
    mkdir(dir, { recursive: true }),
  );
  await Promise.all(
    Object.entries(files).map(([name, content]) =>
      writeFile(join(dir, name), content),
    ),
  );
  return { outputDir: dir, files: Object.keys(files), gate };
}

export async function writeJson(path, value) {
  await writeFile(resolve(path), JSON.stringify(value, null, 2));
}
