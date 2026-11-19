# Plan 001: Add the Divider component (ui-sdk separator + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 3ba8f41..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: migration (component build-out, cycle 1 of the Hashti component program)
- **Planned at**: commit `e41909b`, 2026-11-19; **re-baselined at `0080aa1` and `3ba8f41`** —
  the typecheck gate was fixed on main before execution (see Current state).

## Why this matters

Divider is the first component of the Hashti build-out. It establishes the
pattern every later component copies: a **pure wrapper** in `@hashti/react`
that composes a ui-sdk part, adds the Hashti class name, and nothing else —
no re-implemented state, keyboard, focus, or ARIA — with **all styling in
`@hashti/styles`**. If this pattern lands clean, cycles 2+ are mechanical.

## Current state

The repo is a bun workspace monorepo (`packages/*`, `apps/*`):

- `packages/react/src/index.tsx` — the whole `@hashti/react` barrel today
  (16 lines). This is the wrapper exemplar to match:

  ```tsx
  "use client"

  import { createParts } from "@ui-sdk/react/primitive"
  import { button, hashtiSwitch } from "@hashti/core"

  export const { Root: Button } = createParts(button, { root: "button" })

  export const { Root: Switch } = createParts(hashtiSwitch, { root: "button" })
  ```

- `packages/core/src/button.ts` — exemplar of a Hashti-owned primitive
  (`definePrimitive`). **Divider needs no core primitive**: ui-sdk already
  ships the `separator` primitive, and Divider adds no Hashti-owned state.
  Do not touch `packages/core` except for the script added in Step 1.
- `packages/styles/index.css` — layer statement + imports:

  ```css
  @layer hashti.tokens, hashti.components;
  @import "./src/tokens.css" layer(hashti.tokens);
  @import "./src/button.css" layer(hashti.components);
  @import "./src/switch.css" layer(hashti.components);
  ```

- `packages/styles/src/tokens.css` — a small hand-rolled token subset
  (`--hashti-bg`, `--hashti-fg`, `--hashti-muted`, `--hashti-border`,
  `--hashti-primary`, `--hashti-primary-hover`, `--hashti-primary-fg`,
  `--hashti-ring`) with a `@media (prefers-color-scheme: dark)` override
  block. The full design token source is `design/tokens.css` (not imported
  by any package yet — do not switch to it in this plan).
- `apps/docs/content/docs/button.mdx` + `meta.json` — the docs-page pattern:
  frontmatter (`title`, `description`), an `import { X } from '@hashti/react'`,
  live JSX examples, a props table, and a page id listed in `meta.json`'s
  `pages` array (currently `["index", "button", "switch"]`).
