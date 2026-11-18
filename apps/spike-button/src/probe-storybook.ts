import { chromium } from "playwright";
import { join, resolve } from "node:path";

const dir = resolve(import.meta.dir, "../../../dist/storybook");
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(req) {
    const path = join(dir, decodeURIComponent(new URL(req.url).pathname));
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response("nf", { status: 404 });
    return new Response(file, { headers: { "Content-Type": file.type } });
  },
});

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text().slice(0, 200));
});
const params = new URLSearchParams({ id: "actions-button--variants", viewMode: "story" });
const resp = await page.goto(`${server.url.origin}/iframe.html?${params}`, {
  waitUntil: "domcontentloaded",
});
console.log("status", resp?.status());
try {
  await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
} catch {
  console.log("story never mounted; body html head:", (await page.content()).slice(0, 500));
}
const mounted = await page.evaluate(() => document.querySelectorAll(".hashti-button").length);
console.log("mounted buttons:", mounted);

if (mounted > 0) {
  const btn = page.locator(".hashti-button").first();
  const before = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
  await btn.hover();
  await page.waitForTimeout(300);
  const during = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
  console.log("storybook hover:", before, "->", during, before === during ? "NO CHANGE" : "CHANGES");
}

for (const p of ["index.html", "react.html"]) {
  const page2 = await ctx.newPage();
  await page2.goto(`http://127.0.0.1:4471/${p}`, { waitUntil: "domcontentloaded" });
  await page2.waitForSelector("[data-spike='ready']");
  await page2.waitForTimeout(300);
  const b2 = page2.locator("#spike-hover");
  const bef = await b2.evaluate((el) => getComputedStyle(el).backgroundColor);
  await b2.hover();
  await page2.waitForTimeout(300);
  const dur = await b2.evaluate((el) => getComputedStyle(el).backgroundColor);
  console.log(`${p} hover:`, bef, "->", dur, bef === dur ? "NO CHANGE" : "CHANGES");
}

await browser.close();
server.stop(true);
