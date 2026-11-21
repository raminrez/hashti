#!/usr/bin/env node
// extract-app-graph.mjs — repo-local, source-aware resolver for the Hashti docs site
// (Astro + fumadocs content collection). Adapted from the sb-flows reference template.
//
// Why a local resolver: extract-flows.sh knows react-router / next / tanstack / inertia /
// nanostores. This repo is Astro file routes + a fumadocs content collection, so the generic
// pass reports 0 routes / 0 edges. Everything below is read from source with file:line
// provenance; nothing is modeled. Anything unattributable goes to unresolvedEdges.
//
// ADAPT-1 (routes): `apps/docs/content/docs/meta.json#pages` (ordered) + src/pages/*.astro.
// ADAPT-2 (nav): Astro `<a href>` (home → docs), fumadocs DocsLayout sidebar (page tree from
//   meta.json), fumadocs DocsPage prev/next footer, MDX markdown links, DefaultNotFound.
// ADAPT-3 (roles): none — the docs site is fully public (no guards in source; roleSignals []).
//
// Writes: .storybook/app-graph.json (AppFlowGraph feed), .storybook/flows.json (route/edge
// envelope), .storybook/component-pages.json (docs-page resolution added to the existing map).
// Run: bunx node .storybook/scripts/extract-app-graph.mjs  (or: node …)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = "apps/docs/content/docs";
const META_FILE = `${CONTENT_DIR}/meta.json`;
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");
const write = (rel, data) =>
  writeFileSync(join(ROOT, rel), JSON.stringify(data, null, 2) + "\n");

// ── ADAPT-1: routes ───────────────────────────────────────────────────────────────────────────
// One route per content page (meta.json order = sidebar + prev/next order) plus the home page,
// which is a real Astro page, and the 404 surface. API/image/llms endpoints are not screens.
const meta = JSON.parse(read(META_FILE));
const fmTitle = (text, fallback) =>
  (text.match(/^title:\s*(.+)$/m)?.[1] ?? fallback)
    .trim()
    .replace(/^["']|["']$/g, "");

const docRoutes = meta.pages.map((id, idx) => {
  const file = `${CONTENT_DIR}/${id}.mdx`;
  return {
    key: id,
    path: id === "index" ? "/docs" : `/docs/${id}`,
    file,
    title: fmTitle(read(file), id),
    order: idx + 1,
  };
});

const HOME = {
  key: "home",
  path: "/",
  file: "apps/docs/src/pages/index.astro",
  title: "Hashti",
  order: 0,
};
const NOT_FOUND = {
  key: "404",
  path: "/404",
  file: "apps/docs/src/pages/404.astro",
  title: "Not found",
  order: docRoutes.length + 1,
};
const routes = [HOME, ...docRoutes, NOT_FOUND];
const routeByPath = new Map(routes.map((r) => [r.path, r]));
const docsEntries = docRoutes.filter((r) => r.key !== "index");

// ── ADAPT-3: roles — no guards in this repo, so one public lane (+ the 404 surface) ───────────
const lanes = ["public", "system"];
const roleOf = (route) => (route.key === "404" ? "system" : "public");

// ── ADAPT-2: edges (every one carries file:line) ─────────────────────────────────────────────
const edgeMap = new Map();
const unresolvedEdges = [];
function addEdge(from, to, kind, attribution, site) {
  if (!from || !to || from === to) return;
  const id = `${from}→${to}→${kind}`;
  if (!edgeMap.has(id)) {
    edgeMap.set(id, {
      from,
      to,
      kind,
      label: site.cta || `${site.fn} · ${site.source}`,
      verb: site.fn,
      source: site.source,
      attribution,
      provenance: [],
    });
  }
  const provenance = `${site.file}:${site.line} (${site.fn})`;
  const e = edgeMap.get(id);
  if (!e.provenance.includes(provenance)) e.provenance.push(provenance);
}

// (a) home → docs: apps/docs/src/pages/index.astro:14 <a href={docsRoute}> "Open Docs"
addEdge("/", "/docs", "link", "page", {
  file: "apps/docs/src/pages/index.astro",
  line: 14,
  fn: "a href",
  source: "index.astro",
  cta: "Open Docs",
});

// (b) 404 → home: fumadocs DefaultNotFound renders href="/" ("Back to Home"), used by 404.astro
addEdge("/404", "/", "link", "page", {
  file: "apps/docs/src/components/home.tsx",
  line: 20,
  fn: "DefaultNotFound",
  source: "home.tsx",
  cta: "Back to Home",
});

// (c) persistent nav chrome — fumadocs DocsLayout renders the page tree as the sidebar on every
// /docs page. Anchored at the docs entry (AppFlowGraph convention for chrome that links from
// every screen) instead of emitting the N×N it really is.
for (const r of docsEntries) {
  addEdge("/docs", r.path, "nav", "persistent-nav", {
    file: "apps/docs/src/components/docs.tsx",
    line: 43,
    fn: "DocsLayout tree",
    source: "docs-sidebar",
    cta: r.title,
  });
}

// (d) footer pagination — fumadocs DocsPage derives Previous/Next from the same page tree. Next
// only: each Previous link is the exact reverse of the previous page's Next link.
for (let i = 0; i < docRoutes.length - 1; i++) {
  const from = docRoutes[i];
  const to = docRoutes[i + 1];
  addEdge(from.path, to.path, "link", "pagination", {
    file: "apps/docs/src/components/docs.tsx",
    line: 44,
    fn: "DocsPage footer",
    source: "docs-footer",
    cta: to.title,
  });
}

// (e) MDX cross-links — markdown links to another docs route; the link text is the clicked copy.
for (const r of docRoutes) {
  const lines = read(r.file).split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\[([^\]]+)\]\((\/docs[^)\s#]*)\)/g)) {
      const to = m[2].replace(/\/$/, "") || "/docs";
      if (!routeByPath.has(to)) {
        unresolvedEdges.push({
          from: r.path,
          to: m[2],
          fn: "mdx link",
          provenance: `${r.file}:${i + 1}`,
          reason: "markdown link target is not a captured route",
        });
        continue;
      }
      addEdge(r.path, to, "link", "page-body", {
        file: r.file,
        line: i + 1,
        fn: "mdx link",
        source: r.key,
        cta: m[1],
      });
    }
  });
}

