# TICK-005: TextField, TextArea, NumberField

**Status:** DONE

**Phase:** 3 — Form Controls & Inputs
**Priority:** High
**Blocked by:** TICK-013.
**Effort:** Medium (grew to Large — see Scope below)
**Depends on:** TICK-004

## Scope (expanded)

Per the approved inventory (`docs/component-inventory.md`, decisions-log item 7), TICK-005
absorbed the rest of the form-controls batch: **Field, TextField→Input/Textarea,
NumberField→NumberInput, InputOTP→OtpInput, SearchField, Dropzone→FileInput, TimeField→TimeInput,
Meter, Pagination, Progress, Slider.** The DateField half of `time-field/` was replaced by a
re-export of ui-sdk `date-input` (`DateInput`/`DateInputSegment`); the full DateField/DatePicker
rebuild is TICK-016's.

## Goal
Migrate text input primitives to `@ui-sdk/react` form inputs. These are the highest-usage
form components. The `ChangeDetails`/`ChangeSource` types are kept inline in `text-field.tsx`
for onChange API compat.

## What landed

- **Field** (`components/field/`): Hashti's anatomy on `@ui-sdk/react/field`. `FieldLabel`,
  `FieldDescription`, `FieldErrorMessage` (`match`), `FieldHelp`, `FieldStatusMessage`,
  `FieldStatusIcon`, `FieldControl`, `FieldInput`, `FieldTextArea`, `FieldLayout`,
  `FieldPresentationProvider`, `useFieldPresentation`, `fieldClassName`, `fieldParts`. Status
  (`status`/`statusVariant`/`isOptional`) stays presentation-only; an invalid field takes
  precedence. Label tooltip is a plain `title`-tooltip button (the interactive popover form
  returns with TICK-007). `useFieldAnatomy` + the date-picker's `FieldDateInput`/
  `FieldGroupDateInput` remain RAC-based and live in `src/field-anatomy.tsx` (outside
  `components/`) for the still-RAC components (select, combobox, date-picker, token-field);
  remove with TICK-006/TICK-016.
- **TextField → Input / TextArea** (`components/text-field/`): `Input`, `TextArea`, each with a
  `Root`, on `@ui-sdk/react/input` and `/textarea`. `value`/`defaultValue`/`onValueChange`/
  `disabled`/`required`/`readOnly`.
- **NumberField → NumberInput** (`components/number-field/`): wraps `@ui-sdk/react/number-input`
  with `size`, Field composition, and `Decrement`/`Increment` steppers (aria-labels
  "Decrease"/"Increase"). `min`/`max`/`step`/`format`.
- **InputOTP → OtpInput** (`components/input-otp/`): wraps `@ui-sdk/react/otp-input`; `length`
  maps to `maxLength` slots; Field composition; label is a sibling of the control under Field.
- **SearchField** (`components/search-field/`): thin wrapper over ui-sdk `Input type="search"`
  + `InputClear` (accessible clear button) inside Field.
- **Dropzone → FileInput** (`components/dropzone/`): wraps `@ui-sdk/react/file-input`; keeps
  `variant` (`dashed`/`solid`/`card`) and the `onDropFiles` convenience; `FileUploader` and
  `acceptsFile` retained.
- **TimeField → TimeInput** (`components/time-field/`): wraps `@ui-sdk/react/time-input` (value
  is a `"14:30"` string). Also re-exports `DateInput`/`DateInputSegment` for the DateField half.
- **Meter** (`components/meter/`): wraps `@ui-sdk/react/meter`; keeps tone derivation
  (`deriveMeterTone`), segments, and the circular variant (a Hashti styled variant — ui-sdk
  progress/meter only cover the bar).
- **Pagination** (`components/pagination/`): wraps `@ui-sdk/react/pagination`; the
  `NativeSelect` page-size picker folds into Select later — kept the current Select composition.
- **Progress** (`components/progress/`): `ProgressBar` on `@ui-sdk/react/progress`;
  `ProgressCircle` stays a Hashti styled variant. `Loading`, `InlineLoading`, `Skeleton`,
  `ProgressIndicator` (step list) unchanged.
- **Slider** (`components/slider/`): wraps `@ui-sdk/react/slider` (single + range thumbs).

Old names (`TextField`, `NumberField`, `InputOTP`, `DropZone`, `TimeField`, `DateField`) are
deleted; call sites in stories and tests were migrated to the new names/props
(`minValue`→`min`, `maxValue`→`max`, `isRequired`→`required`, `isInvalid`→`invalid`,
`isDisabled`→`disabled`, `isReadOnly`→`readOnly`, `onChange`→`onValueChange`).

## Acceptance Criteria
- [x] Text input uses `@ui-sdk/react` input primitive (not RAC `TextField`)
- [x] `ChangeDetails` / `ChangeSource` types kept (inline in `text-field.tsx`)
- [x] `.hashti-text-field`, `.hashti-field__label`, `.hashti-input`, `.hashti-field__error` classes
- [x] `data-invalid`, `data-disabled`, `data-required`, `data-readonly` attributes
- [x] NumberField: increment/decrement buttons with `aria-label` (NumberInput Decrease/Increase)
- [x] SearchField: clear button accessible (ui-sdk InputClear)
- [x] No `react-aria-components` imports in the migrated component dirs
- [x] `bun run build:packages` succeeds (exit 0)
- [x] `bun run build:storybook` succeeds (exit 0)

## Verification notes
- Unit tests: 129 pass / 2 fail. Both failures are outside this ticket's scope and pre-existing
  in the concurrent WIP: `ComboBox multipleDisplay` (combobox/ is TICK-006, mid-migration — it
  fails with this ticket's changes stashed too) and `GridList drag handles` (grid-list is
  descoped per the inventory). The direct suite for the migrated components
  (`tests/unit/zz-tick005.test.tsx`) is 19/19.
- Stories cover rest/focus/disabled/invalid/required states, both themes, and RTL for the
  migrated components.

## DOM Contract
```tsx
<div class="hashti-field hashti-text-field" data-slot="field" data-invalid="" data-required="">
  <label class="hashti-field__label" data-slot="field-label">Email</label>
  <input class="hashti-input" data-slot="input" type="email" />
  <span class="hashti-field__error" data-slot="field-error">Required</span>
  <p class="hashti-field__description" data-slot="field-description">Enter your email</p>
</div>
```
