import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

// Guards the failure modes the 2026-11 component review had to repair by hand:
// a component stylesheet nobody imports, and a class the CSS styles but no
// component renders. See docs/css-conventions.md.

const root = join(import.meta.dir, "../..");
const src = join(root, "packages/react/src");
const componentsDir = join(src, "components");
const stylesEntry = readFileSync(join(src, "styles.css"), "utf8");

// Classes that are hooks for consumers or for our own generated markup rather
// than a class any single .tsx file spells out.
const allowlist = new Set(["hashti-theme", "hashti-sr-only", "hashti-visually-hidden"]);

function listComponentCss(): string[] {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = join(componentsDir, entry.name, `${entry.name}.css`);
      return existsSync(file) ? [file] : [];
    });
}

function collectTsx(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectTsx(full, out);
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const tsxSource = collectTsx(src)
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

// Classes built by fieldClassName(), e.g. `hashti-${name}` in Field.
const fieldClasses = new Set<string>();
for (const match of tsxSource.matchAll(/fieldClassName\("([a-z0-9-]+)"\)/g)) {
  fieldClasses.add(`hashti-${match[1]}`);
}

// Template-built classes such as `hashti-listbox-item--${size}` never appear
// literally; match their fixed prefix instead. A bare `hashti-` prefix would
// make every class look rendered, so it is not a usable prefix.
const tsxPrefixes = new Set<string>();
for (const match of tsxSource.matchAll(/hashti-[a-z0-9-]*\$\{/g)) {
  const prefix = match[0].replace(/\$\{$/, "");
  if (prefix.length > "hashti-".length) tsxPrefixes.add(prefix);
}

function isRendered(className: string): boolean {
  if (allowlist.has(className)) return true;
  if (fieldClasses.has(className)) return true;
  // Boundary-aware: `.hashti-color` must not be satisfied by `hashti-color-area`,
  // or a dead rule hides behind any class that extends its name.
  const exact = new RegExp(`(?<![a-z0-9-])${className}(?![a-z0-9-])`);
  if (exact.test(tsxSource)) return true;
  for (const prefix of tsxPrefixes) {
    if (className.startsWith(prefix)) return true;
  }
  return false;
}

describe("css architecture", () => {
  const files = listComponentCss();

  test("every component stylesheet is imported", () => {
    const orphans = files.filter((file) => {
      const specifier = `./${relative(src, file).replace(/\\/g, "/")}`;
      return !stylesEntry.includes(specifier);
    });
    expect(orphans.map((file) => relative(root, file))).toEqual([]);
  });

  test("component stylesheets stay inside a cascade layer", () => {
    const unlayered = files.filter((file) => !readFileSync(file, "utf8").includes("@layer hashti"));
    expect(unlayered.map((file) => relative(root, file))).toEqual([]);
  });

  test("every hashti class in component css has a renderer", () => {
    const dead: string[] = [];
    for (const file of files) {
      const css = readFileSync(file, "utf8");
      const names = new Set([...css.matchAll(/\.(hashti-[a-z0-9-]+)/g)].map((match) => match[1]!));
      for (const name of names) {
        if (!isRendered(name)) dead.push(`${relative(root, file)}: .${name}`);
      }
    }
    expect(dead).toEqual([]);
  });
});
