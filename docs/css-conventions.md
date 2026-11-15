# CSS conventions

The rules this stylesheet follows, and the shape new component CSS must take. They come from the
Modern Web Guidance `css` guide (retrieved 2026-11-13), the React Aria styling docs, and what this
codebase already does. `bun test tests/unit/css-architecture.test.ts` enforces the mechanical parts.

## Layers, in this order

`styles.css` declares the layer order once and every stylesheet contributes to it.

| Layer                   | Owner                 | Contains                                                                                             |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| `hashti.reset`          | `styles.css`          | box-sizing, font inheritance, selection, `[hidden]`. Theme-root scoping only — no bare `*` selector. |
| `hashti.themes`         | `frame.css`           | Frame tokens per theme, inside `@scope (theme) to (theme)`.                                          |
| `hashti.components`     | component stylesheets | Everything a component looks like.                                                                   |
| `hashti.motion`         | `frame.css`           | Entry/exit keyframes and reduced-motion overrides.                                                   |
| `hashti.coarse`         | `frame.css`           | Pointer: coarse adjustments (44px targets).                                                          |
| `hashti.dark-elevation` | `frame.css`           | The few places dark mode needs different depth, not different ink.                                   |
| `hashti.accessibility`  | `frame.css`           | Reduced motion, forced colours, screen-reader-only helpers.                                          |

Never add a layer without adding it to that ordered list first. `!important` is not a layer.

The order statement must be the **first** thing in the entry stylesheet. `styles.css` imports
`layers.css` on line 1 for that reason: a component file that opens `@layer hashti.components`
before the statement defines the order instead, and the reset ends up outranking components (this
happened, and cost a week of tooltip-contrast confusion before anyone noticed).

A portal that carries `data-hashti-theme` itself is both the `@scope` root and the `to (...)` limit,
so scoped theme rules never reach it. Declare the few properties such a surface needs (surface and
inverse ink) unscoped, from tokens, as the tooltip does.

## One file per component

Component styling lives in `packages/react/src/components/<name>/<name>.css` and must be imported
from `styles.css`. A stylesheet that nothing imports is invisible, which is how eight of them rotted
in place until the 2026-11 review deleted them.

Shared parts that several components need (the field anatomy, the popover surface) stay in
`frame.css` under `hashti.themes` with the same `@scope` wrapper.

## Selectors express intent

- Style the component's own class. Do not style `react-aria-*` classes from a component file; those
  belong to the theme layer, and a wrapper that overrides `className` deletes them (see AGENTS.md).
- Use `:is()` / `:where()` instead of duplicating a rule for variants or states.
- Exclude instead of overriding: `[data-hovered]:not([data-disabled])`, not a second rule that
  undoes hover. Order must not change the result.
- Physical properties only when the value should not flip: `left`/`right` in a full-bleed overlay is
  fine; `padding-left` on a field is not.
- No new global resets. If a reset is unavoidable, scope it to `[data-hashti-theme]` and a specific
  element type.

## States and variants are attributes

Every part exposes its variant on the DOM, and CSS keys on that attribute:

```
data-variant="primary|secondary|ghost|danger"   data-size="sm|md|lg"   data-kind="info|success|warning|error"
```

React Aria supplies the interaction states (`data-hovered`, `data-pressed`, `data-focus-visible`,
`data-selected`, `data-disabled`, `data-entering`/`data-exiting`). Do not re-implement them with
CSS pseudo-classes.

Keyboard focus is the only thing that paints a ring, always `2px` at `2px` offset (action controls
`3px`), and never as a `box-shadow` glow.

## Values come from tokens

- Colours, spacing, radii, durations and type roles are `var(--hashti-*)`. A hex value in a
  component stylesheet is a bug unless it is the documented fallback for a legacy theme.
- Durations come from the ladder: `--hashti-duration-fast-01` (130ms), `fast-02` (175),
  `moderate-01` (230), `moderate-02` (310), `slow-01` (410), `slow-02` (730).
- A token is one kind of value. `--hashti-shadow` is a colour, so it may only appear _inside_ a
  shadow (`0 8px 24px var(--hashti-shadow)`), never as the whole value — dark overlays lost their
  shadow that way once.

## Anatomy hooks

Compound parts carry a stable slot name in addition to their class:

```
data-slot="root" | "label" | "control" | "description" | "error" | "item" | "icon" | "close"
```

Consumers style `[data-slot="…"]` when they need anatomy without depending on our class names.
`data-slot` is additive: it never replaces a class.

## Migrating a component out of the monolith

`frame.css` still carries most component rules inside `hashti.themes`. Moving one component at a
time is safe if the enclosing wrappers come along, because layer order and `@scope` proximity decide
the cascade, not file order:

1. Cut the component's rule blocks out of `frame.css` (they live inside
   `@layer hashti.themes { @scope (theme) to (theme) { … } }`).
2. Paste them into `components/<name>/<name>.css` inside the _same two wrappers_.
3. Confirm the stylesheet is imported by `styles.css` (the guard test enforces this).
4. Verify: the component's computed colours, radius, spacing and focus ring must be unchanged. Tag
   was migrated this way — background, 28px pill, 24px remove target and the 2px/3px action ring all
   measured identical before and after.

Once migrated, the same selector must not survive in `frame.css` or `styles.css`; that duplication is
what made the 2026-11 review expensive.

## Status

Migrated: `tag`. Deleted as dead (no renderer): `autocomplete`, `preview-trigger`, `list-box`,
`command-palette`, `table`, `sheet` stylesheets. Remaining components still take their rules from
`frame.css`; the guard test keeps new debt from appearing while they move.
