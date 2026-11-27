import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/styles/global.css"),
  "utf8",
);

describe("V0.2 design tokens and brand assets", () => {
  it("defines the semantic token layers used by components", () => {
    for (const token of [
      "--color-ink-950",
      "--color-canvas",
      "--color-signal",
      "--color-evidence",
      "--space-4",
      "--radius-card",
      "--shadow-card",
      "--motion-fast",
      "--z-header",
    ]) {
      expect(css).toContain(token);
    }
  });

  it("ships the local brand assets without medical claims", () => {
    for (const asset of [
      "public/favicon.svg",
      "public/brand/okoct-mark.svg",
      "public/brand/okoct-wordmark.svg",
      "public/brand/okoct-social-preview.svg",
    ]) {
      expect(existsSync(resolve(process.cwd(), asset))).toBe(true);
    }

    const socialPreview = readFileSync(
      resolve(process.cwd(), "public/brand/okoct-social-preview.svg"),
      "utf8",
    );

    expect(socialPreview).not.toMatch(
      /doctor|hospital|cure|guarantee|medicine/i,
    );
  });
});
