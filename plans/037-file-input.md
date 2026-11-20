# Plan 037: FileInput — trigger, dropzone, file list

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 3690e4b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (drag states and the list recipe are new surface)
- **Depends on**: plans/036-date-input (DONE)
- **Category**: migration (component build-out, cycle 37 — M batch)
- **Planned at**: commit `3690e4b`, 2026-11-20

## Why this matters

FileInput is the upload surface — trigger, dropzone with accept/reject
drag states, and a removable file list. The dropzone recipe (dashed idle
border, drag highlight) is new vocabulary.

## Current state

- `packages/styles/src/date-input.css` — the newest group-recipe exemplar.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "accordion", "avatar", "badge", "button", "checkbox", "collapsible", "date-input", "dialog", "field", "hover-card", "input", "kbd", "label", "link", "listbox", "menu", "meter", "number-input", "password-input", "popover", "progress", "radio", "rating", "scroll-area", "segmented-control", "select", "separator", "slider", "switch", "tabs", "textarea", "timeline", "toast", "toggle", "tooltip"]`.

### ui-sdk FileInput facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/file-input.md`)

- Import: `import { FileInput, FileInputDropzone, FileInputItem, FileInputItemRemove, FileInputList, FileInputTrigger } from "@ui-sdk/react/file-input"` (verify exact exports).
- Composition: `FileInput` → (`FileInputTrigger` — opens the picker,
  `FileInputDropzone` — takes drops and pastes, `FileInputList` →
  `FileInputItem` (children function receives `file` and `index`) →
  `FileInputItemRemove`).
- Root: `data-disabled`, `data-required`, `data-dragging`.
- Dropzone: `data-dragging`, `data-drag-accept` (looks acceptable),
  `data-drag-reject` (type ruled out or too many).
- The list's item renders once per file; keep a trigger beside the
  dropzone for keyboard users.

### Design rules that bite (derived; group + status vocabulary)

- **Root `hashti-file-input`**: `display: flex; flex-direction: column;
gap: 0.5rem;` (trigger + dropzone + list stack).
- **Trigger**: the secondary button recipe — reuse `.hashti-button`'s
  look WITHOUT importing button.css rules: `display: inline-flex;
align-items: center; gap: 0.5rem; padding: 0 0.75rem;
min-block-size: 2.5rem; border: 1px solid
var(--hashti-border-strong-01); border-radius:
var(--hashti-control-radius); background: var(--hashti-layer-01);
color: var(--hashti-text-primary); font-size: 0.875rem; font-weight:
500; cursor: pointer;` hover (hover:hover) → `background:
var(--hashti-background-hover);` `:focus-visible` → 2px ring @2px;
  `[data-disabled]` → disabled recipe.
- **Dropzone**: `display: flex; flex-direction: column; align-items:
center; justify-content: center; gap: 0.25rem; padding: 1.5rem;
border: 1px dashed var(--hashti-border-strong-01); border-radius:
var(--hashti-border-radius-08); background: var(--hashti-layer-02);
color: var(--hashti-text-secondary); font-size: 0.875rem;
text-align: center; cursor: pointer;` (clicking opens the picker too).
  - `[data-dragging]` → `border-color: var(--hashti-focus); background:
var(--hashti-background-selected);`
  - `[data-drag-accept]` → border-color `var(--hashti-support-success);`
  - `[data-drag-reject]` → border-color `var(--hashti-support-error);`
- **List**: `display: grid; gap: 0.25rem; margin: 0; padding: 0;
list-style: none;` (check the rendered element type — if ui-sdk renders
  a `ul`, reset it).
