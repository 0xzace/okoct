import { describe, expect, it } from "vitest";

import {
  canTransition,
  transitionLifecycle,
} from "../../../src/content-engine/lifecycle/state-machine";

describe("content lifecycle state machine", () => {
  it("allows only the documented next states", () => {
    expect(canTransition("draft", "fact-check-pending")).toBe(true);
    expect(canTransition("published", "withdrawn")).toBe(true);
    expect(canTransition("draft", "published")).toBe(false);
  });

  it("rejects invalid transitions and records valid transitions", () => {
    expect(() =>
      transitionLifecycle(
        { id: "ART-000001-EN", state: "draft", revision: 1 },
        "published",
        "editor",
        new Date("2026-11-27"),
      ),
    ).toThrow(/Invalid lifecycle transition/);

    expect(
      transitionLifecycle(
        { id: "ART-000001-EN", state: "draft", revision: 1 },
        "fact-check-pending",
        "editor",
        new Date("2026-11-27"),
      ),
    ).toEqual({
      articleId: "ART-000001-EN",
      from: "draft",
      to: "fact-check-pending",
      revision: 1,
      actor: "editor",
      occurredAt: new Date("2026-11-27"),
    });
  });
});
