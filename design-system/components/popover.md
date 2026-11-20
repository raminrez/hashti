---
sourcesHash: 0cf6c16bfe186b901e661b7f7515d2bb1763207ff6fb7fc9f08ee335a8972584
id: popover
description: >-
  Opens a small task — fields, buttons, other interactive content — beside its
  trigger, with placement, focus and dismissal handled. The Hashti wrapper
  fixes the `hashti-popover` classes on every part.
status: discoverable
sources:
  - packages/react/src/popover/popover.tsx
  - packages/react/src/popover/index.ts
  - packages/styles/src/popover.css
examples:
  - apps/docs/content/docs/popover.mdx
---

# Popover

## Purpose

Popover keeps a small task close to the thing it belongs to — edit or explore
something beside its trigger — and handles placement, focus and dismissal.
`@hashti/react` wraps ui-sdk's Popover parts unchanged except for the
`hashti-popover*` classes.

## When to use

- The content is a small task beside its trigger: a few fields, buttons, or
  other interactive content.
- The page should stay usable while it is open: the default is non-modal, and
  focus leaving the popover closes it.

## When not to use

- A focused task that must take over the page: use [Dialog](dialog.md).
- Choosing among commands: use [Menu](menu.md).
- Pure supplementary text with no interaction: a tooltip fits better; ui-sdk
  ships one, Hashti does not wrap it yet.

## Public API

Exported from `@hashti/react` (`packages/react/src/popover/index.ts`):

- `Popover` — every ui-sdk Popover prop forwards unchanged: `open` /
  `defaultOpen`, `onOpenChange(open, details)`, `onOpenChangeComplete`,
  `modal` (`false` default; `true` traps focus, locks scroll and makes the
  page inert; `"trap-focus"` traps focus only), `openOnHover` with `delay`
  and `closeDelay`, `dismissible`, `onDismissAttempt`, `presentation`
  (`"sheet"` or `"auto"` presents as a bottom sheet), `controller` (from
  `createPopoverController()`), `container`.
- `PopoverTrigger` — `disabled`, `focusableWhenDisabled`, `payload`,
  `shortcut`, `controller`.
- `PopoverContent` — placement props: `side`, `align`, `sideOffset`,
  `alignOffset`, `collisionPadding`, `anchor`, `initialFocus`, `finalFocus`,
  `keepMounted`, `inline`.
- `PopoverTitle` — names the popover (renders an `h2`);
  `PopoverDescription` describes it (renders a `p`).
- `PopoverClose` — closes the popover.

## States

Per ui-sdk docs, the parts carry their `data-slot`s and:

- `data-open` / `data-closed` — on the trigger and content while the popover
  is open / closed, including while it animates out.
- `data-side` (`top`, `right`, `bottom`, `left`) and `data-align` (`start`,
  `center`, `end`) — where the popover ended up, after flipping away from
  edges.
- `data-presentation` (`popover`, `sheet`) — how it presents this time it's
  open.
- `data-starting-style` / `data-ending-style` — on the content for its
  transitions.
- `data-disabled` — on a disabled trigger.

The stylesheet (`packages/styles/src/popover.css`) keys the open/closed
transitions through `data-starting-style` and `data-ending-style`, and scales
from `var(--transform-origin)`, as of this read. Modifiers are attributes
only and values come from tokens, per `design/css-conventions.md`.

## Observable promises

Per ui-sdk docs (`@ui-sdk/react/docs/components/popover.md`):

- The popover handles placement — flipping away from edges — focus and
  dismissal.
- With `openOnHover`, resting the pointer opens it after `delay`; pressing
  the trigger still opens it, so keyboard and touch users can too.
- `--anchor-width`, `--available-height` and `--transform-origin` on the
  content let CSS match the trigger's width, cap the height and scale from
  the trigger.
- `dismissible: false` refuses Escape and outside presses and asks in
  `onDismissAttempt` instead.
