import { chromium } from "playwright";

const base = "http://localhost:6006/iframe.html";
const stories = [
  "overlays-menu--playground",
  "fields-combobox--playground",
  "fields-select--playground",
  "fields-select--multiple-selection",
  "collections-autocomplete--playground",
  "collections-listbox--reorderable",
  "collections-listbox--drag-between-lists",
  "collections-gridlist--playground",
  "collections-gridlist--sections",
  "collections-gridlist--grid-layout",
  "collections-gridlist--drag-and-drop",
  "collections-gridlist--actions",
  "collections-tree--playground",
  "collections-tree--keyboard-navigation",
  "collections-navigationtree--playground",
  "collections-navigationtree--keyboard-navigation",
];

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const id of stories) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) {
      errors.push(`console: ${m.text().slice(0, 400)}`);
    }
  });
  await page.goto(`${base}?id=${id}&viewMode=story`, { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector("#storybook-root > *", { timeout: 20000 });
  await page.waitForTimeout(1800);
  const inert = await page.evaluate(() => !!document.querySelector("#storybook-root [inert]"));
  console.log(`${id}: ${errors.length ? "ERRORS" : "ok"}${inert ? " INERT" : ""}`);
  for (const error of errors.slice(0, 4)) console.log("   ", error.replace(/\n/g, " "));
  await context.close();
}

await browser.close();
