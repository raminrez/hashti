# Plan 053: NavigationMenu — disclosure navigation with a viewport

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the shared viewport follows the trigger with
  `--viewport-width/height`; placement math is ui-sdk's)
- **Depends on**: plans/051-token-input (DONE)
- **Category**: migration (component build-out, cycle 53)
- **Parallel lane**: Particle-3

## Why this matters

NavigationMenu is the site-header navigation — triggers opening link
panels through a shared viewport that follows the active trigger. It
reuses Popover/Menu surface recipes in a nav pattern.

## Current state

- `packages/styles/src/popover.css` — the surface/motion exemplar.
- `packages/react/src/popover/popover.tsx` — the wrapper exemplar.
- `apps/docs/content/docs/meta.json` — check the live list; insert
  `"navigation-menu"` alphabetically.

### ui-sdk NavigationMenu facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/navigation-menu.md`)

- Import: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@ui-sdk/react/navigation-menu"` (verify exact exports).
- Composition: `NavigationMenu` (aria-label) → `NavigationMenuList` →
  `NavigationMenuItem` → (`NavigationMenuTrigger`,
  `NavigationMenuContent` → `NavigationMenuLink`+). Optional
  `NavigationMenuViewport` sibling of the list — sized/positioned by
  ui-sdk via `--viewport-width`/`--viewport-height`.
- The content panels are positioned by ui-sdk (Popover-like placement).
- READ the docs' Data Attributes for trigger/content/link states
  (`data-active`, `data-open`, starting/ending styles etc.) and the
  Viewport section for the geometry contract. ALSO read "Without a
  viewport" — the demo may ship viewportless if simpler, but prefer the
  viewport (it's the smooth-sizing pattern).

### Design rules that bite (Popover surface in a nav row)

- **Root `hashti-navigation-menu`**: `position: relative; display:
inline-flex; justify-content: center;` (the viewport anchors inside).
- **List `hashti-navigation-menu-list`**: `display: flex; gap: 0.25rem;
align-items: center;`
- **Item `hashti-navigation-menu-item`**: wrapper only (`display: flex;
position: relative;`).
- **Trigger `hashti-navigation-menu-trigger`**: the quiet-action recipe —
  `display: inline-flex; align-items: center; gap: 0.375rem; padding: 0
0.625rem; min-block-size: 2.25rem; border: none; border-radius:
var(--hashti-control-radius); background: transparent; color:
var(--hashti-text-primary); font-size: 0.875rem; font-weight: 500;
cursor: pointer;` hover (hover:hover) → background-hover;
  `:focus-visible` → 2px ring @2px; active/open state per docs
  (`[data-open]` → background-hover like a pressed tab).
- **Content `hashti-navigation-menu-content`**: the popover surface
  recipe — `background: var(--hashti-layer-01); border: 1px solid
var(--hashti-border-subtle-00); border-radius:
var(--hashti-popover-radius); box-shadow: 0 8px 24px
var(--hashti-shadow); padding: 0.75rem;` motion via
  starting/ending styles (opacity + scale 0.98, fast-01,
  transform-origin from `--transform-origin` if exposed; reduced-motion →
  opacity only).
- **Link `hashti-navigation-menu-link`**: `display: block; padding:
0.5rem; border-radius: var(--hashti-border-radius-08); color:
var(--hashti-text-primary); font-size: 0.875rem; text-decoration:
none;` hover → background-hover.
- **Viewport `hashti-navigation-menu-viewport`**: `position: absolute;
background: var(--hashti-layer-01); border: 1px solid
var(--hashti-border-subtle-00); border-radius:
var(--hashti-popover-radius); box-shadow: 0 8px 24px
var(--hashti-shadow); overflow: hidden;` sized by `width:
var(--viewport-width); height: var(--viewport-height);` — CHECK the
  docs' exact variable names/positions and follow.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/navigation-menu/navigation-menu.tsx` — create
- `packages/react/src/navigation-menu/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/navigation-menu.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/navigation-menu-demo.tsx` — create
- `apps/docs/content/docs/navigation-menu.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"navigation-menu"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Horizontal/vertical orientation variants beyond the default — deferred
- Hover-open delays — ui-sdk behavior, not styling
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/053-navigation-menu`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the NavigationMenu wrappers in `@hashti/react`

`packages/react/src/navigation-menu/navigation-menu.tsx` — the `join`
helper pattern (direct-re-export checks per part; verify class landing in
the rendered DOM — the date-input lesson):

| Part                     | Class                             |
| ------------------------ | --------------------------------- |
| `NavigationMenu`         | `hashti-navigation-menu`          |
| `NavigationMenuList`     | `hashti-navigation-menu-list`     |
| `NavigationMenuItem`     | `hashti-navigation-menu-item`     |
| `NavigationMenuTrigger`  | `hashti-navigation-menu-trigger`  |
| `NavigationMenuContent`  | `hashti-navigation-menu-content`  |
| `NavigationMenuLink`     | `hashti-navigation-menu-link`     |
| `NavigationMenuViewport` | `hashti-navigation-menu-viewport` |

Export all from `./navigation-menu` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/navigation-menu.css` — the design-rules section
above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/navigation-menu.css`
→ no matches; `grep -c "data-" packages/styles/src/navigation-menu.css`
→ ≥ 4.

### Step 3: Docs demo component and page

`apps/docs/src/components/navigation-menu-demo.tsx` — two items with
small link panels (follow the docs' Usage structure; the trigger opens a
panel of links):

```tsx
"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@hashti/react";

const docsLinks = [
  { href: "#components", title: "Components", desc: "Every building block." },
  { href: "#styles", title: "Styles", desc: "Tokens and recipes." },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu aria-label="Main navigation">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            {docsLinks.map((l) => (
              <NavigationMenuLink key={l.href} href={l.href}>
                <div style={{ fontWeight: 600 }}>{l.title}</div>
                <div
                  style={{
                    color: "var(--hashti-text-secondary)",
                    fontSize: "0.8125rem",
                  }}
                >
                  {l.desc}
                </div>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#guides">Guides</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
```

`apps/docs/content/docs/navigation-menu.mdx`:

```mdx
---
title: NavigationMenu
description: Opens link panels from a nav row.
---

import { NavigationMenuDemo } from "../../src/components/navigation-menu-demo";

## Usage

<NavigationMenuDemo client:load />

## Parts

| Part                                           | Purpose                                |
| ---------------------------------------------- | -------------------------------------- |
| `NavigationMenu`                               | Owns the open item.                    |
| `NavigationMenuList` / `NavigationMenuItem`    | The trigger row.                       |
| `NavigationMenuTrigger`                        | One disclosure button.                 |
| `NavigationMenuContent` / `NavigationMenuLink` | The panel of links.                    |
| `NavigationMenuViewport`                       | The shared panel surface that follows. |

Styling lives in `@hashti/styles` under `.hashti-navigation-menu*` — quiet triggers with the popover surface and a viewport that follows the open panel's size.
```

`apps/docs/content/docs/meta.json` — insert `"navigation-menu"`
alphabetically.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(trigger opens panel in the viewport, viewport sizes to content, second
trigger reuses the viewport, hover/focus states, Escape dismisses).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-navigation-menu" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/navigation-menu.css`
      returns nothing
- [ ] `grep -n "navigation-menu" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/navigation-menu` — quote
  the error.
- The viewport variables do not resolve — report what you found.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The viewport pattern may feed a mega-menu variant later.
