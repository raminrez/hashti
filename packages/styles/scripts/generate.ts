import {
  themes,
  buttonTokens,
  tagTokens,
  notificationTokens,
  statusTokens,
  contentSwitcherTokens,
} from "@carbon/themes";
import * as layout from "@carbon/layout";
import * as typography from "@carbon/type";
import * as motion from "@carbon/motion";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { frameThemes } from "../src/tokens/frame";

const destination = resolve(import.meta.dir, "../src/tokens");
const stylesRoot = resolve(import.meta.dir, "../src");

export function kebab(name: string): string {
  return name
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([a-z])([0-9]+)/g, "$1-$2")
    .toLowerCase();
}

const componentGroups = [
  buttonTokens,
  tagTokens,
  notificationTokens,
  statusTokens,
  contentSwitcherTokens,
];

// Base semantic scale from Carbon for fallback roles
const semantic: Record<string, Record<string, string | number>> = Object.fromEntries(
  Object.entries(themes).map(([theme, values]) => {
    const entries: [string, string][] = Object.entries(values)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .map(([name, value]) => [kebab(name), value]);
    for (const group of componentGroups) {
      for (const [name, values] of Object.entries(group)) {
        const map = values as Record<string, string>;
        const value = map[theme === "white" ? "whiteTheme" : theme] ?? map.fallback;
        if (value !== undefined) entries.push([kebab(name), value]);
      }
    }
    if (theme === "g90" || theme === "g100") {
      entries.push(
        ["notification-action-hover", "var(--hashti-layer-hover)"],
        ["status-orange-outline", statusTokens.statusOrange[theme]],
        ["status-yellow-outline", statusTokens.statusYellow[theme]],
      );
    }
    return [theme, Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)))];
  }),
);

for (const values of Object.values(semantic)) {
  const placeholder = values["text-placeholder"];
  if (typeof placeholder === "string" && placeholder.startsWith("rgba"))
    values["text-placeholder"] = values["text-secondary"]!;
}

// Single Hashti Theme with Light and Dark modes (rooted in Frame's tactile baseline)
const hashtiThemes: Record<string, Record<string, string | number>> = {
  light: {
    ...semantic["white"],
    ...frameThemes["frame-light"],
  },
  dark: {
    ...semantic["g100"],
    ...frameThemes["frame-dark"],
  },
};

const global: Record<string, string | number> = {
  "font-sans": 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "font-mono": 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
};
for (const [key, value] of Object.entries(layout)) {
  if (/^(spacing\d|container\d|size(Xs|Sm|Md|Lg|Xl|2xl)$|borderRadius)/.test(key)) {
    if (typeof value === "string") global[kebab(key)] = value;
  }
}

const typeStyles = Object.fromEntries(
  Object.entries(typography)
    .filter(([key]) =>
      /^(body|bodyCompact|label|helperText|heading|headingCompact|code|display|legal|fluidHeading|fluidParagraph|fluidQuotation|fluidDisplay)\d+$/.test(
        key,
      ),
    )
    .map(([key, value]) => [kebab(key), value]),
);
for (const [key, value] of Object.entries(typeStyles)) {
  for (const [property, setting] of Object.entries(value)) {
    if (typeof setting === "number" || typeof setting === "string") {
      global[`${key}-${kebab(property)}`] = setting;
    }
  }
}
for (const [key, value] of Object.entries(motion)) {
  if (key.startsWith("duration") && typeof value === "string") global[kebab(key)] = value;
}

Object.assign(global, {
  "duration-fast-01": "130ms",
  "duration-fast-02": "175ms",
  "duration-moderate-01": "230ms",
  "duration-moderate-02": "310ms",
  "duration-slow-01": "410ms",
  "duration-slow-02": "730ms",
});
for (const [name, modes] of Object.entries(motion.easings)) {
  for (const [mode, value] of Object.entries(modes)) global[`ease-${name}-${mode}`] = value;
}

const declarations = (values: Record<string, string | number>) =>
  Object.entries(values)
    .map(([name, value]) => `  --hashti-${name}: ${value};`)
    .join("\n");

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
const aliases = (layer: number) =>
  layeredTokens
    .map(
      (name) =>
        `  --hashti-${name}: var(--hashti-${name}-0${Math.min(layer, 2) + (name === "border-subtle" ? 0 : 1)});`,
    )
    .join("\n");

const lightDeclarations = declarations(hashtiThemes.light);
const darkDeclarations = declarations(hashtiThemes.dark);

const css = `/* Hashti Universal Design Tokens.
 * Regenerate with: bun run build:tokens
 */
@layer hashti.tokens {
:root {\n${declarations(global)}\n}

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
  Bun.write(
    `${destination}/tokens.json`,
    JSON.stringify(
      { themes: hashtiThemes, global, breakpoints: layout.breakpoints, typeStyles },
      null,
      2,
    ) + "\n",
  ),
  // Backward compatibility alias for any existing imports
  Bun.write(resolve(import.meta.dir, "../../tokens/src/tokens.css"), css),
  Bun.write(
    resolve(import.meta.dir, "../../tokens/src/tokens.json"),
    JSON.stringify(
      { themes: hashtiThemes, global, breakpoints: layout.breakpoints, typeStyles },
      null,
      2,
    ) + "\n",
  ),
]);

console.log(
  `Generated unified Hashti theme (light & dark) with ${Object.keys(global).length} foundations.`,
);
