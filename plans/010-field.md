# Plan 010: Field anatomy — label, description, error, recovery band

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 18ef7a7..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (new layout recipe: the recovery band overlaps the control)
- **Depends on**: plans/009-switch (DONE)
- **Category**: migration (component build-out, cycle 10)
- **Planned at**: commit `d25c69e`, 2026-11-20 (recovery-radius token added at `18ef7a7`)

## Why this matters

Field anatomy is the keystone the deferred form recipes hang off: the
recovery band, invalid-over-selected precedence, read-only/required marks,
and the label/description/error wiring for Input, Textarea, Checkbox, Radio
and Switch. After this cycle every form control integrates with validation.

## Current state

- `packages/react/src/radio/radio.tsx` — the compound wrapper exemplar
  (three parts). Field has seven.
- `packages/styles/src/input.css` — the control the recovery band joins:
  `.hashti-input` (10px control radius, control border). The band overlaps
  the control's bottom edge by 1px.
- `packages/styles/src/label.css` — `.hashti-label` (14px/600/20px). The
  field label is the field-scoped variant with its own class.
- `apps/docs/src/components/checkbox-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "input", "label", "radio", "separator", "switch", "textarea"]`.
- `design/tokens.css` has `--hashti-border-radius-recovery: 0.1875rem`
  (3px, added at `18ef7a7` per DESIGN.md's recovery-band rule).

### ui-sdk Field facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/field.md`)

- Import: `import { Field, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/react/field"`.
- Composition: `Field` → `FieldLabel`, control (an Input/Textarea/… or
  `FieldControl`), `FieldDescription`, `FieldError`. `FieldSet` →
  `FieldLegend`, `FieldDescription`, `FieldGroup` → `Field`s.
- `Field name="…"` supplies the control's name; native constraints
  (`required`, `type="email"`) show errors after a submit attempt;
  `invalid={true}` shows an app-supplied error immediately; `FieldError`
  takes `match="valueMissing"` etc. or `match` for app errors; an empty
  `<FieldError />` shows the browser's message.
- **Every part carries the same state attributes**: `data-invalid`,
  `data-valid`, `data-disabled`, `data-required`, `data-focused` — "so a
  label can turn red with its control".
- `data-slot` values: `field`, `field-label`, `field-control`,
  `field-description`, `field-error`, `field-set`, `field-legend`,
  `field-group`.
- The control submits under its own `name` or the field's; reset hides
  validation errors; the first invalid control takes focus on submit.

### Design rules that bite (from `design/DESIGN.md`, `design/css-conventions.md`, `design/design-system.md`)

- **Reading sequence**: label, guidance, control, recovery — a flex column.
- **Label**: the label role — 14px/600/20px (same values as `.hashti-label`).
  Labels wrap; sentence case. A required mark can show via `data-required`
  on the label (CSS alone).
- **Description (guidance)**: the helper role — 13px/400/20px
  (`font-size: 0.8125rem; line-height: 1.25rem`), ink
  `var(--hashti-text-secondary)`. **Guidance stays visible while recovery
  shows** — never hide the description when an error appears.
- **Invalid ink on parts**: `[data-invalid]` on the label and description →
  ink `var(--hashti-text-error)`. (The control's invalid border lives in
  input.css via `aria-invalid`.)
- **Recovery band** (DESIGN.md, authoritative numbers):
  - The band is the `FieldError` element, below the control.
  - `margin-block-start: -9px` — it sits 1px under the control's shared
    edge (the control's 1px bottom border overlaps the band's top).
  - Layering: control `z-index: 2`, band `z-index: 1`.
  - The band has side and bottom borders (1px, `var(--hashti-support-error)`),
    background `var(--hashti-notification-background-error)`, and carries
    the status ink on its border; its text ink is `var(--hashti-text-error)`.
  - **Lower corners 3px** — band `border-radius` lower corners
    `var(--hashti-border-radius-recovery)`; the control's LOWER corners
    tighten to the same 3px when the band shows (upper corners keep the
    10px control radius).
  - The band applies to bounded controls (Input, Textarea — the 10px-radius
    controls). For choice rows (Checkbox/Switch/Radio) the error is a plain
    text line below the row, not an overlapping band — style `FieldError`
    inside a choice row as plain error text (no negative margin) via a
    `.hashti-field:has(.hashti-choice) .hashti-field__error` override.
- **Focus ring unchanged**: an invalid field keeps the normal focus ring —
  no second error outline (DESIGN.md).
- **The 58px/78px stable-form reserve** is a form-level recipe — deferred to
  a forms recipe; do not build it here.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/field/field.tsx` — create
- `packages/react/src/field/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/field.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/field-demo.tsx` — create
- `apps/docs/content/docs/field.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"field"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/styles/src/input.css` — the control's invalid border already
  works via `aria-invalid`; do not re-style it here (the corner-tightening
  rule lives in field.css, scoped to fields with an error)
- The 58px/78px stable-form reserve — forms recipe, deferred
- Character count, custom controls — consumer recipes, documented later
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/010-field`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Field wrappers in `@hashti/react`

`packages/react/src/field/field.tsx` — one thin wrapper per part, all
class-only:

```tsx
"use client";

import type { ComponentProps } from "react";
import {
  Field as UiField,
  FieldControl as UiFieldControl,
  FieldDescription as UiFieldDescription,
  FieldError as UiFieldError,
  FieldGroup as UiFieldGroup,
  FieldLabel as UiFieldLabel,
  FieldLegend as UiFieldLegend,
  FieldSet as UiFieldSet,
} from "@ui-sdk/react/field";

const join = (base: string, className: string | undefined) =>
  className ? `${base} ${className}` : base;

function Field(props: ComponentProps<typeof UiField>) {
  return (
    <UiField {...props} className={join("hashti-field", props.className)} />
  );
}

function FieldLabel(props: ComponentProps<typeof UiFieldLabel>) {
  return (
    <UiFieldLabel
      {...props}
      className={join("hashti-field__label", props.className)}
    />
  );
}

function FieldControl(props: ComponentProps<typeof UiFieldControl>) {
  return (
    <UiFieldControl
      {...props}
      className={join("hashti-field__control", props.className)}
    />
  );
}

function FieldDescription(props: ComponentProps<typeof UiFieldDescription>) {
  return (
    <UiFieldDescription
      {...props}
      className={join("hashti-field__description", props.className)}
    />
  );
}

function FieldError(props: ComponentProps<typeof UiFieldError>) {
  return (
    <UiFieldError
      {...props}
      className={join("hashti-field__error", props.className)}
    />
  );
}

function FieldSet(props: ComponentProps<typeof UiFieldSet>) {
  return (
    <UiFieldSet
      {...props}
      className={join("hashti-field-set", props.className)}
    />
  );
}

function FieldLegend(props: ComponentProps<typeof UiFieldLegend>) {
  return (
    <UiFieldLegend
      {...props}
      className={join("hashti-field__legend", props.className)}
    />
  );
}

function FieldGroup(props: ComponentProps<typeof UiFieldGroup>) {
  return (
    <UiFieldGroup
      {...props}
      className={join("hashti-field-group", props.className)}
    />
  );
}

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
};
```

(The `join` helper is local to this file — the other wrappers use the
inline template; either is fine, pick one and stay consistent within the
file.)

`packages/react/src/field/index.ts`:

```ts
export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from "./field";
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from "./field";
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/field.css`:

```css
.hashti-field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  min-inline-size: 0;
}

.hashti-field__label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: var(--hashti-text-primary);
}

.hashti-field__label[data-invalid] {
  color: var(--hashti-text-error);
}

.hashti-field__description {
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--hashti-text-secondary);
}

.hashti-field__description[data-invalid] {
  color: var(--hashti-text-error);
}

.hashti-field__error {
  margin-block-start: -0.5625rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--hashti-support-error);
  border-start-start-radius: 0;
  border-start-end-radius: 0;
  border-end-start-radius: var(--hashti-border-radius-recovery);
  border-end-end-radius: var(--hashti-border-radius-recovery);
  background: var(--hashti-notification-background-error);
  color: var(--hashti-text-error);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  z-index: 1;
}

.hashti-field:has(.hashti-field__error) :is(.hashti-input, .hashti-textarea) {
  position: relative;
  z-index: 2;
  border-end-start-radius: var(--hashti-border-radius-recovery);
  border-end-end-radius: var(--hashti-border-radius-recovery);
}

.hashti-field:has(.hashti-choice) .hashti-field__error {
  margin-block-start: 0;
  padding: 0;
  border: none;
  background: none;
  border-radius: 0;
}

.hashti-field-set {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
  border: none;
  min-inline-size: 0;
}

.hashti-field__legend {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: var(--hashti-text-primary);
  padding: 0;
}

.hashti-field-group {
  display: grid;
  gap: 1rem;
}
```

Geometry notes:

- `-0.5625rem` is the -9px overlap from DESIGN.md (1px under the control's
  shared edge, accounting for the band's own top border).
- The control's lower corners tighten to 3px only inside a field that shows
  an error; upper corners keep the 10px control radius from input.css.
- The choice-row override turns the band into plain error text — choice
  rows are not bounded surfaces.
- The error band renders only while invalid (ui-sdk mounts it then), so the
  `:has()` selectors cost nothing while healthy.

`packages/styles/index.css` — add after the radio import:

```css
@import "./src/field.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/field.css` → no matches.

### Step 3: Docs demo component and page

`apps/docs/src/components/field-demo.tsx` — the recovery band needs a
submit-triggered validation error, so the demo is a small form (compound
parts compose in ONE React tree):

```tsx
"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@hashti/react";
import { Input } from "@hashti/react";

export function FieldDemo() {
  return (
    <form
      style={{ display: "grid", gap: 16, maxWidth: 320 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" required placeholder="hollis@example.com" />
        <FieldDescription>We'll send you a confirmation link.</FieldDescription>
        <FieldError match="valueMissing">Enter your email address.</FieldError>
        <FieldError match="typeMismatch">
          Enter an email address like hollis@example.com.
        </FieldError>
      </Field>
      <Field name="website">
        <FieldLabel>Website</FieldLabel>
        <Input type="url" required placeholder="https://example.com" />
        <FieldError />
      </Field>
      <button type="submit" className="hashti-button" data-variant="primary">
        Subscribe
      </button>
    </form>
  );
}
```

(The submit button reuses the Button classes directly — importing
`@hashti/react`'s Button into the same demo is also fine; pick one.)

`apps/docs/content/docs/field.mdx`:

```mdx
---
title: Field
description: Labels, describes and validates a control.
---

import { FieldDemo } from "../../src/components/field-demo";

## Usage

Press Subscribe with an empty or malformed email to see the recovery band:

<FieldDemo client:load />

## Parts

| Part                                      | Purpose                                                |
| ----------------------------------------- | ------------------------------------------------------ |
| `Field`                                   | Owns the name, validation state and wiring.            |
| `FieldLabel`                              | Names the control; turns error ink when invalid.       |
| `FieldDescription`                        | Guidance; stays visible while an error shows.          |
| `FieldError`                              | The recovery band; renders while the field is invalid. |
| `FieldControl`                            | Wires a control ui-sdk doesn't ship.                   |
| `FieldSet` / `FieldLegend` / `FieldGroup` | Group related fields.                                  |

The recovery band sits 1px under the control, tightens the control's lower corners to 3px, and carries the error ink. Guidance never hides while an error shows.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "field", "input", "label", "radio", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(submit empty → error band appears 1px under the control, control's lower
corners tighten to 3px, upper corners stay 10px, description stays visible,
label turns error ink, focus ring unchanged; choice-row fields get plain
error text).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-field" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/field.css` returns nothing
- [ ] `grep -n "field" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the eight parts is not exported from `@ui-sdk/react/field` — quote
  the error.
- The -9px overlap does not produce a 1px shared edge against the rendered
  control (measure and report the actual geometry instead of guessing a new
  offset).
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The stable-form reserve (58px/78px ≤24rem) is a forms recipe — document it
  when a forms guide cycle exists.
- Character count (description-as-counter) is a consumer recipe.
- Choice-row fields (Checkbox/Switch/Radio inside a Field) get their
  invalid-precedence recipes refined here later; the plain-text error
  override in Step 2 is the foundation.
