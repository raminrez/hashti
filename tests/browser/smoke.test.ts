import { afterAll, beforeAll, expect, test } from "bun:test";
import { type BrowserContext, type Page } from "playwright";
import { expect as pwExpect } from "playwright/test";
import { startPreview } from "../../scripts/preview";
import { audit, getBrowser, stopStorybook } from "../harness";

// The docs site: every route is a built page, so axe here covers real page composition,
// not only component stories.

let server: Awaited<ReturnType<typeof startPreview>>;

beforeAll(async () => {
  server = await startPreview({ port: 0 });
});

afterAll(async () => {
  await server?.stop();
  await stopStorybook();
});

const routes = ["/", "/docs/components/button", "/docs/components/slider", "/docs/components/form"];

for (const route of routes) {
  test(`${route} renders without console errors or a11y violations`, async () => {
    const browser = await getBrowser();
    const context: BrowserContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    // External font CDNs never resolve in CI; keep the page local and deterministic.
    await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
    const page: Page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(new URL(route, server.url).href, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await pwExpect(page.locator("main, body").first()).toBeVisible();
    expect(await audit(page)).toEqual([]);
    expect(errors).toEqual([]);
    await context.close();
  });
}
