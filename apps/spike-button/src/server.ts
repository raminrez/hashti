import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const styles = resolve(root, "../../packages/styles/src");
const uiSdkCoreCss = resolve(
  root,
  "../../node_modules/.bun/node_modules/@ui-sdk/core/dist/web.css",
);

async function serveCss(path: string, base: string) {
  const file = Bun.file(join(base, path));
  if (!(await file.exists())) return new Response("not found", { status: 404 });
  let text = await file.text();
  // Browsers resolve @import against the served URL; rewrite relative imports to the
  // /styles/ mount so packages/styles/src/index.css works unmodified from source.
  text = text.replaceAll('@import "./', '@import "/styles/');
  return new Response(text, {
    headers: { "Content-Type": "text/css", "Cache-Control": "no-store" },
  });
}

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 4471),
  async fetch(request) {
    const url = new URL(request.url);
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    if (path === "/hashti-styles.css") {
      // The spike contract: the same unmodified stylesheet both frameworks render against.
      return serveCss("index.css", styles);
    }
    if (path === "/ui-sdk-web.css") {
      return new Response(Bun.file(uiSdkCoreCss), {
        headers: { "Content-Type": "text/css", "Cache-Control": "no-store" },
      });
    }
    if (path.startsWith("/styles/")) {
      return serveCss(path.slice("/styles/".length), styles);
    }
    const file = Bun.file(join(root, "public", path));
    if (await file.exists()) {
      return new Response(file, {
        headers: { "Content-Type": file.type, "Cache-Control": "no-store" },
      });
    }
    return new Response("not found", { status: 404 });
  },
});

console.log(`spike-button on ${server.url.origin}`);
