import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";

// Captures the React Storybook Button stories against the same states as the spike
// harness, so the spike result can be anchored to the repo's review surface.
const root = resolve(import.meta.dir, "../../..");
const dir = join(root, "dist/storybook");
if (!existsSync(join(dir, "iframe.html"))) {
  console.error("Run bun run build:storybook first");
  process.exit(1);
}
const out = resolve(import.meta.dir, "../shots");
await mkdir(out, { recursive: true });

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const url = new URL(request.url);
    const path = join(dir, decodeURIComponent(url.pathname));
    if (!path.startsWith(dir)) return new Response("no", { status: 403 });
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response("not found", { status: 404 });
    return new Response(file, {
      headers: { "Cache-Control": "no-store", "Content-Type": file.type },
    });
  },
});

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function story(id: string, name: string, act?: (page: import("playwright").Page) => Promise<void>) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  const page = await context.newPage();
  const params = new URLSearchParams({ id, viewMode: "story" });
  await page.goto(`${server.url.origin}/iframe.html?${params}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#storybook-root > *");
  await page.waitForTimeout(400);
  if (act) await act(page);
  await page.screenshot({ path: `${out}/storybook-${name}.png`, fullPage: true });
  await context.close();
  console.log(`captured ${name}`);
}

await story("actions-button--variants", "variants", async (page) => {
  const probe = await page.evaluate(() =>
    [...document.querySelectorAll(".hashti-button")].map((el) => {
      const cs = getComputedStyle(el);
      return {
        v: el.getAttribute("data-variant"),
        s: el.getAttribute("data-size"),
        bg: cs.backgroundColor,
        color: cs.color,
        h: cs.height,
        radius: cs.borderRadius,
        pr: cs.paddingInlineEnd,
      };
    }),
  );
  console.log("storybook variants computed:", JSON.stringify(probe));
});
await story("actions-button--sizes", "sizes");
await story("actions-button--disabled", "disabled");
await story("actions-button--icon-only", "icon-only");
await story("actions-button--right-to-left", "rtl");
await story("actions-button--pending", "pending", async (page) => {
  const button = page.getByRole("button", { name: "Save draft" });
  await button.click();
  await page.waitForSelector("[data-pending]");
  await page.waitForTimeout(100);
});

await browser.close();
server.stop(true);
console.log("done");
