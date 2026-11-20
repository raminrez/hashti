# hashti-new

Framework-agnostic component library built on [ui-sdk](https://ui-sdk.dev), with docs on [Fumadocs](https://fumadocs.dev) (Astro).

## Packages

| Package | Purpose |
| --- | --- |
| `@hashti/react` | React wrappers (parts, classes) composing `@ui-sdk/react` |
| `@hashti/styles` | Native CSS: design tokens + component styles keyed off `data-slot` / state attributes |
| `@hashti/react` | React adapter rendering the core primitives via `@ui-sdk/react` |
| `apps/docs` | Fumadocs documentation site (Astro + React islands) |

## Develop

```bash
bun install
bun run dev        # docs site at http://localhost:4321/docs
bun run typecheck
```

## Adding a component

1. Define the primitive in `packages/react/src` with `definePrimitive`.
2. Style it in `packages/styles/src/<name>.css` from its `data-slot` and state attributes, and add the import to `index.css`.
3. Render it in `packages/react/src/index.tsx` with `createParts`.
4. Document it in `apps/docs/content/docs`.
