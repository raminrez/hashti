# Plan 064: Vertical variants (Slider, Tabs, SegmentedControl)

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end — stop and report instead of improvising. Do not update
> `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: M · **Risk**: MED (three components; the
  indicator/track geometry flips axes — logical properties where possible)
- **Depends on**: 018 Slider, 016 Tabs, 033 SegmentedControl (merged)
- **Lane**: Particle-4 (orchestrator on glm-5.3-flash; GOOD candidate for
  sub-agent panes: one sub-agent per component, in particle mode)

## Why

Vertical orientation for the three orientation-bearing controls.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/slider.md`,
  `tabs.md`, `segmented-control.md` — the orientation/or vertical sections
  and the data attribute each root exposes (`data-orientation` expected —
  verify exact names).
- Current styles: `packages/styles/src/{slider,tabs,segmented-control}.css`.

## Design rules

- Key off the root's orientation attribute:
  `[data-orientation="vertical"]` (verify) — flip `inline-size`/`block-size`
  and the track/thumb axes.
- Slider: vertical track gets a block-size (e.g. 10rem) and inline-size of
  the track thickness; thumb centering flips.
- Tabs list: vertical = column flex; indicator geometry follows ui-sdk's
  CSS variables if it exposes them (`--active-tab-*`), else per docs.
- SegmentedControl: column layout; the active-pill geometry follows its
  variable (`--active-segment-*` or similar per docs).
- Use logical properties so RTL comes free later.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/slider.css`, `tabs.css`, `segmented-control.css`
  (extend with vertical rules)
- `apps/docs/src/components/` — add vertical examples to the three demos
- `apps/docs/content/docs/slider.mdx`, `tabs.mdx`,
  `segmented-control.mdx` — document vertical
- No wrapper changes expected (orientation is a ui-sdk prop).

## Steps (parallelizable: one sub-agent per component)

1. Docs recon for all three (orientation attribute names + geometry
   variables). 
2. Per component: vertical CSS + demo example + docs line. Typecheck after
   each.
3. Final typecheck + rendered pass.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] rendered check: each vertical
  variant lays out top-to-bottom with correct indicator/thumb geometry ·
  [ ] commits per step (or per sub-agent merge)

## STOP

- A component exposes no orientation prop/attribute — report which.
- Indicator geometry needs JS-computed inline styles — report (frame-agnostic
  rule).
- Verification fails twice.
