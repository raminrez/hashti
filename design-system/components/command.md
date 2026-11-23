---
sourcesHash: da295d86d5fc1883faec003652f3602bee4b61075ff0c2303c70861cc3a36353
id: command
description: >-
  Search commands and run actions over an always-open list, with fuzzy
  filtering, pages, shortcuts and async results handled by ui-sdk; the base
  for a command palette inside a dialog.
status: discoverable
sources:
  - packages/react/src/command/command.tsx
  - packages/react/src/command/index.ts
  - packages/styles/src/command.css
examples:
  - apps/docs/content/docs/command.mdx
---

# Command

## Purpose

Puts a search field over a list of actions. Hashti wraps ui-sdk's `Command`,
`CommandInput`, `CommandList`, `CommandItem`, `CommandGroup`,
`CommandGroupLabel`, `CommandSeparator` and `CommandEmpty`, adding
`hashti-command*` classes, and re-exports `CommandPage`,
`createCommandController()` and `useAsyncOptions`. Appearance lives in
`packages/styles/src/command.css`.

## When to use

- A command palette: the Command inside a [Dialog](dialog.md) with
  `shortcut="mod+k"` on its trigger. ui-sdk docs: "Command puts a search field
  over a list of actions."
- Filtering a large action list as someone types, with groups and separators
  that disappear when filtering leaves them empty.
- Async results: `useAsyncOptions` plus `status` and `onLoadMore`.

## When not to use

- Choosing one value for a form field — use [Select](select.md) or
  Combobox.
- A short fixed list with no search — a [Menu](menu.md) is simpler.

## Public settings

Hashti wraps the eight parts above; ui-sdk also ships `CommandItemText`,
`CommandItemIcon`, `CommandShortcut`, `CommandStatus` and `CommandItems`,
which Hashti does not wrap yet (import them from `@ui-sdk/react/command`
directly if needed).

- Root: `value`/`onValueChange` (the highlighted command, not a chosen one),
  `query`/`onQueryChange`, `pages`/`onPagesChange`, `onAction(value, details)`
  (return a Promise to mark the command pending), `pendingAnnouncement`,
  `items`/`emptyItems` (`CommandData`), `filter` (`"fuzzy"` default |
  `"contains"` | `"startsWith"` | a scoring function | `false` for
  server-filtered results), `autoHighlight`, `loop`, `status`, `onLoadMore`,
  `announcement`, `controller`.
- Item: `value`, `label` (what the search matches when the content isn't plain
  text), `keywords`, `disabled`, `shortcut` (like `"mod+p"`), `page`, `index`
  (for virtualized lists), `onSelect` (runs before `onAction`;
  `preventDefault()` stops the action).
- Composition: give the input an accessible name and each command a unique
  value; keep empty and status messages outside the list.

## States

ui-sdk sets `data-loading` on the root and empty part, `data-has-icons` on the
list and `data-has-icon` on items, `data-highlighted`, `data-disabled` and
`data-pending` on items, and `data-matched`/`data-mirror` on the unwrapped
text/icon parts. `packages/styles/src/command.css` keys:

- `[data-highlighted]` — hover background; `[data-disabled]` muted, and no
  background when both.
- `[data-pending]` — muted with a progress cursor, and it spins any
  `[data-slot="spinner"]` inside the item's leading slot.
- The palette shell (border, popover shadow, `max-inline-size`), a 16rem list
  cap, and skeleton rows (`hashti-command__skeleton-row`) that pulse, stopped
  under `prefers-reduced-motion`.

## Observable promises

Per ui-sdk docs:

- Return a Promise from `onAction` or an item's `onSelect`: the command gets
  `data-pending`, `aria-busy` and `aria-disabled` until it settles, further
  presses do not start another run, and a rejection becomes the command's
  `error` state, which clears when it runs again.
- An item's `shortcut` can run it while the command list is mounted, even when
  the search or current page hides it; the item gets `aria-keyshortcuts`, and
  shortcuts inside a dialog run while it is open.
- The list renders a `div` with the listbox role, always shown; the input
  renders an `input` with the combobox role and keeps focus while arrow keys
  move the highlight.
- `CommandEmpty`'s message is announced when it appears; place it outside the
  list. Groups and separators disappear when filtering leaves them empty.
- Backspace in an empty search goes back and restores the previous page's
  query; Escape clears the query first, then goes back.
- `CommandItemText` marks the matched text, and the default fuzzy filter can
  match letters that are apart, so one command may have several marked
  segments.
- Data commands are ranked by score; commands written directly in markup keep
  their order. The list gets `aria-busy` while loading, and `onLoadMore` runs
  when the highlight or scrolling reaches the last command — not again for the
  same commands unless the last load failed.
