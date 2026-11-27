import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const url = process.argv[2] ?? "http://127.0.0.1:4322/th/";
const output = resolve(process.argv[3] ?? "seo-lab/reports/lighthouse.json");

await mkdir(resolve("seo-lab/reports"), { recursive: true });

const command = spawn(
  "pnpm",
  [
    "exec",
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${output}`,
    "--chrome-flags=--headless --no-sandbox",
  ],
  { stdio: "inherit" },
);

const exitCode = await new Promise((resolveExit) => {
  command.on("error", (error) => {
    console.error(`[seo:lighthouse] ${error.message}`);
    resolveExit(1);
  });
  command.on("exit", (code) => resolveExit(code ?? 1));
});

if (exitCode === 0) {
  const metadata = {
    type: "laboratory",
    url,
    generatedAt: new Date().toISOString(),
    note: "Lighthouse laboratory data is not field Core Web Vitals and does not prove Google ranking or indexing.",
  };
  await writeFile(`${output}.meta.json`, JSON.stringify(metadata, null, 2));
}

process.exitCode = exitCode;
