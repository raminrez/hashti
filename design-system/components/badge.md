---
sourcesHash: 4a82d7e692da4a6829f2694b0d7b5831c0c1c5a00c1baf865ded09e538a1c0cb
id: badge
description: >-
  Mark an element with a small count, dot or status pill, positioned over its
  corner, in seven kinds. Hashti-only: ui-sdk does not ship a badge.
status: discoverable
sources:
  - packages/react/src/badge/badge.tsx
  - packages/react/src/badge/index.ts
  - packages/styles/src/badge.css
examples:
  - apps/docs/content/docs/badge.mdx
---

# Badge

## Purpose

Marks an element — or stands alone — with a small count, a dot, or a status
pill. Hashti's own component (ui-sdk ships no badge): a `span` with
`hashti-badge` classes, `role="status"`, and `data-kind`/`data-placement`/
`data-dot` for `packages/styles/src/badge.css`.

## When to use

- An unread or pending count on an icon, tab or avatar: `count` with `max`.
- A state label on its own: `kind="success"` etc. with children as the text.
- A bare attention dot: `isDot`, or no `content`/`children` at all.

## When not to use

- Text that wraps or carries actions — use a [Toast](toast.md) or a
  [Dialog](dialog.md).
- A neutral label in a flow of text — the pill shape and kinds read as
  status; a plain styled span is often right.

## Public API

- `kind`: `"danger"` (default) | `"success"` | `"warning"` | `"info"` |
  `"primary"` | `"neutral"` | `"secondary"`, emitted as `data-kind`.
- `placement`: `"top-end"` (default) | `"top-start"` | `"bottom-end"` |
  `"bottom-start"`; the legacy `"top-right"`/`"top-left"`/
  `"bottom-right"`/`"bottom-left"` values normalize to their logical
  equivalents, emitted as `data-placement`.
- `content` or `count`: the pill's content (`count` is an alias). A number
  above `max` (default 99, `maxCount` legacy alias) renders as `"99+"`.
- `isDot`: force the dot; implied when there is no content and no children.
- Composition: with children and content, the children render inside a
  `hashti-badge-wrapper` span and the badge positions itself over their
  corner. Without content, the children are the pill's own label.

## States

Hashti emits `data-kind`, `data-placement` and `data-dot` (dot mode).
`packages/styles/src/badge.css` keys:

- `[data-kind]` — support/interactive tokens per kind; `neutral`/`secondary`
  get a bordered layer look.
- `[data-placement]` — absolute positioning with percentage translate, flipped
  on the inline axis under `[dir="rtl"]`.
- `[data-dot]` — a fixed 0.5rem dot with no padding.

## Observable promises

Hashti-owned behavior (no ui-sdk docs for this component):

- The badge renders `role="status"`, so count changes are announced politely.
- A count above the max collapses to `<max>+`; the underlying value stays in
  the prop, not the DOM.
- Dot mode renders no text content at all.
- A positioned badge is `pointer-events: none`, so clicks reach the element it
  marks.