- `packages/core/package.json` and `packages/react/package.json` **have a
  `types:check` script** (`tsc --noEmit`) since commit `0080aa1`, which also
  fixed a pre-existing type error in `packages/core/src/button.ts` (missing
  `api` broke `definePrimitive`'s Options inference). `packages/react` has
  `@types/react` as a devDependency since commit `3ba8f41`.
  `bun run typecheck` from the repo root passes. Do not re-do Step 1 of an
  earlier revision of this plan; start at Step 2.
- `packages/*/tsconfig.json` extend `tsconfig.base.json`
  (`strict`, `noEmit`, `jsx: react-jsx`, `include: ["src"]`). The root
  script `bun --filter '*' types:check` runs every workspace's
  `types:check`, including `apps/docs` (`astro sync && tsc --noEmit`).

### ui-sdk separator facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/separator.md`)

Use the **ready-made component**: `import { Separator } from "@ui-sdk/react/separator"`.

- The rendered root carries `data-slot="separator"`, `role="separator"`,
  `aria-orientation`, and `data-orientation` (`"horizontal"` | `"vertical"`).
- `decorative` prop → `role="none"`, no `aria-orientation`; `data-orientation`
  is kept for styling.
- Props: `orientation?`, `decorative?`, `debug?`. It never takes focus.
- Styling is up to the consumer: "Give it a background, a height when it's
  horizontal and a width when it's vertical, and use `data-orientation` to
  tell them apart. A vertical line takes its row's height with
  `align-self: stretch`."
- `className` passed to the part is merged (ui-sdk joins class names) — read
  `docs/rendering.md` §"Class names" if merge behavior needs confirmation.
- Do NOT import from `@ui-sdk/core/separator`: `@hashti/react` does not
  depend on `@ui-sdk/core`, and adding it is out of scope (decided by the
  reviewer after executor STOP report, cycle 1).

### Design rules that bite (from `design/DESIGN.md`, `design/css-conventions.md`, `design/extraction/tokens.md`)

- Divider color role: **`#dde1e8` light / `#3e424d` dark**. In the design
  token table (`design/extraction/tokens.md` line 604) the Divider row maps
  to `border-subtle-00/01/02` — use `--hashti-border-subtle-00`.
- Style the component's **own class** (`.hashti-divider`), not bare
  `[data-slot]`; `data-slot` stays on the DOM as an additive anatomy hook.
- Colours/spacings only via `var(--hashti-*)`; **a hex value in a component
  stylesheet is a bug**.
- A separator is a non-interactive surface: **no focus ring, no hover state,
  no transition** (focus-ring matrix: "Non-interactive surfaces: none").
- Keyboard focus ring rules do not apply; do not add any.

## Commands you will need

| Purpose   | Command                                        | Expected on success            |
| --------- | ---------------------------------------------- | ------------------------------ |
| Install   | `bun install`                                  | exit 0                         |
| Typecheck | `bun run typecheck` (root; runs all workspaces) | exit 0, no errors             |
| Docs sync | `cd apps/docs && bun run types:check`          | exit 0 (included in root run)  |

There is **no lint setup and no test runner** in this repo yet — out of scope
for this plan; the reviewer runs the rendered check instead.

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/divider/divider.tsx` — create
- `packages/react/src/divider/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/tokens.css` — add one token (light + dark)
- `packages/styles/src/divider.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/content/docs/divider.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"divider"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/core/src/*` — no new primitive; ui-sdk's `separator` is the source of truth
- `packages/styles/src/button.css`, `switch.css`, `src/tokens.css` existing tokens — do not rename or restructure
- `design/tokens.css` — reference only, never imported by packages in this plan
- Any lint/test infrastructure
- `apps/docs` source code (only content files listed above)

## Git workflow

- Work on the branch checked out in your worktree (the reviewer creates it).
- Commit per logical step; message style: plain imperative, e.g.
  `divider: add typecheck scripts`, `divider: add Divider component`.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: ~~Add `types:check` scripts~~ — DONE on main (commit `0080aa1`)

The scripts exist and `bun run typecheck` passes. Skip to Step 2.

### Step 2: Create the Divider wrapper in `@hashti/react`

`packages/react/src/divider/divider.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import { Separator } from "@ui-sdk/react/separator"

function Divider({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={`hashti-divider${className ? ` ${className}` : ""}`} {...props} />
}

export { Divider }
```

Notes:

- The wrapper's only job is the `hashti-divider` class; every behavior prop
  (`orientation`, `decorative`, `render`, ARIA props) passes through untouched.
- `@types/react` is a devDependency of `packages/react` since commit
  `3ba8f41`; `ComponentProps<typeof Separator>` resolves through it.
- If `ComponentProps<typeof Separator>` does not resolve (check what
  `@ui-sdk/react/separator` exports — a part, not a plain component), fall
  back to `ComponentProps<"div"> & { orientation?: "horizontal" | "vertical";
  decorative?: boolean }` and keep it compiling under `strict`.

`packages/react/src/divider/index.ts`:

```ts
export { Divider } from "./divider"
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Divider } from "./divider"
```

**Verify**: `bun run typecheck` → exit 0.

### Step 3: Add the divider token

In `packages/styles/src/tokens.css`, add to the `:root` block:

```css
--hashti-border-subtle-00: #dde1e8;
```

and to the `@media (prefers-color-scheme: dark)` block:

```css
--hashti-border-subtle-00: #3e424d;
```

(Values from `design/DESIGN.md` divider role; token name from
`design/extraction/tokens.md`'s Divider row. Do not add sibling
`border-subtle-01/02` tokens — one token, one use.)

**Verify**: `grep -c "border-subtle-00" packages/styles/src/tokens.css` → `2`.

### Step 4: Create the stylesheet and import it

`packages/styles/src/divider.css`:

```css
.hashti-divider {
  background: var(--hashti-border-subtle-00);
}

.hashti-divider[data-orientation="horizontal"] {
  block-size: 1px;
  inline-size: 100%;
}

.hashti-divider[data-orientation="vertical"] {
  block-size: auto;
  inline-size: 1px;
  align-self: stretch;
}
```

No margins, no transitions, no focus rules — spacing belongs to the layout
around the divider, not to the divider.

`packages/styles/index.css` — add after the switch import:

```css
@import "./src/divider.css" layer(hashti.components);
```

**Verify**: `grep -n "divider" packages/styles/index.css` → one import line inside the layer statement order (tokens first, then components); `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/divider.css` → no matches.

### Step 5: Docs page

`apps/docs/content/docs/divider.mdx`:

```mdx
---
title: Divider
description: Divides groups of content with a horizontal or vertical line.
---

import { Divider } from '@hashti/react'

## Orientation

<div style={{ display: 'grid', gap: 16 }}>
  <p>Content above the line.</p>
  <Divider />
  <p>Content below the line.</p>
</div>

<div style={{ display: 'flex', gap: 16, alignItems: 'stretch', height: 48 }}>
  <span>Start</span>
  <Divider orientation="vertical" />
  <span>End</span>
</div>

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | Which way the line runs. Default `horizontal`. |
| `decorative` | `boolean` | Hides the line from assistive technology with `role="none"`. |

Styling lives in `@hashti/styles` under `.hashti-divider`, keyed off `data-orientation`, with the color from `--hashti-border-subtle-00`.
```

Match the exact MDX conventions of `apps/docs/content/docs/button.mdx`
(frontmatter first, import after, `##` sections). If Astro's MDX rejects the
inline `style` objects, use the same markup shape the other pages use for
layout instead — do not add new dependencies or components to fix it.

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "button", "divider", "switch"]` (alphabetical among components).

**Verify**: `bun run typecheck` → exit 0 (includes `apps/docs`' `astro sync && tsc --noEmit`, which validates the content collection).

## Test plan

No test runner exists in this repo; none is added by this plan. The
verification is: typecheck gate (Step 1/2/5), the greps in Steps 3–4, and the
reviewer's rendered check against the docs page (browser: horizontal line
between two paragraphs, vertical line stretching a 48px row, class
`hashti-divider` present alongside `data-slot="separator"`, correct color in
light and dark).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-divider" packages/react/src packages/styles/src` shows the wrapper class and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/divider.css` returns nothing
- [ ] `grep -n "divider" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `separator` is not exported from `@ui-sdk/core/separator`, or `createParts`
  rejects `{ root: "div" }` — quote the exact error.
- The rendered docs page cannot resolve `@hashti/react` or `@hashti/styles`
  imports (workspace wiring broken) — this is pre-existing breakage, not
  yours to fix in this plan.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- `packages/styles/src/tokens.css` is a hand-rolled subset of
  `design/tokens.css`. A later cycle should switch `@hashti/styles` to import
  the design token source directly; when that happens, the local
  `--hashti-border-subtle-00` added here is deleted, not kept.
- Cycles 2+ (Label/Kbd, Badge/Avatar, Button variants, …) copy this exact
  file shape: `packages/react/src/<name>/<name>.tsx` + `index.ts`, barrel
  line, `packages/styles/src/<name>.css` + import, docs page + meta entry.
- Reviewer should scrutinize: that the wrapper stays pure (no state, no
  handlers, no extra DOM), that `data-slot="separator"` survives in the DOM,
  and that no hex values leaked into the component stylesheet.
