import { afterAll, expect, test } from "bun:test";
import { mkdirSync } from "node:fs";
import { audit, stopStorybook, withStory } from "../harness";

// Feedback story sweep: every story for Alert, InlineNotification, ActionableNotification,
// Toast and Loading, axe clean in both themes at 1280px, with a screenshot per theme.

const shotDir = "docs/verification/notification-variants";

const stories = [
  "feedback-alert--variants-and-kinds",
  "feedback-inlinenotification--all-kinds",
  "feedback-inlinenotification--variants",
  "feedback-actionablenotification--variants-and-kinds",
  "feedback-toast--variants",
  "feedback-loading--playground",
  "feedback-loading--spinner-follows-ink",
];

afterAll(stopStorybook);

for (const id of stories) {
  test(`${id}: axe clean in both themes at 1280px`, async () => {
    for (const theme of ["frame-light", "frame-dark"] as const) {
      await withStory(
        id,
        async (page) => {
          if (id === "feedback-toast--variants") {
            for (const label of ["Subtle Toast", "Solid Toast", "Bordered Toast"]) {
              await page.getByRole("button", { name: label }).click();
            }
            await page.waitForSelector('.hashti-toast[data-variant="bordered"]');
            await page.waitForTimeout(500);
          }
          expect(await audit(page), `${theme} axe`).toEqual([]);
          mkdirSync(shotDir, { recursive: true });
          await page.screenshot({
            path: `${shotDir}/${id.replaceAll("/", "-")}-${theme}.png`,
            fullPage: true,
          });
        },
        { theme },
      );
    }
  });
}
