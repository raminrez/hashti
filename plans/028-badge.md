# Plan 028: Badge — status marker with kinds, dot, placement

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat afffa8d..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (behavior copied from the old implementation)
- **Depends on**: plans/027-hover-card (DONE)
- **Category**: migration (component build-out, cycle 28 — Hashti-owned)
- **Planned at**: commit `afffa8d`, 2026-11-20

## Why this matters

Badge is the count/status marker (notification dots, counts on icons,
status pills). ui-sdk ships no equivalent — Hashti-owned per the naming
rule.

## Current state

- `packages/react/src/kbd/kbd.tsx` — the Hashti-owned exemplar (direct
  component, no ui-sdk part).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### Reference implementation (old system: `/Users/raminrezaei/Documents/Projects/Personal/hashti/packages/react/src/components/badge/badge.tsx` + the badge block in `packages/react/src/frame.css` around line 2718)

Read both before writing. Facts:

- `Badge` props: `content?`/`count?` (the marker text; number clamps at
  `maxCount` (default 99) to "99+"; `max` is an alias), `isDot?` (dot
  mode), `kind?` (`danger` default | `success` | `warning` | `info` |
  `primary` | `neutral` | `secondary`), `placement?` (`top-end` default |
  `top-start` | `bottom-end` | `bottom-start`; legacy `top-right` etc.
  normalize to the `*-end`/`*-start` names), `children?` (the thing the
  badge marks).
- No `children` → renders a bare `<span class="hashti-badge" role="status"
data-kind data-placement>`. With `children` → wraps in
  `<span class="hashti-badge-wrapper">` (a relative positioning context)
  with the badge absolutely placed on it.
- `isDot || content == null` → dot mode: `hashti-badge--dot` modifier class
  (8px dot). WAIT — the css-conventions rule is "modifiers only via
  attributes": ship dot mode as `data-dot` attribute instead of the
  `--dot` class. Everything else keeps the old names.
- Copy the rendering logic verbatim, changing only the modifier class to
  `data-dot` and keeping `data-kind`/`data-placement`.

### Design rules that bite (tokenize the old frame.css block)

- `.hashti-badge`: inline-flex, centered, `min-inline-size: 1.125rem;
block-size: 1.125rem; padding: 0 0.3125rem; border-radius:
var(--hashti-border-radius-max); font-size: 0.6875rem; font-weight: 600;
line-height: 1; background: var(--hashti-support-error); color:
var(--hashti-text-on-color); white-space: nowrap; user-select: none;`
- `.hashti-badge-wrapper`: `position: relative; display: inline-flex;`
- Placements (wrapper > badge): `top-end` →
  `position: absolute; inset-block-start: 0; inset-inline-end: 0;
translate: 50% -50%;` (and `top-start`, `bottom-end`, `bottom-start`
  mirrored across the two axes); `pointer-events: none; z-index: 1;`
- Kinds: `success` → `background: var(--hashti-support-success)`;
  `warning` → `var(--hashti-support-warning)`; `info` →
  `var(--hashti-support-info)`; `primary` → `var(--hashti-interactive)`;
  `neutral`/`secondary` → `background: var(--hashti-layer-02); color:
var(--hashti-text-primary); border: 1px solid
var(--hashti-border-subtle-00);` (map the old layer-accent to layer-02;
  check `design/tokens.css` for the exact token names and use what
  exists).
- `[data-dot]`: `min-inline-size: 0.5rem; inline-size: 0.5rem;
block-size: 0.5rem; padding: 0;`
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/badge/badge.tsx` — create
- `packages/react/src/badge/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/badge.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/badge-demo.tsx` — create
- `apps/docs/content/docs/badge.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"badge"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- AILabel (the old file also exported it) — not in scope
- `data-pressed`/`data-focus-visible` badge states (old badge.css extras) —
  deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/028-badge`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Badge component in `@hashti/react`

`packages/react/src/badge/badge.tsx` — the reference logic verbatim with
the two named adjustments (data-dot instead of the modifier class; drop
AILabel). Keep the `hashti-badge`, `hashti-badge-wrapper` class names and
the `data-kind`/`data-placement` attributes exactly.

`packages/react/src/badge/index.ts` exports `Badge`; add the barrel line.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/badge.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/badge.css` →
no matches; `grep -c "data-" packages/styles/src/badge.css` → ≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/badge-demo.tsx`:

```tsx
"use client";

import { Badge } from "@hashti/react";

function Bell() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
      <path
        d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4Zm-1.5 10a1.5 1.5 0 0 0 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BadgeDemo() {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Badge count={3}>
        <Bell />
      </Badge>
      <Badge count={150}>
        <Bell />
      </Badge>
      <Badge isDot>
        <Bell />
      </Badge>
      <Badge kind="success">Active</Badge>
      <Badge kind="warning">Pending</Badge>
      <Badge kind="info">Beta</Badge>
      <Badge kind="neutral">Draft</Badge>
    </div>
  );
}
```

`apps/docs/content/docs/badge.mdx`:

```mdx
---
title: Badge
description: Marks a count or status on content.
---

import { BadgeDemo } from "../../src/components/badge-demo";

## Usage

<BadgeDemo client:load />

## Props

| Prop                | Type                                                                      | Description                                           |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| `count` / `content` | `ReactNode`                                                               | The marker; numbers clamp at `maxCount` (99 → "99+"). |
| `isDot`             | `boolean`                                                                 | An 8px dot instead of content.                        |
| `kind`              | `danger \| success \| warning \| info \| primary \| neutral \| secondary` | The status ink.                                       |
| `placement`         | `top-end \| top-start \| bottom-end \| bottom-start`                      | Where the badge sits on `children`.                   |
| `children`          | `ReactNode`                                                               | The content the badge marks; wraps it.                |
```

`apps/docs/content/docs/meta.json` — insert `"badge"` after `"avatar"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(count badge on the icon at top-end, "99+" clamp, dot mode, kind inks,
bare badges as status pills).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-badge" packages/react/src packages/styles/src`
      shows the component classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/badge.css` returns
      nothing
- [ ] `grep -n "badge" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- The reference implementation files are unreadable — quote the error.
- A `--hashti-layer-02`-equivalent token does not exist for the
  neutral/secondary kind — quote what tokens.css offers instead of
  hard-coding.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Link (Button render-as) is the next Hashti-owned cycle.
- The `data-kind` vocabulary matches Toast's `data-type` — a unified
  status pass may unify the attribute names later.
