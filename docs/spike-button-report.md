# TICK-013 Spike Report — Button across two ui-sdk frameworks, one stylesheet

**Date:** 2026-11-18 · **Branch:** rewrite/migrate-from-rac-to-ui-sdk · **Harness:** `apps/spike-button/`

## Framework chosen and why

`@ui-sdk/web` (Web Components), pinned to `0.1.0-beta.6` — the exact version of `@ui-sdk/react`
installed. Chosen over Svelte/Vue/Solid because it needs no framework runtime or compiler: a
`<ui-button>` custom element wrapping a light-DOM `<button>`, served from a 30-line `Bun.serve`
file.

Key structural fact from `@ui-sdk/web/docs/components/button.md`: the wrapper renders
`display: contents` and state attributes land on the inner `<button>`. Light DOM means the
global `@hashti/styles` stylesheet reaches it unchanged — the CSS contract can hold.

## Method

- `apps/spike-button/public/index.html` + `src/main.ts` — the ui-sdk/web side. Imports
  `@ui-sdk/web/button`, builds a matrix of buttons: 5 variants, 3 sizes, hover, active,
  disabled (per variant), pending, iconOnly, and two RTL blocks (Persian + Arabic).
- `apps/spike-button/public/react.html` + `src/react.tsx` — the `@hashti/react` Button side,
  identical layout and labels.
- Both pages link the **same stylesheet**: `packages/styles/src/index.css` served unmodified
  (the server only rewrites relative `@import` paths so the browser can resolve them; no
  selector is touched).
- `src/capture.ts` drives Playwright (headed Chrome, `reducedMotion: "reduce"` for
  determinism): real hover, real mouse-down active, real click-to-pending with a held promise,
  focus ring, RTL screenshots.
- `src/diff.ts` pixel-diffs web vs react with `pixelmatch` at threshold 0.1.
- `src/capture-storybook.ts` captures the canonical Storybook stories
  (`actions-button--variants/sizes/disabled/icon-only/right-to-left/pending`) from
  `dist/storybook` for anchoring.

## What rendered identically

After harness fixes (below), **every comparison is 0.000% pixel-different**:

| Capture | Pixels differ |
|---|---|
| rest (full page: variants + sizes + states + RTL) | 0 |
| hover | 0 |
| active/pressed | 0 |
| states row (disabled ×5, pending-at-rest, iconOnly) | 0 |
| pending (clicked, spinner visible) | 0 |
| focus ring | 0 |
| RTL — Persian | 0 |
| RTL — Arabic | 0 |

The DOM the CSS sees is identical on both sides: web's `<ui-button>` is `display: contents`,
so `.hashti-button[data-variant][data-size]` on the inner `<button>` matches the same selectors
as React's directly-rendered `<button>`. Attribute snapshot confirms both carry
`data-slot="button"`, `data-variant`, `data-size`, `data-hashti-size-default`, and — while
pending — `data-pending`, `aria-busy="true"`, `aria-disabled="true"`.

**RTL verified in both** — logical-property CSS (`margin-inline-end`, `padding-inline-end`,
`text-align: start`) mirrors correctly with no per-framework work.

## Cracks found and fixed

### 1. THE crack the spike exists to catch — Storybook hover was dead (React side, not web)

**Symptom:** hovering a Storybook Button produced **no** background change, while both harness
pages changed identically (`rgb(39,42,50)` → `rgb(67,71,84)`).

**Root cause:** TICK-000b swept `packages/styles/src/index.css` to ui-sdk vocabulary
(`:hover`, `:active`, `:focus-visible`). But `@hashti/react` ships its **own** `styles.css` —
a pre-sweep RAC-vocabulary duplicate (`[data-hovered]`, `[data-pressed]`,
`[data-focus-visible]`) that ui-sdk never emits. Storybook and the docs app load
`@hashti/react/styles.css`, so every interactive state styled by attribute was dead on the
review surface. The pixel-identical harness result proved the *swept* stylesheet is correct;
the *duplicate* was the bug.

**Fix (`packages/react/src/styles.css`):** replaced the 4,983-line stale copy with a one-line
forward — `@import "@hashti/styles";`. `@hashti/styles` is the single source of truth per
ADR-0002; `@hashti/react` re-exports it so existing `import "@hashti/react/styles.css"` call
sites keep working.

