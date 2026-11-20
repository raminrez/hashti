# Hashti

A React component library built on [ui-sdk](https://ui-sdk.dev): it wraps ui-sdk's headless primitives instead of re-implementing them, and ships every style as plain CSS you can reuse from Vue, Svelte, or anything else.

- **Thin wrappers.** Each of the **58 components** composes `@ui-sdk/react` and adds one class — no logic duplicated.
- **Framework-agnostic styles.** `@hashti/styles` is plain CSS keyed off `hashti-*` classes and ui-sdk `data-*` attributes, with design tokens only (`var(--hashti-*)`).
- **Hard gates.** Every commit runs typecheck (tsc), oxlint (type-aware), stylelint, and the formatter via lefthook.

```tsx
import { Button } from "@hashti/react";
import "@hashti/styles/button.css";

<Button data-size="lg" onClick={save}>
  Save
</Button>;
```

## Packages

| Package          | Purpose                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `@hashti/react`  | React wrappers composing `@ui-sdk/react` (parts, classes, re-exports)          |
| `@hashti/styles` | Design tokens + one CSS file per component, keyed off `hashti-*` / `data-*`    |
| `@hashti/utils`  | Framework-free TS helpers (`join`, the className joiner used by every wrapper) |
| `apps/docs`      | Documentation site ([Fumadocs](https://fumadocs.dev) on Astro + React islands) |

## Develop

```bash
bun install
bun run dev          # docs site at http://localhost:4321/docs
bun run typecheck    # tsc across all workspaces
bun run lint         # oxlint
bun run lint:css     # stylelint
bun run format:check # formatter check
```

Commits go through [lefthook](https://lefthook.dev): pre-commit formats and lints staged files, pre-push runs the full gate suite.

## Adding a component

1. Wrap the ui-sdk part in `packages/react/src/<name>/<name>.tsx` — compose, add the `hashti-<name>` class, export from the barrel.
2. Style it in `packages/styles/src/<name>.css` (tokens only, no hex), and add the import to `packages/styles/index.css`.
3. Document it in `apps/docs/content/docs/<name>.mdx` and add it to `meta.json`.

Naming follows ui-sdk: if ui-sdk ships it, Hashti uses its name and file layout.
