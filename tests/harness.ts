import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium, type Browser, type BrowserContext, type Locator, type Page } from "playwright";
import AxeBuilder from "@axe-core/playwright";

/**
 * One verification module for the whole repo.
 *
 * Every review of this library re-invented the same throwaway Playwright script: launch a browser,
 * open a story at an iframe URL, run axe, read a bounding box, read computed ink. This is that
 * script, checked in. A check is a story id plus an expectation.
 *
 * The Storybook build (`dist/storybook`) and the docs build (`dist/site`) are produced by
 * `bun run build` / `bun run build:storybook`; tests skip when the artefact is absent.
 */

export type Theme = "frame-light" | "frame-dark";

export interface PageOptions {
  /** Viewport width; height is fixed at 900 so vertical rhythm is comparable. */
  width?: number;
  theme?: Theme;
  /** Sets `dir` on the story root, for mirroring checks. */
  dir?: "ltr" | "rtl";
}

const root = resolve(import.meta.dir, "..");

let storybookServer: { url: string; stop: () => void } | null = null;
let browser: Browser | null = null;

/** Serves the static Storybook build. Returns null when it has not been built. */
export async function startStorybook(): Promise<{ url: string; stop: () => void } | null> {
  if (storybookServer) return storybookServer;
  const dir = join(root, "dist/storybook");
  if (!existsSync(join(dir, "iframe.html"))) return null;
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
  storybookServer = { url: server.url.origin, stop: () => server.stop(true) };
  return storybookServer;
}

export async function stopStorybook(): Promise<void> {
  storybookServer?.stop();
  storybookServer = null;
  await browser?.close();
  browser = null;
}

export async function getBrowser(): Promise<Browser> {
  browser ??= await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
    headless: true,
  });
  return browser;
}

/**
 * Opens a story, hands the page to `check`, and returns both what the check threw and every
 * console/page error the story produced — a story that logs an error fails even if it renders.
 */
export async function withStory(
  id: string,
  check: (page: Page) => Promise<void>,
  options: PageOptions & { expectErrors?: boolean } = {},
): Promise<void> {
  const server = await startStorybook();
  if (!server) throw new Error("Run `bun run build:storybook` before the browser tests.");
  const instance = await getBrowser();
  const context: BrowserContext = await instance.newContext({
    viewport: { width: options.width ?? 1280, height: 900 },
  });
  // External CDNs never resolve in CI; keep the run local and deterministic.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !/Failed to load resource/.test(text)) errors.push(text);
  });

  const params = new URLSearchParams({ id, viewMode: "story" });
  if (options.theme)
    params.set("globals", `theme:${options.theme === "frame-dark" ? "Frame dark" : "Frame light"}`);
  await page.goto(`${server.url}/iframe.html?${params}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#storybook-root > *");
  if (options.dir) {
    await page.evaluate((dir) => {
      document.querySelector<HTMLElement>("#storybook-root > *")?.setAttribute("dir", dir);
    }, options.dir);
  }
  // Let entry animations settle so measurement is stable.
  await page.waitForTimeout(400);

  let failure: unknown;
  try {
    await check(page);
  } catch (error) {
    failure = error;
  }
  await context.close();
  if (failure) throw failure;
  if (!options.expectErrors && errors.length) {
    throw new Error(`story ${id} logged errors:\n${errors.join("\n")}`);
  }
}

/** axe, mapped to `id (count): first target` so a failure names the rule and the node. */
export async function audit(page: Page, tags: string[] = ["wcag2a", "wcag2aa"]): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  return violations.map(
    (violation) =>
      `${violation.id} (${violation.nodes.length}): ${JSON.stringify(violation.nodes[0]?.target)}`,
  );
}

export interface Box {
  width: number;
  height: number;
  x: number;
  y: number;
}

export function bounds(locator: Locator): Promise<Box> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, x: rect.x, y: rect.y };
  });
}

export interface Ink {
  color: string;
  background: string;
  ratio: number;
}

/** Computed text colour against the nearest painted ancestor background, with WCAG ratio. */
export function ink(locator: Locator): Promise<Ink> {
  return locator.evaluate((element) => {
    const parseColor = (color: string): number[] => {
      const match = color.match(/rgba?\(([^)]+)\)/);
      if (!match) return [0, 0, 0];
      return match[1]!
        .split(",")
        .slice(0, 3)
        .map((part) => Number.parseFloat(part.trim()));
    };
    const channel = (value: number): number => {
      const normalized = value / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    const luminance = ([r, g, b]: number[]): number =>
      0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
    const opaque = (color: string): boolean => !color.startsWith("rgba") || color.endsWith(", 1)");

    const color = getComputedStyle(element).color;
    let node: HTMLElement | null = element as HTMLElement;
    let background = "rgba(0, 0, 0, 0)";
    while (node) {
      const candidate = getComputedStyle(node).backgroundColor;
      if (candidate !== "rgba(0, 0, 0, 0)" && opaque(candidate)) {
        background = candidate;
        break;
      }
      node = node.parentElement;
    }
    const light = luminance(parseColor(background));
    const dark = luminance(parseColor(color));
    const ratio = (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
    return { color, background, ratio: Math.round(ratio * 100) / 100 };
  });
}

/** The React Aria state attributes on a part, for state assertions. */
export function states(locator: Locator): Promise<Record<string, string | null>> {
  return locator.evaluate((element) => {
    const result: Record<string, string | null> = {};
    for (const attribute of element.getAttributeNames()) {
      if (attribute.startsWith("data-")) result[attribute] = element.getAttribute(attribute);
    }
    return result;
  });
}

/** Outline painted on the element itself — the one-ring contract reads this. */
export function ring(locator: Locator): Promise<{ width: string; style: string; offset: string }> {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: style.outlineWidth, style: style.outlineStyle, offset: style.outlineOffset };
  });
}
