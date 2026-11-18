# TICK-007: Modal, Dialog, Popover, Drawer, Sheet

**Status:** DONE

**Phase:** 4 — Overlays & Floating Panels
**Priority:** Medium
**Blocked by:** TICK-013.
**Effort:** High
**Depends on:** TICK-006

## Goal
Migrate overlay components to `@ui-sdk/react`. These require focus trap, scroll lock,
animation entry/exit, and portal rendering.

## Files to Touch
- `packages/react/src/components/modal/`
- `packages/react/src/components/dialog/`
- `packages/react/src/components/popover/`
- `packages/react/src/components/drawer/`
- `packages/react/src/components/sheet/`

## ui-sdk Primitives
See: `docs/popups.md`

## Acceptance Criteria
- [x] Modal/Dialog: focus trap, Escape closes, `aria-modal`, `role="dialog"`
- [x] Popover: floating positioning (anchored to trigger), no focus trap
- [x] Drawer/Sheet: slides in from edge, focus trap, scroll lock
- [x] `.hashti-dialog`, `.hashti-popover`, `.hashti-drawer` render; `.hashti-modal`/`.hashti-sheet` retired (Modal folded into Dialog, Sheet into Drawer per decisions log item 2)
- [x] `data-open`/`data-closed` + `data-starting-style`/`data-ending-style` for CSS transitions (ui-sdk state attributes)
- [x] Overlay/backdrop element with `.hashti-overlay` (shared by Dialog.Backdrop, Drawer.Backdrop, AlertDialog backdrop)
- [x] No `react-aria-components` imports in dialog/, drawer/, popover/
- [x] Unit tests pass; the 4 skipped sheet-preview tests now run as real Drawer assertions
- [x] `bun run build:packages` succeeds

## DOM Contract
```tsx
// Dialog
<div class="hashti-overlay" data-open data-backdrop="dim" />
<div class="hashti-dialog" role="dialog" aria-modal="true" data-open data-size="md">
  <h2 class="..." data-slot="dialog-title">...</h2>
  <p data-slot="dialog-description">...</p>
  <div class="hashti-dialog-footer">...</div>
</div>
```
