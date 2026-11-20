---
sourcesHash: 05d1cf74208c31bef321ffe243746fac7ff386f4e839fd75984c8c2ac82feb19
id: menu
description: >-
  Chooses actions and settings from a button or a context menu, with arrow
  keys, typeahead and dismissal handled. The Hashti wrapper fixes the
  `hashti-menu` classes on every part.
status: discoverable
sources:
  - packages/react/src/menu/menu.tsx
  - packages/react/src/menu/index.ts
  - packages/styles/src/menu.css
examples:
  - apps/docs/content/docs/menu.mdx
---

# Menu

## Purpose

Menu chooses actions and settings from a trigger or a context menu — items,
groups, checkbox and radio choices, submenus — with focus, arrow keys,
typeahead and dismissal handled. `@hashti/react` wraps ui-sdk's Menu parts
unchanged except for the `hashti-menu*` classes.

## When to use

- Several related commands share one entry point: a trigger opens a list of
  actions.
- Settings toggle or choose inside the menu: checkbox items and radio groups.
- The command list grows: groups with labels, separators, and submenus.

## When not to use

- One immediate action: use [Button](button.md).
- Choosing a value for a form: use [Select](select.md).
- A small task with fields beside its trigger: use [Popover](popover.md).

## Public API

Exported from `@hashti/react` (`packages/react/src/menu/index.ts`):

- `Menu` — every ui-sdk Menu prop forwards unchanged: `open` / `defaultOpen`,
  `onOpenChange(open, details)`, `onOpenChangeComplete`, `onAction(value,
details)` (runs for every plain item; return a Promise to keep the item
  pending), `onCheckedChange`, `onValueChange`, `items` (menu as data),
  `loop`, `delay`, `modal` (`"pointer"` default; `true` locks scroll, traps
  focus and makes the page inert), `dismissible`, `onDismissAttempt`,
  `presentation`, `controller` (from `createMenuController()`), `container`.
- `MenuTrigger` — `disabled`, `focusableWhenDisabled`, `payload`, `shortcut`,
  `controller`. (ui-sdk's `MenuContextTrigger` for right-click menus is not
  re-exported yet.)
- `MenuContent` — placement props: `side`, `align`, `sideOffset`,
  `alignOffset`, `collisionPadding`, `anchor`, `finalFocus`, `keepMounted`.
- `MenuItem` — `value`, `label`, `disabled`, `destructive`, `shortcut`,
  `closeOnSelect`.
- `MenuCheckboxItem`, `MenuRadioGroup`, `MenuRadioItem`,
  `MenuItemIndicator` — settings inside the menu.
- `MenuGroup`, `MenuGroupLabel`, `MenuSeparator` — structure.
- `MenuSub`, `MenuSubTrigger`, `MenuSubContent` — submenus; the sub trigger
  carries both `hashti-menu-item` and `hashti-menu-sub-trigger`.
- `MenuItemIcon` — an icon slot that flips with `mirror` in RTL.

## States

Per ui-sdk docs, the parts carry their `data-slot`s and:

- `data-open` / `data-closed` — on the trigger and content while the menu is
  open / closed, including while it animates out; a submenu trigger has
  `data-open` while its submenu is open.
- `data-highlighted` — on the item with keyboard focus or under the pointer.
- `data-disabled` — on an item that can't be chosen.
- `data-checked` / `data-unchecked` — on checkbox and radio items, and on
  their indicators.
- `data-pending` — on an item whose action Promise runs.
- `data-destructive` — on an item styled as dangerous.
- `data-side`, `data-align`, `data-presentation`, `data-nested`,
  `data-starting-style`, `data-ending-style` — on the content.
- `data-mirror` — on an icon that flips in right-to-left text.

The stylesheet (`packages/styles/src/menu.css`) keys `data-highlighted`,
`data-disabled`, `data-checked`, `data-unchecked`, `data-indeterminate`,
`data-mirror`, `data-open` transitions through `data-starting-style` and
`data-ending-style`, and sizes from `--anchor-width` / `--available-height`,
as of this read. Modifiers are attributes only and values come from tokens,
per `design/css-conventions.md`.

## Observable promises

Per ui-sdk docs (`@ui-sdk/react/docs/components/menu.md`):

- The menu handles focus, arrow keys, typeahead, and dismissal.
- A Promise from `onAction` or an item's `onSelect` keeps the item pending —
  `data-pending`, `aria-busy` and `aria-disabled` — the menu stays open, and
  choosing it again does nothing until the promise settles; it closes once
  the promise resolves, and a rejection keeps it open with the reason in the
  item's `error` state. After a second, screen readers hear
  `pendingAnnouncement` ("Loading" by default).
- A separator divides items without becoming a focus stop.
- `dismissible: false` refuses Escape and outside presses and asks in
  `onDismissAttempt` instead.
