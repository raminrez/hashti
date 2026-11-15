import { gzipSync } from "node:zlib";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dir, "../dist/site");
const compressible = /\.(html|css|js|mjs|json|svg|map|txt|xml)$/i;
// Preview serves raw build output; compress like a real host so local perf numbers mean something.
const cache = new Map<string, ArrayBuffer>();

async function respond(file: Bun.BunFile, request: Request, headers: Record<string, string>) {
  const accept = request.headers.get("accept-encoding") ?? "";
  const filename = file.name ?? "";
  if (!compressible.test(filename) || !/\bgzip\b/.test(accept))
    return new Response(file, { headers });
  const key = `${filename}:${file.lastModified}`;
  let body = cache.get(key);
  if (!body) {
    body = Uint8Array.from(gzipSync(await file.arrayBuffer())).buffer;
    cache.set(key, body);
  }
  return new Response(request.method === "HEAD" ? null : body, {
    headers: {
      ...headers,
      "Content-Type": file.type || "application/octet-stream",
      "Content-Encoding": "gzip",
      Vary: "Accept-Encoding",
    },
  });
}

export async function startPreview({
  port = Number(process.env.PORT ?? 3000),
  hostname = process.env.HOST ?? "127.0.0.1",
} = {}) {
  if (!(await Bun.file(`${root}/index.html`).exists()))
    throw new Error("Run bun run build before starting the production preview.");
  return Bun.serve({
    hostname,
    port,
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/health") return Response.json({ status: "ok", runtime: Bun.version });
      if (request.method !== "GET" && request.method !== "HEAD")
        return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
      let path: string;
      try {
        path = decodeURIComponent(url.pathname);
      } catch {
        return new Response("Bad request", { status: 400 });
      }
      const filename = resolve(root, `.${path}`);
      if (!filename.startsWith(`${root}${sep}`) && filename !== root)
        return new Response("Not found", { status: 404 });
      const file = Bun.file(filename);
      if (filename !== root && (await file.exists()))
        return respond(file, request, {
          "Cache-Control":
            /-[a-z0-9]{8,}\./i.test(filename) || path.startsWith("/_astro/")
              ? "public, max-age=31536000, immutable"
              : "no-cache",
        });
      // Directory routes (e.g. /docs, /docs/components/button) resolve to their index.html
      const index = Bun.file(`${filename}/index.html`);
      if (await index.exists()) return respond(index, request, { "Cache-Control": "no-cache" });
      // Extensionless paths fall back to the SPA entry
      if (!/\.[a-z0-9]+$/i.test(path))
        return respond(Bun.file(`${root}/index.html`), request, { "Cache-Control": "no-cache" });
      return new Response("Not found", { status: 404 });
    },
  });
}

if (import.meta.main) {
  const server = await startPreview();
  console.log(`Hashti production preview · http://${server.hostname}:${server.port}`);
}
