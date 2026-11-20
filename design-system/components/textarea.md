---
id: textarea
description: >-
  Enter multiple lines of text — messages, notes, descriptions — through a
  native textarea wired to its Field, optionally growing with its text and
  submitting on a keyboard shortcut.
status: discoverable
sources:
  - packages/react/src/textarea/textarea.tsx
  - packages/react/src/textarea/index.ts
  - packages/styles/src/textarea.css
examples:
  - apps/docs/content/docs/textarea.mdx
---

# Textarea

## Purpose

Enters multiple lines of text into a form or state. Hashti wraps ui-sdk's
`Textarea` unchanged and adds the `hashti-textarea` class; appearance lives in
`packages/styles/src/textarea.css`.

## When to use

- The value is free-form text spanning lines: message, note, description, feedback.
- The field sits in a `Field` for label, description and errors, or carries its own `aria-label`.

## When not to use

- A single short value: use `Input`.
- Rich or formatted text: this is a plain native `<textarea>`, not an editor.

## Public settings

All props forward to ui-sdk's `Textarea`; the wrapper adds no options.

- Native textarea attributes pass through (`rows`, `placeholder`, `maxLength`, …).
- `value` / `defaultValue` / `onValueChange(value, details)` — same change reasons as Input (`input-change`, `clear-press`, `reset`, `imperative`), with `details.cancel()` (per ui-sdk docs).
- `autoResize` — grows and shrinks with the text; bound it with CSS `min-height`/`max-height`, past the maximum it scrolls inside.
- `submitShortcut` — `"enter"` (Shift+Enter for a new line) or `"mod+enter"` (Enter for a new line); without it, Enter always starts a new line. `onSubmit(value, details)` runs on the shortcut; without `onSubmit` the shortcut submits the surrounding form.
- `controller` — a `createInputController()` handle, same as Input.
- `disabled`, `readOnly`, `required` behave like the native attributes.

## States

ui-sdk sets `data-filled`, `data-disabled`, `data-readonly`, `data-required`
(`data-slot="textarea"`). `packages/styles/src/textarea.css` keys:

- `[aria-invalid="true"]` — error border (same `aria-invalid` keying as input.css; see gap G2 in `design-system/gaps.md`).
- `[data-readonly]` — dashed border and accent background; `[data-disabled]` — disabled colors and cursor.
- `:focus-visible` outline; `::placeholder` in secondary text color; `resize: vertical` and a 5rem minimum height from the stylesheet.

## Observable promises

Per ui-sdk docs:

- The textarea stays a native `<textarea>` with standard editing, selection, spell checking and form behavior; there is no WAI-ARIA pattern for multi-line fields, so keep label and errors in Field parts (or an `aria-label`).
- With `autoResize`, it grows with each line, stops at its max height and scrolls, and shrinks back on a form reset; browsers with `field-sizing: content` size it natively.
- Submit-shortcut keys never fire while an input method is composing.
- A form reset returns the value to `defaultValue`.
