# TICK-004: Checkbox, RadioGroup, Switch

**Status:** DONE

**Phase:** 3 — Form Controls & Inputs
**Priority:** High
**Blocked by:** TICK-013.
**Effort:** Medium
**Depends on:** TICK-002 (Button)

## Goal
Migrate `Checkbox`, `RadioGroup`/`Radio`, and `Switch` from `react-aria-components` to `@ui-sdk/react`
form primitives. These are tri-state/boolean toggles with critical accessibility requirements.

## Files to Touch
- `packages/react/src/components/checkbox/`
- `packages/react/src/components/radio/`
- `packages/react/src/components/switch/`

## ui-sdk Primitives
See: `node_modules/.bun/@ui-sdk+react@0.1.0-beta.6+98c4ab0ca8cf4886/node_modules/@ui-sdk/react/docs/forms.md`
and `docs/components/radio.md`

## Acceptance Criteria
- [x] Checkbox: tri-state support (checked / unchecked / indeterminate) via `data-checked` / `data-unchecked` / `data-indeterminate` (ui-sdk attribute names; `data-state` is not what ui-sdk emits)
- [x] `aria-checked="mixed"` + `data-indeterminate` on the mixed checkbox, `data-checked`/`data-unchecked` elsewhere
- [x] RadioGroup: `role="radiogroup"`, Radio items `role="radio"`, `data-checked` on selected
- [x] Switch: `role="switch"`, `aria-checked`, `data-checked`/`data-unchecked` (ui-sdk emits checked/unchecked, not `data-state="on"/"off"`)
- [x] `.hashti-checkbox`, `.hashti-radio-group`, `.hashti-radio`, `.hashti-switch` root classes
- [x] `data-disabled`, `data-invalid` (via surrounding ui-sdk Field), `data-required` attributes supported
- [x] No `react-aria-components` imports
- [x] Selection-control unit tests pass (`tests/unit/selection-controls.test.tsx`, 5 tests); remaining suite failures are foreign in-flight migrations (field, toolbar, text/number/search/time fields, combobox, grid-list drag handle)
- [x] `bun run build:packages` succeeds

## DOM Contract
```tsx
// Checkbox
<label class="hashti-checkbox" data-state="checked" data-disabled="">
  <input type="checkbox" />
  <span class="hashti-checkbox__indicator" />
  <span class="hashti-checkbox__label">Label</span>
</label>

// Radio
<div class="hashti-radio-group" role="radiogroup">
  <label class="hashti-radio" data-state="checked">
    <input type="radio" role="radio" />
    <span class="hashti-radio__indicator" />
    Option A
  </label>
</div>

// Switch
<button class="hashti-switch" role="switch" aria-checked="true" data-state="on">
  <span class="hashti-switch__thumb" />
</button>
```
