# Plan 003: Add the Avatar component (ui-sdk avatar + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat e90275b..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/002-label (DONE — file shape established)
- **Category**: migration (component build-out, cycle 3)
- **Planned at**: commit `e90275b`, 2026-11-19

## Why this matters

Avatar shows a person's image with initials fallback — the first compound
component (three parts) and the first with Hashti-owned sizes. It extends the
established file shape to multi-part components.

## Current state

- `packages/react/src/label/label.tsx` — the single-part wrapper exemplar.
  Avatar is the same pattern with three parts.
- `packages/styles/src/label.css` — exemplar stylesheet: one class, tokens
  only, no hex.
- `packages/styles/src/tokens.css` — light `:root` block, `[data-theme="dark"]`
  block, and a `@media (prefers-color-scheme: dark)` system-fallback block
  (added by the reviewer in commit `982d7b5`; see its comments).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "button", "label", "separator", "switch"]`.

### ui-sdk Avatar facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/avatar.md`)

- Import the ready-made parts:
  `import { Avatar, AvatarImage, AvatarFallback } from "@ui-sdk/react/avatar"`.
- Composition: `Avatar` → `AvatarImage` + `AvatarFallback`. The image is a
  real `img`; the fallback shows until it loads and if it fails.
- `data-slot`: `avatar` (root), `avatar-image`, `avatar-fallback`. Every part
  carries `data-loading-status` (`idle` | `loading` | `loaded` | `error`).
- `AvatarFallback` takes `delay?` (ms) to avoid flashing initials.
- Interactive avatar: `render={<button type="button" aria-label="…"/>}` on
  the root — pass-through, no wrapper work.
- Styling: "Set the root's size and let the image and fallback fill it."
- `className` passed to parts is merged by ui-sdk.

### Design rules that bite (from `design/extraction/`, `design/css-conventions.md`)

- Hashti adds `data-size` (`xs` | `sm` | `md` | `lg` | `xl`) on the root —
  Hashti-owned variant attribute, allowed by `design/ui-sdk-patterns.md` §4.
- Measured sizes (old implementation, `hashti` repo `styles.css:3721-3735`):
  xs 1.5rem, sm 2rem, md 2.5rem (default), lg 3rem, xl 4rem. Square.
- Shape: fully round — `border-radius` from `--hashti-border-radius-max`
  (design token, value `999999px`; add it to tokens, see Step 2).
- Fallback initials: secondary ink on a muted surface, font-size 40% of the
  avatar size, weight 600, line-height 1.
- **Deferred (do NOT build)**: `AvatarGroup`, presence dot, `getInitials` —
  Hashti-owned extras with no ui-sdk equivalent; deferred per the naming/
  scope rule.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.
- The avatar itself is not a focus target unless the consumer renders it as
  a button; no focus ring in the component CSS.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

No lint setup and no test runner in this repo yet — out of scope.

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/avatar/avatar.tsx` — create
- `packages/react/src/avatar/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/tokens.css` — add two tokens (see Step 2)
- `packages/styles/src/avatar.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/content/docs/avatar.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"avatar"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `packages/core/src/*` — ui-sdk ships the avatar primitive
- AvatarGroup, presence dot, getInitials — deferred (no ui-sdk equivalent)
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/003-avatar`).
- Commit per logical step; plain imperative messages, e.g.
  `avatar: add Avatar component`.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Avatar wrappers in `@hashti/react`

`packages/react/src/avatar/avatar.tsx`:

```tsx
"use client"

import type { ComponentProps } from "react"
import {
  Avatar as UiAvatar,
  AvatarImage as UiAvatarImage,
  AvatarFallback as UiAvatarFallback,
} from "@ui-sdk/react/avatar"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarProps extends ComponentProps<typeof UiAvatar> {
  size?: AvatarSize
}

