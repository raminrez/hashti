---
sourcesHash: 50eee4245ef6f42eb4524f606f90b202b65beb22bbca25d6f24602565d5e0bb2
id: accordion
description: >-
  Show and hide sections of content from their headings, one at a time or
  several at once, with ui-sdk handling the disclosure behavior, deep links
  and find-in-page.
status: discoverable
sources:
  - packages/react/src/accordion/accordion.tsx
  - packages/react/src/accordion/index.ts
  - packages/styles/src/accordion.css
examples:
  - apps/docs/content/docs/accordion.mdx
---

# Accordion

## Purpose

Shows and hides sections of content from their headings. Hashti wraps ui-sdk's
`Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionTrigger` and
`AccordionPanel` unchanged, adding `hashti-accordion*` classes; appearance
lives in `packages/styles/src/accordion.css`.

## When to use

- Content people explore one section at a time, such as answers, settings or a
  course outline. ui-sdk docs: "Show and hide sections of content from their
  headings."
- Several sections open at once: add `multiple`.
- A panel that must stay in the page when closed: `keepMounted` preserves
  local state such as a draft, and `hiddenUntilFound` keeps it reachable from
  the browser's Find.

## When not to use

- One single panel to show and hide — use [Collapsible](collapsible.md).
- Navigation between views — use [Tabs](tabs.md).

## Public settings

Hashti wraps and re-exports the five parts only; all props forward to ui-sdk.

- Root: `value`/`defaultValue`/`onValueChange` (the value is always an array of
  open item values, even when only one can be open; `details.cancel()` stops a
  change), `multiple`, `collapsible` (`false` keeps one item permanently open),
  `disabled`, `keepMounted`, `hiddenUntilFound`, `controller`,
  `createAccordionController()`.
- Item: `value` (unique per item), `disabled`, `onOpenChange` (runs before the
  accordion's `onValueChange`; canceling any one item cancels the whole
  change), `onOpenChangeComplete` (after any animation).
- Composition: put the trigger inside the header (an `h3` by default — pick a
  level that fits the document), then the panel after it.

## States

ui-sdk sets `data-open`, `data-closed` and `data-disabled` on every part, plus
`data-starting-style`/`data-ending-style` on the panel (`data-slot` names
preserved). The panel exposes `--accordion-panel-height`.
`packages/styles/src/accordion.css` keys:

- `[data-open]` on the trigger — the CSS-drawn caret rotates from pointing
  closed to down; the panel animates `block-size` from
  `var(--accordion-panel-height)`.
- `[data-starting-style]`/`[data-ending-style]` — height 0, exits shorter than
  entrances.
- `[data-disabled]` on trigger and panel, `:focus-visible` ring on the trigger.

## Observable promises

Per ui-sdk docs:

- Tab moves between triggers; Enter or Space opens and closes their panels.
  Arrow keys, Home and End do nothing: the APG removed them from the pattern,
  and a screen reader's heading navigation already reaches each trigger.
- Disabled triggers stay in the tab order so people can still discover them; a
  disabled `<fieldset>` around the accordion disables it too.
- A closed panel normally unmounts; `keepMounted` keeps its content hidden in
  the page. `hiddenUntilFound` keeps it as `hidden="until-found"` so the
  browser's Find opens it with the `find-in-page` reason.
- A link with a hash to an element inside a closed panel reveals it; with
  `hiddenUntilFound`, React's server render writes `hidden=""` so panels
  become findable after hydration.
- With `multiple`, a controller's `openAll()` opens every enabled item and
  `closeAll()` closes every item that may close.
- The panel stays mounted until its exit animation finishes;
  `onOpenChangeComplete` runs afterward.
