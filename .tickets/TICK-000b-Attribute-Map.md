# TICK-000b: Attribute Map & Stylesheet Sweep

**Phase:** 0 — Foundation (blocks all component tickets)
**Status:** DONE (18 Nov 2026)
**Priority:** Critical
**Blocked by:** None (can start immediately). Blocks every component ticket.
**Effort:** Medium

## Goal
Produce the canonical RAC→ui-sdk state-attribute map and apply it to every stylesheet in
`packages/styles`. CSS selectors are global; this sweep happens once, here, not per ticket
(ADR-0002). The map is also the porting contract for future Vue/Svelte/Solid/web bindings.

## Known remap territory (verify each against ui-sdk docs, don't assume)
- `data-hovered` / `data-pressed` / `data-focus-visible` → ui-sdk equivalents per component doc
- `data-entering` / `data-exiting` → `data-starting-style` / `data-ending-style`
- `data-indeterminate` → `data-checked="mixed"` (or per checkbox/switch docs)
- `data-expanded` → `data-open` / `data-closed`
- `data-readonly` → `data-readonly` (probably survives; verify)
- `data-kind` → `data-variant` (AGENTS.md rule)
- `data-slot` values: adopt ui-sdk's part names everywhere

## Deliverable
- `docs/attribute-map.md`: table of RAC attribute → ui-sdk attribute → notes, covering every
  `data-*` used in `packages/styles/src` today
- Swept stylesheets: every selector targets ui-sdk vocabulary
- Token prune: move `packages/tokens` pipeline into `packages/styles`, keeping only tokens the
  stylesheets reference (relay.ts and unreferenced tokens dropped); delete `packages/tokens`

## Acceptance Criteria
- [ ] `docs/attribute-map.md` complete — zero `data-*` in styles without a map entry
- [ ] No RAC-only attribute remains in `packages/styles/src` (grep-clean)
- [ ] `packages/tokens` deleted; `bun run build:tokens` works from `packages/styles`
- [ ] `bun run build` succeeds (styles compile even while React components still render RAC attrs —
  visual breakage expected and accepted until component tickets land)
