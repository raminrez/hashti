# TICK-006: Select & ListBox

**Phase:** 3 — Form Controls & Inputs
**Priority:** High
**Blocked by:** TICK-013; TICK-004 and TICK-005 recommended (Select composes field anatomy and selection states).
**Effort:** High
**Depends on:** TICK-005

## Goal
Migrate `Select`, `ListBox`, and combo-box popup pattern to `@ui-sdk/react`.
These require floating popup positioning and keyboard navigation.

## Files to Touch
- `packages/react/src/components/select/select.tsx`
- `packages/react/src/components/list-box/list-box.tsx` (if separate)
- `packages/react/src/components/combobox/` (if exists)

## ui-sdk Primitives
See: `docs/lists-and-menus.md`, `docs/popups.md`

## Acceptance Criteria
- [ ] Select trigger + listbox popup pattern
- [ ] Keyboard: Down opens, Enter/Space selects, Escape closes, type-ahead
- [ ] `.hashti-select`, `.hashti-listbox`, `.hashti-listbox-item` classes
- [ ] `data-selected`, `data-focused`, `data-disabled` on items
- [ ] Popover uses `@ui-sdk/react` floating positioning (not RAC Popover)
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

## DOM Contract
```tsx
<div class="hashti-select">
  <button class="hashti-select__trigger" aria-expanded="false" aria-haspopup="listbox">
    <span class="hashti-select__value">Pick one</span>
    <span class="hashti-select__icon" />
  </button>
  <div class="hashti-listbox" role="listbox" aria-label="Options">
    <div class="hashti-listbox-item" role="option" data-selected="" data-focused="">Item A</div>
    <div class="hashti-listbox-item" role="option" data-disabled="">Item B</div>
  </div>
</div>
```
