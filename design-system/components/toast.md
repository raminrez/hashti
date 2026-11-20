---
sourcesHash: bb31de1eefb61dd3fa1a70be56b1b177cd920d60040bad00b069c6fd6414a830
id: toast
description: >-
  Tell someone that something happened — a saved change, a sent message, a
  finished or failed promise — with actions, timed dismissal and screen-reader
  announcements, without taking focus.
status: discoverable
sources:
  - packages/react/src/toast/toast.tsx
  - packages/react/src/toast/index.ts
  - packages/styles/src/toast.css
examples:
  - apps/docs/content/docs/toast.mdx
---

# Toast

## Purpose

Reports that something happened and goes away on its own, optionally offering
an action such as Undo. Hashti wraps ui-sdk's Toast parts unchanged, adding
`hashti-toast*` classes, and re-exports the `toast()` function; appearance
lives in `packages/styles/src/toast.css`.

## When to use

- The outcome of an action should be confirmed without interrupting the current task.
- The message can carry one action (Undo, Retry) and can wait or be swiped away.

## When not to use

- Information the user must not miss or must answer: use `Dialog`.
- Persistent status that belongs on the page: render it in place instead.

## Public settings

Hashti wraps and re-exports: `ToastRegion`, `Toast`, `ToastTitle`,
`ToastDescription`, `ToastAction`, `ToastClose`, and the shared `toast()`
function (`toast(...)`, `toast.success/.info/.warning/.error/.loading`,
`toast.promise`, `toast.update`, `toast.dismiss`). ui-sdk also ships
`createToaster` for a second region with its own queue; Hashti re-exports it
from the same module through ui-sdk.

- `ToastRegion` options forward from ui-sdk: `toaster`, `side` (`top` | `bottom`), `align`, `maxVisible`, `expanded`, `shortcut` (focus key, e.g. `"F6"`; `null` turns it off), `pendingAnnouncement`. Its children function renders each toast; without children it renders unstyled default parts.
- Toast data (through `toast(message, options)`): `description`, `type`, `duration` (`Infinity` keeps it until dismissed), `priority` (`"assertive"` | `"polite"`), `action` (`label`, `onAction`, `href`, `dismiss`), `cancel`, `dismissible`, `id` (reuse updates in place), `data`, `onDismiss`.
- Composition: a toast is named by its title and described by its description; empty title/description/action parts show the text from the toast's data.

## States

ui-sdk sets `data-type` (`default`/`success`/`error`/`info`/`warning`/
`loading`), `data-front`, `data-expanded`, `data-starting-style`/
`data-ending-style` on the toast; `data-side`/`data-align`/`data-expanded`/
`data-keyboard` on the region; `data-pending` on action and close buttons
(`data-slot` names preserved). `packages/styles/src/toast.css` keys:

- Region: fixed bottom-end, 22rem wide; toasts stack in a grid.
- Toast: type backgrounds for `success`/`warning`/`error` with matching title colors; entrance/exit fade+slide via `data-starting-style`/`data-ending-style`, `prefers-reduced-motion` drops the slide.
- Promise states: a leading `.hashti-toast__icons` slot appears for `loading`/`success`/`error`, showing the icon child marked `data-show="success|error|loading"` (a `.hashti-toast__spinner` is provided for loading); action and close buttons show a progress cursor on `[data-pending]`.

## Observable promises

Per ui-sdk docs:

- Toasts are announced through shared live regions once each, politely by default and assertively for errors; while it has toasts, the region is a landmark named Notifications (`aria-label` to name it in the page's language), and the visible region itself is not a live region.
- F6 (or the region's `shortcut`) moves focus to the newest toast and back; Tab moves through toasts and their buttons; Escape dismisses the focused toast.
- Timers pause while the pointer or focus is in the region and while the window loses focus; `maxVisible` holds older toasts with their timers stopped.
- Swiping toward the region's side (or its aligned edge) dismisses; a short swipe snaps back; `dismissible: false` ignores Escape and swipes.
- A Promise from an action's handler marks it pending and dismisses the toast once it resolves; a rejection keeps the toast. `toast.promise` shows loading, then the result.
- A toast shown from a modal dialog stays visible and usable above it.
