# Plan 011: Select — core single-select with popup surface

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat bec6f35..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (first popup surface: positioning, animation, layering)
- **Depends on**: plans/010-field (DONE)
- **Category**: migration (component build-out, cycle 11)
- **Planned at**: commit `ddf93a8`, 2026-11-20

## Why this matters

Select is the first popup component and the heaviest ui-sdk surface. This
cycle lands the core single-select — trigger, popup list, items, groups —
and establishes the popover recipes (surface, shadow, entrance motion,
highlight) that Dialog, Popover, Tooltip, Toast and Menu reuse.

## Current state

- `packages/react/src/field/field.tsx` — the multi-part wrapper exemplar
  (eight parts, `join` helper handling state-function classNames — reuse
  that helper pattern; ui-sdk part classNames accept render functions).
- `packages/styles/src/field.css` — the newest stylesheet exemplar.
- `apps/docs/src/components/field-demo.tsx` — the compound docs pattern.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "field", "input", "label", "radio", "separator", "switch", "textarea"]`.

### ui-sdk Select facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/select.md`)

- Import: `import { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectItemIndicator, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@ui-sdk/react/select"`.
- Composition: `Select` → (`SelectLabel`, `SelectTrigger` → `SelectValue`,
  `SelectContent` → `SelectItem`(+`SelectItemIndicator`), `SelectGroup` →
  `SelectGroupLabel`, `SelectSeparator`, `SelectEmpty`).
- `items` as data on the root (strings, `{value, label}`, groups,
  separators) keeps labels available before open, including SSR; render
  `SelectItem` parts inside `SelectContent` to style them.
- Trigger states: `data-open`/`data-closed`, `data-placeholder`,
  `data-disabled`, `data-readonly`, `data-required`.
- Content states: `data-open`/`data-closed`, `data-side`, `data-align`,
  `data-starting-style`/`data-ending-style`, `data-modality`,
  `data-presentation` (`popover` | `sheet`).
- Item states: `data-selected`, `data-highlighted` (keyboard focus OR
  pointer — style this, not `:hover`), `data-disabled`, `data-has-icon`.
- The list renders in the top layer (no portal); `[data-theme]` ancestry
  works. `min-width: var(--anchor-width)` matches the trigger's width (a
  ui-sdk-provided CSS variable — verify the name in
  `docs/popovers.md` or the guide if it fails).
- Keyboard/typeahead/multiple/search/async/virtualized are documented but
  **deferred** here.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`, `design/css-conventions.md`)

- **Trigger**: a field-style control — `min-block-size: 2.75rem` (44px),
  1px `var(--hashti-border-strong-01)` border, `var(--hashti-layer-01)`
  surface, `var(--hashti-control-radius)`, `padding: 0 0.75rem`,
  `inline-size: 100%`, text 0.875rem/500, `justify-content: space-between`
  (value left, chevron right). `data-open` keeps the control border (the
  focus ring is the open affordance; no extra border change).
- **Placeholder ink**: `[data-placeholder]` on the value → ink
  `var(--hashti-text-secondary)`.
- **Popover surface** (extraction: popover = 1px `border-subtle` divider,
  radius `--hashti-popover-radius` = 18px): background
  `var(--hashti-layer-01)`, border `1px solid var(--hashti-border-subtle-00)`,
  `border-radius: var(--hashti-popover-radius)`, shadow
  `0 8px 24px var(--hashti-shadow)` (the shadow token is a COLOR — it may
  only appear inside a shadow value), `padding: 0.25rem`,
  `min-inline-size: var(--anchor-width)`.
- **Entrance/exit motion**: style `data-starting-style` (opacity 0,
  `scale(0.98)`) and `data-ending-style` (same), with
  `transition: opacity var(--hashti-duration-fast-01)
cubic-bezier(0.16, 1, 0.3, 1), scale var(--hashti-duration-fast-01)
cubic-bezier(0.16, 1, 0.3, 1)`; `prefers-reduced-motion` removes travel
  and scale (opacity only).
- **Items**: `min-block-size: 2.5rem`, `padding: 0 0.75rem`,
  `border-radius: var(--hashti-border-radius-08)` (0.5rem — items are
  rounded INSIDE the 18px surface), text 0.875rem/400 ink
  `var(--hashti-text-primary)`.
  - `[data-highlighted]` → background `var(--hashti-background-hover)`
    (no `:hover` — ui-sdk emits highlighted for pointer too).
  - `[data-selected]` → ink stays; the indicator (check) shows in
    `var(--hashti-focus)`.
  - `[data-disabled]` → ink `var(--hashti-text-disabled)`, no highlight.
- **Indicator**: reserve the lane — `padding-inline-end` on items is not
  needed; the indicator element is inline-flex sized 1rem; when absent,
  items align via `data-has-icons` on the content (no extra CSS this
  cycle).
- **Separator**: `block-size: 1px`, background
  `var(--hashti-border-subtle-00)`, margin `0.25rem 0.5rem`.
- **Group label**: helper typography (0.8125rem), ink
  `var(--hashti-text-secondary)`, `padding: 0.25rem 0.75rem`.
- **Empty**: helper typography, ink `var(--hashti-text-secondary)`,
  `padding: 0.5rem 0.75rem`, centered.
- **Focus ring**: the trigger takes the field ring (2px/2px offset) on
  `:focus-visible`. Items are highlighted, not focus-ringed.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/select/select.tsx` — create
