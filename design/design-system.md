# Hashti design system

**6 November 2026 · Frame specification · code-first.** Frame is Hashti's selected
visual direction. This specification defines how that direction becomes a usable,
accessible, internationalized, and customizable component system. The
[ordered implementation plan](component-library-plan.md) turns these requirements
into library work: **components + Storybook first, documentation website next,
Figma last**.

## 1. Authority and implementation status

| Artifact                                                    | Responsibility                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| [PRODUCT.md](PRODUCT.md)                                    | People, goals, constraints, and selected direction                         |
| [DESIGN.md](../DESIGN.md)                                   | Frame's visual language and measured values                                |
| This specification                                          | Component, interaction, content, inclusion, and customization requirements |
| [Library plan](component-library-plan.md)                   | Dependencies, implementation order, acceptance conditions, and migration   |
| [Coverage](coverage.md) and [verification](verification.md) | What the packages actually implement and what has been checked             |
| [Prototype guide](prototypes-guide.md)                      | Working comparison tasks and their bounded evidence                        |
| Research reports                                            | Rationale and versioned source observations                                |

**Phase 1 foundations and styling contracts are complete.** The user approved
native prebuilt CSS, the single `light` / `dark` theme, Frame's 44px default,
and `Theme appearanceClassName` on 6 November 2026. `system` follows `prefers-color-scheme`. The remaining component and
inclusion requirements below are the target for the later library slices;
foundation work alone does not complete the Frame catalog. See the
[Phase 1 verification](verification.md#frame-phase-1) for executed evidence.

Phase 2 develops the actual packaged components with Storybook as their working
review surface, starting with Button and Link, then fields and form recovery.
Component stories and README/API contracts grow together through the remaining
slices. The full documentation website follows the component work in Phase 6;
Figma follows in Phase 7.

| State         | Established today                                                                                          | Remaining library work                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Direction     | User-selected Frame; Astryx leads visual references, HeroUI v3 informs visuals and DX                      | Apply that language consistently across the catalog                                              |
| Foundations   | Frame semantic tokens, type/geometry roles, additive light/dark themes, and scoped CSS                     | Apply and verify the roles across the remaining families                                         |
| Components    | Existing RAC wrappers, eight themes, 45 catalog entries; Frame foundation hooks and a verified Relay slice | Phase 2 field anatomy, persistent guidance, attached recovery, and complete fourteen-entry slice |
| Interaction   | Portable appearance/language bridge, Modal part access, and representative installed consumers             | Complete Frame settings/submission journeys and each later family's behavior matrix              |
| Inclusion     | Bounded Chromium, keyboard, responsive, axe, and live locale/portal evidence                               | Manual AT, cross-browser, zoom, devices, real IME, translation, and representative users         |
| Design assets | Code, reference captures, written decisions                                                                | Editable Figma assets only after the implemented system is settled                               |

For implemented facts, source and current verification win over an outdated
description. For intentional visual changes, update the authored code, DESIGN.md,
its sidecar, and affected examples together. Generated token files are outputs,
not a second place to invent values.

## 2. Principles that affect implementation

1. **Clarity before decoration.** Make the purpose, state, and next action easy to
   find. Group related content with alignment and spacing before adding containers.
2. **Useful defaults, reachable parts.** An ordinary labeled field should be short
   to write. Styling or composing its meaningful parts should not require copying
   the component's behavior.
3. **One owner for each behavior.** RAC and native elements own primitive interaction.
   Hashti owns correct composition and appearance. Applications own domain rules,
   authorization, persistence, and request lifecycle.
4. **Meaning survives change.** Themes, custom classes, long text, narrow screens,
   and input methods must preserve names, state, focus, relationships, and recovery.
5. **Feedback stays with the task.** Field errors belong to fields; save failures
   belong to the form. Keep entered data and provide a usable next step.
6. **Maintain one system.** Reuse the existing packages, token generator, RAC model,
   catalog, and package-consumer verification. Extend the responsible module.
7. **Make claims as specific as the evidence.** A live example, an automated scan,
   a manual evaluation, and complete support are different levels of evidence.

Impeccable's document, operate, shape, extract, and hardening guidance informs this
specification: familiar task controls, a restrained visual vocabulary, explicit
anatomy, progressive extraction, and real-content checks. The selected Frame
direction takes precedence over generic style defaults.

## 3. Foundations

### Color and surfaces

Use the paired light/dark roles in DESIGN.md. The visual hierarchy is canvas →
ordinary surface → contextual surface → temporary overlay. Contextual layer level
is not z-index or shadow strength. Preserve `Theme` resetting the layer and `Layer`
advancing it through the existing bounded levels.

Primary actions are neutral; focus and selection are blue. Error, warning, and
success use their own paired colors and text. Focus, current location, selection,
invalidity, and pending work can coexist. Every relevant combination needs an
explicit recipe, including selected + focused and invalid + focused.

Selected opaque color-pair arithmetic, using the WCAG sRGB luminance method:

| Pair                           |   Light |    Dark | Intended use                    |
| ------------------------------ | ------: | ------: | ------------------------------- |
| Main text / surface            | 14.94:1 | 13.87:1 | Ordinary reading                |
| Muted text / surface           |  5.75:1 |  7.64:1 | Guidance and secondary text     |
| Text on primary / primary      | 14.35:1 | 13.87:1 | Primary action                  |
| Focus blue / surface           |  5.91:1 |  8.43:1 | Focus and links on this surface |
| Control border / surface       |  3.62:1 |  4.13:1 | Editable boundary               |
| Error text / error surface     |  5.90:1 |  7.38:1 | Attached recovery               |
| Warning text / warning surface |  6.40:1 |  7.37:1 | Attention                       |
| Success text / success surface |  6.14:1 |  7.75:1 | Result feedback                 |

These calculations have black/white and identical-color self-checks. They do not
cover every rendered state, translucent composition, custom theme, or WCAG
criterion. Divider colors are for grouping, not sufficient substitutes for an
interactive boundary.

### Typography, spacing, and density

- Use DESIGN.md's system-font roles. The working body is 14/21px, field values
  16/24px, labels 14/20px at weight 600, and guidance/recovery 13/20px. These are
  baseline working metrics; longer reading surfaces can use a larger body recipe.
- Express library type and minimum geometry in scalable units where appropriate.
  Preserve zoom and text resizing; do not enforce screenshot heights by clipping.
- Reuse the small spacing vocabulary. Component inset, related-part gap, group
  spacing, and region separation serve different relationships.
- The chosen comfortable control is 44px with 10px corners. Group/popover corners
  are 14px and dialog corners 18px. The prototype deliberately maps all ordinary
  sizes to 44px; that is not a reusable size API.
- Frame sizing: `sm` 32px, `md` 44px, `lg` 48px; omitted ordinary Buttons and
  size-bearing fields use 44px. Explicit Button `xl` / `2xl` stay 64/80px. Older
  themes keep their 48px omitted Button and 40px medium-field defaults. These are
  scalable minimum control sizes, not a fixed-height rule for all component types.
- Hit target and painted mark are separate. A small check mark can sit in a larger
  label target. Aim for 44px targets in ordinary forms and coarse-pointer use;
  document and test intentional compact cases. Current checkbox/switch targets
  and embedded controls have not all met that stronger goal.

### Shape, icons, depth, and motion

Use a one-pixel full control border and an external two-pixel focus outline. The
prototype offsets focus by two pixels on fields and three on actions. Preserve
the visible outline on an invalid control and in forced colors.

Reuse `Icon` and the current icon vocabulary. Icons normally inherit `currentColor`;
decorative icons stay out of the accessible name. Keep a consistent visible scale
and align icons with the relevant text line. Directional arrows follow reading
direction when their meaning does; check marks, media controls, and logos do not
automatically mirror.

Use opaque surfaces, restrained popover elevation, and the modal backdrop from
DESIGN.md. Reuse the installed productive motion tokens for state transitions.
Reduced motion removes travel, pulsing, and nonessential transitions while keeping
visible pending/focus/status cues. Progress must not depend on animation alone.

## 4. Shared interaction contract

| State                        | Visible and behavioral requirement                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Default                      | Purpose, value, and available action are understandable without hovering                            |
| Hover                        | A small response on enabled controls; no movement of surrounding content                            |
| Pressed                      | Immediate feedback without changing the control's meaning or hit target                             |
| Focus-visible                | A distinct indicator on the actual active control; visible over error/selection                     |
| Selected / mixed / current   | Correct checked/selected/current semantics plus an identifiable visual signal                       |
| Invalid                      | Associated recovery text and invalid semantics; retain applicable instructions                      |
| Read-only                    | Legible and copyable where the control supports it; no mutation                                     |
| Disabled                     | Unavailable interaction and correct native/ARIA semantics; explain dependencies nearby              |
| Pending                      | Prevent repeat activation, retain useful focus, announce the operation, preserve content dimensions |
| Success                      | Confirm the completed task without stealing focus or coloring every valid input                     |
| Empty / failed / unavailable | Explain the state and a relevant next action; preserve drafts and recoverable state                 |

Only applicable states belong to a family: a static tag does not need a pending
state, and Select must not acquire a fake read-only prop. Use normal text for a
noneditable selected value when the primitive has no read-only behavior.

Use `onPress` for actions and upstream typed value callbacks for state. Do not
substitute click-only behavior or make state styling drive application state.
RAC emits the actual interaction attributes; pinned visual specimens must be
identified as specimens and accompanied by live controls.

## 5. Fields, forms, and validation

### Default anatomy

```text
Field root — value, name, validation and disabled/read-only ownership
  Label + visible required/optional wording where useful
  Description — instructions that remain relevant while editing
  Control or control group — native input, trigger, or related choices
  Error — associated recovery text, when invalid
```

The reusable Frame defaults establish this reading and DOM order through shared
`FieldLayout`; guidance stays visible when errors appear. The four Relay
themes retain label → control → help/error and their error-replaces-description
behavior. Replacement children retain their authored order. Keep RAC `Label`,
description and error slots, IDs, native controls, and ref connections intact.

Callable conveniences remain supported. Twelve additive field namespaces expose
`.Root`, `.Label`, `.Description`, `.Help`, `.ErrorMessage`, and their family-specific
parts with RAC/native props and actual refs. `.Root` inserts no convenience anatomy;
RAC owns relationships, validation, values, events, and state. The
[package contract](../packages/react/README.md#additive-compound-namespaces) lists
every part and target. Grouped, collection, and date namespaces establish shared
API compatibility only; they do not complete those families' later Frame reviews.

| Part                | Rule                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Label               | Visible, sentence case, concise; clicking it reaches the control when supported                                    |
| Required indication | `isRequired` supplies behavior; visible wording is localizable, never a substitute for programmatic required state |
| Description         | Necessary format, limit, or consequence before entry; an example is not the label                                  |
| Control             | Readable value, caret and focus; preserve paste, autofill, password managers, and IME                              |
| Recovery            | What needs changing and, when useful, an example; text remains available until resolved                            |
| Supporting icon     | Reinforces meaning without duplicate screen-reader announcements                                                   |

The attached band applies to a single bounded control or control group. A checkbox
or radio group gets associated group-level guidance and recovery; it should not
look like every individual choice is a broken text input. Warning and success
messages can use semantic feedback recipes when a real task needs them; only the
error band is established as Frame's current field treatment.

### Validation and recovery

- Start with native/RAC submit validation: input types, `isRequired`, bounds,
  `validate`, and useful errors. Focus the first invalid control on failed submit.
- An application using `validationBehavior="aria"` owns validation timing and
  invalid state. Avoid showing errors on untouched fields while the person is
  still entering a valid value. Clear or update a displayed error when its cause
  is corrected according to that form's policy.
- Keep instructions visible alongside errors. Use separate description and error
  relationships; do not replace one ID with another merely to match the layout.
- Reserve expected recovery space in stable form layouts. Bounded Frame controls
  reserve one padded recovery line. The Form recipe increases required-field
  minimums to 58px in wider containers and 78px at or below 24rem; its 24px side
  padding places the tested viewport boundary at 432/433px. These are recipe
  budgets, not fixed heights or a promise of zero motion for arbitrary recovery
  text. Extra text must grow rather than clip; optional notes retain their values
  and do not acquire unrelated errors.
- Keep validation errors local. Put service/save errors above or beside the commit
  actions with a retry path. Preserve the draft; say whether anything was saved.
- Map server field errors through Form's existing validation contract. The server
  still validates and authorizes the mutation; frontend validity is not authority.
- Use a status announcement for save progress/completion and an appropriate alert
  for a consequential failure. Avoid announcing the same message through several
  live regions and focus changes at once.
- Pending submission uses Button's focus-retaining pending behavior with a
  localized `pendingLabel`. Form recipes keep fields read-only, not disabled, so
  their values remain selectable, copyable, and included in native FormData. RAC
  changes pending Save from native `submit` to `button`; the application also
  guards in-flight submission. `onSubmit` preserves the draft and takes a fresh
  FormData snapshot; service failure and retry stay application-owned. The
  historical prototype's disabled Save/field combination is not this contract.

Use a checkbox for a preference committed by Save. A switch normally applies its
change immediately. The prototype's summary switch currently changes a draft and
preview before Save; the reusable example should use the appropriate control or
make that deferred-save behavior explicit.

## 6. Component families and task patterns

The [45-entry catalog](coverage.md#what-the-number-45-means) is the inventory, not
a claim that every variant is complete. Additional primitives do not inflate that
count. Each promoted family must document its applicable states and exceptions.

Frame Button recommends four treatments: `primary`, `secondary`, `ghost`, and
`danger`. Keep the neutral primary, quiet secondary fill, Frame palette, and
control corners. Destructive actions use explicit wording. The existing
`tertiary`, `danger-tertiary`, and `danger-ghost` treatments remain compatible.

| Family                           | Choice and behavior contract                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button / Link                    | Button performs an action; Link navigates. Use one primary action per decision, explicit destructive wording, localizable pending and icon-only names                                            |
| Text / number / search           | Choose the value model deliberately. Text returns a string; NumberField uses localized numeric editing; search has a clear action and query-state ownership                                      |
| Checkbox / radio / switch        | Independent/mixed choices, one-of-many, and on/off setting respectively. Group labels and descriptions remain associated; label target exceeds the painted mark                                  |
| Select / ComboBox / NativeSelect | Closed set, editable query, or native platform selection. Keep collection keys distinct from labels, rich-option `textValue`, disabled skipping, and single/multiple value types                 |
| Slider                           | Label every thumb, expose formatted values, support keyboard and pointer, retain bounds/order, and provide a non-drag input alternative when the task requires precise entry                     |
| Date / time / calendar           | Preserve typed date values, locale/calendar/time-zone meaning, segments, range endpoints, unavailable dates, and nested calendar focus                                                           |
| Menu / overflow / tooltip        | Menu contains actions; tooltip explains a trigger and remains noninteractive. Essential instructions are visible. Interactive supplementary content needs the appropriate popover/dialog pattern |
| Dialog / modal / popover         | Named task, purposeful initial focus, containment when modal, reachable actions, inner-first Escape, return focus, scrolling, and matching portal appearance/locale                              |
| Tabs / switcher / accordion      | Tabs own panels; ContentSwitcher retains its radio-group model; accordion headings and expansion have meaningful structure. Do not style navigation as tabs without panel semantics              |
| Table / grid list / tree         | Declare the actual grid/treegrid keyboard model, row names, selection scope, sorting, and action access. Preserve important data and relationships through responsive changes                    |
| Pagination                       | State whether paging is local/server-owned and what a count means. Announce results appropriately; define empty and stale-page normalization                                                     |
| Tag / list / tile / structure    | Distinguish static meaning from interactive selection/removal. Use semantic lists and description lists; a surface is not automatically an interactive card                                      |
| Notifications / toast            | Critical recovery persists near the task. Passive acknowledgement avoids focus stealing. Timing, dismissal, queue, and live-region behavior are documented; Toast remains experimental           |
| Loading / skeleton / progress    | Identify what is loading, preserve useful content, expose determinate progress only when known, and keep skeleton decoration out of the accessibility tree                                       |
| Files                            | Local selection, validation, and removal are component work. Transfer, server validation, retry, cancellation, and request errors are application work unless explicitly added later             |
| Shell / breadcrumb / code        | Landmarks, current destination, skip path, mobile navigation and focus; code remains selectable, copy reports success/failure, and technical values remain complete                              |

### Canonical compositions

1. **Settings:** labeled fields, read-only identifier, dependent preference,
   required validation, summary, Save, pending, failure/retry, and success.
2. **Review workspace:** search + status filter + sort, explicit page selection,
   table/list, bulk action, pagination, no-results reset, loading, and failed-load
   recovery. Keep query/selection state predictable when the view changes.
3. **Nested editing task:** named dialog, Select popover, validation, Cancel/Save,
   inner-first dismissal, focus return, and consistent theme/locale across portals.

These are evidence fixtures and documentation recipes. Review-specific models,
summary business rules, and a global application shell stay outside the generic
component package. A responsive table recipe must preserve value labels and
actions; hiding important columns is not sufficient adaptation.

### AI-related guidance

Hashti currently has no AI label or
AI-specific component variant. For a future actual AI-assisted task:

- Identify generated or suggested content at its point of use, with text rather
  than a decorative sparkle as the only explanation.
- Make the origin, available sources, and limits of an explanation discoverable.
  Do not imply that an explanation proves accuracy or that a score is calibrated
  unless the product establishes that meaning.
- Preserve the person's draft; make accept, edit, dismiss, and undo actions clear
  where they apply. Long-running work has meaningful progress/cancel/error states.
- Keep announcements bounded and keyboard access complete. Support ordinary
  non-AI entry when the workflow offers it.

Implement a dedicated AI component only against a real task and its acceptance
criteria; token availability alone is not component coverage.

## 7. Developer experience and composition

### Preserve the existing model

Keep React Aria's controlled/uncontrolled patterns and value shapes. Use
`defaultValue` / `defaultSelected` for internal state and the corresponding
controlled prop plus callback when the application owns it. Keep `Key`, key sets,
strings, numbers, booleans, and native DOM events distinct. Hashti does not need
a new event wrapper to make those contracts appear uniform.

The current practical API is:

| Component                 | Value / action                               | `className`, `style`, and ref target today                                                                                                      | Meaning of `children`                              |
| ------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Button                    | `onPress`; `isPending` with `pendingLabel`   | Button element; wrapper retains its class                                                                                                       | Action content, including upstream render function |
| TextField / TextArea      | String `value` / `defaultValue` / `onChange` | Field root; `inputRef` reaches input/textarea                                                                                                   | Replaces convenience anatomy                       |
| NumberField               | Numeric value and localized editing          | Field root                                                                                                                                      | Replaces convenience anatomy                       |
| SearchField               | Query value; upstream search/clear behavior  | Field root; existing `inputProps` reaches Input                                                                                                 | Replaces convenience anatomy                       |
| Checkbox / Radio / Switch | Boolean or group-owned selection             | Label root; the native input owns actual focus                                                                                                  | Label content inside fixed control anatomy         |
| Select / ComboBox         | Typed single/multiple value and collection   | Field root; trigger/value/popover are currently fixed                                                                                           | Options, not replacement field anatomy             |
| Popover                   | Upstream overlay state and placement         | Portalled popover root                                                                                                                          | Popup content                                      |
| Modal                     | Upstream open/dismiss state                  | Class/ref reach inner Modal; `style`/`render` reach ModalOverlay; `modalStyle`, `overlayClassName`, and `overlayRef` provide independent access | Inner content; dialog semantics are composed       |
| Dialog                    | Upstream dialog contract                     | Dialog element                                                                                                                                  | Title, body, and actions                           |
| Direct RAC exports        | Exact upstream contract                      | Supplying a class can replace the default `react-aria-*` hook                                                                                   | Family-specific upstream composition               |

Source owners: [fields](../packages/react/src/fields.tsx),
[selection](../packages/react/src/selection.tsx),
[overlays](../packages/react/src/overlays.tsx), and
[exports](../packages/react/src/index.ts).

### Target contract for promoted components

- Document each real root and meaningful part: element, ref, class, style,
  relationship slots, state attributes, and exposed semantic variables.
- Keep useful convenience props. A composed version should use the same
  behavior-bearing parts and preserve the short default path.
- Hashti-owned wrapper hooks survive custom classes. Raw RAC re-exports retain
  their exact upstream class-replacement contract: explicitly retain their
  `react-aria-*` class when keeping Hashti styling. Label/Text accept string
  classes; Input/FieldError and other stateful primitives support their own
  upstream render functions. Do not assume all parts have the same state shape.
- Preserve existing hook names and ref targets. Resolve exceptions such as Modal's
  split targets through additive named part access before deprecation; do not
  silently retarget an existing prop.
- Pure appearance needs tokens and selectors. Independently rendered, named, or
  referenced anatomy may need an exported part. Do not add a universal nested
  `overrides` object, a slot-prop dialect, and a second compound API for the same job.
- `slot="description"`, `slot="label"`, and `slot="close"` are behavior contracts,
  not stylistic aliases for BEM names. Custom rendering retains supplied handlers,
  IDs, refs, native inputs, and collection semantics.
- Preserve plain React/TypeScript imports and one CSS import. Examples must work
  from the packed package with strict declaration checking and no workspace aliases.

## 8. Styling and customization

**Approved contract: native prebuilt CSS, semantic CSS variables, stable BEM-style
names, RAC states, native nesting, cascade layers, and scoped themes.** Import
`@hashti/react/styles.css` once for tokens and component/theme styles. Consumption
does not require a Hashti compiler or styling runtime.

| Choice                 | Role and tradeoff                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native CSS + variables | Implemented foundation: ordinary browser CSS, no consumer compiler requirement, direct theming and devtools inspection                                                |
| BEM-style naming       | Stable block/part identity alongside existing `hashti-*` hooks; punctuation alone does not create encapsulation or accessibility                                      |
| Sass                   | Can compile authoring conveniences, but adds little to the current token generator, native nesting, and custom-property model                                         |
| Tailwind               | Optional in applications. Generate utilities there and document cascade/preflight interaction; do not require it to consume Hashti                                    |
| StyleX                 | A different compiler, style-authoring API, and integration contract. The current task does not justify that migration; any future choice needs its own consumer proof |

### Naming, states, and ownership

Use `.hashti-button`, `.hashti-field`, `.hashti-input-group`, and existing useful
part hooks. Default field anatomy adds `.hashti-field__label`, `__control`,
`__help`, `__description`, and `__error`; Select adds `.hashti-select__value` and
`__listbox`. The existing classes remain alongside them. These hooks identify
real elements: `__control` is the bordered input, compound Group, Select trigger,
or standalone DateInput. It is not a new wrapper or a relationship slot.

The twelve shared label/help callers retain their current reading order and
help/error presentation in Phase 1. Phase 2 changes the Frame default anatomy.
Custom composition remains caller-owned; the [React guide](../packages/react/README.md)
shows explicit raw-part hooks and root/control refs.

Use `data-variant` and `data-size` for appearance choices, RAC `data-hovered`,
`data-pressed`, `data-focus-visible`, `data-selected`, `data-indeterminate`,
`data-invalid`, and related attributes on their actual owners for state. Not every
attribute exists on every family. Native inputs may use `:focus`, `:disabled`,
and `:read-only`; focus-within belongs to a compound group.

TextField's root owns required/invalid/disabled/read-only states, while its Input
owns focus/hover. FieldError receives validation results but does not emit its
own `data-invalid`; style the error hook or use the field's invalid state.

### Token structure

1. **Authored foundations:** a small vocabulary for spacing, type, geometry, motion,
   and palette values. Keep the present generator and typed/JSON exports.
2. **Semantic roles:** surfaces, foregrounds, interaction boundaries, action,
   focus, selection, and feedback. Values change by theme; meaning does not.
3. **Component recipes:** compose those roles. Publish a component variable only
   when it supports a real customization need, not every intermediate calculation.

Extend existing semantic names where they already express the role. In particular,
reuse `background`, contextual `layer` / `field` / border aliases, `text-primary`,
`text-helper`, `button-primary`, `focus`, and `support-error`. New paired feedback
surface roles should be added once in the token owner if the current vocabulary
cannot express them. DESIGN.md's descriptive keys are not parallel runtime tokens.

### Cascade and overrides

The stylesheet has one top-level `hashti` layer, with sublayers in this order:
`tokens`, `reset`, `components`, `themes`, `accessibility`. Phase 1 consolidates the
formerly unlayered tokens and separate Relay layers. Applications that ordered
the old layer names should place `hashti` instead; token overrides that formerly
lost to unlayered generated CSS now follow the normal documented cascade.

A Tailwind application can place the library deliberately:

```css
@layer theme, base, hashti, components, utilities;
@import "tailwindcss";
@import "@hashti/react/styles.css";
```

For normal declarations, later layers win before specificity; unlayered app rules
win over layered library rules. Within one layer, specificity and then source
order apply. Class order in JSX does not set priority. Inline declarations,
animations, transitions, and important declarations have their own cascade rules;
important layer order reverses. Preserve narrow accessibility essentials rather
than recommending `!important` as the normal override path.

Set a token override on the element that owns its declaration or an appropriate
theme recipe. A child declaration beats an inherited value regardless of the
parent selector's specificity. Low specificity is useful, but it cannot solve
inheritance or portal ownership by itself.

### Theme, language, and portals

React context crosses a portal; DOM inheritance follows its physical parent.
`Theme appearanceClassName` establishes a portable class recipe on the Theme root
and the appearance-bearing roots of Popover, ModalOverlay, Tooltip, and ToastRegion.
Omission inherits the nearest recipe, a supplied string replaces it, and `""`
clears it. Layer carries the same recipe. Ordinary `className`, `style`, IDs, and
arbitrary props stay on their original element. Define portable variables on the
recipe itself rather than relying on an unrelated DOM ancestor.

The bridge carries theme, layer, effective HTML language, and locale-owned direction.
Theme computes language as `lang ?? locale`, including explicit `lang=""`. A
nested Theme without `lang` recomputes it from its effective RAC locale; its omitted
theme still means `white` and its layer resets to zero. Popover, Modal, and Tooltip
can override bridged language with their own `lang`, including an empty string.
Theme changes update open portals. Toast appearance belongs to ToastProvider,
not the component that enqueues a message.

Use Theme for a locale boundary that must travel through successive portals.
Layer's native `lang`/`dir` and ordinary HTML overrides are DOM-local; a raw
I18nProvider nested inside Theme does not update that Theme's DOM metadata.

An in-scope portal host is an advanced inheritance option only after checking
clipping, stacking, transformed ancestors, modal background hiding, and focus.
Document exactly which values cross the default bridge. A consumer's arbitrary
inline override does not become portable merely because it is a CSS variable.

Built-in Frame and Relay recipes use native `@scope` and stop at nested Theme
boundaries. Native nesting, cascade layers, and `@scope` support are required;
the current execution matrix is Chromium. A custom appearance recipe intentionally
inherits until replaced or cleared. Scope limits selector matching, not custom
property inheritance; theme-varying foundations are resolved at each theme boundary.

Raw RAC selector groups are limited to `[data-theme]`. Neighboring RAC
controls outside that boundary and unrelated generic `data-size` elements keep
their own styling. Inside the boundary, a direct RAC import is indistinguishable
from the same raw part re-exported by Hashti.

### Supported consumer recipes

Plain CSS, real CSS Modules, and a pinned Tailwind 4.3.5 preflight/utility consumer
are the Phase 1 proof paths. Emotion and styled-components can supply classes, but
complete integration claims require their own prop/ref, insertion-order, portal,
and SSR proof. A behavior-only/headless distribution is a separate commitment;
omitting all CSS can also remove essential visually hidden treatment.

## 9. Accessibility and internationalization

### Accessibility requirements

Target WCAG 2.2 AA with specific evidence. Maintain accessible names, labels,
descriptions, errors, roles, state, landmarks, and heading order. Keyboard behavior
comes from the chosen primitive, including its documented RAC adaptations.

- Normal text meets 4.5:1 and qualifying large text 3:1; required non-text controls
  and state indicators meet 3:1 against adjacent colors. Review every theme/state
  pairing, not just the default palette.
- Meet the 24×24 CSS-pixel AA target criterion or its defined exceptions; 44×44 is
  the stronger Hashti ordinary-control goal and the enhanced criterion, not a
  claim about every current target. Test real clickable bounds and spacing.
- Keep visible focus, purposeful order, and focused content unobscured by fixed
  headers, action bars, switchers, and overlays. Never remove an outline without
  a usable replacement. Test selected + focused and invalid + focused states.
- Reflow at 320 CSS pixels where applicable, support text resizing to 200%, and
  test browser zoom/reflow at 400%. Essential two-dimensional content may scroll
  within an identified region while surrounding controls reflow.
- Keep labels/errors/actions reachable with text-spacing overrides, long content,
  forced colors, reduced motion, and coarse pointers. Hover-only affordances and
  color-only instructions are insufficient.
- Provide keyboard/non-drag alternatives for meaningful drag tasks. Inspect
  virtualized collections, removal, and focus restoration against real behavior.
- Perform manual screen-reader tasks alongside automated scans. A zero-violation
  axe result is regression evidence, not an accessibility certification.

### Internationalization requirements

- `Theme locale` remains the source of RAC formatting and keyboard direction;
  inherit the nearest provider when omitted. DOM `lang` and `dir` must agree with
  the intended content, including portalled popovers, modals, tooltips, and toasts.
- Inventory every Hashti-authored visible and accessible string: required wording,
  pending/clear/close/copy labels, pagination counts, file errors, slider thumb
  names, and feedback. Give them a consistent localization path; reuse RAC's own
  translations rather than overriding them with hardcoded English.
- Accept complete messages and proper pluralization. Format values with locale-aware
  APIs and the existing internationalized date primitives. Preserve date-only,
  time-zone, calendar, and numeric value semantics instead of parsing display text.
- Use logical properties and natural text wrapping. Test substantial expansion,
  long unbroken identifiers, mixed-direction text, and CJK line breaking. Do not
  assume one language is always the longest.
- Isolate user-generated direction where needed with native bidi tools such as
  `bdi` or a local `dir="auto"`; keep the surrounding widget's keyboard direction
  coherent. LTR identifiers inside RTL interfaces need deliberate handling.
- Preserve Unicode content, meaningful joiners, input composition, clipboard and
  autofill behavior. Do not apply name restrictions or normalization merely to
  simplify a component. Domain search/validation policy belongs to the application.
- Test a real locale provider, nested locales, and an open overlay during locale
  changes. DOM-only RTL injection is a layout stress test, not localization proof.

The current prototype hardcodes `en-US`. Its multilingual value and synthetic RTL
checks establish preservation/layout evidence only. Translation quality, real IME,
non-Latin font coverage, calendars, and broad locale behavior remain acceptance
work for the library slices that claim them.

## 10. Documentation, maturity, and change control

During component work, Storybook supplies the working examples, state matrices,
composition stories, and interaction/accessibility checks. README/API contracts
record real props, values, refs, parts, and limits alongside the implementation.

Phase 6 consolidates these verified components and examples into the existing
`apps/docs` website. Each component page contains: purpose and alternatives; a working example with
copyable code; anatomy and real targets; props/value shapes; applicable state
matrix; keyboard/content rules; responsive/localization behavior; token/part/state
customization; portal example where relevant; evidence, limitations, and migration
notes. Keep the existing catalog and package contracts as the shared inventory.

Promote a family only when its code, types, stylesheet, documentation, representative
composition, and packed-consumer behavior agree. Track baseline, Frame-in-progress,
Frame-verified, and experimental scope in the coverage inventory. A shared color
token reaching a component does not make that component Frame-verified.

Review consumer-visible defaults, props, refs, classes, state placement, token
meaning, and CSS order as API changes. Prefer additive migration with compatibility
fixtures; document deprecations and rollback to the preceding package/CSS version.
Preserve source attribution and exact upstream version boundaries.

Figma comes last: derive variables and component states from the settled authored
tokens and implemented anatomy, record the corresponding package version, and
check parity. Code and verified documentation remain the source of truth.

## Sources and evidence

- [Astryx findings](research-astryx.md): primary field/anatomy reference; inspected
  core 0.7.10 and separately captured public docs displaying 0.7.9.
- [HeroUI findings](research-heroui.md): v3.2.7 visuals, parts, composition, styling,
  licensing, and compatibility observations.
- [RAC research](research-rac.md), [Hashti baseline](research-cinder-baseline.md),
  and [earlier architecture research](research-cinder-direction.md): existing
  ownership and customization constraints.
- [Prototype verification](prototypes-guide.md#verification) and
  [capture provenance](../apps/docs/src/prototypes/references/README.md): actual
  interactions, screenshots, versions, and limits.
