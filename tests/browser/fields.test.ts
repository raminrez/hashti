import { afterAll, expect, test } from "bun:test";
import { audit, bounds, stopStorybook, withStory } from "../harness";

// The field family is the most reused anatomy in the library, and the one that regressed most
// often during the 2026-11 review. These are the checks that used to be run by hand.

const stories = [
  "fields-textfield--states",
  "fields-numberfield--playground",
  "fields-searchfield--playground",
  "fields-select--playground",
  "fields-nativeselect--validation",
  "fields-tokenfield--compound-anatomy",
  "fields-datepicker--playground",
  "fields-timefield--states",
];

afterAll(stopStorybook);

for (const id of stories) {
  test(`${id}: axe clean in light and dark`, async () => {
    await withStory(id, async (page) => {
      expect(await audit(page)).toEqual([]);
    });
    await withStory(
      id,
      async (page) => {
        expect(await audit(page)).toEqual([]);
      },
      { theme: "frame-dark" },
    );
  });

  test(`${id}: control meets the 44px minimum`, async () => {
    await withStory(id, async (page) => {
      const control = page
        .locator(
          ".hashti-field__control, .hashti-native-select-control, .hashti-token-input, .react-aria-Input",
        )
        .first();
      const { height } = await bounds(control);
      expect(height).toBeGreaterThanOrEqual(44);
    });
  });

  test(`${id}: every aria-describedby target exists`, async () => {
    await withStory(id, async (page) => {
      const dangling = await page.evaluate(() => {
        const broken: string[] = [];
        for (const element of document.querySelectorAll<HTMLElement>("[aria-describedby]")) {
          for (const target of (element.getAttribute("aria-describedby") ?? "").split(/\s+/)) {
            if (target && !document.getElementById(target)) {
              broken.push(`${element.tagName.toLowerCase()} → ${target}`);
            }
          }
        }
        return broken;
      });
      expect(dangling).toEqual([]);
    });
  });
}
