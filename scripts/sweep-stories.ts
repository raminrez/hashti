import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

/**
 * axe + play-function sweep over every built story, in one theme.
 *
 *   bun scripts/sweep-stories.ts                 # frame-light
 *   THEME="Frame dark" bun scripts/sweep-stories.ts
 *
 * Sweeps `dist/storybook` (build it first) rather than the dev server: deterministic, no HMR
 * churn, and the same artefact CI serves. Motion is frozen before the audit because sampling an
 * overlay mid entry-animation makes axe compute contrast against a partly transparent backdrop and
 * invent failures. Keep concurrency low: React Aria's drag state is global, so two pages dragging
 * at once report "Cannot begin dragging while already dragging".
 */

const root = resolve(import.meta.dir, "..");
const dir = join(root, "dist/storybook");
if (!existsSync(join(dir, "iframe.html"))) {
  console.error("build the storybook first: bun run build:storybook");
  process.exit(1);
}

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const url = new URL(request.url);
    const path = join(dir, decodeURIComponent(url.pathname));
    if (!path.startsWith(dir)) return new Response("no", { status: 403 });
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response("not found", { status: 404 });
    return new Response(file, { headers: { "Content-Type": file.type } });
  },
});

const index = (await (await fetch(`${server.url.origin}/index.json`)).json()) as {
  entries: Record<string, { id: string; type: string }>;
};
const stories = Object.values(index.entries).filter((entry) => entry.type === "story");
const theme = process.env.THEME === "Frame dark" ? "Frame dark" : "Frame light";

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome" });
const findings: { id: string; violations: string[]; errors: string[] }[] = [];
let cursor = 0;

async function worker() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  while (cursor < stories.length) {
    const story = stories[cursor++]!;
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !/Failed to load resource/.test(text))
        errors.push(text.slice(0, 160));
    });
    let violations: string[] = [];
    try {
      await page.goto(
        `${server.url.origin}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${encodeURIComponent(theme)}`,
        { waitUntil: "domcontentloaded", timeout: 30000 },
      );
      await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
      // Freeze motion: sampling an overlay mid entry-animation makes axe compute contrast
      // against a partly transparent backdrop and invent failures.
      await page.addStyleTag({
        content:
          "*,*::before,*::after{animation-duration:0.001s!important;animation-delay:0s!important;transition-duration:0.001s!important;transition-delay:0s!important}",
      });
      await page.waitForTimeout(700);
      // The Storybook a11y addon runs axe on each story too; retry while it holds the lock.
      let found: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"] = [];
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
          found = result.violations;
          break;
        } catch (error) {
          if (!String(error).includes("already running")) throw error;
          await page.waitForTimeout(400);
        }
      }
      violations = found.map(
        (violation) => `${violation.id}: ${JSON.stringify(violation.nodes[0]?.target)}`,
      );
    } catch (error) {
      errors.push(`sweep: ${String(error).slice(0, 120)}`);
    }
    if (violations.length || errors.length) findings.push({ id: story.id, violations, errors });
    await page.close();
  }
  await context.close();
}

const concurrency = Number(process.env.CONCURRENCY ?? 2);
await Promise.all(Array.from({ length: concurrency }, worker));
await browser.close();
server.stop(true);

const out =
  process.env.OUT ??
  join(process.env.TMPDIR ?? "/tmp", `sweep-${theme === "Frame dark" ? "dark" : "light"}.json`);
await Bun.write(out, JSON.stringify(findings, null, 1));
console.log(`${stories.length} stories (${theme}) | findings: ${findings.length}`);
for (const finding of findings.slice(0, 12)) {
  console.log(
    " ",
    finding.id,
    "|",
    finding.violations.join(" ; ").slice(0, 120),
    finding.errors.join(" ; ").slice(0, 120),
  );
}
