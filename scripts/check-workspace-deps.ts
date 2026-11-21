// Fails when a workspace imports a package its own package.json does not declare.
//
// Why this exists: bunfig.toml sets `linker = "hoisted"` (Storybook's vitest
// addon needs it), so every dependency lands in the root node_modules and an
// import of a root-only or sibling-workspace dep resolves fine at install time.
// Bun's default isolated layout made that impossible by construction; this
// check restores the guarantee. knip's `unlisted` class covers undeclared
// transitives but deliberately treats root deps as shared, so it cannot.
import { isBuiltin } from "node:module";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;
const SOURCE = /\.(ts|tsx|js|jsx|mjs|astro)$/;

// Value imports, side-effect imports, and dynamic imports. Type-only imports
// are checked too: a type package still has to be declared (see @types below).
const IMPORT =
  /^[ \t]*(?:import|export)\b[^\n]*?\bfrom\s*["']([^"']+)["']|^[ \t]*import\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/gm;

// Non-package specifiers: relative/absolute paths, runtime builtins, Astro's
// virtual modules, and apps/docs' tsconfig path alias (`@/*` → `./src/*`).
function isPackage(spec: string): boolean {
  return (
    !/^[./]/.test(spec) &&
    !/^(node|bun|astro):/.test(spec) &&
    !spec.startsWith("@/") &&
    !isBuiltin(spec)
  );
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    // Generated or vendored trees are not hand-written workspace code.
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name === ".astro"
    )
      continue;
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* walk(path);
    else if (SOURCE.test(entry.name)) yield path;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function declaredDeps(manifestPath: string): Set<string> {
  const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
  const declared = new Set<string>();
  if (!isRecord(parsed)) return declared;
  for (const field of DEP_FIELDS) {
    const deps = parsed[field];
    if (!isRecord(deps)) continue;
    for (const name of Object.keys(deps)) declared.add(name);
  }
  return declared;
}

const failures: string[] = [];
// Matches the root `workspaces` globs ({packages,apps}/*).
for (const group of ["packages", "apps"]) {
  if (!existsSync(group)) continue;
  for (const entry of readdirSync(group, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = `${group}/${entry.name}`;
    if (!existsSync(`${dir}/package.json`)) continue;
    const declared = declaredDeps(`${dir}/package.json`);

    for (const file of walk(dir)) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(IMPORT)) {
        const spec = match[1] ?? match[2] ?? match[3];
        if (!spec || !isPackage(spec)) continue;
        const name = spec.startsWith("@")
          ? spec.split("/").slice(0, 2).join("/")
          : (spec.split("/")[0] ?? spec);
        // A bare package can be satisfied by its @types package (mdx → @types/mdx).
        if (declared.has(name) || declared.has(`@types/${name}`)) continue;
        failures.push(
          `${file}: imports "${name}", not declared in ${dir}/package.json`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error(
    [
      `${failures.length} import(s) of packages the importing workspace does not declare:`,
      ...failures.map((f) => `  ${f}`),
      "",
      "Why: the hoisted linker (bunfig.toml) lets a workspace reach any package in",
      "the root node_modules, so install-time resolution no longer proves the",
      "dependency is real. Add it to the importing package's package.json (with the",
      "version the workspace actually needs), or import it from the package that",
      "declares it.",
    ].join("\n"),
  );
  process.exit(1);
}
console.log("deps:check — every workspace import is declared");
