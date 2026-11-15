import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const destination = resolve(root, "dist/packages");
await mkdir(destination, { recursive: true });
const packages = [];

for (const name of ["tokens", "react", "agent"]) {
  const folder = resolve(root, `packages/${name}`);
  if (!(await Bun.file(`${folder}/dist/index.d.ts`).exists()))
    throw new Error("Run bun run build before packing the libraries.");
  const pkg = await Bun.file(`${folder}/package.json`).json();
  const process = Bun.spawn(
    [Bun.argv[0]!, "pm", "pack", "--destination", destination, "--quiet", "--ignore-scripts"],
    { cwd: folder, stdout: "pipe", stderr: "inherit" },
  );
  const output = (await new Response(process.stdout).text()).trim();
  if ((await process.exited) !== 0) throw new Error(`Could not pack ${pkg.name}`);
  const filename = `${pkg.name.replace(/^@/, "").replace("/", "-")}-${pkg.version}.tgz`;
  const file = Bun.file(resolve(destination, filename));
  const bytes = await file.arrayBuffer();
  packages.push({
    name: pkg.name,
    version: pkg.version,
    filename,
    bytes: file.size,
    sha256: new Bun.CryptoHasher("sha256").update(bytes).digest("hex"),
  });
  console.log(`Packed ${pkg.name} · ${output}`);
}

await Bun.write(resolve(destination, "manifest.json"), `${JSON.stringify(packages, null, 2)}\n`);
