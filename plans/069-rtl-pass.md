# Plan 069: RTL pass — logical properties audit across all stylesheets

> **Executor instructions**: Execute step by step, verify every gate, COMMIT
> ON EVERY STEP. This cycle runs SOLO on branch `particle/069-rtl-pass` cut
> from `dev` (no other lanes in parallel). Do not update `plans/README.md`.
>
> **Drift check first**: `git log --oneline -1` — the branch must start at
> dev's tip before any commit.

## Status

- **Priority**: P1 · **Effort**: L · **Risk**: MED (touches every stylesheet;
  mechanical but high blast radius)
- **Depends on**: waves 1+2 (061–068) all merged to dev
- **Lane**: Particle-8 worktree, branch `particle/069-rtl-pass` (cut from
  dev) — still solo: no other lane runs during it

## Why

Components must render correctly in RTL contexts. Physical properties
(`margin-left`, `padding-right`, `left`, `text-align: left`, transforms)
break under `dir="rtl"`.

## Facts

- All component stylesheets: `packages/styles/src/*.css`.
- ui-sdk exposes direction via data attributes/variables where relevant —
  check `--anchor-*` variables (positioning) stay as-is.
- `design/tokens.css` is the token source.

## Audit method (per file, mechanical)

For each stylesheet replace physical with logical ONLY where direction
matters:

- `margin-left/right` → `margin-inline-start/end` (or collapse to
  `margin-inline`)
- `padding-left/right` → `padding-inline-start/end`
- `border-left/right` → `border-inline-*`
- `left/right` positioned → `inset-inline-start/end`
- `text-align: left/right` → `text-align: start/end`
- `translateX(-100%)` open/close animations → check ui-sdk's own handling;
  if the transform is in wrapper code, wrap in `:where([dir='rtl'])`
  override rule ONLY if unavoidable — prefer replacing with logical
  equivalents the platform offers.
- `clip-path: inset(0 X% 0 0)` (rating half-star!) → needs an RTL variant
  clip (`inset(0 0 0 X%)`) under `[dir='rtl']`.

Do NOT touch: geometry that is direction-symmetric (top/bottom,
block-size, inline-size widths), ui-sdk-provided CSS variables
(`--active-tab-*`, `--anchor-*`), `data-slot` selectors.

## Steps

1. Inventory: `grep -nE '(margin|padding|border)-(left|right)|:left|:right|text-align|translate[XY]|clip-path' packages/styles/src/*.css` — write the list to the first commit message context.
2. Fix files in batches of ~10 stylesheets; typecheck after each batch.
3. Rendered RTL spot-check on the docs server (localhost:4321): set
   `document.documentElement.dir='rtl'` in an eval and screenshot 6
   representative pages (date-picker, rating, slider, menu, drawer, toast).
   Verify mirrored layout, no clipped text, rating clip mirrors.
4. Final typecheck + summary of files changed.

## Done

- [ ] typecheck exit 0 after every batch · [ ] grep above returns zero
  physical direction hits (or documented exceptions) · [ ] RTL screenshots
  verified on 6 pages · [ ] commits per batch

## STOP

- A ui-sdk-provided variable/attribute makes a rule unreplaceable — document
  the exception inline (`/* rtl-exception: <reason> */`) and continue.
- A rendered check shows broken geometry that CSS logical props cannot fix —
  report the specific component.
