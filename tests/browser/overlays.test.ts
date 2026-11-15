import { afterAll, expect, test } from "bun:test";
import type { Page } from "playwright";
import { expect as pw } from "playwright/test";
import { audit, states, stopStorybook, withStory } from "../harness";

// The overlay family regressed silently in the 2026-11 review: the sheet rendered nothing, the
// modal backdrop blurred twice at two strengths, and the command palette's arrow keys did nothing.
// These are the checks that used to be run by hand.

afterAll(stopStorybook);

const PALETTE = "overlays-commandpalette--playground";

/** Opens the palette and clears the query the story's play function leaves behind. */
async function openPalette(page: Page): Promise<void> {
  const trigger = page.getByRole("button", { name: "Open Command Palette" });
  await trigger.waitFor();
  // The story's play function opens the palette, types and selects; wait for it to finish
  // before driving the same state by hand.
  await page.waitForFunction(() =>
    document
      .querySelector("[data-testid='selected-action-output']")
      ?.textContent?.startsWith("Selected action:"),
  );
  await pw(page.locator(".hashti-command-palette-modal")).toHaveCount(0);
  await trigger.click();
  const input = page.locator(".hashti-command-palette__input");
  await input.waitFor();
  const clear = page.getByRole("button", { name: "Clear search" });
  if (await clear.count()) await clear.click();
  // Clearing is a button press, so the caret has to come back to the search field.
  await input.focus();
}

/** React Aria moves the active option after a state update, so a press needs a beat to land. */
async function press(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
  await page.waitForTimeout(120);
}

/**
 * Escape once, then once more if React Aria was still finishing an enter animation. Its sheet
 * defers interaction until the enter scroll ends, which is not observable from the DOM.
 */
async function dismissWithEscape(page: Page, selector: string): Promise<void> {
  await page.keyboard.press("Escape");
  try {
    await pw(page.locator(selector)).toHaveCount(0, { timeout: 1500 });
  } catch {
    await page.keyboard.press("Escape");
    await pw(page.locator(selector)).toHaveCount(0);
  }
}

/** The option the collection treats as active, whichever way React Aria marks it. */
function activeOption(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const input = document.querySelector(".hashti-command-palette__input");
    const id = input?.getAttribute("aria-activedescendant");
    const option =
      (id ? document.getElementById(id) : null) ??
      document.querySelector('[role="option"][data-focused]');
    return option?.textContent?.trim() ?? null;
  });
}

function overlayPaint(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backdrop: element.getAttribute("data-backdrop"),
        background: style.backgroundColor,
        blur: style.backdropFilter,
      };
    });
}

test("sheet: opens from its trigger with a dialog role and closes on Escape", async () => {
  await withStory("overlays-sheet--playground", async (page) => {
    const sheet = page.locator(".react-aria-Sheet");
    await pw(sheet).toHaveCount(1);
    // React Aria reports the sheet as expanded only once its enter scroll has settled.
    await page.waitForSelector(".hashti-sheet-overlay[data-expanded]");
    expect(await states(sheet)).toMatchObject({ "data-position": "bottom" });

    // On screen, not parked below the fold: the overscroll padding used to collapse it to nothing.
    const box = (await sheet.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.y).toBeGreaterThan(viewport.height / 2);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 8);

    await pw(page.getByRole("dialog", { name: "Order Summary" })).toBeVisible();
    await pw(page.locator(".hashti-sheet-handle")).toBeVisible();

    await dismissWithEscape(page, ".react-aria-Sheet");
  });
});

test("sheet: pressing the backdrop dismisses it", async () => {
  await withStory("overlays-sheet--playground", async (page) => {
    await page.waitForSelector(".hashti-sheet-overlay[data-expanded]");
    await pw(page.locator(".react-aria-SheetBackdrop")).toBeVisible();
    // The sheet's swipe gesture is React Aria's scroll snap on [data-sheet-scroll]; a backdrop
    // press is the other dismissal path and the one a pointer can express in a test.
    await page.mouse.click(40, 40);
    await pw(page.locator(".react-aria-Sheet")).toHaveCount(0);
  });
});

const overlays = [
  { story: "overlays-modal--backdrops", kind: "modal", selector: ".hashti-modal-overlay" },
  { story: "overlays-drawer--backdrops", kind: "drawer", selector: ".hashti-drawer-overlay" },
];

for (const { story, kind, selector } of overlays) {
  test(`${kind}: dim paints DESIGN's scrim with no blur, blur adds 6px, none is clear`, async () => {
    await withStory(story, async (page) => {
      const open = async (variant: "dim" | "blur" | "none") => {
        await page.getByRole("button", { name: `Open ${variant} ${kind}` }).click();
        await page.waitForSelector(`${selector}[data-backdrop="${variant}"]`);
        await page.waitForTimeout(400); // entry animation sets opacity, not paint
        return overlayPaint(page, selector);
      };
      const close = async () => {
        await page.keyboard.press("Escape");
        await pw(page.locator(selector)).toHaveCount(0);
      };

      const dim = await open("dim");
      expect(dim.backdrop).toBe("dim");
      expect(dim.background).toBe("rgba(18, 22, 32, 0.5)");
      expect(dim.blur).toBe("none");
      await close();

      const blur = await open("blur");
      expect(blur.background).toBe("rgba(18, 22, 32, 0.5)");
      expect(blur.blur).toBe("blur(6px)");
      await close();

      const none = await open("none");
      expect(none.background).toBe("rgba(0, 0, 0, 0)");
      expect(none.blur).toBe("none");
      await close();
    });
  });
}

