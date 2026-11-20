# Plan 051: TokenInput — editable tokens with a suggest menu

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 1ebb10c..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (the chips recipe adapts to tokens; the suggest menu is
  TriggerMenu's, embedded)
- **Depends on**: plans/050-command (DONE)
- **Category**: migration (component build-out, cycle 51 — L batch)
- **Planned at**: commit `1ebb10c`, 2026-11-20

## Why this matters

TokenInput is the recipient/prompt field — tokens made from typed text
(`@name`), selected, removed, backed by a suggest menu. Chips' free-text
sibling.

## Current state

- `packages/styles/src/combobox.css` — the chips block (the token recipe
  adapts it: container is the field, chips carry their own surface).
- `packages/styles/src/trigger-menu.css` — the embedded suggest popup
  (comes with the TriggerMenu the docs compose in).
- `packages/react/src/trigger-menu/trigger-menu.tsx` — the parts to
  compose inside (already exported).
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "alert-dialog", "avatar", "badge", "button", "carousel", "checkbox", "collapsible", "combobox", "command", "date-input", "dialog", "drawer", "field", "file-input", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "menubar", "meter", "number-input", "pagination", "password-input", "popover", "progress", "radio", "rating", "resizable", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "time-input", "timeline", "toast", "toolbar", "toggle", "tooltip", "trigger-menu"]`.

### ui-sdk TokenInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/token-input.md`)

- Import: `import { TokenInput, TokenInputEditor, TokenInputToken, TokenInputTokenRemove } from "@ui-sdk/react/token-input"` + TriggerMenu parts (verify exact exports).
- Composition: `TokenInput` (holds value; `renderToken` for token markup)
  → `TokenInputEditor` (the editable field) + a `TriggerMenu` inside it
  (suggests tokens on a trigger like `@`).
- Editor states: `data-empty`, `data-disabled`, `data-readonly`.
- Token states: `data-token-type` (file/mention…), `data-pending`,
  `data-selected` (in the selection / selected for removal),
  `data-unresolved`, `data-disabled`, `data-readonly`.
- TokenRemove: `data-disabled`/`data-readonly`.
- Deleting tokens: `tokenDeletion` option exists (select-then-delete) —
  deferred styling.

### Design rules that bite (the chips recipe adapted)

- **Editor `hashti-token-input-editor`**: the chips container role —
  `display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem;
  min-block-size: 2.75rem; padding: 0.3125rem 0.5rem; border: 1px solid
  var(--hashti-border-strong-01); border-radius:
  var(--hashti-control-radius); background: var(--hashti-layer-01);`
  `[data-empty]` → nothing special (placeholder shows via the input).
- **Editor's inner input**: TriggerMenu's input inside the editor must go
  borderless: `.hashti-token-input-editor .hashti-trigger-menu-input {
  border: none; background: transparent; min-block-size: 2rem; flex: 1 1
  4rem; padding: 0 0.25rem; }` (same pattern as combobox-chips).
- **Focus ring**: on the editor via `:has(:focus-visible)` 2px @2px (the
  group recipe).
- **Token `hashti-token-input-token`**: the chip recipe — `display:
  inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem
  0.5rem; border-radius: var(--hashti-border-radius-08); background:
  var(--hashti-background-selected); color: var(--hashti-focus);
  font-size: 0.8125rem; font-weight: 500;`
  - `[data-selected]` → darker treatment: `background:
    var(--hashti-background-selected-hover);` (or an outline ring — pick
    the hover token; keep simple).
  - `[data-pending]` → ink `var(--hashti-text-disabled);`
  - `[data-unresolved]` → `border: 1px dashed
    var(--hashti-support-warning);`
- **TokenRemove `hashti-token-input-token-remove`**: the chip-remove
  recipe — 1.125rem square, transparent, inherit ink, hover
  background-hover, ring 2px@2px on `:focus-visible`.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Install   | `bun install`         | exit 0              |
| Typecheck | `bun run typecheck`   | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/token-input/token-input.tsx` — create
- `packages/react/src/token-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/token-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/token-input-demo.tsx` — create
- `apps/docs/content/docs/token-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"token-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- `tokenDeletion` select-then-delete styling — deferred
- Prompt Input (the LLM prompt variant) — deferred
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/051-token-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the TokenInput wrappers in `@hashti/react`

`packages/react/src/token-input/token-input.tsx` — the `join` helper
pattern (direct-re-export checks per part — check class landing against
the rendered DOM, the date-input lesson):

| Part | Class |
| --- | --- |
| `TokenInput` | `hashti-token-input` (or direct re-export) |
| `TokenInputEditor` | `hashti-token-input-editor` |
| `TokenInputToken` | `hashti-token-input-token` |
| `TokenInputTokenRemove` | `hashti-token-input-token-remove` |

Export all from `./token-input` and the barrel (TriggerMenu parts are
already in the barrel for composition).

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/token-input.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/token-input.css`
→ no matches; `grep -c "data-" packages/styles/src/token-input.css` →
≥ 5.

### Step 3: Docs demo component and page

`apps/docs/src/components/token-input-demo.tsx` — compose TokenInput +
TriggerMenu per the docs' Usage section; a remove glyph inline:

```tsx
"use client"

import { TokenInput, TokenInputEditor, TokenInputToken, TokenInputTokenRemove } from "@hashti/react"
import { TriggerMenu, TriggerMenuContent, TriggerMenuInput } from "@hashti/react"

const people = ["Hollis Vance", "Priya Nair", "Tom Okafor"]

export function TokenInputDemo() {
  return (
    <TokenInput style={{ maxWidth: 360 }}>
      <TokenInputEditor>
        <TriggerMenu items={people}>
          <TriggerMenuInput placeholder="Type @ to mention…" aria-label="Recipients" />
          <TriggerMenuContent />
        </TriggerMenu>
      </TokenInputEditor>
    </TokenInput>
  )
}
```

(`renderToken` markup: if the docs' Usage renders tokens through
`renderToken`, adapt the demo to include `TokenInputToken` +
`TokenInputTokenRemove` with an inline × glyph — read the docs and note
what you shipped.)

`apps/docs/content/docs/token-input.mdx`:

```mdx
---
title: TokenInput
description: Turns typed text into removable tokens.
---

import { TokenInputDemo } from '../../src/components/token-input-demo'

## Usage

<TokenInputDemo client:load />

## Notes

Compose with TriggerMenu: type `@` to open the suggest popup, pick, and the value becomes a token. `renderToken` builds each token's markup with `TokenInputToken` and `TokenInputTokenRemove`.
```

`apps/docs/content/docs/meta.json` — insert `"token-input"` after
`"time-input"`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(type @ + pick → token appears, remove button works, editor grows, focus
ring, pending/unresolved states if renderable).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-token-input" packages/react/src packages/styles/src`
  shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/token-input.css`
  returns nothing
- [ ] `grep -n "token-input" packages/styles/index.css apps/docs/content/docs/meta.json`
  shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any part is not exported from `@ui-sdk/react/token-input` — quote the
  error.
- The TriggerMenu-inside-editor composition fails — report the actual DOM
  and what the docs recommend instead.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Prompt Input (LLM prompt variant) reuses this recipe.
- `tokenDeletion` styling lands later.
