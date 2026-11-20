---
sourcesHash: c25a1cf6999f512715e65e6bbf2b901357ac8ea45acb62c8ce741847a2aac5b2
id: dialog
description: >-
  Opens a focused task over the page — editing a record, collecting a few
  details — with focus management, Escape and dismissal handled. The Hashti
  wrapper fixes the `hashti-dialog` classes on every part.
status: discoverable
sources:
  - packages/react/src/dialog/dialog.tsx
  - packages/react/src/dialog/index.ts
  - packages/styles/src/dialog.css
examples:
  - apps/docs/content/docs/dialog.mdx
---

# Dialog

## Purpose

Dialog gives a task its own space over the page — share a link, edit a
record, collect a few details — and manages focus, Escape, outside presses
and returning to where you started. `@hashti/react` wraps ui-sdk's Dialog
parts unchanged except for the `hashti-dialog*` classes.

## When to use

- The task is focused and bounded: one record to edit, one link to share, a
  few details to collect, after which the user returns to where they were.
- The task must interrupt the page: a modal dialog makes the rest of the page
  inert and doesn't scroll.

## When not to use

- A small task beside its trigger — a color picker, a filter — that should
  not take over the page: use [Popover](popover.md).
- Choosing among commands: use [Menu](menu.md).
- A passive notification that goes away on its own: use [Toast](toast.md).

## Public API

Exported from `@hashti/react` (`packages/react/src/dialog/index.ts`):

- `Dialog` — every ui-sdk Dialog prop forwards unchanged: `open` /
  `defaultOpen`, `onOpenChange(open, details)` (with `details.returnValue`),
  `onOpenChangeComplete`, `modal` (`true` makes the page inert; `"trap-focus"`
  traps focus but leaves the page scrollable; `false` is a dialog beside the
  page), `closeOnOutsidePress`, `dismissible`, `onDismissAttempt`,
  `persistentElements`, `pendingAnnouncement`, `presentation` (`"sheet"` or
  `"auto"` presents as a bottom sheet), `controller` (from
  `createDialogController()`), `container`.
- `DialogTrigger` — `disabled`, `focusableWhenDisabled`, `payload` (data for
  the content when this trigger opens), `shortcut`, `controller`.
- `DialogBackdrop` — the dimmed page behind the dialog.
- `DialogContent` — the dialog surface.
- `DialogTitle` — names the dialog; `DialogDescription` describes it.
- `DialogClose` — closes the dialog; a Promise from its `action` keeps it
  open and pending until it settles.

## States

Per ui-sdk docs, the parts carry their `data-slot`s and:

- `data-open` / `data-closed` — on the trigger, backdrop and content while
  the dialog is open / closed, including while it animates out.
- `data-presentation` (`dialog`, `sheet`) — how the dialog presents this time
  it's open.
- `data-starting-style` / `data-ending-style` — on the backdrop and content
  for their transitions.
- `data-disabled` — on a disabled trigger.
- `data-pending` — on a Close part while its action runs.
- `data-keyboard` — on the content while the on-screen keyboard covers part
  of the page.

The stylesheet (`packages/styles/src/dialog.css`) keys `data-open` /
`data-closed` transitions through `data-starting-style` and
`data-ending-style`, and `data-pending` on close parts, as of this read.
Modifiers are attributes only and values come from tokens, per
`design/css-conventions.md`.

## Observable promises

Per ui-sdk docs (`@ui-sdk/react/docs/components/dialog.md`):

- The dialog manages focus, Escape, outside presses, and returning to where
  you started.
- With `modal` true, the rest of the page is inert and doesn't scroll, and
  focus is trapped; `persistentElements` keeps listed elements usable.
- `dismissible: false` refuses Escape, outside press and Android's back
  gesture and asks in `onDismissAttempt` instead — "Discard changes?".
- A Close part's Promise keeps the dialog open and the button pending; after
  a second, screen readers hear `pendingAnnouncement`.
- A trigger's `payload` gives the content the data for the row it belongs to.
