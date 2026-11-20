# CSS conventions

The rules this stylesheet follows, and the shape new component CSS must take. They come from the
React Aria styling docs and what this codebase already does. The visual specification itself lives
in [DESIGN.md](../DESIGN.md) at the repo root; this file is about how CSS is organised.

## Two layers

`packages/styles/index.css` is the entry stylesheet. It declares the layer order on line 1 and
assigns every stylesheet to a layer at import time:

```css
@layer hashti.tokens, hashti.components;

@import "../../design/tokens.css" layer(hashti.tokens);
@import "./src/button.css" layer(hashti.components);
```

| Layer               | Owner                            | Contains                                                |
| ------------------- | -------------------------------- | ------------------------------------------------------- |
| `hashti.tokens`     | `design/tokens.css` (generated)  | `--hashti-*` custom properties, per `data-theme` value. |
| `hashti.components` | `packages/styles/src/<name>.css` | Everything a component looks like.                      |

Two layers are all the shipped cascade needs: tokens lose to components by construction, and
theme switching happens inside `hashti.tokens` on `[data-theme="light|dark|system"]`, so there is
no separate themes layer to order.

Planned future layers (reset, motion, coarse pointers, dark elevation, accessibility) exist as an
idea for when `frame.css`-era concerns return; add them to the line-1 order statement first if one
ever ships. Never add a layer without adding it to that ordered list first. `!important` is not a
layer.

## One file per component

Component styling lives in `packages/styles/src/<name>.css` and must be imported from
`packages/styles/index.css` under `hashti.components`. A stylesheet that nothing imports is
invisible.

## Class contract

`hashti-<block>` for the component root and simple parts, `hashti-<block>__<element>` for the
elements of a compound part. Every part also carries ui-sdk's `data-slot`, which is additive and
never renamed.

Modifiers are attributes, never class suffixes. There is no `hashti-button--primary`:

```
data-variant="primary|secondary|tertiary|ghost|danger"   data-size="sm|md|lg"   data-kind="info|success|warning|error"
```

## Styling state

State comes in two kinds, and the stylesheet keys on both where both exist:

- **ui-sdk data attributes** — React Aria supplies `data-hovered`, `data-pressed`,
  `data-focus-visible`, `data-selected`, `data-disabled`, `data-open`, `data-invalid`,
  `data-pending`, `data-entering`/`data-exiting`. Do not re-implement them with CSS pseudo-classes.
- **Plain pseudo-classes** — shipped _alongside_ the attributes so the class contract also works
  without a runtime (a future Vue/Svelte wrapper or plain HTML).

The shipped pattern for hover on interactive controls guards the pseudo-class so touch devices
never get sticky hover paint, with the attribute additive:

```css
@media (hover: hover) {
  .hashti-button[data-variant="primary"]:hover:not([data-disabled]) { … }
}
```

`link.css` ships both forms unguarded (`:is(:hover, :active)` plus `[data-hovered]`/
`[data-pressed]`) because a link's hover feedback is text decoration, not a fill.

Keyboard focus is the only thing that paints a ring, always on `:focus-visible` /
`[data-focus-visible]`, `2px` at `2px` offset (action controls `3px`), and never as a `box-shadow`
glow.

Composite group controls — a wrapper whose whole surface answers while an inner control holds
keyboard focus — use `:has(:focus-visible)`. `password-input`, `number-input`, `otp-input`,
`combobox`, and `slider` are the reference (`password-input` scopes its `:has` to the control's
class, the others use the bare pseudo-class).

## Values come from tokens

- Colours, spacing, radii, durations and type roles are `var(--hashti-*)`. A raw non-color value in
  a component stylesheet is a bug; a hex value is a bug unless it is a documented legacy fallback.
- Component CSS may target only `hashti-*` class names and ui-sdk's data attributes (`data-open`,
  `data-selected`, `data-highlighted`, `data-invalid`, …) and `data-slot`. No React DOM specifics,
  no inline-style contracts, no JS-in-CSS coupling — `@hashti/styles` must stay usable verbatim by
  future Vue/Svelte packages.
- Durations come from the ladder: `--hashti-duration-fast-01` (130ms), `fast-02` (175),
  `moderate-01` (230), `moderate-02` (310), `slow-01` (410), `slow-02` (730).

## Consumers styling our parts

Consumers style `[data-slot="…"]` when they need anatomy without depending on our class names.
`data-slot` is additive: it never replaces a class.

## Known proposal: invalid state keys on `data-invalid` only

CSS should key invalid state on `[data-invalid]` only. Wrappers own the mapping from
`aria-invalid` to `data-invalid`, so a plain HTML consumer sets one attribute and both the
a11y tree and the stylesheet agree. Deferred: the React wrappers don't do this mapping yet, and
adding it is React work, not CSS work. Until then component CSS keys on whatever ui-sdk emits.

## Status

Every shipped component has its stylesheet in `packages/styles/src/` and is imported from
`packages/styles/index.css`. `design/tokens.css` is generated — edit
`packages/tokens/src/frame.ts` and rebuild, never the output.
