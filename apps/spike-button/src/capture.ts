import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = process.env.SPIKE_URL ?? "http://127.0.0.1:4471";
const out = resolve(import.meta.dir, "../shots");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
  headless: true,
});

async function shoot(pagePath: string, side: "web" | "react") {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // Deterministic captures: no transitions or spinner rotation mid-shot.
    reducedMotion: "reduce",
  });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource/.test(message.text()))
      errors.push(message.text());
  });

  await page.goto(`${base}/${pagePath}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-spike='ready']");
  await page.waitForTimeout(400);

  // 1. Rest: the whole matrix (variants, sizes, states, RTL).
  await page.screenshot({ path: `${out}/${side}-rest.png`, fullPage: true });

  // 2. Hover (real pointer over the button; ui-sdk styling is :hover, not an attribute).
  await page.hover("#spike-hover");
  await page.waitForTimeout(250);
  await page.locator("#spike-hover").screenshot({ path: `${out}/${side}-hover.png` });
  await page.mouse.move(0, 0);

  // 3. Active/pressed: hold the mouse down on the button (:active).
  const box = (await page.locator("#spike-active").boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.locator("#spike-active").screenshot({ path: `${out}/${side}-active.png` });
  await page.mouse.up();
  // The press fired a 1.2s pending action on the web side; outlast it, then let
  // hover/focus states clear before the row capture.
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1400);

  // 4. States row (disabled buttons, pending trigger at rest, iconOnly).
  await page
    .locator(".matrix")
    .nth(2)
    .screenshot({ path: `${out}/${side}-states.png` });

  // 5. Pending: click the held-promise button, wait for data-pending, screenshot.
  await page.click("#spike-pending");
  await page.waitForSelector("#spike-pending[data-pending]");
  await page.waitForSelector("#spike-pending .hashti-spinner");
  await page.waitForTimeout(100);
  await page.locator("#spike-pending").screenshot({ path: `${out}/${side}-pending.png` });
  await page.evaluate(() =>
    (window as unknown as { __releasePending: () => void }).__releasePending(),
  );
  await page.waitForSelector("#spike-pending:not([data-pending])");

  // 6. Focus ring.
  await page.locator("#spike-hover").focus();
  await page.waitForTimeout(150);
  await page.locator("#spike-hover").screenshot({ path: `${out}/${side}-focus.png` });

  // 7. RTL blocks.
  await page.locator(".rtl-block").nth(0).screenshot({ path: `${out}/${side}-rtl-fa.png` });
  await page.locator(".rtl-block").nth(1).screenshot({ path: `${out}/${side}-rtl-ar.png` });

  // Attribute snapshot for the report.
  const snapshot = await page.evaluate(() => {
    const probe = document.querySelector<HTMLElement>("#spike-pending")!;
    const attrs: Record<string, string | null> = {};
    for (const name of probe.getAttributeNames()) attrs[name] = probe.getAttribute(name);
    return {
      pendingButton: attrs,
      wrapperDisplay: getComputedStyle(probe.parentElement!).display,
      wrapperTag: probe.parentElement!.tagName,
    };
  });

  await context.close();
  return { errors, snapshot };
}

const web = await shoot("index.html", "web");
const react = await shoot("react.html", "react");
await browser.close();

console.log(JSON.stringify({ web, react }, null, 2));
if (web.errors.length || react.errors.length) process.exit(1);
