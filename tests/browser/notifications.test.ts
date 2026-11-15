import { afterAll, expect, test } from "bun:test";
import { mkdirSync } from "node:fs";
import { audit, ink, states, stopStorybook, withStory } from "../harness";

// The notification family (Alert, InlineNotification, ActionableNotification, Toast) shares one
// surface system: subtle = tint + matched full 1px border, solid = saturated fill + on-colour ink,
// bordered = neutral card + 1px semantic outline + framed icon. These checks pin that language,
// the AA ink pairs, and the absence of the old heavy left accent.

const shotDir = "docs/verification/notification-variants";

afterAll(stopStorybook);

const surfaces = [
  {
    name: "alert",
    story: "feedback-alert--variants-and-kinds",
    container: ".hashti-notification",
    text: "strong",
    frame: false,
    screenshot: false,
  },
  {
    name: "inline-notification",
    story: "feedback-inlinenotification--variants",
    container: ".hashti-notification",
    text: "strong",
    frame: true,
    screenshot: false,
  },
  {
    name: "actionable-notification",
    story: "feedback-actionablenotification--variants-and-kinds",
    container: ".hashti-actionable-notification",
    text: "strong",
    frame: true,
    screenshot: true,
  },
  {
    name: "toast",
    story: "feedback-toast--variants",
    container: ".hashti-toast",
    text: '[slot="title"]',
    frame: true,
    screenshot: false,
  },
] as const;

async function openAllToasts(page: import("playwright").Page): Promise<void> {
  for (const label of ["Subtle Toast", "Solid Toast", "Bordered Toast"]) {
    await page.getByRole("button", { name: label }).click();
  }
  await page.waitForSelector('.hashti-toast[data-variant="bordered"]');
  await page.waitForTimeout(500);
}

for (const surface of surfaces) {
  test(`${surface.name}: every kind × variant passes AA ink and the variant contract, both themes`, async () => {
    for (const theme of ["frame-light", "frame-dark"] as const) {
      await withStory(
        surface.story,
        async (page) => {
          if (surface.name === "toast") await openAllToasts(page);

          const items = page.locator(surface.container);
          const count = await items.count();
          expect(count).toBeGreaterThan(0);

          for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            const attributes = await states(item);
            const kind = attributes["data-kind"];
            const variant = attributes["data-variant"] ?? "subtle";

            // No heavy left accent anywhere in the variant system.
            const startWidth = await item.evaluate(
              (el) => getComputedStyle(el).borderInlineStartWidth,
            );
            expect(startWidth, `${theme} ${kind}/${variant} border-inline-start`).toBe("1px");

            // Title ink ≥ 4.5:1 against the painted surface.
            const title = await ink(item.locator(surface.text).first());
            expect(
              title.ratio,
              `${theme} ${kind}/${variant} title: ${title.color} on ${title.background}`,
            ).toBeGreaterThanOrEqual(4.5);

            // The kind icon reads against the surface (UI component contrast ≥ 3:1).
            const icon = await ink(item.locator("> svg").first());
            expect(
              icon.ratio,
              `${theme} ${kind}/${variant} icon: ${icon.color} on ${icon.background}`,
            ).toBeGreaterThanOrEqual(3);
          }

          expect(await audit(page), `${theme} axe`).toEqual([]);

          if (surface.screenshot) {
            mkdirSync(shotDir, { recursive: true });
            await page.screenshot({ path: `${shotDir}/${surface.name}-${theme}.png` });
          }
        },
        { theme },
      );
    }
  });
}

test("actionable notification: the action reads as the component's kind, not a primary button", async () => {
  for (const theme of ["frame-light", "frame-dark"] as const) {
    await withStory(
      "feedback-actionablenotification--variants-and-kinds",
      async (page) => {
        const items = page.locator(".hashti-actionable-notification");
        const count = await items.count();
        for (let i = 0; i < count; i++) {
          const item = items.nth(i);
          const attributes = await states(item);
          const actionInk = await ink(
            item.locator(".hashti-actionable-notification-actions .hashti-button").first(),
          );
          const kind = attributes["data-kind"];
          const variant = attributes["data-variant"] ?? "subtle";
          // Solid uses a white-on-saturated wash (~4.5+); subtle/bordered use the semantic
          // outline, which sits above 4.5 on light and above 3 on dark borders by token audit.
          expect(
            actionInk.ratio,
            `${theme} ${kind}/${variant} action: ${actionInk.color} on ${actionInk.background}`,
          ).toBeGreaterThanOrEqual(3);
        }
      },
      { theme },
    );
  }
});

test("loading: the spinner paints with currentColor, so ink follows the surface", async () => {
  await withStory("feedback-loading--spinner-follows-ink", async (page) => {
    const [plain, filled] = (await page.locator(".hashti-loading").evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node.querySelector(".hashti-spinner")!);
        return { borderColor: style.borderInlineStartColor, color: style.color };
      }),
    )) as [{ borderColor: string; color: string }, { borderColor: string; color: string }];
    expect(plain.borderColor).toBe(plain.color);
    expect(filled.borderColor).toBe(filled.color);
    // The filled strip proves the inverse path: on-colour ink on the action fill.
    expect(filled.color).not.toBe(plain.color);
    expect(await audit(page)).toEqual([]);
  });
});
