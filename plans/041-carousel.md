# Plan 041: Carousel — sliding pages, arrows, indicators

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat e91c0a0..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (scroll-snap + drag states are new mechanics to style)
- **Depends on**: plans/040-toolbar (DONE)
- **Category**: migration (component build-out, cycle 41 — M batch)
- **Planned at**: commit `e91c0a0`, 2026-11-20

## Why this matters

Carousel is the sliding gallery — scroll-snap slides, arrows, page
indicators. Autoplay/thumbnails/progress deferred.

## Current state

- `packages/styles/src/toolbar.css` — the newest exemplar.
- `packages/styles/src/scroll-area.css` — read for the viewport/overflow
  vocabulary (the carousel viewport is a scroller too).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "date-input", "dialog", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip"]`.

### ui-sdk Carousel facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/carousel.md`)

- Import: `import { Carousel, CarouselContent, CarouselIndicator, CarouselItem, CarouselNext, CarouselPrevious, CarouselViewport } from "@ui-sdk/react/carousel"` (verify).
- Composition: `Carousel` (aria-label) → (`CarouselViewport` →
  `CarouselContent` → `CarouselItem`+; `CarouselPrevious`,
  `CarouselNext`; `CarouselIndicator`+ — verify where indicators mount,
  likely inside the root or the viewport; read the Usage section).
- Item states: `data-active` (current page), `data-in-view` (half visible;
  the rest are inert + hidden from screen readers).
- Previous/Next: `data-disabled` at the ends (focusable, does nothing).
- Viewport: `data-dragging` while dragging.
- Root: `data-orientation`, `data-playing`/`data-paused` (autoplay —
  deferred).

### Design rules that bite (derived; scroll-snap gallery)

- **Root `hashti-carousel`**: `display: flex; flex-direction: column;
gap: 0.75rem;` (viewport, then controls row).
- **Viewport**: `overflow: hidden; border-radius:
var(--hashti-popover-radius);` (an 18px clipping gallery; scroll-snap
  comes from ui-sdk's inline mechanics — do not fight them; add `scroll
behavior` nothing). `[data-dragging]` → `cursor: grabbing;`
- **Content**: `display: flex;` — ui-sdk drives the translation/snap; do
  not set gap here unless the docs say so (slides' spacing is part of the
  snap math). If the rendered layout needs a gap, use the docs' pattern.
- **Item**: `flex: 0 0 100%; min-inline-size: 0;` (one slide per page —
  the docs' default). `[data-in-view]` slides are visible; content
  styling (images, cards) is the consumer's.
- **Previous/Next**: the quiet-action square — `display: inline-flex;
align-items: center; justify-content: center; inline-size: 2.5rem;
block-size: 2.5rem; border: 1px solid var(--hashti-border-subtle-00);
border-radius: var(--hashti-border-radius-max); background:
var(--hashti-layer-01); color: var(--hashti-text-primary); cursor:
pointer;` hover (hover:hover, not disabled) → `background:
var(--hashti-background-hover);` `:focus-visible` → 2px ring @2px;
  `[data-disabled]` → ink disabled, cursor not-allowed, background
  transparent.
- **Indicator**: `inline-size: 0.375rem; block-size: 0.375rem;
border-radius: var(--hashti-border-radius-max); border: none;
background: var(--hashti-border-strong-01); cursor: pointer; padding:
0;` — the dot row wraps them (`display: flex; gap: 0.375rem;
justify-content: center;` on the indicators' parent — check how
  ui-sdk nests them; if the indicators mount inside a wrapper the consumer
  renders, style BOTH the wrapper class `hashti-carousel-indicators` and
  the dots).
  - `[data-active]`/current indicator → `background: var(--hashti-focus);`
    and `inline-size: 1rem;` (a pill; check the docs' indicator state
    attribute name and use it).
  - `:focus-visible` → 2px ring @2px.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/carousel/carousel.tsx` — create
- `packages/react/src/carousel/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/carousel.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/carousel-demo.tsx` — create
- `apps/docs/content/docs/carousel.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"carousel"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Autoplay, thumbnails, progress bar, vertical orientation — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/041-carousel`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Carousel wrappers in `@hashti/react`

`packages/react/src/carousel/carousel.tsx` — the `join` helper pattern
(direct-re-export check on roots; check which parts render themselves —
the date-input lesson):

| Part                | Class                                                                |
| ------------------- | -------------------------------------------------------------------- |
| `Carousel`          | `hashti-carousel`                                                    |
| `CarouselViewport`  | `hashti-carousel-viewport`                                           |
| `CarouselContent`   | `hashti-carousel-content`                                            |
| `CarouselItem`      | `hashti-carousel-item` (or data-slot keyed if the class cannot land) |
| `CarouselPrevious`  | `hashti-carousel-arrow` (shared with Next)                           |
| `CarouselNext`      | `hashti-carousel-arrow`                                              |
| `CarouselIndicator` | `hashti-carousel-indicator`                                          |

Export all from `./carousel` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/carousel.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/carousel.css`
→ no matches; `grep -c "data-" packages/styles/src/carousel.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/carousel-demo.tsx` — three slides with plain
content, arrows with chevron glyphs, indicators per the docs:

```tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@hashti/react";

const slides = ["First slide", "Second slide", "Third slide"];

export function CarouselDemo() {
  return (
    <Carousel aria-label="Highlights" style={{ maxWidth: 480 }}>
      <CarouselViewport>
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={s}>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  blockSize: 160,
                  background: "var(--hashti-layer-03)",
                  borderRadius: "var(--hashti-popover-radius)",
                  fontSize: "0.875rem",
                }}
              >
                {s} {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CarouselPrevious aria-label="Previous slide">
          <ChevLeft />
        </CarouselPrevious>
        {slides.map((s, i) => (
          <CarouselIndicator key={s} aria-label={`Go to slide ${i + 1}`} />
        ))}
        <CarouselNext aria-label="Next slide">
          <ChevRight />
        </CarouselNext>
      </div>
    </Carousel>
  );
}

function ChevLeft() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="m10 3-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevRight() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="m6 3 5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

(Adapt the indicators' mount point and props to what the docs document;
note deviations.)

`apps/docs/content/docs/carousel.mdx`:

```mdx
---
title: Carousel
description: Pages through slides.
---

import { CarouselDemo } from "../../src/components/carousel-demo";

## Usage

<CarouselDemo client:load />

## Parts

| Part                                | Purpose                                  |
| ----------------------------------- | ---------------------------------------- |
| `Carousel`                          | Owns the page.                           |
| `CarouselViewport`                  | The clipping window; snaps slides.       |
| `CarouselContent`                   | The slide row.                           |
| `CarouselItem`                      | One slide; `data-active`/`data-in-view`. |
| `CarouselPrevious` / `CarouselNext` | The arrows; disabled at the ends.        |
| `CarouselIndicator`                 | One dot per page.                        |

Styling lives in `@hashti/styles` under `.hashti-carousel*` — an 18px viewport, round arrows, dot indicators that grow into pills on the active page.
```

`apps/docs/content/docs/meta.json` — insert `"carousel"` after `"button"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(arrows page, arrows disable at ends, active dot pill, viewport clips at
18px, keyboard arrows page, drag state).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-carousel" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/carousel.css`
      returns nothing
- [ ] `grep -n "carousel" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/carousel` — quote the
  error.
- The snap/translation mechanics need CSS the docs do not mention —
  report what you found instead of inventing.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Autoplay progress composes Progress; thumbnails compose the grid
  recipe.
- Vertical carousel lands with the vertical pass.