// (f) structural URL hierarchy — /docs is a child of /, every doc page is a child of /docs.
function parentOf(path) {
  if (path === "/docs") return "/";
  if (path.startsWith("/docs/")) return "/docs";
  return undefined;
}
for (const r of docRoutes) {
  const parent = parentOf(r.path);
  if (!parent) continue;
  const id = `${parent}→${r.path}→subroute`;
  if (!edgeMap.has(id))
    edgeMap.set(id, {
      from: parent,
      to: r.path,
      kind: "subroute",
      label: "sub-route",
      verb: "sub-route",
      source: META_FILE,
      attribution: "route-hierarchy",
      provenance: [
        "apps/docs/src/pages/docs/[...slug].astro (Astro catch-all)",
      ],
    });
}

const edges = [...edgeMap.values()];
const nodes = routes.map((r) => ({
  id: r.path,
  key: r.key,
  label: r.title,
  role: roleOf(r),
  page: r.key === "404" ? "NotFound" : r.key === "home" ? "Home" : "Docs",
  storyId: null,
  coverage: "none",
  parent: parentOf(r.path),
  group: r.key === "home" ? "root" : r.key === "404" ? "system" : "docs",
  order: r.order,
  entry: r.key === "home" || r.key === "index" || undefined,
}));

const byAttribution = {};
for (const e of edges)
  byAttribution[e.attribution] = (byAttribution[e.attribution] || 0) + 1;
const navEdges = edges.filter(
  (e) => e.attribution !== "route-hierarchy",
).length;
const graph = {
  generatedAt: new Date().toISOString(),
  extractor: ".storybook/scripts/extract-app-graph.mjs",
  lanes,
  metadata: {
    app: "Hashti docs site — Astro file routes + fumadocs content collection",
    routesSource: `${META_FILE}#pages (ordered) + apps/docs/src/pages/*.astro`,
    navSource:
      "apps/docs/src/components/docs.tsx (fumadocs DocsLayout sidebar + DocsPage footer)",
    roles:
      "none in source — every docs page is public; 404 sits in the system lane",
    notScreens: [
      "apps/docs/src/pages/api/search.ts",
      "apps/docs/src/pages/og/docs/[...slug]/image.webp.ts",
      "apps/docs/src/pages/[...path].ts (llms markdown endpoints)",
    ],
    coverage:
      "no page-level stories exist yet, so every node is coverage:none with storyId:null",
  },
  stats: {
    routes: nodes.length,
    navCallSites: edges.length,
    navEdges,
    hierarchyEdges: edges.length - navEdges,
    backEdges: 0,
    backByVia: {},
    backCallSites: 0,
    ctaLabels: edges.filter((e) => e.attribution !== "route-hierarchy").length,
    labelFallbacks: 0,
    dynamicCallSites: 0,
    unresolvedEdges: unresolvedEdges.length,
    unresolvedBack: 0,
    byAttribution,
  },
  nodes,
  edges: edges.map((e) => ({
    ...e,
    labelVia: e.attribution === "route-hierarchy" ? "structural" : "cta",
    count: e.provenance.length,
  })),
  dynamicCallSites: [],
  unresolvedEdges,
  unresolvedBack: [],
};
write(".storybook/app-graph.json", graph);

