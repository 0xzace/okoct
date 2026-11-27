import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const cli = "scripts/content-cli.mjs";

function run(...args: string[]): string {
  return execFileSync("node", [cli, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

describe("content CLI", () => {
  it("reports the initial brief plan without exposing private evidence", () => {
    const result = JSON.parse(run("content:list", "--json")) as {
      briefs: number;
      publicArticles: number;
      states: string[];
    };
    expect(result.briefs).toBe(12);
    expect(result.publicArticles).toBe(0);
    expect(result.states).toEqual(["brief"]);
  });

  it("runs deterministic validation, audit, coverage, and keyword reports", () => {
    expect(run("content:validate")).toContain("validation passed");
    expect(JSON.parse(run("content:audit", "--json"))).toMatchObject({
      summary: { errors: 0 },
    });
    expect(run("content:coverage", "--json")).toContain("TOP-001");
    expect(run("keyword:report", "--json")).toContain("KW-TH-0001");
  });

  it("cannot manufacture publication approval for an unapproved article", () => {
    expect(() => run("publication:check", "ART-001")).toThrow();
  });
});
