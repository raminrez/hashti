# Plan 031: Timeline — events on a line (vertical)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 3a75b4d..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/030-avatar-group (DONE)
- **Category**: migration (component build-out, cycle 31 — S batch)
- **Planned at**: commit `3a75b4d`, 2026-11-20

## Why this matters

Timeline is the event rail (activity feeds, order history). No old-system
implementation exists — this is designed fresh from the ui-sdk composition
and the design vocabulary.

## Current state

- `packages/react/src/avatar/avatar-group.tsx` — the newest exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk Timeline facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/timeline.md`)

- Import: `import { Timeline, TimelineConnector, TimelineDescription, TimelineItem, TimelineMarker, TimelineTime, TimelineTitle } from "@ui-sdk/react/timeline"` (verify exact exports).
- Composition: `Timeline` → `TimelineItem` → (`TimelineMarker` — the dot,
  `TimelineConnector` — the line to the next event, `TimelineTitle`,
  `TimelineTime`, `TimelineDescription`). Every part inside an item is
  optional; marker and connector are aria-hidden decorations.
- Root: `data-orientation`; items: `data-complete`/`data-current`/
  `data-upcoming` (status prop), `data-first`/`data-last`.
- The connector line runs between markers — read the docs' own example
  layout (Usage section) and mirror its structure; don't invent a DOM
  arrangement that fights ui-sdk's.

### Design rules that bite (derived; no old implementation)

- **Root**: `display: flex; flex-direction: column; gap: 1rem;` (vertical
  only this cycle; horizontal styling deferred).
- **Item**: `display: grid; grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr; column-gap: 0.75rem;` — marker column +
  content column; the connector spans the marker column's second row.
  (Adapt to ui-sdk's actual DOM if it differs — the docs' Usage example
  shows the intended arrangement; keep the visual contract below.)
- **Marker (dot)**: `inline-size: 0.625rem; block-size: 0.625rem;
  border-radius: var(--hashti-border-radius-max); background:
  var(--hashti-border-strong-01);` — an 10px dot in the marker column,
  `margin-block-start: 0.3125rem` to align with the title's cap height.
  - `[data-current]` → `background: var(--hashti-focus); box-shadow: 0 0
    0 0.1875rem var(--hashti-background-selected);` (the current dot is
    blue with a light-blue halo).
  - `[data-complete]` → `background: var(--hashti-support-success);`
  - `[data-upcoming]` → default (strong border gray).
- **Connector**: `inline-size: 1px; min-block-size: 1rem; align-self:
  stretch; background: var(--hashti-border-subtle-00);` — runs from the
  dot down to the next item's dot; `[data-last]` items hide their
  connector (`display: none` via the item's data-last on the connector's
  parent — read how ui-sdk exposes it and adapt).
- **Title**: 0.875rem/600, ink `var(--hashti-text-primary)`;
  `[data-upcoming]` item's title → `var(--hashti-text-secondary)`.
- **Time**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `font-variant-numeric: tabular-nums`;
  sits on the title row at the inline end (consumer layout or a simple
  `display: flex; justify-content: space-between;` on the title row —
  keep it simple: time renders after the title inline).
- **Description**: 0.8125rem/400, ink `var(--hashti-text-secondary)`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/timeline/timeline.tsx` — create
- `packages/react/src/timeline/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/timeline.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/timeline-demo.tsx` — create
- `apps/docs/content/docs/timeline.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"timeline"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Horizontal orientation styling — deferred
- Feed/busy styling — deferred
- Icons in markers — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/031-timeline`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Timeline wrappers in `@hashti/react`

`packages/react/src/timeline/timeline.tsx` — the `join` helper pattern
(direct-re-export check on the root):

| Part | Class |
| --- | --- |
| `Timeline` | `hashti-timeline` |
| `TimelineItem` | `hashti-timeline__item` |
| `TimelineMarker` | `hashti-timeline__marker` |
| `TimelineConnector` | `hashti-timeline__connector` |
| `TimelineTitle` | `hashti-timeline__title` |
| `TimelineTime` | `hashti-timeline__time` |
| `TimelineDescription` | `hashti-timeline__description` |

Export all seven from `./timeline` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/timeline.css` — the design-rules section above,
adapted to ui-sdk's actual DOM structure.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/timeline.css`
→ no matches; `grep -c "data-" packages/styles/src/timeline.css` → ≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/timeline-demo.tsx`:

```tsx
"use client"

import { Timeline, TimelineConnector, TimelineDescription, TimelineItem, TimelineMarker, TimelineTime, TimelineTitle } from "@hashti/react"

const events = [
  { title: "Order placed", time: "09:12", desc: "We received your order.", status: "complete" },
  { title: "Payment confirmed", time: "09:13", desc: "Card charged successfully.", status: "complete" },
  { title: "Shipped", time: "14:40", desc: "Your parcel left the warehouse.", status: "current" },
  { title: "Out for delivery", time: "Tomorrow", desc: "Expected before 18:00.", status: "upcoming" },
] as const

export function TimelineDemo() {
  return (
    <Timeline style={{ maxWidth: 420 }}>
      {events.map((e) => (
        <TimelineItem key={e.title} status={e.status}>
          <TimelineMarker />
          <TimelineConnector />
          <TimelineTitle>{e.title}</TimelineTitle>
          <TimelineTime>{e.time}</TimelineTime>
          <TimelineDescription>{e.desc}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
```

(If `status` is not the prop name — the docs' Status section defines it —
use what the docs document and note it.)

`apps/docs/content/docs/timeline.mdx`:

```mdx
---
title: Timeline
description: Lists events along a line.
---

import { TimelineDemo } from '../../src/components/timeline-demo'

## Usage

<TimelineDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Timeline` | The event rail. |
| `TimelineItem` | One event; a `status` of complete/current/upcoming. |
| `TimelineMarker` | The dot. |
| `TimelineConnector` | The line to the next event. |
| `TimelineTitle` / `TimelineTime` / `TimelineDescription` | The event's content. |

Styling lives in `@hashti/styles` under `.hashti-timeline*` — a subtle connector line, gray dots, blue current with a light halo, green complete.
```

`apps/docs/content/docs/meta.json` — insert `"timeline"` after `"tabs"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(dots align with titles, connector runs between dots, current dot blue
with halo, complete green, connector absent on the last item, upcoming ink
muted).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-timeline" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/timeline.css`
  returns nothing
- [ ] `grep -n "timeline" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the seven parts is not exported from `@ui-sdk/react/timeline` —
  quote the error.
- The status prop name contradicts the docs — quote the documented name.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Horizontal orientation and marker icons land later.
- The connector recipe may feed a step-bar/wizard variant later.
