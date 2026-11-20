# Plan 057: Tree — hierarchical rows, branches, indicator

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition triggers, stop and report — do not improvise. Do not update
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> Compare "Current state" excerpts against live code; on mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (recursive consumer-rendered rows; depth comes from
  `data-level` / `--tree-level`)
- **Depends on**: plans/054-calendar (DONE)
- **Category**: migration (component build-out, cycle 57)
- **Parallel lane**: Particle-7

## Why this matters

Tree is the file-explorer pattern — indented rows, expand/collapse,
selection. Depth styling keys off `data-level`, not nested selectors.

## Current state

- `packages/styles/src/accordion.css` — the disclosure-row exemplar.
- `packages/react/src/accordion/accordion.tsx` — wrapper exemplar.
- `apps/docs/content/docs/meta.json` — insert `"tree"` after `"time-input"`.

### ui-sdk Tree facts (READ the full docs page first)

- Import: `import { Tree, TreeItem, TreeItemLabel, TreeItemIndicator, TreeGroup } from "@ui-sdk/react/tree"` (verify).
- Composition: `Tree` (accessible name; items need unique `value`) →
  `TreeItem` → (`TreeItemLabel` → optional `TreeItemIndicator`, optional
  `TreeGroup` → child `TreeItem`s). An item with a `TreeGroup` is a branch.
- `TreeItem` states: `data-level` (1, 2, …) also as `--tree-level`,
  `data-branch`, `data-expanded`, `data-selected`, `data-current`,
  `data-disabled`, `data-loading`, `data-failed`, `data-pending`, and
  `data-checked`/`data-indeterminate`/`data-unchecked` with `checkable`.
- READ the docs' Usage for how rows render (the demo may need
  `renderItem`-style props — follow the docs, note deviations).

### Design rules that bite (derived)

- **Root `hashti-tree`**: `display: flex; flex-direction: column; gap:
0.125rem; font-size: 0.875rem;`
- **Item `hashti-tree-item`**: `display: flex; align-items: center;
gap: 0.375rem; min-block-size: 2rem; padding: 0 0.5rem;
border-radius: var(--hashti-border-radius-08); cursor: pointer;`
  - Indent: `padding-inline-start: calc((var(--tree-level, 1) - 1) * 1.25rem
    - 0.5rem);`(frame-agnostic: uses ui-sdk's own`--tree-level`).
  - `[data-selected]` → `background: var(--hashti-background-selected);`
  - `[data-current]` → font-weight 600.
  - `[data-disabled]` → disabled ink, not-allowed.
  - hover (hover:hover, not selected/disabled) → background-hover.
- **Label `hashti-tree-item-label`**: `display: flex; align-items: center;
gap: 0.375rem; flex: 1; min-inline-size: 0;` truncate long names.
- **Indicator `hashti-tree-item-indicator`**: the disclosure chevron —
  `inline-size: 1rem; transition: transform var(--hashti-duration-fast-01)
cubic-bezier(0.16, 1, 0.3, 1);` `[data-expanded] > * &` or per the
  rendered DOM: rotate 90° when expanded (check what carries the state —
  style from the item's `[data-expanded]` down to the indicator class).
- **Group `hashti-tree-group`**: `display: flex; flex-direction: column;
gap: 0.125rem;` collapsed state per ui-sdk (`data-expanded` on the item —
  verify what hides the group; if ui-sdk renders `hidden`, don't fight it).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/tree/tree.tsx` — create
- `packages/react/src/tree/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/tree.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/tree-demo.tsx` — create (a compound demo
  component is fine — the MDX-roots lesson: compose in a demo component,
  render it with `client:load`)
- `apps/docs/content/docs/tree.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"tree"`

**Out of scope**: checkable trees, async `loadChildren` styling beyond the
loading/failed data-attributes defaults, drag-and-drop; lint/test infra.

## Git workflow

- Branch `particle/057-tree` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrappers** — `join` helper pattern per part; export all + barrel.
   Verify: typecheck exit 0.
2. **Stylesheet** — rules above. Verify: no hex; `grep -c "data-"
packages/styles/src/tree.css` → ≥ 5.
3. **Demo + page** — two-level tree (a branch with children + a leaf), per
   the docs' Usage. meta.json entry. Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-tree" packages/react/src packages/styles/src` hits
- [ ] no hex in `packages/styles/src/tree.css`
- [ ] import + meta entries present
- [ ] `git status --porcelain` clean of out-of-scope files
- [ ] one commit per step

## STOP conditions

- Any part not exported from `@ui-sdk/react/tree` — quote the error.
- Rows don't expose `--tree-level`/`data-level` as documented — report the
  DOM.
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
