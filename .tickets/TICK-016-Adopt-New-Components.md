# TICK-014: Adopt New ui-sdk Components

**Phase:** 5 — After the migration tickets (uses patterns proven there)
**Priority:** Medium
**Blocked by:** TICK-013; after the Phase 3–5 tickets (reuses their proven patterns).
**Effort:** Medium

## Goal
Add the ui-sdk components Hashti lacks, per `docs/component-inventory.md`: `Calendar`,
`DateInput`, `PasswordInput`, `HoverCard` (replacing `preview-trigger/`), `Collapsible`,
`Menu`. Also the two deferred fact-checks from the inventory:

- **ColorPicker coverage**: read `color-picker.md`; confirm whether swatch-picker and
  color-wheel are covered. Uncovered parts are built on `@ui-sdk/core` or descoped — record
  the decision in the inventory doc.
- **OverflowMenu rebuild**: read `trigger-menu.md`; decide `menu` + `popover` composition vs
  `trigger-menu`, then rebuild `OverflowMenu` on the winner.

## Acceptance Criteria
- [ ] Each adopted component exported from `@hashti/react` (wrap only where Hashti adds API)
- [ ] Each styled in `packages/styles` per the DOM contract, verified against the attribute map
- [ ] `preview-trigger/` deleted, call sites moved to HoverCard
- [ ] Inventory doc updated with the color + overflow-menu decisions
- [ ] Storybook stories + `bun run build:packages` green