function Avatar({ size, className, ...props }: AvatarProps) {
  return (
    <UiAvatar
      className={`hashti-avatar${className ? ` ${className}` : ""}`}
      data-size={size}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: ComponentProps<typeof UiAvatarImage>) {
  return <UiAvatarImage className={`hashti-avatar__image${className ? ` ${className}` : ""}`} {...props} />
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof UiAvatarFallback>) {
  return <UiAvatarFallback className={`hashti-avatar__fallback${className ? ` ${className}` : ""}`} {...props} />
}

export { Avatar, AvatarImage, AvatarFallback, type AvatarSize }
```

Notes:

- `data-size` is set only when the consumer passes `size`; undefined removes
  the attribute (the CSS default `md` applies).
- The class join is the established pattern; every behavior prop passes
  through untouched.

`packages/react/src/avatar/index.ts`:

```ts
export { Avatar, AvatarImage, AvatarFallback, type AvatarSize } from "./avatar"
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Avatar, AvatarImage, AvatarFallback } from "./avatar"
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Add tokens

In `packages/styles/src/tokens.css`:

- In the `:root` block add:

```css
--hashti-border-radius-max: 999999px;
--hashti-text-secondary: #606674;
```

- In BOTH the `[data-theme="dark"]` block and the
  `@media (prefers-color-scheme: dark)` block add:

```css
--hashti-text-secondary: #b1b6c3;
```

(Values from `design/extraction/tokens.md` line 109 `text-secondary`; the
radius token name and value from `design/tokens.css`. Radius is not
theme-dependent — root block only.)

**Verify**: `grep -c "border-radius-max" packages/styles/src/tokens.css` → `1`;
`grep -c "text-secondary" packages/styles/src/tokens.css` → `3`.

### Step 3: Create the stylesheet and import it

`packages/styles/src/avatar.css`:

```css
.hashti-avatar {
  --avatar-size: 2.5rem;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  inline-size: var(--avatar-size);
  block-size: var(--avatar-size);
  border-radius: var(--hashti-border-radius-max);
  user-select: none;
  vertical-align: middle;
}

.hashti-avatar[data-size="xs"] { --avatar-size: 1.5rem; }
.hashti-avatar[data-size="sm"] { --avatar-size: 2rem; }
.hashti-avatar[data-size="lg"] { --avatar-size: 3rem; }
.hashti-avatar[data-size="xl"] { --avatar-size: 4rem; }

.hashti-avatar__image,
.hashti-avatar__fallback {
  inline-size: 100%;
  block-size: 100%;
  border-radius: inherit;
}

.hashti-avatar__image {
  object-fit: cover;
}

.hashti-avatar__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--hashti-muted);
  color: var(--hashti-text-secondary);
  font-size: calc(var(--avatar-size) * 0.4);
  font-weight: 600;
  line-height: 1;
}
```

`packages/styles/index.css` — add after the label import:

```css
@import "./src/avatar.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/avatar.css` → no matches.

### Step 4: Docs page

`apps/docs/content/docs/avatar.mdx`:

```mdx
---
title: Avatar
description: Shows an image with a fallback while it loads or if it fails.
---

import { Avatar, AvatarImage, AvatarFallback } from '@hashti/react'

## Sizes

<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
  <Avatar size="xs"><AvatarFallback>XS</AvatarFallback></Avatar>
  <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
  <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
  <Avatar size="xl"><AvatarFallback>XL</AvatarFallback></Avatar>
</div>

## Image with fallback

<Avatar size="lg">
  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Root size. Default `md`. |
| `delay` | `number` | On `AvatarFallback`: ms to wait before showing it. |

Styling lives in `@hashti/styles` under `.hashti-avatar`, keyed off `data-size`, fully round, with initials at 40% of the avatar size.
```

Match the MDX conventions of the existing pages. If the external image URL
is unwanted, swap the "Image with fallback" example for a second initials
example — do not add dependencies.

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "label", "separator", "switch"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Steps 2–3, and the reviewer's rendered
check (sizes measured in the DOM, round shape, initials visible, image
replaces fallback, `data-slot` and `data-loading-status` present).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-avatar" packages/react/src packages/styles/src` shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/avatar.css` returns nothing
- [ ] `grep -n "avatar" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Avatar`, `AvatarImage` or `AvatarFallback` is not exported from
  `@ui-sdk/react/avatar`, or the import fails to resolve — quote the error.
- `data-size` set through the wrapper conflicts with a ui-sdk attribute —
  quote the docs section or error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- AvatarGroup, presence dot and getInitials are deferred, not rejected: when
  they land they build on `.hashti-avatar` sizes and the group needs the
  overlap recipe from the old implementation.
- Cycles 4+ (Button next) copy this multi-part shape where applicable.
