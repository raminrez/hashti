# TICK-004: Checkbox, RadioGroup, Switch

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
- [ ] Checkbox: tri-state support (checked / unchecked / indeterminate) via `data-state`
- [ ] `data-state="checked"`, `data-state="indeterminate"`, `data-state="unchecked"`
- [ ] RadioGroup: `role="radiogroup"`, Radio items `role="radio"`, `data-state="checked"` on selected
- [ ] Switch: `role="switch"`, `aria-checked`, `data-state="on"/"off"`
- [ ] `.hashti-checkbox`, `.hashti-radio-group`, `.hashti-radio`, `.hashti-switch` root classes
- [ ] `data-disabled`, `data-invalid`, `data-required` attributes supported
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

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
