---
sourcesHash: fd98b84b7d569ccd1cb6162674516f0e693da179017c618b030e6de488f700cb
id: file-input
description: >-
  Choose, drop, or paste files, validate them against rules, and submit them
  with a form, with rejections and live announcements handled by ui-sdk.
status: discoverable
sources:
  - packages/react/src/file-input/file-input.tsx
  - packages/react/src/file-input/index.ts
  - packages/styles/src/file-input.css
examples:
  - apps/docs/content/docs/file-input.mdx
---

# File Input

## Purpose

Holds the files someone chooses, drops or pastes, checks them against rules,
and submits them with a form. Hashti wraps ui-sdk's `FileInput`,
`FileInputTrigger`, `FileInputDropzone`, `FileInputList`, `FileInputItem` and
`FileInputItemRemove` unchanged, adding `hashti-file-input*` classes;
appearance lives in `packages/styles/src/file-input.css`.

## When to use

- Uploading attachments with a picker, a drop zone, or both. ui-sdk docs: "A
  file input holds the files someone chooses, drops, or pastes, checks them
  against your rules, and submits them with a form. Uploading them to a server
  is up to your app."
- Page-wide or targeted pastes: `pasteTarget` on the dropzone.
- A whole folder: `directory` (turns on `multiple`).

## When not to use

- One already-uploaded file with a replace action — a button plus text is
  simpler.
- Picking a file path to store, not upload — the value is `File` objects.

## Public settings

Hashti wraps and re-exports the six parts only; all props forward to ui-sdk.

- Rules: `accept` (MIME types, wildcards, extensions), `maxFiles`, `maxSize`,
  `minSize`, `validate(file, { accepted })` (return a reason string to reject,
  `null` to accept; `accepted` holds the same batch's earlier files, for
  duplicate checks).
- Value: `value`/`defaultValue`/`onValueChange` (details carry `reason`,
  `added`, `removed`, `rejected`; `details.cancel()` keeps the current value),
  `onReject` (runs after `onValueChange`, with every reason each failed file
  hit), `multiple`, `directory`, `capture` (`"user"` | `"environment"`),
  `name`, `form`, `required`, `disabled`, `announcement`, `controller` from
  `createFileInputController()`.
- Parts: `FileInputDropzone` takes `target` (`"document"` for page-wide
  drops) and `pasteTarget`; `FileInputTrigger` takes `controller` to connect
  from outside the file input; `FileInputList` renders its children once per
  file, and an item's state has the `file`.
- Composition: keep a trigger beside or inside the dropzone for keyboard
  users; wrap in a [Field](field.md) to connect label, description and
  validation.

## States

ui-sdk sets `data-disabled`/`data-required` throughout, `data-dragging`,
`data-drag-accept` and `data-drag-reject` on the dropzone.
`packages/styles/src/file-input.css` keys the dashed dropzone with its
drag-accept (success) and drag-reject (error) borders, the trigger as a
button-like control with disabled and focus states, and the list as a grid of
bordered items with an icon-sized remove button.

## Observable promises

Per ui-sdk docs:

- A rejected file never joins the value; `onReject` receives each one with
  its `reasons`, such as `file-type` or `too-many-files`. While files are
  dragged over a drop zone, `data-drag-reject` shows when their types won't be
  accepted.
- When too many files arrive, the component accepts the first ones that pass
  the other checks until the list is full and rejects the rest. Without
  `multiple`, a new file replaces the current one.
- `validate` runs after the built-in type and size checks, and its reason
  reaches `onReject` like theirs; validate uploads on your server too.
- The list has one Tab stop; arrow keys, Home and End move between files, and
  Delete or Backspace removes the focused one. Remove buttons are named for
  their file and stay outside the Tab order.
- `target="document"` takes files dropped anywhere on the page, and while a
  drop zone is mounted, dropping a file outside every zone doesn't navigate
  away from the page; a drop on another zone stays with that zone.
- `pasteTarget` takes file pastes from the target too; text pastes keep their
  normal behavior.
- `directory` reads dropped folders recursively, up to 1,000 files, skipping
  system files such as `.DS_Store`; `relativePath(file)` returns the path
  inside the folder.
- Accepted, removed and rejected files are announced through a polite live
  region; `announcement` changes the message, or returns `null` to skip it.
- With `name`, the files submit through a native file input, which can submit
  before hydration; a form reset returns to `defaultValue`, rejected files
  never submit, and `disabled` leaves the value out of the submission as well
  as stopping picks, drops and pastes.
