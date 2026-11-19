# Hashti-new: standing program rules

Component build-out program. One component per cycle, simplest first. Each
cycle: plan → executor in an isolated worktree → review → merge on main.

## Naming rule (applies to every component)

If ui-sdk ships the component, Hashti uses the ui-sdk name — for the
component, its parts, files, exports, and docs pages.

- ui-sdk `separator` → Hashti **`Separator`** (not "Divider").
- ui-sdk `input` → Hashti **`Input`**; ui-sdk `textarea` → Hashti **`Textarea`**
  (not "TextField"/"TextArea").
- Checkbox, Radio, Switch, Button, Tabs, Dialog, … keep their ui-sdk names.
- Components ui-sdk does not ship (Badge, Kbd) keep their Hashti names.
- Class contract follows `design/css-conventions.md`: `hashti-<block>`,
  `hashti-<block>__<element>`, modifiers only via attributes. `data-slot`
  is ui-sdk's and is never renamed.

## Component recipe

- `@hashti/react` wraps; it does not re-implement. Compose the ui-sdk part
  (or the ready-made component), add the Hashti class name, nothing else.
- All styles live in `@hashti/styles`, one file per component, imported from
  `packages/styles/index.css` under `hashti.components`. Tokens only
  (`var(--hashti-*)`); a hex value in component CSS is a bug.
- File shape: `packages/react/src/<name>/<name>.tsx` + `index.ts`, barrel
  line in `packages/react/src/index.tsx`, `packages/styles/src/<name>.css` +
  import, docs page `apps/docs/content/docs/<name>.mdx` + `meta.json` entry.
- A new `@hashti/core` primitive only when ui-sdk ships no equivalent
  behavior. Always include an `api` in a primitive (even `api: () => ({})`):
  it anchors `definePrimitive`'s Options inference.

## Verification gates

- `bun run typecheck` from the repo root must pass (every workspace has a
  `types:check` script).
- `bun install` before typecheck in a fresh worktree (no `node_modules`).
- Rendered check per component on its docs page: class names present
  (`document.querySelectorAll("[class*='hashti-']")`), both themes, keyboard
  walk-through where the component is interactive.
- **Compound parts in docs pages**: Astro/MDX renders each React component
  child as its own React root, so ui-sdk's context-bound parts (image inside
  Avatar, items inside Select, …) cannot be composed directly in MDX — the
  root's context never reaches them ("part must be used inside its root").
  Put the composition in a single React demo component under
  `apps/docs/src/components/` and render that from the MDX page with
  `client:load`.
- No lint setup yet — not a gate until it exists.

## Executor workflow

- Work in the assigned worktree on the assigned branch; commit on every
  step; never merge, push, or touch main.
- Honor plan STOP conditions: report instead of improvising.
- **Fresh session per cycle.** When a herdr terminal's opencode session
  starts an unrelated task (a new component cycle), reset it first
  (`/new` in the TUI, or a fresh terminal) so old task context doesn't
  bleed into the new plan. Related follow-ups (review findings on the
  same plan) stay in the same session.

## Framework-agnostic styles rule (added post-cycle-20)

`@hashti/styles` must be usable verbatim by future Vue/Svelte/… packages.
Component CSS therefore targets ONLY:
- `hashti-*` class names (the class contract), and
- ui-sdk's data attributes (`data-open`, `data-selected`, `data-highlighted`,
  `data-invalid`, …) and `data-slot`.

Never: React DOM specifics, `:has(react-…)`, inline-style contracts the
wrapper must compute per-render, or JS-in-CSS coupling. Anything that needs
a runtime value comes from a ui-sdk CSS variable (like `--anchor-width`,
`--active-tab-*`) or a `--hashti-*` token.
