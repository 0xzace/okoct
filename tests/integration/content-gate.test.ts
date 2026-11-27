import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("content validation command", () => {
  it("accepts the V0.1 test fixture and reports it as excluded", () => {
    const output = execFileSync("node", ["scripts/validate-content.mjs"], {
      cwd: resolve(process.cwd()),
      encoding: "utf8",
    });

    expect(output).toContain("excluded");
    expect(output).toContain("v0-1-test-content.md");
  });
});
