import { readdir, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

/** Retain verbatim notices from the installed, locked runtime dependency tree. */
export async function siteLicenses(root: string) {
  const sections = new Map<string, string>();
  async function collect(name: string, from: string) {
    const path = await realpath(createRequire(from).resolve(`${name}/package.json`));
    const pkg = await Bun.file(path).json();
    const id = `${pkg.name}@${pkg.version}`;
    if (sections.has(id)) return;
    sections.set(id, "");
    const folder = dirname(path);
    const files = (await readdir(folder))
      .filter((file) => /^(licen[cs]e|copying|notice)(\.|$)/i.test(file))
      .sort();
    const notices = await Promise.all(
      files.map(async (file) => `${file}\n\n${await Bun.file(resolve(folder, file)).text()}`),
    );
    sections.set(
      id,
      [
        id,
        `Declared license: ${pkg.license ?? "See package metadata"}`,
        ...notices,
        ...(files.length ? [] : ["The published package supplies no separate license file."]),
      ].join("\n\n"),
    );
    for (const dependency of Object.keys(pkg.dependencies ?? {}).sort())
      await collect(dependency, path);
  }

  const app = resolve(root, "apps/docs/package.json");
  for (const name of [
    "react",
    "react-dom",
    "react-aria-components",
    "fumadocs-core",
    "fumadocs-ui",
    "@fumadocs/astro",
    "astro",
  ])
    await collect(name, app);
  return [
    "Hashti documentation — third-party licenses",
    "Installed runtime dependencies. Tree-shaken code may be absent from the final bundle.",
    ...[...sections].sort(([a], [b]) => a.localeCompare(b)).map(([, text]) => text),
  ].join("\n\n============================================================\n\n");
}
