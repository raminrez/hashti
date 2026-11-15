import { expect, test } from "bun:test";
import { getInitials } from "./avatar";

test("getInitials handles Latin names", () => {
  expect(getInitials("John Doe")).toBe("JD");
  expect(getInitials("Cher")).toBe("C");
  expect(getInitials("  spaced   out  ")).toBe("so");
});

test("getInitials handles Persian names grapheme-safely", () => {
  // رامین رضایی — first grapheme of each word, not a surrogate half
  expect(getInitials("رامین رضایی")).toBe("را".charAt(0) + "رض".charAt(0));
  expect(getInitials("علی")).toBe("ع");
});

test("getInitials handles ZWNJ-joined words", () => {
  // می‌شود contains U+200C ZWNJ; a split must not produce ZWNJ as an initial
  const initials = getInitials("می‌شود شود");
  expect(initials).not.toContain("\u200c");
  expect(initials.length).toBe(2);
});

test("getInitials handles empty and whitespace-only input", () => {
  expect(getInitials("")).toBe("");
  expect(getInitials("   ")).toBe("");
});
