# Plan 029: Link — styled anchor (and Button render-as styling)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat d65d16e..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/028-badge (DONE)
- **Category**: migration (component build-out, cycle 29 — Hashti-owned)
- **Planned at**: commit `d65d16e`, 2026-11-20

## Why this matters

Link is the inline navigation style. Ship the CSS contract first — the
React component is a thin styled `<a>` — and make sure `Button
render={<a href/>}` picks the styles up too (the deferred list's
"revisit as Button render-as" note).

## Current state

- `packages/react/src/badge/badge.tsx` — the Hashti-owned exemplar.
- `packages/styles/src/button.css` — check how `hashti-button` selectors
  are written so a `<a class="hashti-button">` (Button render-as) needs no
  extra rules (element-agnostic selectors: `.`-based only, no
  `button.hashti-button` element prefixes; verify and note).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### Reference implementation (old system: `frame.css` `.hashti-link` block ~line 129)

Facts (small — style-only):

- `.hashti-link { overflow-wrap: anywhere; text-underline-offset: 0.15em; }`
- `:is([data-hovered], [data-pressed])` → underline, thickness `0.125em`.
- `[data-focus-visible]` → 2px focus ring, offset `+1px` beyond the
  standard offset.
- Link colors from `design/tokens.css`: `--hashti-link-primary`
  (#365ccb), hover `--hashti-link-primary-hover`, visited
  `--hashti-link-visited`, plus the inverse set. Default ink:
  `var(--hashti-link-primary)`.
- ui-sdk data attributes (`data-hovered`, `data-pressed`,
  `data-focus-visible`) are React-runtime-emitted. For a framework-agnostic
  contract, the CSS must ALSO respond to plain `:hover`, `:active` and
  `:focus-visible` so a Vue/Svelte `<a class="hashti-link">` looks right
  without any runtime. Ship BOTH: the data-attribute selectors (ui-sdk
  runtime parity) AND pseudo-class fallbacks (`:is(:hover, :active)` /
  `:focus-visible`). Same specificity pattern is fine.

### Design rules that bite

- `.hashti-link`: `color: var(--hashti-link-primary); text-decoration:
  underline; text-decoration-thickness: 0.0625em; text-underline-offset:
  0.15em; overflow-wrap: anywhere; text-decoration-color: color-mix(in
  srgb, currentColor 40%, transparent)` — hmm, color-mix on a token is
  fine (no hex), but simplest: skip the decoration-color line if it
  complicates; underline at reduced thickness with full ink is acceptable.
  Keep: underline 0.0625em thick, offset 0.15em.
- Hover/active (both selector families): thickness `0.125em` (thicker
  underline, no color change).
- `:focus-visible` / `[data-focus-visible]`: 2px `var(--hashti-focus)`
  outline, offset 3px (the action-control ring).
- Visited: `color: var(--hashti-link-visited)` on `:visited` (must be a
  plain `:visited` rule — browsers restrict visited styling to color
  properties only; that is all we need).
- `a.hashti-link` inherits font from context (inline flow) — set nothing
  else.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/link/link.tsx` — create
- `packages/react/src/link/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/link.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/link-demo.tsx` — create
- `apps/docs/content/docs/link.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"link"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/styles/src/button.css` — do NOT modify it; if its selectors
  already work for `<a>`, note that; if they don't, report what blocks
  render-as (STOP-adjacent finding, not a fix).
- Inverse-link context styling — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/029-link`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Link component in `@hashti/react`

`packages/react/src/link/link.tsx` — a thin styled `<a>` (Hashti-owned,
no ui-sdk part):

```tsx
"use client"

import type { ComponentPropsWithRef, Ref } from "react"

export interface LinkProps extends ComponentPropsWithRef<"a"> {
  ref?: Ref<HTMLAnchorElement>
}

function Link({ className, ref, ...props }: LinkProps) {
  const base = "hashti-link"
  return <a {...props} ref={ref} className={className ? `${base} ${className}` : base} />
}

export { Link }
```

`packages/react/src/link/index.ts` exports `Link`; add the barrel line.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/link.css` — the design-rules section above (both
selector families: data-attributes AND pseudo-classes).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/link.css` →
no matches; `grep -c "focus-visible" packages/styles/src/link.css` → ≥ 2.

### Step 3: Docs demo component and page

`apps/docs/src/components/link-demo.tsx`:

```tsx
"use client"

import { Link } from "@hashti/react"

export function LinkDemo() {
  return (
    <p style={{ maxWidth: 480, fontSize: "0.875rem", lineHeight: 1.5 }}>
      Read the <Link href="#docs">documentation</Link> or visit the{" "}
      <Link href="#repo">repository</Link>. Already read it? The link turns{" "}
      <Link href="#visited">visited</Link> after you follow it.
    </p>
  )
}
```

`apps/docs/content/docs/link.mdx`:

```mdx
---
title: Link
description: Styles inline navigation.
---

import { LinkDemo } from '../../src/components/link-demo'

## Usage

<LinkDemo client:load />

## Notes

The class contract is framework-agnostic: `<a class="hashti-link">` styles correctly in any framework — hover/active/focus work through plain pseudo-classes, and ui-sdk's data attributes are styled in parallel.
```

`apps/docs/content/docs/meta.json` — insert `"link"` after `"label"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(link ink, underline, thicker hover underline, focus ring via real
keyboard, visited color after following).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-link" packages/react/src packages/styles/src` shows
  the component class and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/link.css` returns
  nothing
- [ ] `grep -n "link" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file (including
  button.css).

## Maintenance notes

- Button render-as-a check is this cycle's review note; AvatarGroup and
  InputGroup remain after this.
