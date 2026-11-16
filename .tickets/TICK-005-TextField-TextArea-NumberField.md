# TICK-005: TextField, TextArea, NumberField

**Phase:** 3 — Form Controls & Inputs
**Priority:** High
**Effort:** Medium
**Depends on:** TICK-004

## Goal
Migrate text input primitives to `@ui-sdk/react` form inputs. These are the highest-usage
form components. The `ChangeDetails`/`ChangeSource` types (previously from `@hashti/agent`)
are currently inlined in `text-field.tsx` — keep them or move to `packages/react/src/utils/`.

## Files to Touch
- `packages/react/src/components/text-field/text-field.tsx`
- `packages/react/src/components/text-field/text-area.tsx` (if separate)
- `packages/react/src/components/number-field/number-field.tsx`
- `packages/react/src/components/field/` (field anatomy: Label, FieldError, Description)
- `packages/react/src/components/search-field/` (if exists)

## ui-sdk Primitives
See: `docs/forms.md`, `docs/components/input.md`, `docs/components/label.md`

## Acceptance Criteria
- [ ] Text input uses `@ui-sdk/react` input primitive (not RAC `TextField`)
- [ ] `ChangeDetails` / `ChangeSource` types kept (inline or in utils) for onChange API compat
- [ ] `.hashti-text-field`, `.hashti-label`, `.hashti-input`, `.hashti-field-error` classes
- [ ] `data-invalid`, `data-disabled`, `data-required`, `data-readonly` attributes
- [ ] NumberField: increment/decrement buttons with `aria-label`
- [ ] SearchField: clear button accessible
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

## DOM Contract
```tsx
<div class="hashti-text-field" data-invalid="" data-required="">
  <label class="hashti-label">Email</label>
  <input class="hashti-input" type="email" />
  <span class="hashti-field-error">Required</span>
  <span class="hashti-description">Enter your email</span>
</div>
```
