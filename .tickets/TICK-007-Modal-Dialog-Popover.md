# TICK-007: Modal, Dialog, Popover, Drawer, Sheet

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
- [ ] Modal/Dialog: focus trap, Escape closes, `aria-modal`, `role="dialog"`
- [ ] Popover: floating positioning (anchored to trigger), no focus trap
- [ ] Drawer/Sheet: slides in from edge, focus trap, scroll lock
- [ ] `.hashti-modal`, `.hashti-dialog`, `.hashti-popover`, `.hashti-drawer`, `.hashti-sheet`
- [ ] `data-state="open"/"closed"` for CSS transitions
- [ ] Overlay/backdrop element with `.hashti-overlay`
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

## DOM Contract
```tsx
// Dialog
<div class="hashti-overlay" data-state="open" />
<div class="hashti-dialog" role="dialog" aria-modal="true" data-state="open">
  <header class="hashti-dialog__header">...</header>
  <div class="hashti-dialog__body">...</div>
  <footer class="hashti-dialog__footer">...</footer>
</div>
```
