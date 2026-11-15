import { afterAll, expect, test } from "bun:test";
import { audit, bounds, ink, stopStorybook, withStory } from "../harness";

// The 2026-11 navigation review turned three visual complaints into numbers: a disclosure whose
// body did not line up with its title, a switcher whose segments were too short and too pale, and
// a tab indicator that painted a second line above the list's hairline.

afterAll(stopStorybook);

for (const theme of ["frame-light", "frame-dark"] as const) {
  test(`disclosure: body text starts where the trigger title starts (${theme})`, async () => {
    await withStory(
      "navigation-disclosure--playground",
      async (page) => {
        const title = await bounds(page.locator(".hashti-disclosure-trigger > span").first());
        const body = await bounds(page.locator(".hashti-disclosure-panel-inner > *").first());
        expect(Math.abs(body.x - title.x)).toBeLessThanOrEqual(1);
      },
      { theme },
    );
  });

  test(`disclosure: expanded row paints one surface, not a card inside the row (${theme})`, async () => {
    await withStory(
      "navigation-disclosure--playground",
      async (page) => {
        const row = await ink(page.locator(".hashti-disclosure-trigger > span").first());
        const panel = await ink(page.locator(".hashti-disclosure-panel-inner > *").first());
        // Same surface behind trigger and panel: the row is one block.
        expect(panel.background).toBe(row.background);
        const { height } = await bounds(page.locator(".hashti-disclosure-trigger").first());
        expect(height).toBeGreaterThanOrEqual(44);
      },
      { theme },
    );
  });

  test(`content switcher: every segment is a 44px target with AA ink (${theme})`, async () => {
    await withStory(
      "navigation-contentswitcher--playground",
      async (page) => {
        const segments = page.locator(".hashti-toggle-button");
        for (const index of [0, 1]) {
          const { height } = await bounds(segments.nth(index));
          expect(height).toBeGreaterThanOrEqual(44);
          const measured = await ink(segments.nth(index));
          expect(
            measured.ratio,
            `${theme} segment ${index}: ${measured.color} on ${measured.background}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      },
      { theme },
    );
  });

  test(`tabs: the selected indicator lands on the list hairline (${theme})`, async () => {
    await withStory(
      "navigation-tabs--playground",
      async (page) => {
        const selected = page.locator(".react-aria-Tab[data-selected]").first();
        const { height } = await bounds(selected);
        expect(height).toBeGreaterThanOrEqual(44);

        const geometry = await selected.evaluate((element) => {
          const self = getComputedStyle(element);
          const tab = element.getBoundingClientRect();
          const parent = element.parentElement!.getBoundingClientRect();
          const parentStyle = getComputedStyle(element.parentElement!);
          return {
            border: Number.parseFloat(self.borderBottomWidth),
            hairline: Number.parseFloat(parentStyle.borderBottomWidth),
            overhang: tab.bottom - parent.bottom,
            width: tab.width,
          };
        });
        // 2px indicator, flush against the 1px hairline it replaces under the tab.
        expect(geometry.border).toBe(2);
        expect(geometry.hairline).toBe(1);
        expect(Math.abs(geometry.overhang)).toBeLessThanOrEqual(1);
        expect(geometry.width).toBeGreaterThan(64);
        expect(await audit(page)).toEqual([]);
      },
      { theme },
    );
  });
}
