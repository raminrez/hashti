# Plan 068: Drawer snap points

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end. Do not update `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P2 · **Effort**: S · **Risk**: LOW (snap positions are
  ui-sdk-driven; we style the states)
- **Depends on**: 044 Drawer (merged)
- **Lane**: Particle-8 (orchestrator glm-5.3-flash)

## Why

Drawers that snap to defined positions instead of fully open/closed.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/drawer.md` —
  section Snap Points (258). Read it + Data Attributes for the snap state
  (`data-snap` value or a position variable — follow the docs).
- Current styles: `packages/styles/src/drawer.css`.

## Design rules

- **Snap affordance**: a drag handle bar at the drawer's top edge —
  `inline-size: 2.5rem; block-size: 0.25rem; border-radius: 999px;
background: var(--hashti-border-strong-01);` centered, margin-block
  0.5rem. (If ui-sdk renders its own handle part, style that; else add via
  the demo composition.)
- **Snapped states**: per the docs' attribute (e.g. `[data-snap="0.5"]`) —
  optionally a slightly stronger shadow when partially open (the sheet
  floats over content): deepen the existing drawer shadow token usage, no
  new colors.
- Motion: snap settle uses the drawer's existing transition tokens
  (fast-01/slow-01 per what drawer.css already does); reduced-motion →
  no transition.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/drawer.css` (extend)
- `apps/docs/src/components/drawer-demo.tsx` (add a snap-points example)
- `apps/docs/content/docs/drawer.mdx` (document snap points)

## Steps

1. Docs recon (snap API + state attributes).
2. CSS (handle + snapped states). Verify: no hex.
3. Demo + docs. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] rendered check: drawer snaps to
      positions and settles smoothly · [ ] commits per step

## STOP

- Snap points not exposed as documented — quote the mismatch.
- Verification fails twice.
