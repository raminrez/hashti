---
sourcesHash: 8c5ace2cf77d42e3489ee747e9386c91b338961ff40e1e339bb2d52ea393adcd
id: carousel
description: >-
  Page through slides with native scrolling, keyboard controls, indicators and
  optional rotation, handled by ui-sdk; Hashti adds the gallery chrome.
status: discoverable
sources:
  - packages/react/src/carousel/carousel.tsx
  - packages/react/src/carousel/index.ts
  - packages/styles/src/carousel.css
examples:
  - apps/docs/content/docs/carousel.mdx
---

# Carousel

## Purpose

Shows a set of slides one view at a time and pages through them with buttons,
indicators, swipes or keys. Hashti wraps ui-sdk's eight `Carousel*` parts
unchanged (including `className` as a function of part state), adding
`hashti-carousel*` classes; appearance lives in
`packages/styles/src/carousel.css`.

## When to use

- Product photos, featured stories, or any set of slides shown one view at a
  time. ui-sdk docs: "It scrolls natively, so swipes and trackpads work, and
  Previous and Next buttons page through the slides."
- A gallery with a thumbnail strip: two carousels sharing the selected page,
  the strip with `dragFree`.
- Rotation for passive viewing: `defaultPlaying` with `interval`.

## When not to use

- Content people read in place and scroll normally — a plain scroll region is
  simpler.
- Choosing one item from many — use [Select](select.md) or
  [Command](command.md).

## Public settings

Hashti wraps and re-exports the eight parts only; all props forward to
ui-sdk.

- Paging: `page`/`defaultPage`/`onPageChange` (pages count from 1),
  `onPageChangeComplete` (after the slides come to rest), `loop`,
  `slidesPerPage` (`"auto"` fits as many as show), `skipSnaps`, `dragFree`,
  `drag` (`false` turns off swiping and dragging).
- Layout: `orientation` (`"horizontal"` default | `"vertical"` — give the
  viewport a height), `align` (`"start"` default | `"center"` | `"end"`).
- Rotation: `playing`/`defaultPlaying`, `interval` (ms, 5000 default),
  `CarouselPlayToggle` (Hashti does not wrap it yet) starts and stops it.
- `controller` from `createCarouselController()` pages it from anywhere and
  connects parts placed outside the carousel.
- Composition: slides go inside `CarouselViewport` › `CarouselContent`;
  name the carousel with `aria-label` and give icon-only controls an
  `aria-label`.

## States

ui-sdk sets `data-orientation` throughout, `data-dragging` on the viewport,
`data-active`/`data-in-view` on slides, `data-disabled` on Previous/Next at
their end, `data-selected` on the current indicator, and `data-playing`/
`data-paused` on the root. `packages/styles/src/carousel.css` keys
`data-dragging` for the grab cursor, `data-disabled` arrows, and indicators
that widen and take the focus color when `[data-selected]`; slide sizing
(`flex: 0 0 100%`) is Hashti's, while ui-sdk writes the scrolling styles
inline.

## Observable promises

Per ui-sdk docs:

- Native scrolling and CSS scroll snap do the paging, so swipes and trackpads
  work and snapping works before JavaScript loads.
- With `loop`, slides take turns at the ends of the content with CSS `order`
  while the carousel rests, so the current page always has slides on both
  sides; they keep their place in the document, so screen readers and Tab
  follow the slides' own order.
- Indicators are a tablist: one Tab stop on the current page, arrows to move
  between them, Home and End for the ends; indicators past the page count
  hide themselves.
- Rotation stops when keyboard focus moves in and doesn't restart until the
  user asks, pauses while the mouse is over it, the tab is hidden, the
  carousel is scrolled out of view or a finger is down; it doesn't start on
  its own when the user prefers reduced motion, and the slides are a polite
  live region only while it isn't rotating.
- Slides without `data-in-view` are inert and hidden from screen readers.
- `--carousel-progress` on the root follows every frame of a scroll or spring
  without re-renders; a drag that moved never clicks the link it started on.
- Every page change carries a reason (`swipe`, `scroll`, `timeout`, …) and
  `details.cancel()` stays on the page: a swipe or drag springs back.
