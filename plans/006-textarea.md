# Plan 006: Add the Textarea component (ui-sdk textarea + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat c551701..HEAD -- packages apps/docs/content`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/005-input (DONE)
- **Category**: migration (component build-out, cycle 6)
- **Planned at**: commit `c551701`, 2026-11-20

## Why this matters

Textarea completes the text-entry family. It reuses Input's control recipes
(border, surface, typography, states) with multi-line geometry.

## Current state

- `packages/react/src/input/input.tsx` — the wrapper exemplar (class-only,
  no Hashti-owned props). Textarea is the same shape.
- `packages/styles/src/input.css` — the control recipes Textarea shares:
  control border, layer-01 surface, 16px/24px entered text, field focus ring
  (2px/2px offset), placeholder, read-only and disabled treatments.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "input", "label", "separator", "switch"]`.

### ui-sdk Textarea facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/textarea.md`)

- Ready-made: `import { Textarea } from "@ui-sdk/react/textarea"`. Renders a
  native `<textarea>`; `data-slot="textarea"`.
- Data attributes: `data-filled`, `data-disabled`, `data-readonly`,
  `data-required` — same as Input.
- `value`/`defaultValue`/`onValueChange` with the same change reasons as
  Input; native attributes (`rows`, `placeholder`, `maxLength`) pass through.

### Design rules that bite (from `design/DESIGN.md`, `design/extraction/`)

- Same control recipes as Input: control border (`--hashti-border-strong-01`),
  `--hashti-layer-01` surface, `--hashti-control-radius`, entered text
  16px/24px weight 400, field focus ring 2px/2px offset, placeholder
  `--hashti-text-secondary`, invalid border `--hashti-support-error`,
  read-only dashed + `--hashti-layer-accent-01`, disabled treatments.
- **Multi-line geometry** (old implementation, `text-field.css`):
  `padding: 0.5rem 0.75rem` (spacing-03 block, spacing-04 inline);
  `resize: vertical` (block resizing only — inline resizing breaks layout);
  `min-block-size: 5rem` for a comfortable default; `inline-size: 100%`.
- No `min-block-size: 2.75rem` from Input — the textarea's own 5rem default
  governs; rows attribute may grow it.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/textarea/textarea.tsx` — create
- `packages/react/src/textarea/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/textarea.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/content/docs/textarea.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"textarea"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Field anatomy, InputGroup/InputClear — deferred (see plans/README)
- `packages/core/src/*`
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/006-textarea`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Textarea wrapper in `@hashti/react`

`packages/react/src/textarea/textarea.tsx`:

```tsx
"use client";

import type { ComponentProps } from "react";
import { Textarea as UiTextarea } from "@ui-sdk/react/textarea";

function Textarea({ className, ...props }: ComponentProps<typeof UiTextarea>) {
  return (
    <UiTextarea
      className={`hashti-textarea${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Textarea };
```

`packages/react/src/textarea/index.ts`:

```ts
export { Textarea } from "./textarea";
```

`packages/react/src/index.tsx` — add at the end:

```tsx
export { Textarea } from "./textarea";
```

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/textarea.css`:

```css
.hashti-textarea {
  inline-size: 100%;
  min-block-size: 5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--hashti-border-strong-01);
  border-radius: var(--hashti-control-radius);
  background: var(--hashti-layer-01);
  color: var(--hashti-text-primary);
  font-size: 1rem;
  line-height: 1.5rem;
  resize: vertical;
  transition: border-color var(--hashti-duration-fast-01)
    cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-textarea::placeholder {
  color: var(--hashti-text-secondary);
  opacity: 1;
}

.hashti-textarea:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 2px;
}

.hashti-textarea[aria-invalid="true"] {
  border-color: var(--hashti-support-error);
}

.hashti-textarea[data-readonly] {
  border-style: dashed;
  background: var(--hashti-layer-accent-01);
}

.hashti-textarea[data-disabled] {
  border-color: var(--hashti-border-disabled);
  background: var(--hashti-button-disabled);
  color: var(--hashti-text-disabled);
  cursor: not-allowed;
}
```

`packages/styles/index.css` — add after the input import:

```css
@import "./src/textarea.css" layer(hashti.components);
```

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/textarea.css` → no matches.

### Step 3: Docs page

`apps/docs/content/docs/textarea.mdx`:

```mdx
---
title: Textarea
description: Enters multiple lines of text, connected to your form or state.
---

import { Textarea } from "@hashti/react";

## Usage

<div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
  <Textarea
    aria-label="Message"
    placeholder="Type your message here…"
    rows={4}
  />
  <Textarea
    aria-label="Notes"
    defaultValue="Read-only notes."
    readOnly
    rows={2}
  />
  <Textarea aria-label="Locked" disabled defaultValue="Locked value" rows={2} />
</div>

## Props

Textarea passes every native textarea prop through — `rows`, `placeholder`,
`maxLength` — plus ui-sdk's controlled state and change reasons.

Styling lives in `@hashti/styles` under `.hashti-textarea`: the input control recipes with multi-line geometry and vertical-only resizing.
```

`apps/docs/content/docs/meta.json` — `pages` becomes
`["index", "avatar", "button", "input", "label", "separator", "switch", "textarea"]`.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(multi-line geometry, vertical resize, shared control recipes, states).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-textarea" packages/react/src packages/styles/src` shows the wrapper class and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/textarea.css` returns nothing
- [ ] `grep -n "textarea" packages/styles/index.css apps/docs/content/docs/meta.json` shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Textarea` is not exported from `@ui-sdk/react/textarea` — quote the error.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- The text-entry family (Input, Textarea) is complete after this cycle; the
  Field anatomy cycle wraps them with label/description/error and the
  recovery band.
