import { expect, spyOn, test } from "bun:test";
import * as processes from "node:child_process";
import { EventEmitter, once } from "node:events";
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createServer, type HotUpdateOptions, type ViteDevServer } from "vite";
import config from "./main";
import { watchPackages } from "./watch-packages";

test("package refresh queues edits, retries failures, and stops with Vite", async () => {
  const children: processes.ChildProcess[] = [];
  const createChild = () => {
    const child = new processes.ChildProcess();
    children.push(child);
    return child;
  };
  const spawn = spyOn(processes, "spawn").mockImplementation(createChild as typeof processes.spawn);
  const watcher = Object.assign(new EventEmitter(), { add: () => {} });
  const messages: unknown[] = [];
  const errors: string[] = [];
  let invalidations = 0;
  const server = {
    watcher,
    moduleGraph: { invalidateAll: () => invalidations++ },
    ws: { send: (message: unknown) => messages.push(message) },
    config: { logger: { error: (message: string) => errors.push(message) } },
  };
  const plugin = watchPackages();
  const change = (file: string) => watcher.emit("all", "change", resolve(import.meta.dir, file));

  try {
    plugin.configureServer.call(
      {} as ThisParameterType<typeof plugin.configureServer>,
      server as unknown as ViteDevServer,
    );
    change("../../../packages/styles/src/tokens/tokens.css");
    change("../../../packages/styles/src/tokens/tokens.json");
    change("../../../packages/react/dist/index.js");
    expect(spawn).not.toHaveBeenCalled();

    change("../../../packages/react/src/buttons.tsx");
    change("../../../packages/react/src/frame.css");
    expect(spawn).toHaveBeenCalledTimes(1);
    children[0]!.emit("close", 0);
    await Promise.resolve();
    expect(spawn).toHaveBeenCalledTimes(2);
    expect(messages).toEqual([]);

    children[1]!.emit("close", 1);
    await Promise.resolve();
    expect(errors).toHaveLength(1);
    expect(messages).toEqual([]);

    change("../../../packages/styles/src/tokens/frame.ts");
    children[2]!.emit("close", 0);
    await Promise.resolve();
    expect(invalidations).toBe(1);
    expect(messages).toEqual([{ type: "full-reload" }]);

    change("../../../packages/styles/scripts/generate.ts");
    const kill = spyOn(children[3]!, "kill").mockReturnValue(true);
    plugin.closeBundle();
    expect(kill).toHaveBeenCalledTimes(1);
    expect(watcher.listenerCount("all")).toBe(0);
    children[3]!.emit("close", null);
    await Promise.resolve();
    expect(errors).toHaveLength(1);
    expect(messages).toHaveLength(1);
    kill.mockRestore();
  } finally {
    plugin.closeBundle();
    spawn.mockRestore();
  }
});

test("package outputs defer HMR while story edits retain normal updates", () => {
  const plugin = watchPackages();
  const update = (file: string) =>
    plugin.hotUpdate.call(
      {} as ThisParameterType<typeof plugin.hotUpdate>,
      {
        file: resolve(import.meta.dir, file),
      } as HotUpdateOptions,
    );

  expect(update("../../../packages/react/dist/styles.css")).toEqual([]);
  expect(update("../../../packages/styles/dist/index.css")).toEqual([]);
  expect(update("../stories/actions.css")).toBeUndefined();
});

test("Vite resolves public CSS after a missing build output is restored", async () => {
  // Vite resolves symlinks in its root, so fixture paths and fs.allow must match.
  const directory = await realpath(await mkdtemp(join(tmpdir(), "hashti-storybook-")));
  const app = join(directory, "apps/storybook");
  const pkg = join(directory, "packages/react");
  const stylesheet = join(pkg, "dist/styles.css");
  const events = new EventEmitter();
  let watching: Promise<unknown> = Promise.resolve();
  let server: ViteDevServer | undefined;

  try {
    await mkdir(join(app, "node_modules/@hashti"), { recursive: true });
    await mkdir(dirname(stylesheet), { recursive: true });
    await symlink(pkg, join(app, "node_modules/@hashti/react"), "dir");
    await writeFile(
      join(pkg, "package.json"),
      JSON.stringify({ name: "@hashti/react", exports: { "./styles.css": "./dist/styles.css" } }),
    );
    await writeFile(join(app, "preview.js"), 'import "@hashti/react/styles.css";');
    const vite = await config.viteFinal!(
      {
        configFile: false,
        root: app,
        cacheDir: join(directory, ".vite"),
        logLevel: "silent",
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, ws: false, fs: { allow: [directory] } },
      },
      {} as Parameters<NonNullable<typeof config.viteFinal>>[1],
    );
    server = await createServer({
      ...vite,
      // Keep package builds and file events confined to this fixture.
      plugins: [
        {
          name: "observe-restored-stylesheet",
          configureServer(vite) {
            watching = once(vite.watcher, "ready", { signal: AbortSignal.timeout(3000) });
            vite.watcher.add(dirname(stylesheet));
          },
          hotUpdate({ file }) {
            if (file === stylesheet) {
              events.emit("restored");
              return [];
            }
          },
        },
      ],
    });
    await watching;
    await expect(server.transformRequest("/preview.js")).rejects.toThrow(
      'Failed to resolve import "@hashti/react/styles.css"',
    );

    const restored = once(events, "restored", { signal: AbortSignal.timeout(3000) });
    await writeFile(stylesheet, ":root { color: black; }");
    await restored;
    expect((await server.transformRequest("/preview.js"))?.code).toContain(stylesheet);
  } finally {
    await server?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
