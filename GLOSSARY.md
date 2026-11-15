# Hashti

A design system built on React Aria Components, published as packages and demonstrated in a
documentation site, Storybook, and design comparisons.

## Product

**Cinder**:
The design system as a whole: its language, components, tokens and documentation.
_Avoid_: library, kit, UI framework

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

## Agents

**Agent surface**:
What one component offers an agent: the values it exposes and the actions it accepts.
_Avoid_: API, interface, contract

**Bridge**:
The object that finds components on a page, reports them, and performs the actions an agent asks for.
_Avoid_: connector, driver, adapter

**Action**:
A named operation an agent may ask a component to perform, such as `setValue` or `press`.
_Avoid_: command, method, operation

**Mark**:
An attribute that changes what an agent sees or may do: confirm, secret, hidden.
_Avoid_: flag, tag, annotation

**Ref**:
The short identifier a bridge assigns to one component instance in its snapshot.
_Avoid_: id, handle, pointer