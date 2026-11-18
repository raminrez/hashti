import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

const out = resolve(import.meta.dir, "../shots");
const pairs = [
  "rest",
  "hover",
  "active",
  "states",
  "pending",
  "focus",
  "rtl-fa",
  "rtl-ar",
];

interface DiffResult {
  name: string;
  pixels: number;
  percent: number;
  sizeMismatch: boolean;
}

const results: DiffResult[] = [];
for (const name of pairs) {
  const a = PNG.sync.read(Buffer.from(await Bun.file(`${out}/web-${name}.png`).arrayBuffer()));
  const b = PNG.sync.read(Buffer.from(await Bun.file(`${out}/react-${name}.png`).arrayBuffer()));
  if (a.width !== b.width || a.height !== b.height) {
    results.push({
      name,
      pixels: -1,
      percent: 100,
      sizeMismatch: true,
    });
    console.log(`${name}: SIZE MISMATCH web=${a.width}x${a.height} react=${b.width}x${b.height}`);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  const percent = (pixels / (a.width * a.height)) * 100;
  results.push({ name, pixels, percent, sizeMismatch: false });
  if (pixels > 0) {
    await writeFile(`${out}/diff-${name}.png`, PNG.sync.write(diff));
  }
  console.log(`${name}: ${pixels} px differ (${percent.toFixed(3)}%)`);
}

const worst = results.reduce((m, r) => Math.max(m, r.percent), 0);
console.log(`\nworst diff: ${worst.toFixed(3)}%`);
