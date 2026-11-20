# Plan 061: DatePicker range mode

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end — stop and report instead of improvising. Do not update
> `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: M · **Risk**: MED (range selection state,
  two-input layout, hover preview styling)
- **Depends on**: 054 Calendar, 055 DatePicker (both merged)
- **Lane**: Particle-1 (orchestrator on glm-5.3-flash; sub-agents via herdr
  panes in particle mode for parallelizable steps)

## Why

Range selection is the last missing DatePicker behavior.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/date-picker.md`
  — the range section: `mode="range"`, in range mode the picker renders an
  input for each end. Read the Data Attributes for range states
  (`data-mode="range"`, day states for in-range/selected edges).
- `packages/react/node_modules/@ui-sdk/react/docs/components/calendar.md` —
  Calendar range states (day `data-` attributes for range edges/middle).
- Current styles: `packages/styles/src/date-picker.css`, `calendar.css`.

## Design rules

- Two inputs side by side with a separator (`–`) between — flex row,
  `hashti-date-picker__field` recipe from cycle 055.
- Day cells in range: edge days use the selected recipe
  (`--hashti-background-selected` + focus ink); in-range middle days get a
  subtle tint (`--hashti-background-selected` at reduced emphasis or a
  hover token — pick an existing token, do not invent colors); rounded
  outer corners on edges only.
- Hover preview (if ui-sdk exposes a preview state attribute) mirrors the
  in-range tint.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/react/src/date-picker/*` (extend wrappers if range needs props
  passthrough — wrap, don't re-implement)
- `packages/styles/src/date-picker.css` + `calendar.css` (range rules)
- `packages/styles/index.css` (no new file needed unless splitting)
- `apps/docs/src/components/date-picker-demo.tsx` — add a range demo
- `apps/docs/content/docs/date-picker.mdx` — document range
- `apps/docs/content/docs/meta.json` — no change expected

## Steps

1. Read docs (date-picker range + calendar range states). Extend wrappers
   if props must pass through. Typecheck.
2. Range CSS rules (two-input row, edge/middle day tints). Verify: no hex,
   data- selectors ≥ 4 new.
3. Range demo + docs section. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex in touched css · [ ] range demo renders
      two inputs · [ ] commits per step · [ ] no out-of-scope files

## STOP

- ui-sdk exposes no range mode on DatePicker/Calendar as documented — report.
- Range needs core changes in `packages/core` — report.
- Verification fails twice.
