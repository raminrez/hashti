// Contrast audit over design/tokens.css — APCA (apca-w3) + WCAG 2.x.
// Pairs are the foreground/background combinations the stylesheets actually
// compose (verified by grep over packages/styles/src). Thresholds:
//   body text    WCAG >= 4.5, APCA Lc >= 75
//   content text WCAG >= 4.5, APCA Lc >= 60
//   non-text UI  WCAG >= 3.0, APCA Lc >= 30
// Informational rows report values but never fail the run.
// Usage: node design-system/scripts/contrast-audit.mjs [--json]
import { readFileSync } from "node:fs";
import { APCAcontrast, sRGBtoY } from "apca-w3";

const css = readFileSync(
  new URL("../../design/tokens.css", import.meta.url),
  "utf8",
);

function block(startMarker) {
  const start = css.indexOf(startMarker);
  if (start === -1) throw new Error(`block not found: ${startMarker}`);
  const body = css.slice(css.indexOf("{", start) + 1);
  const end = body.indexOf("\n  }");
  const map = {};
  for (const m of body
    .slice(0, end)
    .matchAll(/(--hashti-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

const themes = {
  light: block('[data-theme="light"]'),
  dark: block('[data-theme="dark"]'),
};

// role: body | content | non-text | info
const pairs = [
  ["text-primary", "layer-01", "body"],
  ["text-primary", "layer-02", "body"],
  ["text-secondary", "layer-01", "content"],
  ["text-helper", "layer-01", "content"],
  ["text-placeholder", "layer-01", "content"],
  ["text-error", "layer-01", "body"],
  ["text-disabled", "layer-01", "info"],
  ["text-on-color", "button-primary", "body"],
  ["text-on-color", "button-primary-hover", "body"],
  ["text-on-color", "button-primary-active", "body"],
  ["focus", "layer-01", "non-text"],
  ["focus", "layer-02", "non-text"],
  ["button-primary", "layer-01", "non-text"],
  ["border-subtle-00", "layer-01", "info"],
  ["border-subtle-03", "layer-01", "info"],
];

const threshold = {
  body: { wcag: 4.5, apca: 75 },
  content: { wcag: 4.5, apca: 60 },
  "non-text": { wcag: 3.0, apca: 30 },
  info: null,
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const s = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

function lin(c8) {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function lum(hex) {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  return (
    0.2126 * lin(parseInt(r, 16)) +
    0.7152 * lin(parseInt(g, 16)) +
    0.0722 * lin(parseInt(b, 16))
  );
}

function wcag(hexFg, hexBg) {
  const [a, b] = [lum(hexFg), lum(hexBg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const results = [];
for (const [themeName, tokens] of Object.entries(themes)) {
  for (const [fgName, bgName, role] of pairs) {
    const fg = tokens[`--hashti-${fgName}`];
    const bg = tokens[`--hashti-${bgName}`];
    if (!fg || !bg) {
      results.push({
        theme: themeName,
        fg: fgName,
        bg: bgName,
        role,
        error: "token missing",
      });
      continue;
    }
    const w = wcag(fg, bg);
    const a = Math.abs(
      APCAcontrast(sRGBtoY(hexToRgb(fg)), sRGBtoY(hexToRgb(bg))),
    );
    const t = threshold[role];
    const pass = !t || (w >= t.wcag && a >= t.apca);
    results.push({
      theme: themeName,
      fg: fgName,
      bg: bgName,
      role,
      wcag: w,
      apca: a,
      pass,
      fgHex: fg,
      bgHex: bg,
    });
  }
}

const json = process.argv.includes("--json");
if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    if (r.error) {
      console.log(`FAIL ${r.theme} ${r.fg} on ${r.bg}: ${r.error}`);
      continue;
    }
    const mark = r.role === "info" ? "info" : r.pass ? "ok  " : "FAIL";
    console.log(
      `${mark} ${r.theme.padEnd(5)} ${r.fg.padEnd(22)} on ${r.bg.padEnd(24)} ` +
        `WCAG ${r.wcag.toFixed(2)}  APCA Lc ${r.apca.toFixed(0).padStart(3)}  ${r.fgHex}/${r.bgHex}`,
    );
  }
}
const failed = results.filter((r) => r.pass === false || r.error);
if (failed.length) {
  console.error(`\n${failed.length} failing pair(s)`);
  process.exit(1);
}
console.log("\nall pairs pass");
