import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/styles/global.css"),
  "utf8",
);

function contrastRatio(first: string, second: string): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const toLuminance = (value: string) => {
    const channels = value
      .slice(1)
      .match(/.{2}/g)
      ?.map((channel) => toLinear(Number.parseInt(channel, 16)));

    if (!channels || channels.length !== 3) {
      throw new Error(`Invalid color: ${value}`);
    }

    const [red, green, blue] = channels;

    if (red === undefined || green === undefined || blue === undefined) {
      throw new Error(`Invalid color: ${value}`);
    }

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const firstLuminance = toLuminance(first);
  const secondLuminance = toLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("V0.2 design tokens and brand assets", () => {
  it("defines the semantic token layers used by components", () => {
    for (const token of [
      "--color-ink-950",
      "--color-canvas",
      "--color-signal",
      "--color-evidence",
      "--color-on-brand",
      "--color-evidence-strong",
      "--space-4",
      "--radius-card",
      "--shadow-card",
      "--motion-fast",
      "--z-header",
    ]) {
      expect(css).toContain(token);
    }
  });

  it("keeps normal text colors above WCAG AA contrast targets", () => {
    expect(css).toContain("--color-on-brand: #0b252b");
    expect(css).toContain("--color-evidence-strong: #765017");
    expect(contrastRatio("#0b252b", "#6ed7c5")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#765017", "#ffffff")).toBeGreaterThanOrEqual(4.5);
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
