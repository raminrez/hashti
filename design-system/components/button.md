---
id: button
description: >-
  Invoke one immediate action or navigate to one destination through a
  Hashti-styled native button, with pending and disabled states handled by
  ui-sdk.
status: discoverable
sources:
  - packages/react/src/button/button.tsx
  - packages/styles/src/button.css
examples:
  - apps/docs/content/docs/button.mdx
---

# Button

## Purpose

Runs one immediate action — submit, save, open — through a native `button`, or
navigates when it renders as a link via ui-sdk's `render`. The Hashti wrapper
adds the `hashti-button` class and `data-variant`/`data-size` so appearance
lives entirely in `@hashti/styles`.

## When to use

- The user performs one action with one press: submit a form, confirm, open a
  panel. ui-sdk docs: "Run an action, show that it's working, and keep it
  reachable when disabled."
- The action may take time: return a Promise from `onClick` and the button
  stays pending, so a form can't submit twice.
- For navigation, render a link through ui-sdk's `render` prop rather than
  nesting a link inside a button.

## When not to use

- The control toggles a setting on/off — use [switch](switch.md).
- The control chooses from a list — use [select](select.md) or
  [menu](menu.md).
- A plain click handler with no pending/disabled needs: per ui-sdk docs, "For
  a plain click handler, a native `button` is enough."

## Public API

- `variant`: `"primary"` (default) | `"secondary"` | `"tertiary"` | `"ghost"` |
  `"danger"` | `"danger-tertiary"` | `"danger-ghost"`. Hashti-added, emitted as
  `data-variant`. Choose primary for the page's main action, secondary/
  tertiary/ghost for descending emphasis, `danger*` for destructive actions.
- `size`: `"sm"` | `"md"` (default) | `"lg"`. Hashti-added, emitted as
  `data-size`. Free choice within the three sizes; `sm` for dense rows, `lg`
  for hero/empty-state actions.
- All other props forward to ui-sdk `Button`: `disabled`,
  `focusableWhenDisabled`, `type` (`"button"` default), `pendingAnnouncement`,
  `render`, native button attributes. See
  `packages/react/node_modules/@ui-sdk/react/dist/button.d.ts`.
- Children are the button's label; the consumer supplies it.

## Behaviour and states

ui-sdk emits `data-slot="button"` plus (per its docs):

- `data-pending`: while the Promise the press handler returned is running.
- `data-disabled`: when disabled.

`packages/styles/src/button.css` keys `data-size="sm|lg"` for heights,
`data-variant` for palettes, and `:focus-visible` for the focus ring. Pending
content swapping uses ui-sdk's `data-show="idle"`/`data-show="pending"` child
markers; the current stylesheet does not style them yet (as of this read).

## Observable promises

- Per ui-sdk docs: "Return a Promise from `onClick` to keep the button pending
  until it settles. The button keeps focus and ignores further presses while it
  waits."
- Per ui-sdk docs: after one second pending, screen readers hear the
  `pendingAnnouncement` message ("Loading" by default; empty string silences).
- Per ui-sdk docs: `focusableWhenDisabled` "keeps a disabled button in the tab
  order with `aria-disabled` instead of the native attribute", so it can host a
  tooltip explaining why.

## Accessibility

The native `button`/link role and name come from ui-sdk and the consumer's
label. Consumer obligations: supply a meaningful label; set
`pendingAnnouncement` in the page's language for slow actions; prefer
`focusableWhenDisabled` plus an explanation over a button that vanishes from
the tab order.