// ── flows.json envelope (same shape as extract-flows.sh, Astro flavor added) ──────────────────
const flows = {
  generatedAt: graph.generatedAt,
  dominantRouter: "astro",
  routerTies: [],
  routerCounts: {
    "react-router": 0,
    "nextjs-pages": 0,
    "nextjs-app": 0,
    tanstack: 0,
    inertia: 0,
    nanostores: 0,
    astro: docRoutes.length,
  },
  routes: {
    reactRouter: [],
    nextjsPages: [],
    nextjsApp: [],
    tanstack: [],
    inertia: [],
    nanostores: [],
    astro: routes.map((r) => ({
      file: r.file,
      path: r.path,
      title: r.title,
      access: roleOf(r) === "system" ? "public" : roleOf(r),
      recommendedStates: ["default"],
    })),
  },
  routeCount: routes.length,
  edges: graph.edges
    .filter((e) => e.attribution !== "route-hierarchy")
    .map((e) => ({
      kind: e.kind,
      from: e.from,
      to: e.to,
      label: e.label,
      attribution: e.attribution,
      file: e.provenance[0].replace(/:\d+ .*$/, ""),
      line: Number(e.provenance[0].match(/:(\d+)/)?.[1] ?? 0),
    })),
  edgeCount: graph.stats.navEdges,
  edgeNote:
    "Recovered by .storybook/scripts/extract-app-graph.mjs — the generic extractor has no Astro pass. Every edge carries file:line provenance; see app-graph.json for the full chains.",
  navSources: [
    {
      kind: "sidebar",
      file: "apps/docs/src/components/docs.tsx",
      signal: "layout",
    },
  ],
  navSourceCount: 1,
  navSourceNote:
    "fumadocs DocsLayout renders the content page tree as sidebar chrome on every /docs page. Its links are folded into edges[] as kind:nav anchored at /docs.",
  adhocSwitchers: [],
  adhocSwitcherCount: 0,
  wizards: [],
  wizardCount: 0,
  overlays: [],
  overlayCount: 0,
  flowCount: docRoutes.length,
  perScreenRecommendations: [],
  accessSummary: { public: routes.length - 1, system: 0 },
  roleSignals: [],
  roleNote:
    "No access guards exist in this repo (grep for route guards/role checks is empty): a public component docs site with one persona.",
};
write(".storybook/flows.json", flows);

// ── component-pages.json — fill `pages` for the existing usage map (cite it, don't re-derive) ──
// The map itself comes from sb-inventory (component-usage + project-inventory + tokens). This
// pass only answers "which docs page renders it": MDX imports (direct + via its *-demo island).
const reportPath = ".storybook/component-pages.json";
const report = existsSync(join(ROOT, reportPath))
  ? JSON.parse(read(reportPath))
  : { components: {}, tokens: {}, fileIndex: {} };

const pageOf = new Map(routeByPath);
const pageRef = (r) => ({
  path: r.path,
  title: r.title,
  role: roleOf(r),
  storyId: null,
});
const demoImport =
  /from\s+["'](?:\.\.\/)*\.?\.?\/?src\/components\/([\w-]+)["']/;
const libImport = /import\s*\{([^}]+)\}\s*from\s+["']@hashti\/react["']/;

// docs page → demo islands it imports, and @hashti/react components it imports directly
const pagesByDemo = new Map(); // demo module id → Set<route path>
const pagesByLib = new Map(); // library component name → Set<route path>
for (const r of docRoutes) {
  const text = read(r.file);
  for (const m of text.matchAll(new RegExp(demoImport.source, "g"))) {
    if (!pagesByDemo.has(m[1])) pagesByDemo.set(m[1], new Set());
    pagesByDemo.get(m[1]).add(r.path);
  }
  for (const m of text.matchAll(new RegExp(libImport.source, "g"))) {
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0];
      if (!name) continue;
      if (!pagesByLib.has(name)) pagesByLib.set(name, new Set());
      pagesByLib.get(name).add(r.path);
    }
  }
}

