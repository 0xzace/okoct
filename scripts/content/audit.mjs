import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.cwd(), "src/content/articles");
const errors = [];

async function visit(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!/\.(md|mdx)$/.test(entry.name)) continue;
    const source = await readFile(path, "utf8");
    const state = source.match(/^state:\s*['"]?([^'"\n]+)['"]?/m)?.[1]?.trim();
    const visibility = source
      .match(/^visibility:\s*['"]?([^'"\n]+)['"]?/m)?.[1]
      ?.trim();
    const indexable = source.match(/^indexable:\s*(true|false)/m)?.[1];
    if (
      state !== "published" &&
      (visibility === "public" || indexable === "true")
    ) {
      errors.push({ code: "unpublished-content-leakage", file: path });
    }
  }
}

await visit(root);
const report = {
  errors,
  warnings: [],
  information: [],
  summary: { errors: errors.length, warnings: 0, information: 0 },
};
console.log(JSON.stringify(report, null, 2));
if (errors.length > 0) process.exitCode = 1;
