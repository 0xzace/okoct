import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const [command = "help", ...rawArgs] = process.argv.slice(2);
const json = rawArgs.includes("--json");
const source = await readFile(
  resolve(process.cwd(), "src/content-engine/data/planning.ts"),
  "utf8",
);
const titles = [
  ...source.matchAll(/const briefTitles = \[([\s\S]*?)\] as const;/g),
][0]?.[1]
  ? ([...source.matchAll(/const briefTitles = \[([\s\S]*?)\] as const;/g)][0][1]
      .match(/"([^"]+)"/g)
      ?.map((value) => value.slice(1, -1)) ?? [])
  : [];
const keywords = [
  ...source.matchAll(
    /\["(KW-[^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"(TOP-[^"]+)"\]/g,
  ),
].map((match) => ({
  id: match[1],
  keyword: match[2],
  locale: match[3],
  topicId: match[4],
  research: { searchVolume: null, keywordDifficulty: null, cpc: null },
  status: "candidate",
}));
const topics = [
  ...source.matchAll(
    /\["(TOP-[^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"(P[01])"\]/g,
  ),
].map((match) => ({
  id: match[1],
  slug: match[2],
  title: match[3],
  priority: match[4],
  publishedCount: 0,
  indexable: false,
}));

function write(value, human = "") {
  if (json) {
    console.log(JSON.stringify(value, null, 2));
  } else {
    console.log(human || JSON.stringify(value, null, 2));
  }
}

function fail(message) {
  console.error(`[content] error: ${message}`);
  process.exitCode = 1;
}

switch (command) {
  case "content:list":
    write(
      {
        briefs: titles.length,
        publicArticles: 0,
        states: titles.length > 0 ? ["brief"] : [],
        briefsById: titles.map((title, index) => ({
          id: `ART-${String(index + 1).padStart(3, "0")}`,
          title,
          state: "brief",
        })),
      },
      `${titles.length} brief(s), 0 public article(s)`,
    );
    break;
  case "content:status":
    write({
      articleId: rawArgs.find((value) => !value.startsWith("--")) ?? null,
      public: false,
      state: "brief",
      publication: "blocked",
    });
    break;
  case "content:validate": {
    try {
      const output = execFileSync(
        process.execPath,
        ["scripts/validate-content.mjs"],
        { encoding: "utf8" },
      );
      write({ ok: true, output }, "content validation passed");
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
    }
    break;
  }
  case "content:audit": {
    try {
      const output = execFileSync(
        process.execPath,
        ["scripts/content/audit.mjs"],
        { encoding: "utf8" },
      );
      const report = JSON.parse(output);
      write(
        report,
        `${report.summary.errors} error(s), ${report.summary.warnings} warning(s)`,
      );
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
    }
    break;
  }
  case "content:coverage":
    write(
      topics,
      `${topics.length} topic(s), all currently have zero published article(s)`,
    );
    break;
  case "keyword:report":
    write(
      keywords,
      `${keywords.length} candidate keyword(s), research metrics remain null`,
    );
    break;
  case "publication:check":
    fail(
      "No initial planning item has publication approval; a CLI command cannot manufacture review evidence.",
    );
    break;
  case "content:new":
  case "content:brief":
  case "content:links":
  case "content:withdraw":
  case "keyword:import":
  case "keyword:validate":
  case "keyword:mapping":
  case "reference:validate":
  case "reference:audit":
    write({
      command,
      allowed: true,
      changed: false,
      message:
        "Command is report-only until the required source records are supplied.",
    });
    break;
  default:
    write({
      commands: [
        "content:new",
        "content:brief",
        "content:list",
        "content:status",
        "content:validate",
        "content:audit",
        "content:coverage",
        "content:links",
        "content:withdraw",
        "keyword:import",
        "keyword:validate",
        "keyword:mapping",
        "keyword:report",
        "reference:validate",
        "reference:audit",
        "publication:check",
      ],
    });
}
