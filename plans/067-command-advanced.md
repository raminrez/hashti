# Plan 067: Command advanced — pages + async results

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end. Do not update `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: M · **Risk**: MED (page navigation states;
  async pending/empty styling)
- **Depends on**: 050 Command (merged)
- **Lane**: Particle-7 (orchestrator glm-5.3-flash; sub-agent panes in
  particle mode — split: pages / async)

## Why

Command palette pages (drill-in navigation) and async result loading.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/command.md` —
  sections: Pages (551), Items as Data (665), Async Results (779), Pending
  Actions (872). Read each + Data Attributes for page/loading/empty states
  and the `CommandEmpty` part.
- Current styles: `packages/styles/src/command.css`.

## Design rules

- **Page transition**: content swap per ui-sdk states; if a
  `data-page`/breadcrumb affordance exists, style it as the quiet-action
  row (back chevron-start, secondary ink, hover tint).
- **Loading**: item skeleton rows — three shimmer rows
  (`background: var(--hashti-background-hover)` blocks, `border-radius:
var(--hashti-border-radius-08)`, a gentle opacity pulse keyframe,
  reduced-motion → static 0.5 opacity).
- **Empty**: `CommandEmpty` styling — centered, secondary ink, padding
  1rem, no border.
- **Pending action item**: `[data-pending]`-equivalent → leading spinner
  (reuse the toast spinner recipe shape).
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/command.css` (extend)
- `apps/docs/src/components/command-demo.tsx` (extend: two pages + async
  search example)
- `apps/docs/content/docs/command.mdx` (document pages + async)

## Steps (parallelizable: pages / async)

1. Docs recon (page + async states, part names).
2. CSS (page affordance, skeletons, empty, pending). Verify: no hex;
   reduced-motion respected.
3. Demo + docs. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] rendered check: page drill-in
      works, async shows skeletons then results, empty state renders ·
      [ ] commits per step

## STOP

- Pages/async not exposed as documented — quote the docs mismatch.
- Verification fails twice.
