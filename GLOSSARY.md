# Hashti

A design system built on ui-sdk, published as packages and demonstrated in a
documentation site, Storybook, and design comparisons.

## Product

**Hashti**:
The design system as a whole: its language, components, tokens and documentation.
_Avoid_: library, kit, UI framework, Cinder

**Frame**:
The selected visual direction of Cinder, chosen on 6 November 2026 after the fourth prototype comparison.
_Avoid_: theme, skin, style guide

**Theme**:
A light or dark appearance of Frame (`frame-light`, `frame-dark`) applied to a root.
_Avoid_: mode, scheme

**Token**:
A named design value (color, type, spacing, radius) that components read instead of literal values.
_Avoid_: variable, constant, primitive value

**Hook**:
A stable class name a consumer targets for customization, in the `hashti-*` form.
_Avoid_: class, selector, override

**Slice**:
A named, ordered group of component work delivered together, such as the fourteen-entry field slice.
_Avoid_: batch, milestone, phase

**Prototype**:
A working comparison of a candidate design, shown at `/prototypes` on fictional review data.
_Avoid_: mockup, demo, experiment

**Framework package**:
One thin per-framework binding of Hashti (`@hashti/react`, later vue, svelte, solid, web
components). Each binds ui-sdk's framework package to Hashti styles; none owns appearance.
_Avoid_: wrapper library, port

**Wrap**:
A Hashti component that binds a ui-sdk component and adds API: variants, sizes, compound
parts, icons. The alternative to re-export, chosen only when Hashti adds surface.
_Avoid_: adapter, HOC, shim

**Re-export**:
A ui-sdk component exported from `@hashti/react` unchanged; Hashti styles target its parts
and state attributes. The default disposition when Hashti adds no API.

**CSS-only**:
A Hashti component with no behavior: a presentational element carrying only a hook and
variant attributes, such as Kbd, Badge, Card, Tag, Table.
_Avoid_: static component, dumb component

**Attribute map**:
The canonical table translating RAC state attributes to ui-sdk state attributes
(`docs/attribute-map.md`), applied to every stylesheet once, in TICK-000b.

## Interaction

**Behavior**:
The keyboard, focus, selection and ARIA rules that make an interaction work, independent of appearance.
_Avoid_: logic, interaction, a11y code

**Primitive**:
A component's behavior definition: its state, its actions, and its parts. It renders nothing on its own.
_Avoid_: behavior component, core component, headless component

**Part**:
One element of a primitive, such as a trigger or a panel, identified by its slot.
_Avoid_: slot, subcomponent, element

**Slot**:
The name a primitive gives a part, which becomes that part's `data-slot`.
_Avoid_: role, key, part name

**Behavior set**:
The reusable behaviors a component is assembled from, such as roving focus or a popup.
_Avoid_: utility, helper, mixin

