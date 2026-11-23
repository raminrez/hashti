---
sourcesHash: ae9a21eef2eea6b5ceb507b688fd5713979e766a5cb9479b0380a4896427e119
id: kbd
description: >-
  Show a keyboard key or shortcut as a keycap, formatting known key names as
  platform symbols. Hashti-only: ui-sdk does not ship a kbd.
status: discoverable
sources:
  - packages/react/src/kbd/kbd.tsx
  - packages/react/src/kbd/index.ts
  - packages/styles/src/kbd.css
examples:
  - apps/docs/content/docs/kbd.mdx
---

# Kbd

## Purpose

Shows a keyboard key or shortcut as a keycap. Hashti's own component (ui-sdk
ships no kbd): a native `kbd` element with `hashti-kbd` classes; appearance
lives in `packages/styles/src/kbd.css`.

## When to use

- Documenting a shortcut next to a menu item or in help text:
  `keys={["mod", "P"]}`.
- A single key hint, like "Press Esc to close": `keys="esc"`.
- A custom keycap label: children instead of `keys`.

## When not to use

- An actual interactive shortcut hint inside a [Command](command.md) item —
  ui-sdk's `CommandShortcut` formats the item's own `shortcut` and sets
  `aria-keyshortcuts`; use that when Hashti wraps it.
- A button that triggers the action — this is display only.

## Public API

- `keys`: a string or string array of key names. Known names map to symbols:
  on Mac `mod`/`cmd`/`meta` → ⌘, `shift` → ⇧, `ctrl` → ⌃, `option`/`alt` →
  ⌥, `enter` → ↵, `backspace` → ⌫, `tab` → ⇥, arrows → ↑↓←→, and so on; on
  Windows/others they render as words ("Ctrl", "Alt", "Enter"). Unknown names
  pass through; single characters uppercase.
- `children`: rendered instead of `keys`, as the keycap's content.
- All other props forward to the native `kbd` element.

## States

Hashti emits no data attributes; the platform choice is resolved once at
render from `navigator.userAgentData?.platform`, `navigator.platform`, or the
user agent, detecting Mac/iOS. Server render assumes Mac.

`packages/styles/src/kbd.css` draws the keycap: a bordered box with a thicker
bottom edge, `min-block-size: 1lh`, plus sibling spacing so a run of
`hashti-kbd`s reads as a chord. Each key from `keys` gets a
`hashti-kbd-key` span.

## Observable promises

Hashti-owned behavior (no ui-sdk docs for this component):

- The key list renders as separate spans, so each keycap segment keeps its
  spacing and the whole stays one `kbd` element for assistive technology.
- The platform mapping resolves once per component instance, not per render.
- The component is purely presentational: it never binds or listens for the
  keys it shows.
