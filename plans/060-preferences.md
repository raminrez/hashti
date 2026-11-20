# Plan 060: Preferences — headless preference store + apply-to-page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition triggers, stop and report — do not improvise. Do not update
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> Compare "Current state" excerpts against live code; on mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (headless; no component CSS — the "styles" are attribute
  selectors consumers own)
- **Depends on**: plans/054-calendar (DONE)
- **Category**: migration (component build-out, cycle 60)
- **Parallel lane**: Particle-6

## Why this matters

Preferences is NOT a visual component: a headless store that writes a value
to a data attribute, plus a `Preferences` wrapper that renders
`display: contents`. It exercises `@hashti/core` (primitive with an `api`)
and the docs pattern for attribute-driven styling.

## Current state

- `packages/core/src/index.ts` — the core barrel; primitives live per the
  AGENTS.md rule (a new `@hashti/core` primitive only when ui-sdk ships no
  equivalent behavior — here ui-sdk DOES ship it, so we WRAP, not
  re-implement).
- `apps/docs/content/docs/meta.json` — insert `"preferences"` after
  `"popover"`.

### ui-sdk Preferences facts (READ the full docs page first)

- `import { Preferences } from "@ui-sdk/react/preferences"` and
  `import { createPreference } from "@ui-sdk/core"` (verify exact entry
  points; storage helpers like `createLocalStorage` come from core too).
- `createPreference({ values, defaultValue, attribute, storage? })` → a
  preference object with `.set(value)` / read API (check the API Reference
  section for the exact surface).
- `<Preferences preferences={[view]}>` applies each preference's attribute
  to its rendered wrapper (`data-view="list"` etc.), renders
  `display: contents`.
- `usePreference(preference)` reads the value reactively in React.
- Storage: `createLocalStorage(name)` persists between visits.

### Design rules

- **No `packages/styles` file for this cycle** — the component adds no box
  (`display: contents` comes from ui-sdk). If the wrapper needs a class at
  all, give it `hashti-preferences` with only `display: contents` — but
  prefer no class (check what ui-sdk renders; if it already sets
  display:contents, a direct re-export with no CSS is correct).
- Colours only via `var(--hashti-*)` — moot here; no CSS file expected.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/preferences/preferences.tsx` — create (wrap
  `Preferences`; re-export `createPreference`/storage helpers from
  `@hashti/react` if the docs' usage imports them from the react entry —
  otherwise document the core import path on the docs page)
- `packages/react/src/preferences/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `apps/docs/src/components/preferences-demo.tsx` — create (list/grid
  toggle demo per the docs' Usage)
- `apps/docs/content/docs/preferences.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"preferences"`

**Out of scope** (do NOT touch):

- `packages/styles/**` — no stylesheet this cycle
- `packages/core/**` — ui-sdk ships the behavior; we wrap, not re-implement
- Any lint/test infrastructure

## Git workflow

- Branch `particle/060-preferences` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrapper** — wrap `Preferences`; verify what ui-sdk renders
   (display:contents?) and whether a class is needed at all. Export from
   `./preferences` + barrel. Verify: typecheck exit 0.
2. **Demo + page** — the list/grid demo from the docs' Usage: a
   `createPreference` for `data-view`, buttons calling `view.set(...)`, the
   styled list. meta.json entry. Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-preferences\|Preferences" packages/react/src/preferences` hits
- [ ] `grep -n "preferences" apps/docs/content/docs/meta.json` shows the entry
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] one commit per step

## STOP conditions

- `createPreference`/`usePreference` are not exported where the docs say —
  quote the error.
- The wrapper must add CSS to work (ui-sdk does not set display:contents) —
  report and stop (plan assumed none).
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
