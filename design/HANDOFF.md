# Hashti design system — agent handoff

This bundle transfers the Hashti design system to a fresh implementation that
does **not** use React Aria Components (RAC). Everything here is
framework-agnostic except where noted. Read the files in this order.

## 1. The visual authority — `DESIGN.md`

Tokens, type scale, spacing vocabulary, motion ladder, radii, color roles, and
the do/don't rules. It is the single source of visual truth; when code and
DESIGN.md disagree, the code is wrong (unless verification says otherwise —
see §5).

Key frozen facts (from the 19 Nov extraction refresh):

- One theme, three modes: `light` (document default), `dark`, `system`
  (follows `prefers-color-scheme`). Standard `data-theme` attribute.
- Ordinary control minimum **44px**; explicit sizes 32/44/48; buttons 64/80.
- Corners: control 10px, group/popover 14px, dialog 18px, drawer 16px,
  recovery band lower corners 3px.
- Motion ladder: 130 / 175 / 230 / 310 / 410 / 730 ms; entrance
  `cubic-bezier(0.16, 1, 0.3, 1)`; press scale 0.96–0.98, release springs.
- Spacing vocabulary: 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 px, each a
  distinct relationship (inset, related gap, group, region) — not a licence
  to card-wrap regions.

## 2. The CSS architecture — `docs/css-conventions.md`

Cascade layer order (`tokens, reset, components, themes, accessibility`),
`@scope`-based theming, BEM-ish part hooks (`hashti-<component>__<part>`),
state/variant attribute vocabulary (`data-variant`, `data-size`, `data-kind`,
`data-selected`, `data-invalid`, …). One file per component. The RAC-specific
class-preservation rule is obsolete in the new library — every class is yours.

## 3. The interaction spec — `docs/design-system.md` §Principles + §Behavior

This is now the primary checklist for interaction behavior you must implement
yourself. RAC used to own these; the new library owns all of them:

- **Focus**: one full control border + external 2px outline, offset 2px on
  fields / 3px on actions / −2px on overlay close buttons; ring survives
  invalid state and forced colors; focus containment in modals; return focus
  on dismiss; focused content never obscured by fixed headers or overlays.
- **State coexistence**: focus, selection, invalidity, pending co-occur; error
  paint outranks custom selection color; every combination needs an explicit
  recipe (selected + focused, invalid + focused).
- **Recovery**: bounded fields reserve one padded recovery line (58px min / 78px
  ≤24rem); band overlaps the shared edge by 1px; guidance stays visible; never
  clip an error; separate description and error IDs.
- **Read-only vs disabled**: read-only is legible, focusable, copyable, in
  `FormData`, rejects mutation; pending fields are read-only, not disabled.
- **Overlays**: inner-first Escape (Select closes before Dialog), purposeful
  initial focus, matching appearance/locale across portals, overlay grows from
  the edge that touches its trigger.
- **A11y floor**: WCAG 2.2 AA with evidence; 24px target minimum, 44px goal;
  reflow at 320px, 200% text resize; forced colors, reduced motion, coarse
  pointers, no hover-only affordances; axe zero-violations is regression
  evidence, not certification.
- **i18n/direction**: `dir` agreement everywhere including portals; logical
  properties; check marks and media controls do not auto-mirror; `bdi` for
  user-generated direction; localize every authored string.

Recommended companion: the WAI-ARIA Authoring Practices Guide (APG) patterns
for each widget — combobox, listbox, dialog, grid, tabs, menu — as the
behavioral reference RAC was silently implementing.

## 4. The token source — `packages/tokens/src/theme.ts` + `scripts/generate.ts`

The actual values. `theme.ts` holds the authored light/dark palettes and the
working type/geometry scale; `generate.ts` merges them over the frozen
baselines (`src/baseline.ts`, `src/foundations.ts`) and emits `tokens.css` /
`tokens.json`. The generator structure (document default, mode override,
contextual layer aliases with 01/02/03 suffixes, `border-subtle` starting at 00) is worth copying as-is. `bun run build:tokens` regenerates; never hand-edit
generated files.

Open decisions recorded in `docs/design-system-audit.md` §5 still apply
(baseline leaks like `icon-interactive`, `layer-02 ≡ layer-03`, pressed scale
not tokenized) — the new library is the chance to fix them at the source.

## 5. The verification contract — `tests/harness.ts` + `tests/browser/`

How the system is checked: a story id plus expectations, served from a static
build; axe runs with `wcag2a`/`wcag2aa`; geometry assertions (44px targets,
ink contrast, focus rings) read computed styles, not source. Re-point the
selectors that reference RAC classes; keep the assertion style — it is what
kept the system honest. Full verify:

```sh
bun run build && bun run test:browser   # 61 tests / 345 assertions must stay green
```

## 6. What does NOT transfer

- Any RAC knowledge: hooks, contexts, `render` props, `mergeProps`, selection
  APIs, `useSlottedContext`. The new library implements its own.
- `@internationalized/date` and RAC's locale machinery — you own date parsing,
  formatting, and calendar semantics per locale.
- The historical docs (`docs/relay.md`, research notes, phase plans) are
  records of the old implementation, not specs for the new one.

## 7. Working rules (carried over because they earned their place)

- "Clarity before decoration." "One owner for each behavior." "Meaning survives
  change." "Make claims as specific as the evidence."
- Hit target and painted mark are separate. Labels can grow; marks do not
  shrink. Progress must not depend on animation alone.
- Primary actions neutral; focus and selection are blue.
- Generated token files are outputs, not a second place to invent values.
- Source and current verification win over an outdated description.
