# Plan 017: Accordion — disclosure rows with animated panels

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 7e6e038..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/016-tabs (DONE)
- **Category**: migration (component build-out, cycle 17)
- **Planned at**: commit `7e6e038`, 2026-11-20

## Why this matters

Accordion is the disclosure family's core. Its open/close panel animation
(`data-starting-style`/`data-ending-style` with the CSS `interpolate-size`
or grid-rows trick) is the recipe Collapsible and Disclosure reuse.

## Current state

- `packages/react/src/tabs/tabs.tsx` — the wrapper exemplar.
- `packages/styles/src/tabs.css` — the newest stylesheet exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion" absent — see Step 3]` — current list:
  `["index", "avatar", "button", "checkbox", "dialog", "field", "input", "label", "popover", "radio", "select", "separator", "switch", "tabs", "textarea", "toast", "tooltip"]`.

### ui-sdk Accordion facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/accordion.md`)

- Import: `import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"`.
- Composition: `Accordion` → `AccordionItem` (unique `value`) →
  (`AccordionHeader` → `AccordionTrigger`, `AccordionPanel`).
- `AccordionHeader` renders an `h3` by default. Tab moves between triggers;
  Enter/Space toggle. Arrow keys do nothing (APG removed them).
- The accordion's value is always an array of open values.
- States on every part: `data-open`/`data-closed`/`data-disabled`; panel
  adds `data-starting-style`/`data-ending-style`.
- `multiple` prop allows several open items; `collapsible` on single allows
  closing the open item (check the API section for exact names — read
  `## Multiple` and `## Collapsible` before writing the demo).

### Design rules that bite (from `design/DESIGN.md`, `design/css-conventions.md`)

- **Item**: separated rows — `border-block-end: 1px solid
var(--hashti-border-subtle-00)` between items (a divider list, not
  bordered boxes).
- **Trigger**: a full-width quiet action — `display: flex;
align-items: center; justify-content: space-between; gap: 0.5rem;
min-block-size: 2.75rem; padding: 0.25rem 0; border: none;
background: transparent; font-size: 0.875rem; font-weight: 600;
color: var(--hashti-text-primary); cursor: pointer; text-align: start;`
  hover background NONE (rows are full-bleed; hover would paint the whole
  row — keep the ink change only: `[data-open]` ink stays primary, closed
  hover ink darkens is unnecessary — no hover rule).
- **Chevron**: a CSS-drawn caret on the trigger's `::after` — a 0.375rem
  square with a rotated border chevron, rotating 90° when open
  (`[data-open] ::after { rotate: 90deg; }`), transition on rotate
  `var(--hashti-duration-fast-01) cubic-bezier(0.16, 1, 0.3, 1)`. Draw it
  with borders (no hex: `border-inline-end`/`border-block-end` in
  `currentColor`).
- **Panel**: `padding-block: 0 0.75rem;` ink body (0.875rem, text-primary
  at 400); animate open/close with the grid-rows trick:
  `display: grid; grid-template-rows: 0fr; transition: grid-template-rows
var(--hashti-duration-moderate-01) cubic-bezier(0.16, 1, 0.3, 1);` and
  `[data-open] { grid-template-rows: 1fr; }` with an inner
  `overflow: hidden` wrapper — BUT ui-sdk unmounts/hides the panel itself;
  check whether the panel stays mounted with `data-closed` (the docs' Keep
  Mounted section) — if the panel is display:none when closed, the
  grid-rows trick needs `keepMounted`; if animating is not possible without
  it, ship the panel with a simple opacity fade on
  `data-starting-style`/`data-ending-style` instead and note the choice.
- **Focus ring**: triggers are action controls — 2px
  `var(--hashti-focus)`, 3px offset, `:focus-visible` only.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/accordion/accordion.tsx` — create
- `packages/react/src/accordion/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/accordion.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/accordion-demo.tsx` — create
- `apps/docs/content/docs/accordion.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"accordion"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Collapsible / Disclosure — their own cycles (they reuse the panel recipe)
- Keep-mounted panels — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/017-accordion`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Accordion wrappers in `@hashti/react`

`packages/react/src/accordion/accordion.tsx` — the `join` helper pattern;
parts and classes (direct-re-export check on the Accordion root):

| Part               | Class                                    |
| ------------------ | ---------------------------------------- |
| `Accordion`        | `hashti-accordion` (or direct re-export) |
| `AccordionItem`    | `hashti-accordion__item`                 |
| `AccordionHeader`  | `hashti-accordion__header`               |
| `AccordionTrigger` | `hashti-accordion__trigger`              |
| `AccordionPanel`   | `hashti-accordion__panel`                |

Export all five from `./accordion` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/accordion.css` — write the rules from the design-rules
section above: item dividers, trigger (full-width quiet action + CSS caret
that rotates on open), panel (animation per your Keep Mounted findings),
trigger focus ring (3px offset).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/accordion.css` → no matches; `grep -c "data-" packages/styles/src/accordion.css` → ≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/accordion-demo.tsx` — read `## Multiple` and
`## Collapsible` first; ship a single-open collapsible accordion (the
common default) with three items:

```tsx
"use client";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@hashti/react";

export function AccordionDemo() {
  return (
    <Accordion collapsible>
      <AccordionItem value="shipping">
        <AccordionHeader>
          <AccordionTrigger>Shipping</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Orders arrive in five to seven days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionHeader>
          <AccordionTrigger>Returns</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Free returns within 30 days of delivery.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionHeader>
          <AccordionTrigger>Warranty</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Two years, covering parts and labor.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
```

(If `collapsible` is not the prop name, use what `## Collapsible` documents
and note it.)

`apps/docs/content/docs/accordion.mdx`:

```mdx
---
title: Accordion
description: Opens and closes stacked disclosure rows.
---

import { AccordionDemo } from "../../src/components/accordion-demo";

## Usage

<AccordionDemo client:load />

## Parts

| Part               | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `Accordion`        | Owns the open values.                     |
| `AccordionItem`    | One disclosure row; a unique `value`.     |
| `AccordionHeader`  | The heading wrapper (`h3` by default).    |
| `AccordionTrigger` | The full-width row button with the caret. |
| `AccordionPanel`   | The content the trigger reveals.          |

Styling lives in `@hashti/styles` under `.hashti-accordion*` — divider rows, a rotating caret, and animated panels.
```

`apps/docs/content/docs/meta.json` — insert `"accordion"` after `"avatar"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(divider rows, caret rotation, panel open/close animation, single-open
collapsible behavior, Enter/Space and Tab between triggers, focus ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-accordion" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/accordion.css` returns nothing
- [ ] `grep -n "accordion" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the five parts is not exported from `@ui-sdk/react/accordion` —
  quote the error.
- The panel cannot animate without `keepMounted` and the docs contradict
  the fallback fade — report what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The panel animation recipe is the template for Collapsible and
  Disclosure.
- Multiple-open accordions are a prop away; the demo ships single-open.
