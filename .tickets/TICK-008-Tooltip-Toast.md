# TICK-008: Tooltip & Toast

**Phase:** 4 — Overlays & Floating Panels
**Priority:** Medium
**Blocked by:** TICK-013.
**Effort:** Medium
**Depends on:** TICK-007

## Goal
Migrate `Tooltip` and `Toast` feedback components to `@ui-sdk/react`.
Tooltip is anchor-positioned; Toast uses a notification queue/region.

## Files to Touch
- `packages/react/src/components/tooltip/`
- `packages/react/src/components/toast/`

## ui-sdk Primitives
See: `docs/popups.md`, `docs/components/toast.md`

## Acceptance Criteria
- [ ] Tooltip: shows on hover+focus, `role="tooltip"`, anchored positioning
- [ ] Tooltip delay: 300ms default, immediate on keyboard focus
- [ ] Toast: `role="status"` or `role="alert"`, auto-dismiss timer, queue management
- [ ] `.hashti-tooltip`, `.hashti-toast`, `.hashti-toast-region` classes
- [ ] `data-state="open"/"closed"` for animation
- [ ] `data-variant="info"/"success"/"warning"/"error"` on Toast
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds
