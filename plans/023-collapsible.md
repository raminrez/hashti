# Plan 023: Collapsible — disclosure trigger + animated panel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 04b556b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (panel recipe copied from Accordion's proven one)
- **Depends on**: plans/022-toggle (DONE)
- **Category**: migration (component build-out, cycle 23 — S batch)
- **Planned at**: commit `04b556b`, 2026-11-20

## Why this matters

Collapsible is the free-standing disclosure (Accordion's row without the
list). It reuses the accordion's height-animation recipe verbatim.

## Current state

- `packages/styles/src/accordion.css` — the panel animation exemplar
  (block-size from `--accordion-panel-height`; read it and copy the
  mechanism, renaming the variable to `--collapsible-panel-height`).
- `packages/react/src/toggle/toggle.tsx` — the newest wrapper exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "dialog", "field", "input", "kbd", "label", "listbox", "menu", "popover", "radio", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### ui-sdk Collapsible facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/collapsible.md`)

- Import: `import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"`.
- Composition: `Collapsible` → (`CollapsibleTrigger`, `CollapsiblePanel`).
  Root and panel render divs; trigger renders a native button. Put
  surrounding content (heading, always-visible summary) around them.
- States on all three: `data-open`/`data-closed`/`data-disabled`; panel
  adds `data-starting-style`/`data-ending-style`.
- Animation: animate the measured `--collapsible-panel-height` between 0
  and the content height (exact CSS in the docs' Animation section). The
  panel stays mounted until its closing animation finishes; a panel open
  on first paint doesn't animate.

### Design rules that bite (from `design/DESIGN.md`, accordion.css)

- **Trigger**: the accordion trigger recipe without the row context —
  `display: flex; align-items: center; gap: 0.5rem; min-block-size: 2.75rem;
  padding: 0.25rem 0; border: none; background: transparent; font-size:
  0.875rem; font-weight: 600; color: var(--hashti-text-primary); cursor:
  pointer; text-align: start;` + CSS-drawn caret on `::after` (0.375rem
  square, border chevron in `currentColor`, rotates 90° on
  `[data-open]`, transition on rotate `var(--hashti-duration-fast-01)
  cubic-bezier(0.16, 1, 0.3, 1)`).
- **Panel**: `block-size: var(--collapsible-panel-height); overflow:
  hidden; transition: block-size var(--hashti-duration-moderate-01)
  cubic-bezier(0.16, 1, 0.3, 1);` and
  `:is([data-starting-style], [data-ending-style]) { block-size: 0; }`
  (use the ui-sdk docs' exact mechanism; physical `height` is fine if
  `block-size` fights the variable — note which you shipped).
- **Focus ring**: trigger is an action control — 2px `var(--hashti-focus)`,
  3px offset, `:focus-visible` only.
- **No borders between items** — a standalone collapsible has no list
  context; nothing to divide.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/collapsible/collapsible.tsx` — create
- `packages/react/src/collapsible/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/collapsible.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/collapsible-demo.tsx` — create
- `apps/docs/content/docs/collapsible.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"collapsible"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Keep-mounted panels — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/023-collapsible`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Collapsible wrappers in `@hashti/react`

`packages/react/src/collapsible/collapsible.tsx` — the `join` helper
pattern (direct-re-export check on the root):

| Part | Class |
| --- | --- |
| `Collapsible` | `hashti-collapsible` |
| `CollapsibleTrigger` | `hashti-collapsible__trigger` |
| `CollapsiblePanel` | `hashti-collapsible__panel` |

Export all three from `./collapsible` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/collapsible.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/collapsible.css`
→ no matches; `grep -c "data-" packages/styles/src/collapsible.css` → ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/collapsible-demo.tsx`:

```tsx
"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@hashti/react"

export function CollapsibleDemo() {
  return (
    <Collapsible style={{ maxWidth: 480 }}>
      <CollapsibleTrigger>What is the refund policy?</CollapsibleTrigger>
      <CollapsiblePanel>
        Full refunds within 30 days of delivery, no questions asked.
      </CollapsiblePanel>
    </Collapsible>
  )
}
```

`apps/docs/content/docs/collapsible.mdx`:

```mdx
---
title: Collapsible
description: Reveals content behind a trigger.
---

import { CollapsibleDemo } from '../../src/components/collapsible-demo'

## Usage

<CollapsibleDemo client:load />

## Parts

| Part | Purpose |
| --- | --- |
| `Collapsible` | Owns the open state. |
| `CollapsibleTrigger` | The disclosure button with the caret. |
| `CollapsiblePanel` | The animated content. |

Styling lives in `@hashti/styles` under `.hashti-collapsible*` — a quiet trigger with a rotating caret and a height-animated panel.
```

`apps/docs/content/docs/meta.json` — insert `"collapsible"` after
`"checkbox"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(trigger toggles open/closed, caret rotates, panel height-animates without
clipping, settled content fully visible, Enter/Space, focus ring).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-collapsible" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/collapsible.css`
  returns nothing
- [ ] `grep -n "collapsible" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three parts is not exported from `@ui-sdk/react/collapsible`
  — quote the error.
- The height animation does not work with the documented variable — report
  what you measured instead of inventing a new mechanism.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The panel recipe is now proven twice (Accordion, Collapsible); Drawer's
  slide and future Disclosure reuse it.
