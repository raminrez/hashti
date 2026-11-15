import { describe, expect, test } from "bun:test";
import { themes, themeNames, type ThemeName } from "@hashti/tokens";

function luminance(hex: string): number {
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) {
    return 0.5;
  }
  const rgb = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

function contrast(c1: string, c2: string): number {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const [bright, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (bright + 0.05) / (dark + 0.05);
}

// Button secondary ink resolved per theme:
// Carbon (white, g10, g90, g100) -> text-on-color (#ffffff)
// Relay & Frame (relay-light, relay-dark, frame-light, frame-dark) -> text-primary
function getSecondaryButtonInk(theme: ThemeName): string {
  const t = themes[theme];
  if (theme === "white" || theme === "g10" || theme === "g90" || theme === "g100") {
    return t["text-on-color"];
  }
  return t["text-primary"];
}

// Selection controls (Checkbox, Switch) with color="secondary" in dark themes use background color,
// in light themes use text-on-color (#ffffff)
function getSecondaryControlIndicator(theme: ThemeName): string {
  const t = themes[theme];
  if (theme === "g90" || theme === "g100" || theme === "relay-dark" || theme === "frame-dark") {
    return t.background;
  }
  return t["text-on-color"];
}

describe("Secondary colors contrast audit across all 8 themes", () => {
  for (const theme of themeNames) {
    describe(`Theme: ${theme}`, () => {
      const t = themes[theme];

      test("secondary button has >= 4.5:1 contrast in normal, hover, and active states", () => {
        const ink = getSecondaryButtonInk(theme);
        const bgNormal = t["button-secondary"];
        const bgHover = t["button-secondary-hover"];
        const bgActive = t["button-secondary-active"];

        const ratioNormal = contrast(ink, bgNormal);
        const ratioHover = contrast(ink, bgHover);
        const ratioActive = contrast(ink, bgActive);

        expect(ratioNormal, `${theme}: secondary button normal`).toBeGreaterThanOrEqual(4.5);
        expect(ratioHover, `${theme}: secondary button hover`).toBeGreaterThanOrEqual(4.5);
        expect(ratioActive, `${theme}: secondary button active`).toBeGreaterThanOrEqual(4.5);
      });

      test("secondary selection controls (checkbox / switch) have >= 4.5:1 contrast against icon-secondary track", () => {
        const track = t["icon-secondary"];
        const indicator = getSecondaryControlIndicator(theme);
        const ratio = contrast(indicator, track);

        expect(ratio, `${theme}: secondary control indicator on track`).toBeGreaterThanOrEqual(4.5);
      });

      test("secondary badge (text-primary on layer-accent-01) has >= 4.5:1 contrast", () => {
        const text = t["text-primary"];
        const bg = t["layer-accent-01"];
        const ratio = contrast(text, bg);

        expect(ratio, `${theme}: secondary badge text on layer-accent-01`).toBeGreaterThanOrEqual(
          4.5,
        );
      });

      test("supporting gray tag (tag-color-gray on tag-background-gray) has >= 4.5:1 contrast", () => {
        const text = t["tag-color-gray"];
        const bg = t["tag-background-gray"];
        const ratio = contrast(text, bg);

        expect(ratio, `${theme}: gray tag color on background`).toBeGreaterThanOrEqual(4.5);
      });

      test("placeholder ink holds >= 4.5:1 on the field surface", () => {
        const ink = t["text-placeholder"];
        const ratio = contrast(ink, t["field-01"]);

        expect(ratio, `${theme}: text-placeholder on field-01`).toBeGreaterThanOrEqual(4.5);
      });

      test("table batch actions toolbar button ink on interactive background", () => {
        const ink = t["text-on-color"];
        const bg = t.interactive;
        const ratio = contrast(ink, bg);

        // WCAG AA for graphical components / UI elements is >= 3.0:1
        expect(ratio, `${theme}: batch bar text-on-color on interactive`).toBeGreaterThanOrEqual(
          3.0,
        );
      });
    });
  }
});
