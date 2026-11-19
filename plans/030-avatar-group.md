# Plan 030: AvatarGroup + getInitials — stacked avatars with overflow count

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 66bc24d..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (logic copied from the old implementation; styles tokenize)
- **Depends on**: plans/029-link (DONE)
- **Category**: migration (component build-out, cycle 30 — Hashti-owned)
- **Planned at**: commit `66bc24d`, 2026-11-20

## Why this matters

AvatarGroup stacks avatars with an overflow count — the team-picker,
comment-thread and sharing surfaces all render it. Presence dots come with
it (the old Avatar carried them; Hashti's Avatar is ui-sdk's and has none —
this cycle adds the group context, NOT presence).

## Current state

- `packages/react/src/avatar/avatar.tsx` — the existing Hashti Avatar
  (wraps ui-sdk; sizes via a prop; `AvatarImage`/`AvatarFallback`).
- `packages/styles/src/avatar.css` — read it for `--avatar-size` handling
  (the group's overlap math reads it).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "popover", "progress", "radio", "scroll-area", "select", "separator", "slider", "switch", "tabs", "textarea", "toast", "toggle", "tooltip"]`.

### Reference implementation (old system: `/Users/raminrezaei/Documents/Projects/Personal/hashti/packages/react/src/components/avatar/avatar.tsx` + frame.css `.hashti-avatar-group` block ~line 2689)

Read both before writing. Facts:

- `getInitials(name, locale?)`: takes the name, splits on whitespace,
  uppercases the first letter of the first and last words (locale-aware
  via `toLocaleUpperCase`), joins them — read the exact function and copy
  it verbatim.
- `AvatarGroup` props: `size?` (`xs`…`xl`, sets the group context's
  `--avatar-size`), `max?` (visible avatars; the rest collapse into a
  count chip), `overflowRenderer?` (custom chip), `children` (Avatar
  elements only).
- Rendering: `Children.toArray`, slice to `max`, overflow count =
  total − visible; renders `<div role="group" class="hashti-avatar-group">`
  with the context provider, then a
  `<div class="hashti-avatar-group-count">` chip when overflow > 0.
- CSS (frame.css): group is `inline-flex; align-items: center;`; each
  avatar after the first pulls in
  `margin-inline-start: calc(var(--avatar-size, 2.5rem) * -0.25)`; every
  avatar gets `box-shadow: 0 0 0 2px var(--hashti-background)` (the ring
  that separates the stack); the count chip is an avatar-sized circle,
  `background: var(--hashti-layer-02)`, ink `var(--hashti-text-secondary)`,
  0.875rem/600, same pull-in margin and ring shadow.

### Design rules that bite (tokenized for hashti-new)

- The group sets `--avatar-size` per size prop via a `data-size` attribute
  on the group (`xs → 1.5rem, sm → 2rem, md → 2.5rem, lg → 3rem, xl →
  4rem` — READ `packages/styles/src/avatar.css` for the exact per-size
  values Hashti already uses and mirror them; do not invent new sizes).
- Overlap: `margin-inline-start: calc(var(--avatar-size, 2.5rem) * -0.25)`
  on `.hashti-avatar-group > .hashti-avatar:not(:first-child)` and on the
  count chip.
- Stack ring: `box-shadow: 0 0 0 2px var(--hashti-background)` on both
  (the shadow token is a color — here it is a ring thickness number; the
  2px literal is geometry, allowed; `var(--hashti-background)` supplies
  the color).
- Count chip: `background: var(--hashti-layer-02); color:
  var(--hashti-text-secondary); border-radius: var(--hashti-border-radius-max);
  inline-size/block-size: var(--hashti-avatar-size, 2.5rem)` (use the
  variable name avatar.css already defines for sizes; check it).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.
- RTL: negative margin-inline-start is direction-aware already (logical
  property) — no extra rules.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/avatar/avatar-group.tsx` — create (keeps the avatar
  module together)
- `packages/react/src/avatar/index.ts` — add the exports
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/avatar.css` — append the group block
- `packages/styles/index.css` — no change (avatar.css already imported)
- `apps/docs/src/components/avatar-group-demo.tsx` — create
- `apps/docs/content/docs/avatar.mdx` — add a Group section to the
  EXISTING page
- `apps/docs/content/docs/meta.json` — no change

**Out of scope** (do NOT touch, even though they look related):

- Presence dots (`online`/`away`/`busy`) — their own cycle
- `overflowRenderer` custom chips beyond accepting the prop — document,
  don't demo
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/030-avatar-group`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create AvatarGroup + getInitials in `@hashti/react`

`packages/react/src/avatar/avatar-group.tsx` — copy the old group logic
verbatim (context, max slicing, count chip), minus presence. Export
`AvatarGroup` and `getInitials` from the avatar module and the barrel.
Keep the class names `hashti-avatar-group` and `hashti-avatar-group-count`
(the old system's; the wrapper is a positioning block, not a badge
element).

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Extend `packages/styles/src/avatar.css`

Append the group block: group layout, overlap margins (driven by
`[data-size]` attribute values on the group setting `--<the size variable
avatar.css uses>`), stack rings, count chip.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/avatar.css`
→ no matches; `grep -c "avatar-group" packages/styles/src/avatar.css` →
≥ 4.

### Step 3: Docs demo and page section

`apps/docs/src/components/avatar-group-demo.tsx`:

```tsx
"use client"

import { Avatar, AvatarFallback, AvatarGroup, getInitials } from "@hashti/react"

const names = ["Hollis Vance", "Priya Nair", "Tom Okafor", "Lena Fischer", "Marco Ruiz"]

export function AvatarGroupDemo() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AvatarGroup size="md">
        {names.map((n) => (
          <Avatar key={n} name={n} lang="en">
            <AvatarFallback>{getInitials(n)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <AvatarGroup size="md" max={3}>
        {names.map((n) => (
          <Avatar key={n} name={n} lang="en">
            <AvatarFallback>{getInitials(n)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}
```

(If Hashti's Avatar has no `name` prop, pass the initials directly and
note it — the group does not require `name`.)

`apps/docs/content/docs/avatar.mdx` — append:

```mdx
## Group

<AvatarGroupDemo client:load />

`AvatarGroup` stacks avatars with a 25% overlap and a "+N" count chip when `max` is set. `getInitials(name)` derives fallback initials.
```

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(25% overlap, stack rings, "+2" count chip, size variants, getInitials
output for multi-word names).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-avatar-group" packages/react/src packages/styles/src`
  shows the classes and the selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/avatar.css` returns
  nothing
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- The reference implementation files are unreadable — quote the error.
- avatar.css's size variable name cannot be determined — quote the file's
  size-related rules.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Presence dots are the next avatar cycle.
- The count chip could reuse Badge later; for now it is bespoke (matching
  the old system).
