---
sourcesHash: 07484a058cb41eada2c47077f544573dce60cd9f766c14773aec9a19e07efa6c
id: avatar
description: >-
  Show an image of a person or team with a initials fallback while it loads or
  if it fails, plus a Hashti group that stacks avatars with an overflow count.
status: discoverable
sources:
  - packages/react/src/avatar/avatar.tsx
  - packages/react/src/avatar/avatar-group.tsx
  - packages/react/src/avatar/index.ts
  - packages/styles/src/avatar.css
examples:
  - apps/docs/content/docs/avatar.mdx
---

# Avatar

## Purpose

Shows an image with a fallback while it loads or if it fails. Hashti wraps
ui-sdk's `Avatar`, `AvatarImage` and `AvatarFallback` unchanged, adds a
`size` option, and ships its own `AvatarGroup` for stacked avatars with an
overflow count. Appearance lives in `packages/styles/src/avatar.css`.

## When to use

- A person or a team in a comment, member list or account menu. ui-sdk docs:
  "It shows initials or an icon until the image loads, and keeps showing them
  if the image fails."
- A stack of members with "+N" for the rest: `AvatarGroup` with `max` and
  optionally `overflowRenderer`.
- Initials from a name: the Hashti `getInitials` helper is grapheme-safe,
  including Persian/Arabic grapheme clusters.

## When not to use

- A static illustration or logo that always loads — use an `img` directly.
- A status indicator next to a person — Hashti ships no presence dot yet.

## Public API

- `size`: `"xs"` | `"sm"` | `"md"` (default) | `"lg"` | `"xl"`. Hashti-added
  on `Avatar` and `AvatarGroup`, emitted as `data-size`. The group's size wins
  over an avatar's own `data-size`: it owns the stack geometry.
- `AvatarGroup` (Hashti-only): `max` caps the visible avatars, the rest become
  a `hashti-avatar-group-count` span labeled "<N> more members";
  `overflowRenderer(count)` replaces the default `+N` text.
- All other props forward to ui-sdk: `AvatarImage` takes real `img`
  attributes (`srcSet`, `crossOrigin`, `referrerPolicy`, `loading="lazy"`),
  `AvatarFallback` takes `delay` (ms before showing, to avoid flashing
  initials on a fast image), and `Avatar` takes
  `onLoadingStatusChange(status, details)`.

## States

ui-sdk sets `data-loading-status` (`idle`, `loading`, `loaded`, `error`) on
every part. `packages/styles/src/avatar.css` keys `data-size` for the five
diameters, gives the fallback its initials typography, and overlaps group
members with a negative inline margin plus a background-colored ring so the
stack reads on any layer.

## Observable promises

Per ui-sdk docs:

- The image is a real `img`, including in server markup, so the browser can
  start fetching it before hydration.
- The fallback stays visible until the image loads; if loading fails, the
  fallback remains. An image that loads replaces the fallback.
- A screen reader can read the person's name in either state.
- When you replace a loaded image, the browser keeps it visible while the next
  source loads; a failed replacement shows the fallback. A cached image
  doesn't flash the fallback when the avatar mounts again.
- `onLoadingStatusChange` reports `loading`, `loaded`, `error` and `idle`,
  with the reason (`image-load`, `image-error`, `src-change`) in the details.

## Accessibility

Consumer obligations: give the image meaningful `alt` text and include the
person's name in the fallback (visually hidden if you only show initials).
When a visible name beside the avatar already identifies the person, use an
empty `alt` and hide decorative fallback content from screen readers.
