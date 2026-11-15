import { chromium } from "playwright";
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

async function main() {
  console.log("Launching Chromium for brand asset rendering...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const page = await browser.newPage();

  // Load font first
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">
      </head>
      <body>
        <div style="font-family: 'Satoshi'; font-weight: 700;">Preload Font</div>
      </body>
    </html>
  `);
  await page.evaluate(() => document.fonts.ready);

  // Helper to render SVG content to PNG
  async function renderSvgToPng(
    svgContent: string,
    width: number,
    height: number,
    outputPath: string,
    omitBackground = true,
  ) {
    await page.setViewportSize({ width, height });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
            svg { width: 100%; height: 100%; display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const buffer = await page.screenshot({
      omitBackground,
      type: "png",
    });
    writeFileSync(outputPath, buffer);
    console.log(`✓ Rendered: ${outputPath} (${width}x${height})`);
  }

  const publicDir = resolve(import.meta.dirname, "../apps/docs/public");
  const tokensDir = resolve(import.meta.dirname, "../packages/tokens/assets");

  // Read source SVGs
  const markSvg = readFileSync(resolve(publicDir, "hashti-mark.svg"), "utf-8");
  const appIconSvg = readFileSync(resolve(publicDir, "hashti-app-icon.svg"), "utf-8");
  const horizontalSvg = readFileSync(resolve(publicDir, "hashti-horizontal.svg"), "utf-8");
  const horizontalDarkSvg = readFileSync(resolve(publicDir, "hashti-horizontal-dark.svg"), "utf-8");
  const verticalSvg = readFileSync(resolve(publicDir, "hashti-vertical.svg"), "utf-8");
  const verticalDarkSvg = readFileSync(resolve(publicDir, "hashti-vertical-dark.svg"), "utf-8");

  // Multi-resolution mark PNGs
  const markSizes = [32, 64, 128, 192, 512, 1024];
  for (const s of markSizes) {
    const outPath = resolve(publicDir, `hashti-mark-${s}.png`);
    await renderSvgToPng(markSvg, s, s, outPath);
    copyFileSync(outPath, resolve(tokensDir, `hashti-mark-${s}.png`));
  }

  // App icon PNGs
  const appIconSizes = [192, 512, 1024];
  for (const s of appIconSizes) {
    const outPath = resolve(publicDir, `hashti-app-icon-${s}.png`);
    await renderSvgToPng(appIconSvg, s, s, outPath);
    copyFileSync(outPath, resolve(tokensDir, `hashti-app-icon-${s}.png`));
  }

  // Horizontal logo PNGs
  const hLight = resolve(publicDir, "hashti-horizontal-light.png");
  const hDark = resolve(publicDir, "hashti-horizontal-dark.png");
  const hDarkBg = resolve(publicDir, "hashti-horizontal-dark-bg.png");
  await renderSvgToPng(horizontalSvg, 1040, 320, hLight);
  await renderSvgToPng(horizontalDarkSvg, 1040, 320, hDark);
  await renderSvgToPng(
    `<div style="background:#000000; width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:24px; padding:24px;">${horizontalDarkSvg}</div>`,
    1040,
    320,
    hDarkBg,
    false,
  );
  copyFileSync(hLight, resolve(tokensDir, "hashti-horizontal-light.png"));
  copyFileSync(hDark, resolve(tokensDir, "hashti-horizontal-dark.png"));
  copyFileSync(hDarkBg, resolve(tokensDir, "hashti-horizontal-dark-bg.png"));

  // Vertical logo PNGs
  const vLight = resolve(publicDir, "hashti-vertical-light.png");
  const vDark = resolve(publicDir, "hashti-vertical-dark.png");
  const vDarkBg = resolve(publicDir, "hashti-vertical-dark-bg.png");
  await renderSvgToPng(verticalSvg, 640, 760, vLight);
  await renderSvgToPng(verticalDarkSvg, 640, 760, vDark);
  await renderSvgToPng(
    `<div style="background:#000000; width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:24px; padding:32px;">${verticalDarkSvg}</div>`,
    640,
    760,
    vDarkBg,
    false,
  );
  copyFileSync(vLight, resolve(tokensDir, "hashti-vertical-light.png"));
  copyFileSync(vDark, resolve(tokensDir, "hashti-vertical-dark.png"));
  copyFileSync(vDarkBg, resolve(tokensDir, "hashti-vertical-dark-bg.png"));

  await browser.close();
  console.log("All brand PNG assets generated successfully!");
}

main().catch((err) => {
  console.error("Failed to generate PNGs:", err);
  process.exit(1);
});