// a demo island that renders @hashti/react components makes them appear on its page too
const demoUsesLib = new Map(); // demo module id → [library names]
for (const demoId of pagesByDemo.keys()) {
  const file = `apps/docs/src/components/${demoId}.tsx`;
  if (!existsSync(join(ROOT, file))) continue;
  const names = [];
  for (const m of read(file).matchAll(new RegExp(libImport.source, "g")))
    for (const raw of m[1].split(","))
      names.push(raw.trim().split(/\s+as\s+/)[0]);
  demoUsesLib.set(demoId, names);
}

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
const allDocs = docRoutes.map(pageRef);
for (const [name, entry] of Object.entries(report.components)) {
  const found = new Set();
  const demoId = name.endsWith("Demo") ? kebab(name) : null;
  if (demoId && pagesByDemo.has(demoId))
    for (const p of pagesByDemo.get(demoId)) found.add(p);
  if (pagesByLib.has(name)) for (const p of pagesByLib.get(name)) found.add(p);
  for (const [id, libs] of demoUsesLib)
    if (libs.includes(name) && pagesByDemo.has(id))
      for (const p of pagesByDemo.get(id)) found.add(p);
  // app-shell components are rendered by the layouts, not by one page
  if (name === "Provider") for (const p of allDocs) found.add(p.path);
  if (name === "Docs") for (const p of allDocs) found.add(p.path);
  if (name === "Home") {
    found.add("/");
    found.add("/404"); // NotFound renders Home with DefaultNotFound
  }
  entry.pages = [...found]
    .map((p) => pageOf.get(p))
    .filter(Boolean)
    .toSorted((a, b) => a.path.localeCompare(b.path))
    .map(pageRef);
}

// fileIndex: keep the inventory's file→component map, resolve its `pages` the same way
for (const fileEntry of Object.values(report.fileIndex ?? {})) {
  const c = report.components[fileEntry.component];
  fileEntry.pages = c ? c.pages : [];
}

// token pages: union of the pages of the components that use the token
for (const tokenEntry of Object.values(report.tokens ?? {})) {
  const seen = new Map();
  for (const c of tokenEntry.components ?? [])
    for (const p of report.components[c]?.pages ?? [])
      if (!seen.has(p.path)) seen.set(p.path, p);
  if (seen.size) tokenEntry.pages = [...seen.values()];
}

report.generatedAt = graph.generatedAt;
report.meta = {
  ...report.meta,
  note: "Component graph from sb-inventory; `pages` resolved by .storybook/scripts/extract-app-graph.mjs from the Astro/fumadocs routes (MDX imports + demo islands). Static import analysis — dynamic/aliased imports may under-link.",
  flowsExtractor: graph.extractor,
  routeCount: routes.length,
};
write(reportPath, report);

// ── self-diagnosis — never present a thin graph as complete ──────────────────────────────────
const unresolvedTotal = unresolvedEdges.length;
if (navEdges < nodes.length || unresolvedTotal > navEdges / 2) {
  console.error(
    `⚠ LIKELY UNDER-EXTRACTION: ${nodes.length} route(s), ${navEdges} nav edge(s), ` +
      `${unresolvedTotal} unresolved. Revisit ADAPT-1/2 against the codebase.`,
  );
  for (const u of unresolvedEdges.slice(0, 8))
    console.error(`  ${u.provenance} → ${u.to} — ${u.reason}`);
} else {
  console.log(
    `✓ extraction healthy — ${navEdges} nav edges over ${nodes.length} routes ` +
      `(${graph.stats.hierarchyEdges} subroute), ${unresolvedTotal} unresolved (all with provenance).`,
  );
}
console.log(
  `Wrote app-graph.json (${nodes.length} nodes, ${edges.length} edges), flows.json, ` +
    `component-pages.json (${Object.keys(report.components).length} components)`,
);
