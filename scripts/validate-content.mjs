import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(process.cwd(), "src/content");
const validStates = new Set([
  "draft",
  "fact-check-pending",
  "medical-review-pending",
  "compliance-review-pending",
  "translation-review-pending",
  "approved",
  "published",
  "archived",
]);
const validLocales = new Set(["th", "en", "zh-Hans"]);
const errors = [];
const files = [];

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await collectMarkdownFiles(entryPath);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
}

function parseFrontmatter(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    errors.push(`${filePath}: missing frontmatter`);
    return null;
  }

  const values = {};

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");

    if (separator < 1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

function validateEntry(values, filePath) {
  const requiredFields = [
    "title",
    "description",
    "locale",
    "state",
    "visibility",
    "indexable",
    "sources",
  ];

  for (const field of requiredFields) {
    if (!(field in values)) {
      errors.push(`${filePath}: missing ${field}`);
    }
  }

  if (!validLocales.has(values.locale)) {
    errors.push(`${filePath}: unsupported locale ${values.locale}`);
  }

  if (!validStates.has(values.state)) {
    errors.push(`${filePath}: unsupported content state ${values.state}`);
  }

  const indexable = values.indexable === "true";

  if (
    values.state !== "published" &&
    (values.visibility === "public" || indexable)
  ) {
    errors.push(
      `${filePath}: non-published content cannot be public or indexable`,
    );
  }

  if (values.state === "published") {
    const requiredPublishedFields = [
      "author",
      "medicalReviewer",
      "factCheckedAt",
      "medicallyReviewedAt",
      "complianceReviewedAt",
      "translationReviewedAt",
      "publishedAt",
    ];

    if (
      values.visibility !== "public" ||
      !indexable ||
      values.sources === "[]"
    ) {
      errors.push(
        `${filePath}: published content is missing public/indexable/source requirements`,
      );
    }

    for (const field of requiredPublishedFields) {
      if (!values[field]) {
        errors.push(`${filePath}: published content is missing ${field}`);
      }
    }
  }

  return (
    values.state === "published" && values.visibility === "public" && indexable
  );
}

await collectMarkdownFiles(root);

let publicCount = 0;

for (const filePath of files) {
  const relativePath = relative(process.cwd(), filePath);
  const content = await readFile(filePath, "utf8");
  const values = parseFrontmatter(content, relativePath);

  if (!values) {
    continue;
  }

  if (validateEntry(values, relativePath)) {
    publicCount += 1;
    console.log(`[content] public: ${relativePath}`);
  } else {
    console.log(
      `[content] excluded: ${relativePath} (${values.state}/${values.visibility})`,
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[content] error: ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `[content] validation passed: ${files.length} file(s), ${publicCount} public, ${files.length - publicCount} excluded`,
  );
}
