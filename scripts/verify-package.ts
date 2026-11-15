// End-to-end package check: pack the workspace, install it as an outside consumer,
// confirm no workspace/catalog protocols leak, then render a themed component in a browser.
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dir, "..");
const workspace = await Bun.file(join(root, "package.json")).json();
const catalog: Record<string, string> = workspace.workspaces.catalog;
const archives: Array<{ name: string; version: string; filename: string; sha256: string }> =
  await Bun.file(join(root, "dist/packages/manifest.json")).json();

for (const archive of archives) {
  const hash = new Bun.CryptoHasher("sha256")
    .update(await Bun.file(join(root, "dist/packages", archive.filename)).arrayBuffer())
    .digest("hex");
  assert.equal(hash, archive.sha256, `Archive changed after packing: ${archive.filename}`);
}

const consumer = await mkdtemp(join(tmpdir(), "hashti-consumer-"));
const pin = (name: string) => {
  const value = catalog[name];
  assert.ok(value, `catalog entry ${name} is missing`);
  return value;
};
const dependencies: Record<string, string> = {
  react: pin("react"),
  "react-dom": pin("react-dom"),
  "react-aria-components": pin("react-aria-components"),
  "@internationalized/date": pin("@internationalized/date"),
};
for (const archive of archives)
  dependencies[archive.name] = `file:${join(root, "dist/packages", archive.filename)}`;
// Cross-package versions point at the registry; local tarballs stand in for it.
const overrides = Object.fromEntries(
  archives.map((archive) => [archive.name, `file:${join(root, "dist/packages", archive.filename)}`]),
);

await Bun.write(
  join(consumer, "package.json"),
  `${JSON.stringify({ name: "hashti-consumer", private: true, type: "module", dependencies, overrides }, null, 2)}\n`,
);
const install = Bun.spawnSync(["bun", "install"], { cwd: consumer });
assert.equal(install.exitCode, 0, `bun install failed:\n${install.stderr.toString()}`);

for (const name of archives.map((archive) => archive.name)) {
  const manifest = await Bun.file(join(consumer, "node_modules", name, "package.json")).json();
  assert.doesNotMatch(
    JSON.stringify(manifest),
    /workspace:|catalog:/,
    `${name} ships an unresolved workspace protocol`,
  );
}
const installed = await readdir(join(consumer, "node_modules/@hashti"));
assert.deepEqual(installed.sort(), ["agent", "react", "tokens"]);

const reactCss = await Bun.file(Bun.resolveSync("@hashti/react/styles.css", consumer)).text();
const tokenCss = await Bun.file(Bun.resolveSync("@hashti/tokens/tokens.css", consumer)).text();
assert.match(tokenCss, /--hashti-popover-radius:\s*1\.125rem/, "popover radius token missing");
assert.match(reactCss, /hashti-themes|hashti\.themes/, "theme layer missing from styles.css");

await Bun.write(
  join(consumer, "index.tsx"),
  `import { createRoot } from "react-dom/client";
import { Theme, Button } from "@hashti/react";
import "@hashti/tokens/tokens.css";
import "@hashti/react/styles.css";

createRoot(document.getElementById("root")!).render(
  <Theme theme="frame-light">
    <Button variant="primary">Enter portal</Button>
  </Theme>,
);
`,
);
await Bun.write(
  join(consumer, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>consumer</title></head>
<body><div id="root"></div><script type="module" src="./index.js"></script></body></html>\n`,
);

const bundle = await Bun.build({
  entrypoints: [join(consumer, "index.tsx")],
  outdir: consumer,
  target: "browser",
});
assert.ok(bundle.success, `consumer bundle failed: ${bundle.logs.join("\n")}`);

// Bun emits imported CSS as a sibling file; inline it so the page has its styles.
const css = await Bun.file(join(consumer, "index.css")).text();
await Bun.write(
  join(consumer, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>consumer</title><style>${css}</style></head>
<body><div id="root"></div><script type="module" src="./index.js"></script></body></html>\n`,
);

const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  async fetch(request) {
    const path = new URL(request.url).pathname;
    const file = Bun.file(join(consumer, path === "/" ? "index.html" : path));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
  headless: true,
});
try {
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.port}/`);
  const button = page.getByRole("button", { name: "Enter portal" });
  await button.waitFor();
  assert.equal(
    Math.round((await button.boundingBox())!.height),
    44,
    "primary button height drifted from the 44px control minimum",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await button.evaluate((element) => getComputedStyle(element).outlineOffset),
    "3px",
    "button focus ring should sit three pixels outside the control",
  );
  assert.deepEqual(errors, [], `consumer page raised errors: ${errors.join("; ")}`);
} finally {
  await browser.close();
  await server.stop();
}

await mkdir(join(root, "test-results"), { recursive: true });
console.log(`Package consumer verified: ${archives.map((archive) => archive.filename).join(", ")}`);
