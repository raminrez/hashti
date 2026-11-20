# Plan 058: Waterfall — rows, cells, bars, axis

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition triggers, stop and report — do not improvise. Do not update
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> Compare "Current state" excerpts against live code; on mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (chart-like; bar geometry likely driven by ui-sdk CSS
  variables — read the docs for the exact contract)
- **Depends on**: plans/054-calendar (DONE)
- **Category**: migration (component build-out, cycle 58)
- **Parallel lane**: Particle-8

## Why this matters

Waterfall is the Gantt-style chart. ui-sdk owns the layout math; our styles
frame rows, headers, bars and the axis.

## Current state

- `packages/styles/src/timeline.css` — the row/track exemplar.
- `packages/react/src/timeline/timeline.tsx` — wrapper exemplar.
- `apps/docs/content/docs/meta.json` — insert `"waterfall"` near the end
  (after `"trigger-menu"`, keeping the file's ordering style).

### ui-sdk Waterfall facts (READ the full docs page first)

- Import: `import { Waterfall, WaterfallHeaderRow, WaterfallColumnHeader, WaterfallAxis, WaterfallTick, WaterfallMark, WaterfallRow, WaterfallRowHeader, WaterfallIndicator, WaterfallCell, WaterfallBar } from "@ui-sdk/react/waterfall"` (verify).
- Composition: header row with column headers (axis + ticks + marks), rows
  with row header (+ optional indicator), cells and bars.
- READ the Usage and Data Attributes sections fully: bar placement likely
  comes through CSS variables (`--*-start`, `--*-span` or similar) — follow
  the docs exactly and note the variable names in your report.

### Design rules that bite (derived)

- **Root `hashti-waterfall`**: `display: flex; flex-direction: column;
font-size: 0.8125rem; border: 1px solid
var(--hashti-border-subtle-00); border-radius:
var(--hashti-popover-radius); overflow: hidden; background:
var(--hashti-layer-01);`
- **Header row `hashti-waterfall-header-row`**: `display: grid;` (columns
  per the docs' structure), secondary ink, `border-block-end: 1px solid
var(--hashti-border-subtle-00);`
- **Column header `hashti-waterfall-column-header`**: centered tick labels,
  `padding: 0.375rem 0.25rem; color: var(--hashti-text-secondary);`
- **Row `hashti-waterfall-row`**: `display: grid; align-items: center;`
  `border-block-end: 1px solid var(--hashti-border-subtle-00);` last row
  none; hover (hover:hover) → background-hover.
- **Row header `hashti-waterfall-row-header`**: primary ink, weight 500,
  `padding: 0.375rem 0.75rem; text-align: start;`
- **Cell `hashti-waterfall-cell`**: grid cell; subtle column rules
  (`border-inline-start: 1px solid var(--hashti-border-subtle-00);`) if the
  docs render column boundaries.
- **Bar `hashti-waterfall-bar`**: `position: absolute; block-size: 1.25rem;
border-radius: var(--hashti-border-radius-08); background:
var(--hashti-background-selected);` placement per the docs' variables;
  `[data-` states per docs (e.g. done/failed variants if any).
- **Indicator `hashti-waterfall-indicator`**: the "now" line — `inline-size:
1px; background: var(--hashti-focus);`
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/waterfall/waterfall.tsx` — create
- `packages/react/src/waterfall/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/waterfall.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/waterfall-demo.tsx` — create (compound demo
  component rendered with `client:load` — the MDX-roots lesson)
- `apps/docs/content/docs/waterfall.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"waterfall"`

**Out of scope**: zoom/scroll interactions beyond defaults; lint/test infra.

## Git workflow

- Branch `particle/058-waterfall` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrappers** — `join` helper pattern per part; export all + barrel.
   Verify: typecheck exit 0.
2. **Stylesheet** — rules above. Verify: no hex; `grep -c "data-"
packages/styles/src/waterfall.css` → ≥ 3.
3. **Demo + page** — small 3-row waterfall per the docs' Usage; note
   deviations and the geometry variable names in your report. meta.json
   entry. Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-waterfall" packages/react/src packages/styles/src` hits
- [ ] no hex in `packages/styles/src/waterfall.css`
- [ ] import + meta entries present
- [ ] `git status --porcelain` clean of out-of-scope files
- [ ] one commit per step

## STOP conditions

- Any part not exported from `@ui-sdk/react/waterfall` — quote the error.
- Bar geometry variables don't resolve — report what you found.
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
