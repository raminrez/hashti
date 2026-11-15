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
import { relayThemes } from "../src/relay";
import { frameThemes } from "../src/frame";

const destination = resolve(import.meta.dir, "../src");

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
    // Carbon resolves these sparse component maps in its styles package:
    // components/notification/_tokens.scss and icon-indicator/_tokens.scss.
    // Preserve those dark-theme aliases rather than inheriting white's values.
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

// Carbon's 40% placeholder ink lands at 2.52:1 on its own field surface; reuse its
// secondary ink so placeholder text clears WCAG AA.
for (const values of Object.values(semantic)) {
  const placeholder = values["text-placeholder"];
  if (typeof placeholder === "string" && placeholder.startsWith("rgba"))
    values["text-placeholder"] = values["text-secondary"]!;
}

for (const [name, values] of Object.entries({ ...relayThemes, ...frameThemes })) {
  semantic[name] = {
    ...semantic[name.endsWith("-light") ? "white" : "g100"],
    ...values,
  };
}

const global: Record<string, string | number> = {
  "font-sans": '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  "font-mono": '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
};
for (const [key, value] of Object.entries(layout)) {
  if (/^(spacing\d|container\d|size(Xs|Sm|Md|Lg|Xl|2xl)$|borderRadius)/.test(key)) {
    if (typeof value === "string") global[kebab(key)] = value;
  }
}
// Scalar CSS variables describe the base styles. Preserve the complete source
// objects too, including sparse breakpoint overrides, for responsive consumers.
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
// Carbon's 70ms fast step is abrupt next to the hand-timed animations in frame.css
// and the Astryx timing scale this system follows, so the ladder starts at 130ms.
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

// Capture only the document baseline outside Frame. A same-element alias would
// otherwise resolve to Frame's winning value, not the earlier legacy declaration.
const foundationNames = [
  ...new Set(
    Object.values(frameThemes).flatMap((values) =>
      Object.keys(values).filter((name) => Object.hasOwn(global, name)),
    ),
  ),
].sort();
const themeSelector = (names: string[]) =>
  `:where(${names.map((name) => `[data-hashti-theme="${name}"]`).join(", ")})`;
const frameSelector = themeSelector(Object.keys(frameThemes));
const legacySelector = themeSelector(
  Object.keys(semantic).filter((name) => !Object.hasOwn(frameThemes, name)),
);
const documentBaseline = foundationNames
  .map((name) => `  --hashti-internal-legacy-${name}: var(--hashti-${name});`)
  .join("\n");
const legacyFoundations = foundationNames
  .map((name) => `  --hashti-${name}: var(--hashti-internal-legacy-${name}, ${global[name]});`)
  .join("\n");

// A layer changes contextual aliases, not the source theme. A new Theme resets
// its layer context. Portalled overlays carry both attributes from React context.
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
    // Carbon's subtle separators start at 00; the other sets start at 01.
    .map(
      (name) =>
        `  --hashti-${name}: var(--hashti-${name}-0${Math.min(layer, 2) + (name === "border-subtle" ? 0 : 1)});`,
    )
    .join("\n");

const css = `/* Carbon-derived tokens. Copyright IBM Corp. Apache-2.0.
 * Cinder changes: namespace, scoped foundations, layer aliases, and Relay/Frame themes.
 * Regenerate with: bun run build:tokens
 */
@layer hashti.tokens {
:root {\n${declarations(global)}\n}
:root:not(${frameSelector}),
:root:not(${frameSelector}) > body:not(${frameSelector}) {\n${documentBaseline}\n}
${Object.entries(semantic)
  .map(
    ([name, values]) =>
      `${name === "white" ? ":root,\n" : ""}[data-hashti-theme="${name}"] {\n${declarations(values)}\n  color-scheme: ${values["color-scheme"]};\n}`,
  )
  .join("\n")}
${frameSelector} ${legacySelector} {\n${legacyFoundations}\n}
:root, [data-hashti-theme], [data-hashti-layer="0"] {\n${aliases(0)}\n}
[data-hashti-layer="1"] {\n${aliases(1)}\n}
[data-hashti-layer="2"], [data-hashti-layer="3"] {\n${aliases(2)}\n}
}
`;

await mkdir(destination, { recursive: true });
await Promise.all([
  Bun.write(`${destination}/tokens.css`, css),
  Bun.write(
    `${destination}/tokens.json`,
    JSON.stringify(
      { themes: semantic, global, breakpoints: layout.breakpoints, typeStyles },
      null,
      2,
    ) + "\n",
  ),
]);
console.log(
  `Generated ${Object.keys(semantic).length} themes and ${Object.keys(global).length} foundations.`,
);
