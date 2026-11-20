---
sourcesHash: c603fa470f07a7fe446df2451537b32e1f789528a5256f835361f1168bec89a8
id: select
description: >-
  Chooses one value or several from a popup list, with keyboard navigation and
  the value submitted with a form. The Hashti wrapper fixes the
  `hashti-select` classes on every part.
status: discoverable
sources:
  - packages/react/src/select/select.tsx
  - packages/react/src/select/index.ts
  - packages/styles/src/select.css
examples:
  - apps/docs/content/docs/select.mdx
---

# Select

## Purpose

Select chooses one value or several from a popup list, handling opening the
list, keyboard navigation, selection, and the value submitted with a form.
`@hashti/react` wraps ui-sdk's Select parts unchanged except for the
`hashti-select*` classes.

## When to use

- The user picks from a set of options too long or too formal for checkboxes
  or radios.
- The choice belongs to a form: `name` submits the value, `required` blocks
  submission until one is chosen.
- The options need search or async loading: `items` with a `SelectInput`
  filters, and `status` reports loading or failed results.

## When not to use

- One binary choice: use [Checkbox](checkbox.md) or [Switch](switch.md).
- A few known options visible at once: ui-sdk's Radio Group fits; Hashti does
  not wrap it yet.
- Commands rather than values: use [Menu](menu.md).

## Public API

Exported from `@hashti/react` (`packages/react/src/select/index.ts`):

- `Select` — every ui-sdk Select prop forwards unchanged: `value` /
  `defaultValue` / `onValueChange` (a list with `multiple`), `multiple`,
  `items` / `emptyItems`, `query` and `filter` for search, `status` and
  `onLoadMore` for async results, `placeholder`, `itemToValue` /
  `itemToLabel` / `isItemEqualToValue` for object values, `open` /
  `defaultOpen` / `onOpenChange`, `loop`, `virtualFocus`, `modal`,
  `presentation`, `disabled`, `readOnly`, `required`, `name`, `form`,
  `autoComplete`, `controller` (from `createSelectController()`),
  `dismissible`, `onDismissAttempt`, `container`.
- `SelectTrigger` and `SelectValue` — the closed control and the selected
  label it shows.
- `SelectContent` — the popup list; `SelectItem` and `SelectItemIndicator`
  are the choices and their check.
- `SelectLabel` — names the trigger; inside a Field, use its `FieldLabel`
  instead.
- `SelectGroup`, `SelectGroupLabel`, `SelectSeparator`, `SelectEmpty` —
  structure and the no-results message.

Per the AGENTS.md compound-parts rule, compose the parts inside a single
React demo component when rendering on a docs page.

## States

Per ui-sdk docs, the parts carry their `data-slot`s and:

- `data-open` / `data-closed` — on the trigger and content while the list is
  open / closed, including while it animates out.
- `data-highlighted` — on the item with keyboard focus or under the pointer.
- `data-selected` — on chosen items and their indicators.
- `data-placeholder` — on the trigger and value while nothing is selected.
- `data-disabled`, `data-readonly`, `data-required` — on the label, trigger
  and clear part.
- `data-modality` (`keyboard`, `pointer`) — on the content, to tell a
  keyboard highlight from a pointer one.
- `data-side`, `data-align`, `data-presentation`, `data-starting-style`,
  `data-ending-style` — on the content.
- `data-has-icons` / `data-has-icon` — so items without icons line up.

The stylesheet (`packages/styles/src/select.css`) keys `data-highlighted`,
`data-disabled`, `data-placeholder`, and the open/closed transitions through
`data-starting-style` and `data-ending-style`, sizing the content from
`--anchor-width` and `--available-height`, as of this read. Modifiers are
attributes only and values come from tokens, per
`design/css-conventions.md`.

## Observable promises

Per ui-sdk docs (`@ui-sdk/react/docs/components/select.md`):

- The select handles opening the list, keyboard navigation, selection, and
  the value submitted with a form.
- With `virtualFocus`, focus stays on the trigger while the list is open, as
  on a native select: arrow keys, Home, End and typing move the highlight,
  and the trigger points at it with `aria-activedescendant`.
- `required` blocks form submission until a value is selected, with the
  browser's own message; `readOnly` keeps the value submitted but stops
  changes; `disabled` removes it from both.
- With `multiple`, the value is a list and the list stays open as items
  toggle.
- `presentation: "sheet"` slides the list up from the bottom of the screen,
  where it can be swiped away; `"auto"` does that on small touch screens.
