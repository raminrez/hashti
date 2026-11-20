# Phase 2: advanced features — roadmap

Component coverage is COMPLETE (cycles 001–060, all 54 ui-sdk components).
Phase 2 adds the advanced/complex behaviors ui-sdk supports, on top of the
merged components. Work happens on the `dev` branch (cut from main at
`eb94013`); feature branches are `particle/061-*` … cut from `dev`, merged
back to `dev` when reviewed.

## Wave 1 — form elements first (cycles 061–064)

| Cycle | Feature | Lane |
| --- | --- | --- |
| 061 | DatePicker range mode (two-end selection, range styling, two inputs) | Particle-1 — **DONE, merged** |
| 062 | Inline completion (Input/Textarea inline suggest, accept with Tab→) | Particle-2 — **DONE, merged** |
| 063 | Rating half-star masks (fractional fill via mask/clip) | Particle-3 — **DONE, merged** |
| 064 | Vertical variants (Slider, Tabs, SegmentedControl vertical modes) | Particle-4 — **DONE, merged** |

## Wave 2 — surfaces & global (queued)

| Cycle | Feature |
| --- | --- |
| 065 | Menu submenus + checkbox/radio items + icons | in flight |
| 066 | Promise toasts (loading → success/error lifecycle) | **DONE, merged** |
| 067 | Command pages + async search | **DONE, merged** |
| 068 | Drawer snap points | in flight |
| 069 | RTL pass (logical properties audit across all stylesheets) | planned — SOLO after 065+068 merge |

## Rules (unchanged from phase 1)

- Plans committed to `dev` BEFORE dispatching an executor/orchestrator.
- Framework-agnostic styles: only `hashti-*` classes + ui-sdk data
  attributes; tokens only; a hex in component CSS is a bug.
- Review gate every cycle: typecheck + rendered browser check before merge.
- Parallel lanes own non-overlapping files; barrel/meta/index.css conflicts
  resolved by the orchestrator at merge time (read conflicts — never
  blind-strip markers).
- `bun install` on the target branch after merging a dep-adding branch.
