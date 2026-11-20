# Plan 048: Combobox multiple — chips with removal

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 4328c1a..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (new parts: Chips container, Chip, ChipRemove, Value
  render function)
- **Depends on**: plans/047-combobox (DONE)
- **Category**: migration (component build-out, cycle 48 — advanced
  feature)
- **Planned at**: commit `4328c1a`, 2026-11-20

## Why this matters

This is the program brief's flagship advanced feature: combobox
multiselect with chips. `multiple` turns picks into a chip list; the chip
container IS the field.

## Current state

- `packages/react/src/combobox/combobox.tsx` — the cycle-47 wrappers;
  `hashti-combobox-chips` contract reserved.
- `packages/styles/src/combobox.css` — cycle-47's stylesheet; this cycle
  APPENDS the chips block.
- `apps/docs/content/docs/combobox.mdx` — extend it.

### ui-sdk facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/combobox.md` — `## Multiple` and `## Chips That Collapse` sections; READ BOTH)

- Import adds: `ComboboxChip`, `ComboboxChipRemove`, `ComboboxChips`,
  `ComboboxValue` (verify exact exports).
- `multiple` on the root: the value is an array; choosing toggles and
  keeps the list open and clears the query. `itemToLabel` maps unknown
  values to labels.
- DOM: `ComboboxChips` wraps `ComboboxValue` (a render function over the
  values) + the input. Each value renders a `ComboboxChip` with
  `ComboboxChipRemove` inside. Backspace in an empty input removes the
  last chip; arrows move between chips.
- READ the docs' Chips section for any state attributes
  (`data-chip-focus`? `data-empty`?) and use what exists.

### Design rules that bite (the chips field recipe)

- **Chips container `hashti-combobox-chips`**: the field becomes a
  WRAPPING box — `display: flex; flex-wrap: wrap; gap: 0.375rem;
align-items: center; min-block-size: 2.75rem; padding: 0.3125rem
0.5rem;` (the padding from input.css's 0.75rem shrinks — chips carry
  their own height); take over the bordered-control role: `border: 1px
solid var(--hashti-border-strong-01); border-radius:
var(--hashti-control-radius); background: var(--hashti-layer-01);` —
  and SUPPRESS the input's own border when it lives inside the chips
  container: `.hashti-combobox-chips .hashti-combobox-input { border:
none; background: transparent; min-block-size: 2rem; flex: 1 1 4rem;
padding: 0 0.25rem; }`.
- **Chip `hashti-combobox-chip`**: `display: inline-flex; align-items:
center; gap: 0.375rem; padding: 0.25rem 0.5rem; border-radius:
var(--hashti-border-radius-08); background:
var(--hashti-background-selected); color: var(--hashti-focus);
font-size: 0.8125rem; font-weight: 500; line-height: 1.25rem;`
  (the selected tint pair from Toggle's pressed state).
- **ChipRemove `hashti-combobox-chip-remove`**: `display: inline-flex;
align-items: center; justify-content: center; inline-size: 1.125rem;
border: none; background: transparent; color: inherit; cursor: pointer;
padding: 0; border-radius: var(--hashti-border-radius-04);` hover →
  `background: var(--hashti-background-hover);` `:focus-visible` → 2px
  ring @2px.
- **Focus/invalid inheritance**: the chips container is the field —
  ring on `.hashti-combobox-chips:has(:focus-visible)` (2px @2px); check
  whether ui-sdk still emits `data-open`/`data-invalid` on the root and
  mirror to the container if trivial.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/react/src/combobox/combobox.tsx` — add the chips parts
- `packages/react/src/combobox/index.ts` — extend
- `packages/react/src/index.tsx` — extend the re-export
- `packages/styles/src/combobox.css` — append the chips block
- `apps/docs/src/components/combobox-multi-demo.tsx` — create
- `apps/docs/content/docs/combobox.mdx` — add a Multiple section
- Nothing else (meta.json/page exist)

**Out of scope** (do NOT touch, even though they look related):

- Chips-that-collapse ("+N" collapsing) — deferred
- Token Input — its own cycle
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree
  (`particle/048-combobox-chips`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Extend the wrappers in `@hashti/react`

Add wrappers for `ComboboxChips`, `ComboboxValue` (likely a direct
re-export — render-function part), `ComboboxChip`,
`ComboboxChipRemove`:

| Part                 | Class                                |
| -------------------- | ------------------------------------ |
| `ComboboxChips`      | `hashti-combobox-chips`              |
| `ComboboxValue`      | (direct re-export — render function) |
| `ComboboxChip`       | `hashti-combobox-chip`               |
| `ComboboxChipRemove` | `hashti-combobox-chip-remove`        |

**Verify**: `bun run typecheck` → exit 0.

### Step 2: Append the chips block to `packages/styles/src/combobox.css`

The design-rules section above.

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/combobox.css`
→ no matches; `grep -c "hashti-combobox-chip"
packages/styles/src/combobox.css` → ≥ 3.

### Step 3: Multi-select demo + docs section

`apps/docs/src/components/combobox-multi-demo.tsx` — `multiple`, chips
rendered from the value render function, an X glyph inline (no icon dep).
Append a `## Multiple` section to `combobox.mdx` mirroring cycle-47's
page structure.

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists; verification is typecheck + greps + the reviewer's
rendered check (chips appear on pick, list stays open, Backspace removes
the last chip, ChipRemove removes its chip, arrows move between chips,
the field grows with wrapping chips).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -c "hashti-combobox-chip" packages/styles/src/combobox.css`
      → ≥ 3
- [ ] No hex in combobox.css
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- Any chips part is not exported from `@ui-sdk/react/combobox` — quote
  the error.
- The chips DOM cannot host the input inside the container as the docs
  show — report the actual structure.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- Chips-that-collapse lands later.
- TokenInput reuses the chip recipe.