- **Item**: `display: flex; align-items: center; gap: 0.5rem; padding:
0.375rem 0.5rem; border: 1px solid var(--hashti-border-subtle-00);
border-radius: var(--hashti-border-radius-08); background:
var(--hashti-layer-01); font-size: 0.8125rem; color:
var(--hashti-text-primary);` file name truncates (`min-inline-size: 0`
  - ellipsis on the name span is the consumer's job — keep the item flex).
- **ItemRemove**: a quiet icon button — `inline-size: 1.75rem;
block-size: 1.75rem; display: inline-flex; align-items: center;
justify-content: center; border: none; background: transparent; color:
var(--hashti-text-secondary); cursor: pointer; border-radius:
var(--hashti-border-radius-04);` hover → `background:
var(--hashti-background-hover); color: var(--hashti-text-primary);`
  `:focus-visible` → 2px ring @2px.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/file-input/file-input.tsx` — create
- `packages/react/src/file-input/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/file-input.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/file-input-demo.tsx` — create
- `apps/docs/content/docs/file-input.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"file-input"` to `pages`

**Out of scope** (do NOT touch, even though they look related):

- Upload progress attachments, thumbnail previews — deferred
- `target="document"` dropzones — behavior exists; styling same as the
  local one
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/037-file-input`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the FileInput wrappers in `@hashti/react`

`packages/react/src/file-input/file-input.tsx` — the `join` helper pattern
(direct-re-export check on roots). NOTE cycle 36's lesson: check whether
ui-sdk renders any part itself; if a part's class cannot land (like the
date-input segments), key the CSS on the root + `data-slot` and note it:

| Part                  | Class                                                |
| --------------------- | ---------------------------------------------------- |
| `FileInput`           | `hashti-file-input` (or direct re-export)            |
| `FileInputTrigger`    | `hashti-file-input-trigger`                          |
| `FileInputDropzone`   | `hashti-file-input-dropzone`                         |
| `FileInputList`       | `hashti-file-input-list`                             |
| `FileInputItem`       | `hashti-file-input-item` (or data-slot keyed)        |
| `FileInputItemRemove` | `hashti-file-input-item-remove` (or data-slot keyed) |

Export all six from `./file-input` and the barrel.

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Create the stylesheet and import it

`packages/styles/src/file-input.css` — the design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/file-input.css`
→ no matches; `grep -c "data-" packages/styles/src/file-input.css` →
≥ 6.

### Step 3: Docs demo component and page

`apps/docs/src/components/file-input-demo.tsx`:

```tsx
"use client";

import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@hashti/react";

export function FileInputDemo() {
  return (
    <FileInput style={{ maxWidth: 420 }}>
      <FileInputTrigger>Browse files</FileInputTrigger>
      <FileInputDropzone>
        Drop files here or paste from the clipboard
      </FileInputDropzone>
      <FileInputList>
        {(file, index) => (
          <FileInputItem key={file.name + index}>
            {file.name}
            <FileInputItemRemove aria-label={`Remove ${file.name}`}>
              ×
            </FileInputItemRemove>
          </FileInputItem>
        )}
      </FileInputList>
    </FileInput>
  );
}
```

(Fix any prop-name/children-function mismatch against the docs' Usage and
File List sections; note what you shipped. Do not commit a snippet with a
syntax error — the template above is indicative.)

`apps/docs/content/docs/file-input.mdx`:

```mdx
---
title: FileInput
description: Picks, drops and lists files.
---

import { FileInputDemo } from "../../src/components/file-input-demo";

## Usage

<FileInputDemo client:load />

## Parts

| Part                                                      | Purpose                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| `FileInput`                                               | Owns the files.                                                    |
| `FileInputTrigger`                                        | Opens the picker; keep one beside the dropzone for keyboard users. |
| `FileInputDropzone`                                       | Takes drops and pastes; accept/reject drag states.                 |
| `FileInputList` / `FileInputItem` / `FileInputItemRemove` | The removable file list.                                           |

Styling lives in `@hashti/styles` under `.hashti-file-input*` — a dashed dropzone that highlights blue while dragging, green on accept, red on reject.
```

`apps/docs/content/docs/meta.json` — insert `"file-input"` after
`"field"` (alphabetical check against the live list).

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Step 2, and the reviewer's rendered check
(trigger opens the picker, dropzone states on synthetic drag events, list
items render with names, remove works, focus rings).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashti-file-input" packages/react/src packages/styles/src`
      shows the wrapper classes and the stylesheet selectors
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/file-input.css`
      returns nothing
- [ ] `grep -n "file-input" packages/styles/index.css apps/docs/content/docs/meta.json`
      shows the import and the page entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the six parts is not exported from `@ui-sdk/react/file-input` —
  quote the error.
- A part's class cannot land on the rendered element (the date-input
  lesson) and data-slot keying also fails — report the DOM.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Attachments with progress bars land with a later cycle (they compose
  Progress).
- The dashed-dropzone recipe may feed image-uploader variants later.
