import { describe, expect, test } from "bun:test";
import { join } from "./index";

describe("join", () => {
  test("prepends the base class to a string className", () => {
    expect(join("hashti-badge", "extra")).toBe("hashti-badge extra");
  });

  test("returns the base alone when className is undefined", () => {
    expect(join("hashti-badge", undefined)).toBe("hashti-badge");
  });

  test("returns the base alone when className is an empty string", () => {
    expect(join("hashti-badge", "")).toBe("hashti-badge");
  });

  test("wraps a function className: prepends the base to its result", () => {
    const fn = join<{ open: boolean }>("hashti-popover", (state) =>
      state.open ? "is-open" : undefined,
    );
    if (typeof fn === "function") {
      expect(fn({ open: true })).toBe("hashti-popover is-open");
      expect(fn({ open: false })).toBe("hashti-popover");
    } else {
      throw new Error("join should return a function for a function className");
    }
  });

  test("wraps a function className that returns undefined: base alone", () => {
    const fn = join("hashti-tabs", () => undefined);
    if (typeof fn === "function") {
      expect(fn({})).toBe("hashti-tabs");
    } else {
      throw new Error("join should return a function for a function className");
    }
  });
});