**Cleanup forced by the fix:** deleted the now-orphaned duplicate CSS under
`packages/react/src/` (`components/*/*.css`, `frame.css`, `relay.css`, `layers.css`) and
retargeted `tests/unit/css-architecture.test.ts` to guard `packages/styles/src` (where
component CSS now lives) instead of `packages/react/src`.

**Re-verified in React:** Storybook rebuilt; hover now changes
(`rgb(39,42,50) → rgb(67,71,84)`), matching both harness pages. Docs-site smoke tests
(4 routes, axe-clean) pass — the docs app also loads `@hashti/react/dist/styles.css`.

### 2. Dead CSS surfaced by the retargeted guard — Tag

With the guard pointed at the canonical stylesheet, it flagged `.hashti-filter-tag` and
`.hashti-tag-group` in `packages/styles/src/components/tag/tag.css` — classes with **no
renderer anywhere** (no React component, no docs markup). RAC-era TagGroup/FilterTag CSS
carried in by the sweep. Deleted the dead rules from `packages/styles/src/components/tag/tag.css`;
the `.hashti-tag` rules that the real `Tag` component uses are unchanged.

### 3. Harness-only bugs (not contract cracks)

- Web-side pending spinner was never removed after the promise settled (React unmounts it) —
  added a `.finally()` cleanup.
- Disabled-danger button label mismatch between the two harness pages.

## Screenshot evidence

All in `apps/spike-button/shots/`:

- **Contract pairs (web vs react, all 0px diff):** `web-*.png` / `react-*.png` for
  `rest`, `hover`, `active`, `states`, `pending`, `focus`, `rtl-fa`, `rtl-ar`.
- **Storybook anchors:** `storybook-variants.png`, `storybook-sizes.png`,
  `storybook-disabled.png`, `storybook-icon-only.png`, `storybook-rtl.png`,
  `storybook-pending.png`.
- Diff overlays (empty — zero diff) written as `diff-*.png` when any pixels differ.

## Decision: seed or delete the harness?

**Delete `apps/spike-button/` after the ticket lands; do not seed `packages/web` from it.**

Reasons:

1. **The contract is proven; the harness's job is done.** Its value was the comparison, not
   the code. Keeping it means maintaining a second build + server + capture pipeline.
2. **A real `packages/web` should not look like this.** The spike wraps ui-sdk web components
   by hand in imperative DOM code. A shippable `@hashti/web` would be a thin
   custom-element wrapper layer (variant/size/iconOnly attrs → classes + data-attrs), which is
   a fresh design, not a refactor of this spike.
3. **The capture pattern, however, is worth keeping.** If the team wants a permanent
   cross-framework visual-regression harness, the reusable pieces are `src/capture.ts` +
   `src/diff.ts` (Playwright + pixelmatch against the shared stylesheet). Recommend promoting
   that pattern into `tests/browser/` as a future ticket rather than keeping the throwaway app.

## Verification exit codes

| Command | Exit |
|---|---|
| `bun run build:packages` | 0 |
| `bun test tests/unit packages/react/src` | 0 (124 pass, 4 skip, 0 fail) |
| `bun run build:storybook` | 0 |
| `bun test tests/browser/smoke.test.ts` | 0 (4 pass) |
| `bun src/capture.ts` (harness) | 0, no console errors either side |
| `bun src/diff.ts` (pixel diff) | worst 0.000% |

Pre-existing failures on HEAD, **unchanged** by this spike (out of scope — unmigrated RAC
components): 14 browser tests across `overlays` / `fields` / `navigation` (Sheet, Modal,
Drawer, DatePicker, NumberField, Disclosure). `bun run typecheck` and `bun run lint` also fail
on HEAD independently of this change.

## Notes for future component tickets

- Always verify against `@hashti/styles` (or `@hashti/react/styles.css`, which now forwards to
  it) — never a per-package CSS copy. There is now exactly one.
- ui-sdk state styling is pseudo-class based (`:hover`, `:active`, `:focus-visible`); the
  swept stylesheet in `packages/styles` already reflects this. Any selector still keying on
  `[data-hovered]` / `[data-pressed]` / `[data-focus-visible]` is a bug.
- `data-hashti-size-default` is emitted by the React Button but consumed by no CSS — cosmetic
  hook only.