- `packages/react/src/select/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/select.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/select-demo.tsx` — create
- `apps/docs/content/docs/select.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"select"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Multiple/select-all, search, async search, virtualized lists, item icons,
  clear button, value icon, `data-presentation: sheet` — deferred cycles
- `data-modality` styling — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/011-select`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Select wrappers in `@hashti/react`

`packages/react/src/select/select.tsx` — one class-only wrapper per part,
using the `join` helper pattern from `packages/react/src/field/field.tsx`
(it handles state-function classNames):

Parts and classes:

| Part                  | Class                           |
| --------------------- | ------------------------------- |
| `Select`              | `hashti-select`                 |
| `SelectLabel`         | `hashti-select__label`          |
| `SelectTrigger`       | `hashti-select-trigger`         |
| `SelectValue`         | `hashti-select__value`          |
| `SelectContent`       | `hashti-select-content`         |
| `SelectGroup`         | `hashti-select__group`          |
| `SelectGroupLabel`    | `hashti-select__group-label`    |
| `SelectItem`          | `hashti-select-item`            |
| `SelectItemIndicator` | `hashti-select-item__indicator` |
| `SelectSeparator`     | `hashti-select-separator`       |
| `SelectEmpty`         | `hashti-select-empty`           |

Export all eleven from `./select` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/select.css` — write the rules from the design-rules
section above, keyed on the classes from Step 1. Structure:

1. Trigger (control recipe + `[data-placeholder]` value ink via
   `.hashti-select-trigger .hashti-select__value`).
2. Content (popover surface + motion with starting/ending styles +
   reduced-motion override).
3. Items (+ highlighted/selected/disabled).
4. Indicator, separator, group label, empty.
5. `SelectLabel` (label typography — same values as
   `.hashti-field__label`).

The value element inside the trigger inherits the trigger's ink; the
placeholder rule targets `.hashti-select-trigger[data-placeholder]
.hashti-select__value`.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/select.css` → no matches; `grep -c "data-" packages/styles/src/select.css` → ≥ 8.

### Step 3: Docs demo component and page

`apps/docs/src/components/select-demo.tsx` — compound parts in ONE tree;
the chevron is an inline SVG in the trigger (no icon dependency):

```tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@hashti/react";

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SelectDemo() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Select items={["Viewer", "Editor", "Admin"]} defaultValue="Editor">
        <SelectLabel>Role</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          {["Viewer", "Editor", "Admin"].map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select placeholder="Choose a plan">
        <SelectLabel>Plan</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>Contact sales</SelectGroupLabel>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
```

(If the `items`-on-root + mapped `SelectItem` composition errors, drop the
`items` prop and keep the explicit items — report which composition you
shipped.)

`apps/docs/content/docs/select.mdx`:

```mdx
---
title: Select
description: Chooses one option from a popup list.
---

import { SelectDemo } from "../../src/components/select-demo";

## Usage

<SelectDemo client:load />

## Props

| Prop                     | Type       | Description                                         |
| ------------------------ | ---------- | --------------------------------------------------- |
| `items`                  | `ListData` | Options as data; labels stay available before open. |
| `value` / `defaultValue` | `string`   | The selected value.                                 |
| `placeholder`            | `string`   | Shown while nothing is selected.                    |

Styling lives in `@hashti/styles` under `.hashti-select-*` — a field-style trigger, an 18px popover surface with the design shadow, items highlighted in background-hover and selected in focus blue.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "checkbox", "field", "input", "label", "radio", "select", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(trigger geometry, popup surface radius/shadow/border, open/close motion,
item highlight on pointer and keyboard, selection check, group label,
separator, placeholder ink, SSR labels available before open).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-select" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/select.css` returns nothing
- [ ] `grep -n "select" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the eleven parts is not exported from `@ui-sdk/react/select` —
  quote the error.
- `var(--anchor-width)` does not resolve (the popup doesn't match the
  trigger width) — quote what you found in the docs about the anchor width
  variable instead of hard-coding a width.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The popover recipes (surface, shadow, motion, highlight) are the template
  for Dialog, Popover, Tooltip, Toast and Menu — keep select.css honest.
- Multiple/select-all, search, async, virtualized and icons come back as
  their own cycles; the item lane (`data-has-icons`) is reserved.
- `data-presentation: sheet` (small-viewport presentation) is deferred with
  the Drawer cycle.
