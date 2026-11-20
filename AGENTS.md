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
  (`var(--hashti-*)`) — no check sees raw non-color values yet, so this stays
  a convention.
- File shape: `packages/react/src/<name>/<name>.tsx` + `index.ts`, barrel
  line in `packages/react/src/index.tsx`, `packages/styles/src/<name>.css` +
  import, docs page `apps/docs/content/docs/<name>.mdx` + `meta.json` entry.

## Verification gates

- `bun run typecheck` from the repo root must pass (every workspace has a
  `types:check` script).
- `bun install` before typecheck in a fresh worktree (no `node_modules`).
- Rendered check per component on its docs page: class names present
  (`document.querySelectorAll("[class*='hashti-']")`) AND a computed style
  asserted (e.g. `getComputedStyle(input).borderWidth !== "0px"`) —
  class-presence alone passes even when every `hashti-*` style is dropped (the
  `import-notation` regression shipped invisible for a day). Both themes,
  keyboard walk-through where the component is interactive.
- **Compound parts in docs pages**: Astro/MDX renders each React component
  child as its own React root, so ui-sdk's context-bound parts (image inside
  Avatar, items inside Select, …) cannot be composed directly in MDX — the
  root's context never reaches them ("part must be used inside its root").
  Put the composition in a single React demo component under
  `apps/docs/src/components/` and render that from the MDX page with
  `client:load`.

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

Never: React DOM specifics, inline-style contracts the wrapper must compute
per-render, or JS-in-CSS coupling. Anything that needs
a runtime value comes from a ui-sdk CSS variable (like `--anchor-width`,
`--active-tab-*`) or a `--hashti-*` token.

## Anti-slop checks

Rolled out step by step from `anti-slop/todo.md`; the reasoning is in
`anti-slop/plan.md`.

- Fix what a check finds; don't silence it. No new `!`, `as any`,
  `@ts-expect-error`, or disable comments to get a check green.
- Every ignore entry (knip `ignore`, jscpd `ignore`, lint `overrides`, a
  disable comment) carries a comment saying why. Review the lists when they
  grow: each entry is code a detector was told not to look at.
- A lint message says what failed, why the rule exists, and what to do instead.
- After fixing a bug, or a regression a review catches, suggest the lint rule
  or test that would have caught it (the incident, what it matches, its
  message), or say why no check can. Write it only when asked.
- Scores (react-doctor) are diagnostics, not targets. Don't change code to
  move a number.

Commands:

- `bun run deadcode`: knip — unused files, exports, dependencies. Zero is the
  baseline; keep it there.
- `bun run duplicates`: jscpd, logic (strict) + markup (loose). Report-only
  until its gate lands.
- `bun run react-doctor`: React-specific scan (effects, state, hydration).
  Report-only; fix findings in code already being touched.
