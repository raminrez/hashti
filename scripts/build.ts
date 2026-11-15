import { mkdir, rm, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { siteLicenses } from "./licenses";
const root = resolve(import.meta.dir, "..");
// Linked workspace packages resolve to source; keep them as imports so consumers
// (and this app) share one copy of each registry.
const workspaceExternal = {
  name: "workspace-external",
  setup(build: { onResolve: (options: { filter: RegExp }, callback: (args: { path: string }) => { path: string; external: boolean }) => void }) {
    build.onResolve({ filter: /^@hashti\// }, (args) => ({ path: args.path, external: true }));
  },
};
const run = async (...command: string[]) => {
  const process = Bun.spawn(command, { cwd: root, stdout: "inherit", stderr: "inherit" });
  if ((await process.exited) !== 0) throw new Error(`Build step failed: ${command.join(" ")}`);
};

await run("bun", "run", "build:tokens");
for (const name of ["tokens", "agent", "react"]) {
  const folder = `${root}/packages/${name}`;
  if (!process.argv.includes("--no-clean")) {
    await rm(`${folder}/dist`, { recursive: true, force: true });
  }
  const result = await Bun.build({
    entrypoints: [`${folder}/src/index.ts`],
    outdir: `${folder}/dist`,
    target: "browser",
    format: "esm",
    jsx: { runtime: "automatic", development: false },
    packages: "external",
    external: ["@hashti/tokens", "@hashti/agent"],
    plugins: [workspaceExternal],
    sourcemap: "linked",
    minify: false,
    ...(name === "tokens" ? {} : { banner: '"use client";' }),
  });
  if (!result.success) throw new AggregateError(result.logs, `Could not build ${name}`);
  await run("bunx", "--bun", "tsc", "-p", `packages/${name}/tsconfig.build.json`);
  await Promise.all(
    ["LICENSE", "NOTICE"].map((file) => copyFile(`${root}/${file}`, `${folder}/${file}`)),
  );
  if (name === "tokens") {
    await Promise.all(
      ["tokens.css", "tokens.json"].map((file) =>
        copyFile(`${folder}/src/${file}`, `${folder}/dist/${file}`),
      ),
    );
  } else if (name === "react") {
    const css = await Bun.build({
      entrypoints: [`${folder}/src/styles.css`],
      outdir: `${folder}/dist`,
      minify: true,
    });
    if (!css.success) throw new AggregateError(css.logs, "Could not build styles");
  }
  console.log(`Built @hashti/${name}`);
}

if (process.argv.includes("--packages")) process.exit(0);

await rm(`${root}/dist/site`, { recursive: true, force: true });
await mkdir(`${root}/dist/site`, { recursive: true });
await run("bun", "run", "--cwd", "apps/docs", "build");
// Copy site build outputs to dist/site for preview/deployment
await run("cp", "-r", `${root}/apps/docs/dist/.`, `${root}/dist/site`);
await Promise.all([
  copyFile(`${root}/LICENSE`, `${root}/dist/site/LICENSE.txt`),
  copyFile(`${root}/NOTICE`, `${root}/dist/site/NOTICE.txt`),
  Bun.write(`${root}/dist/site/THIRD_PARTY_LICENSES.txt`, await siteLicenses(root)),
]);
console.log("Built Fumadocs Astro documentation");
