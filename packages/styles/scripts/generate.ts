import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Renders `tokens.css` from the standing token set in `src/tokens/tokens.json`.
 * The JSON is the authored source: edit it, then run `bun run build:tokens`.
 * Values were pruned to the stylesheet-referenced closure in TICK-000b.
 */

const destination = resolve(import.meta.dir, "../src/tokens");
const stylesRoot = resolve(import.meta.dir, "../src");

type TokenMap = Record<string, string | number>;

const data = (await Bun.file(`${destination}/tokens.json`).json()) as {
  themes: { light: TokenMap; dark: TokenMap };
  global: TokenMap;
  breakpoints: Record<string, unknown>;
  typeStyles: Record<string, unknown>;
};

const { light, dark } = data.themes;

// Layered aliases resolve to a numbered variant of the same name. An alias is
// emitted only when its variants exist in the token set. `border-subtle`
// numbering starts at 00; the rest start at 01.
const layeredTokens = [
  "layer",
  "layer-background",
  "layer-hover",
  "layer-active",
  "layer-selected",
  "layer-selected-hover",
  "layer-accent",
  "layer-accent-hover",
  "layer-accent-active",
  "field",
  "field-hover",
  "border-subtle",
  "border-strong",
  "border-tile",
  "border-subtle-selected",
];
const presentAliases = layeredTokens.filter(
  (name) => `${name}-0${name === "border-subtle" ? 0 : 1}` in light,
);

const declarations = (values: TokenMap) =>
  Object.entries(values)
    .map(([name, value]) => `  --hashti-${name}: ${value};`)
    .join("\n");

const aliases = (layer: number) =>
  presentAliases
    .map(
      (name) =>
        `  --hashti-${name}: var(--hashti-${name}-0${Math.min(layer, 2) + (name === "border-subtle" ? 0 : 1)});`,
    )
    .join("\n");

const lightDeclarations = declarations(light);
const darkDeclarations = declarations(dark);

const css = `/* Hashti Universal Design Tokens.
 * Regenerate with: bun run build:tokens
 */
@layer hashti.tokens {
:root {\n${declarations(data.global)}\n}

/* Default Theme: Light Mode */
:root,
[data-hashti-theme="light"],
[data-theme="light"],
[data-hashti-theme="frame-light"] {
${lightDeclarations}
  color-scheme: light;
}

/* Dark Mode: manual toggle or system preference */
[data-hashti-theme="dark"],
[data-theme="dark"],
[data-hashti-theme="frame-dark"] {
${darkDeclarations}
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-hashti-theme="light"]):not([data-theme="light"]):not([data-hashti-theme="frame-light"]) {
${darkDeclarations}
    color-scheme: dark;
  }
}

:root, [data-hashti-theme], [data-theme], [data-hashti-layer="0"] {\n${aliases(0)}\n}
[data-hashti-layer="1"] {\n${aliases(1)}\n}
[data-hashti-layer="2"], [data-hashti-layer="3"] {\n${aliases(2)}\n}
}
`;

await mkdir(destination, { recursive: true });
await Promise.all([
  Bun.write(`${destination}/tokens.css`, css),
  Bun.write(`${stylesRoot}/tokens.css`, css),
  Bun.write(`${destination}/tokens.json`, JSON.stringify(data, null, 2) + "\n"),
]);

console.log(
  `Generated unified Hashti theme (light & dark): ${Object.keys(light).length} tokens per mode, ${Object.keys(data.global).length} foundations.`,
);
