import { spawn, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { normalizePath, type Plugin } from "vite";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const inputs = [
  "packages/react/src/",
  "packages/styles/src/",
  "packages/styles/scripts/",
].map((path) => normalizePath(root + path));
const outputs = ["packages/react/dist/", "packages/styles/dist/"].map((path) =>
  normalizePath(root + path),
);
const generated = new Set(
  ["tokens/tokens.css", "tokens/tokens.json", "tokens.css"].map((file) =>
    normalizePath(`${root}packages/styles/src/${file}`),
  ),
);

export function watchPackages() {
  let dispose = () => {};
  return {
    name: "hashti-package-rebuild",
    apply: "serve",
    hotUpdate({ file }) {
      // Keep resolver caches fresh; the completed build owns the preview reload.
      if (outputs.some((output) => file.startsWith(output))) return [];
    },
    configureServer(server) {
      let building = false;
      let pending = false;
      let closed = false;
      let child: ChildProcess | undefined;

      async function rebuild() {
        pending = true;
        if (building) return;
        building = true;
        while (pending && !closed) {
          pending = false;
          try {
            child = spawn("bun", ["scripts/build.ts", "--packages", "--no-clean"], {
              cwd: root,
              stdio: "inherit",
            });
            const code = await new Promise<number | null>((resolve, reject) => {
              child!.once("error", reject);
              child!.once("close", resolve);
            });
            if (code !== 0) throw new Error(`Package rebuild failed (exit ${code}).`);
            if (!pending && !closed) {
              server.moduleGraph.invalidateAll();
              server.ws.send({ type: "full-reload" });
            }
          } catch (error) {
            if (!closed) server.config.logger.error(String(error));
          }
        }
        building = false;
        child = undefined;
      }

      function changed(_event: string, file: string) {
        const path = normalizePath(file);
        if (!closed && inputs.some((input) => path.startsWith(input)) && !generated.has(path)) {
          void rebuild();
        }
      }

      server.watcher.add([...inputs, ...outputs]);
      server.watcher.on("all", changed);
      dispose = () => {
        closed = true;
        server.watcher.off("all", changed);
        child?.kill();
      };
    },
    closeBundle() {
      dispose();
    },
  } satisfies Plugin;
}