test("modal: axe clean in light and dark", async () => {
  for (const theme of ["frame-light", "frame-dark"] as const) {
    await withStory(
      "overlays-modal--playground",
      async (page) => {
        await page.getByRole("button", { name: "Open playground modal" }).click();
        await page.waitForSelector(".hashti-modal");
        // Entry animation fades the surface in; axe would measure it mid-fade.
        await page.waitForTimeout(600);
        expect(await audit(page)).toEqual([]);
      },
      { theme },
    );
  }
});

test("drawer: the edge it is flush to is square, the page side is rounded, in both directions", async () => {
  const corners = (page: Page) =>
    page.locator(".hashti-drawer").evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        placement: element.getAttribute("data-placement"),
        startStart: style.borderStartStartRadius,
        startEnd: style.borderStartEndRadius,
        endStart: style.borderEndStartRadius,
        endEnd: style.borderEndEndRadius,
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right,
      };
    });

  for (const theme of ["frame-light", "frame-dark"] as const) {
    await withStory(
      "overlays-drawer--backdrops",
      async (page) => {
        await page.getByRole("button", { name: "Open dim drawer" }).click();
        await page.waitForSelector(".hashti-drawer");
        const end = await corners(page);
        expect(end.placement).toBe("end");
        // Flush to the inline-end edge: square there, rounded toward the page.
        expect([end.startEnd, end.endEnd]).toEqual(["0px", "0px"]);
        expect([end.startStart, end.endStart]).toEqual(["16px", "16px"]);

        await page.keyboard.press("Escape");
        await pw(page.locator(".hashti-drawer")).toHaveCount(0);
      },
      { theme },
    );
  }

  // RTL mirrors the edge, so the same logical corners stay square and the surface moves left.
  await withStory("overlays-drawer--rtl", async (page) => {
    await page.getByRole("button", { name: "باز کردن کشوی کناری" }).click();
    await page.waitForSelector(".hashti-drawer");
    const end = await corners(page);
    expect([end.startEnd, end.endEnd]).toEqual(["0px", "0px"]);
    expect([end.startStart, end.endStart]).toEqual(["16px", "16px"]);
    expect(end.left).toBeLessThan(1);
  });
});

test("command palette: opens from its trigger and from its shortcut", async () => {
  await withStory(PALETTE, async (page) => {
    await openPalette(page);
    await pw(page.locator(".hashti-command-palette-modal")).toBeVisible();

    await dismissWithEscape(page, ".hashti-command-palette-modal");

    await page.keyboard.press("Meta+k");
    await pw(page.locator(".hashti-command-palette-modal")).toBeVisible();
  });
});

test("command palette: arrow keys, Home and End move the active option", async () => {
  await withStory(PALETTE, async (page) => {
    await openPalette(page);

    await press(page, "ArrowDown");
    expect(await activeOption(page)).toContain("Create New Component");

    await press(page, "ArrowDown");
    expect(await activeOption(page)).toContain("Generate with AI Agent");

    await press(page, "ArrowUp");
    expect(await activeOption(page)).toContain("Create New Component");

    await press(page, "End");
    expect(await activeOption(page)).toContain("Clear Token Build Cache");

    await press(page, "Home");
    expect(await activeOption(page)).toContain("Create New Component");
  });
});

test("command palette: Enter invokes the active option and closes", async () => {
  await withStory(PALETTE, async (page) => {
    await openPalette(page);
    await press(page, "ArrowDown");
    await press(page, "ArrowDown");
    expect(await activeOption(page)).toContain("Generate with AI Agent");
    await page.keyboard.press("Enter");

    await pw(page.getByTestId("selected-action-output")).toHaveText(
      "Selected action: Generate with AI Agent",
    );
    await pw(page.locator(".hashti-command-palette-modal")).toHaveCount(0);
  });
});

test("command palette: Escape closes once and focus returns to the trigger", async () => {
  await withStory(PALETTE, async (page) => {
    const trigger = page.getByRole("button", { name: "Open Command Palette" });
    await openPalette(page);
    // A query must not swallow the first Escape.
    await page.keyboard.type("comp");
    expect(await page.locator(".hashti-command-palette__input").inputValue()).toBe("comp");

    await dismissWithEscape(page, ".hashti-command-palette-modal");
    await pw(trigger).toBeFocused();
  });
});

test("command palette: the close button closes it", async () => {
  await withStory(PALETTE, async (page) => {
    await openPalette(page);
    await page.getByRole("button", { name: "Close command palette" }).click();
    await pw(page.locator(".hashti-command-palette-modal")).toHaveCount(0);
  });
});

test("command palette: axe clean in light and dark", async () => {
  for (const theme of ["frame-light", "frame-dark"] as const) {
    await withStory(
      PALETTE,
      async (page) => {
        await openPalette(page);
        await page.waitForTimeout(600);
        expect(await audit(page)).toEqual([]);
      },
      { theme },
    );
  }
});
