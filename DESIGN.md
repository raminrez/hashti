---
name: Cinder — Frame
description: Clear fields, quiet surfaces, and dependable interaction.
colors:
  action-light: "#272a32"
  action-hover-light: "#434754"
  on-action-light: "#ffffff"
  focus-light: "#365ccb"
  selected-light: "#e7edff"
  info-surface-light: "#edf2ff"
  canvas-light: "#f5f6f8"
  surface-light: "#ffffff"
  raised-light: "#eef1f6"
  text-light: "#25272c"
  muted-light: "#606674"
  divider-light: "#dde1e8"
  control-border-light: "#7f8795"
  error-light: "#aa2735"
  error-surface-light: "#ffe8eb"
  warning-light: "#75500d"
  warning-surface-light: "#fff0ce"
  success-light: "#246343"
  success-surface-light: "#e1f2e8"
  action-dark: "#f1f2f6"
  action-hover-dark: "#d2d7e4"
  on-action-dark: "#22242a"
  focus-dark: "#a9bdff"
  selected-dark: "#333f62"
  info-surface-dark: "#2c354e"
  canvas-dark: "#18191d"
  surface-dark: "#22242a"
  raised-dark: "#2c2f38"
  text-dark: "#f1f2f6"
  muted-dark: "#b1b6c3"
  divider-dark: "#3e424d"
  control-border-dark: "#7d8493"
  error-dark: "#ffacb3"
  error-surface-dark: "#452830"
  warning-dark: "#e7c383"
  warning-surface-dark: "#3e3321"
  success-dark: "#a4d9b8"
  success-surface-dark: "#203a2b"
typography:
  headline:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "30px"
    fontWeight: 600
    lineHeight: "36px"
    letterSpacing: "-0.03em"
  title:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "25.2px"
  body:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "21px"
  input:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  helper:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
  action:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  control: "10px"
  group: "14px"
  overlay: "18px"
spacing:
  detail: "4px"
  related: "8px"
  control: "12px"
  compact: "16px"
  group: "20px"
  section: "24px"
  surface: "28px"
  separation: "32px"
  region: "40px"
components:
  button-primary:
    backgroundColor: "{colors.action-light}"
    textColor: "{colors.on-action-light}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "4px 16px"
    height: "44px"
  button-primary-dark:
    backgroundColor: "{colors.action-dark}"
    textColor: "{colors.on-action-dark}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "4px 16px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-light}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "4px 16px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-light}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "4px 12px"
    height: "44px"
  text-field:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-light}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    height: "44px"
  recovery:
    backgroundColor: "{colors.error-surface-light}"
    textColor: "{colors.error-light}"
    typography: "{typography.helper}"
    padding: "9px 12px"
  navigation-current:
    backgroundColor: "{colors.selected-light}"
    textColor: "{colors.focus-light}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "44px"
  grouped-surface:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.group}"
---

# Design System: Cinder — Frame

## Overview

**Creative North Star: "A clear frame for the task"**

Frame makes a field's purpose, instructions, value, and recovery read as one unit.
Cool neutral surfaces and restrained geometry leave room for content. A neutral
primary action makes commitment clear; blue identifies focus and selection.

The character is precise, calm, and approachable. Familiar controls carry the
interaction. Distinction comes from persistent guidance, attached recovery, and
consistent relationships between type, borders, spacing, and corners.

**Key Characteristics:**

- Guidance before the input; recovery attached below it.
- Quiet surfaces with stronger interactive boundaries.
- Neutral actions, blue focus and selection, explicit status meaning.
- Comfortable controls and content that can grow.
- The same visual language in light and dark themes.

**Authority and scope · 6 November 2026.** Frame is the selected direction in
[PRODUCT.md](PRODUCT.md). Phase 1 promotes the measured colors, scalar type roles,
control geometry, and representative field/action/overlay styling into
`frame-light` and `frame-dark`. The authored values live in
[`packages/tokens/src/frame.ts`](packages/tokens/src/frame.ts), with their
[public mapping](packages/tokens/README.md); the reusable appearance lives in
[`packages/react/src/frame.css`](packages/react/src/frame.css). Existing Carbon
and Relay surfaces retain their defaults.

The frontmatter remains the visual authority at the default font scale. Guidance
before the control, attached recovery, and the complete fourteen-entry component
slice are Phase 2 work. The [Phase 1 evidence](docs/verification.md#frame-phase-1)
records the foundation proof. The [system specification](docs/design-system.md)
covers behavior, accessibility, internationalization, and customization, and the
[library plan](docs/component-library-plan.md) orders the remaining implementation.

The [prototype styles](apps/docs/src/prototypes/frame.css) and
[shared prototype styles](apps/docs/src/prototypes/styles.css) remain dated visual
references. Page composition belongs in the
[Frame brief](apps/docs/.impeccable/surfaces/apps-docs-src-prototypes-main-tsx.md).
Figma is the final handoff from the completed code-based system.

The [Impeccable sidecar](.impeccable/design.json) adds inherited motion, depth,
recipe breakpoints, narrative, and eight self-contained visual previews. Its
eight-step OKLCH ramps are synthesized panel aids, not additional runtime tokens
or validated foreground/background pairings. Preview controls demonstrate
appearance; the React Aria components remain the behavior implementation.

## Colors

The palette is a cool neutral foundation with small, purposeful areas of color.
Frontmatter names describe this visual specification; they are not new exported
CSS variable names. Each light role has a separately authored dark counterpart.

### Primary

**Ink action** is the filled primary control in light mode. **Light action** plays
the same role in dark mode. Pair each with its matching on-action color. An action
does not become blue merely because it is important.

### Focus and selection

**Focus blue** identifies keyboard location, selected choices, current navigation,
and links. Selected surfaces support the indicator; they do not replace it. The
lighter information surface is for relevant supporting content.

**The Separate Signals Rule.** Focus, selection, current location, validation, and
destructive intent must remain distinguishable when they occur together.

### Neutral

**Canvas** sits behind **surface**. **Raised** distinguishes a toolbar, table
header, or inactive field region. Main text uses **text**; instructions and
secondary metadata use **muted**. **Divider** groups content. **Control border**
identifies an editable boundary and is deliberately stronger than a divider.

### Status

Use the error, warning, and success foreground/surface pairs with explicit text
and, when helpful, a small icon. Red means a problem or destructive intent; amber
means attention; green confirms a result. Success is feedback, not a decoration
on every completed input. Test the actual pairing after customization.

## Typography

One system sans family carries the working UI. The frontmatter lists the measured
roles: headline for page titles, title for sections, body for operational copy,
input for entered values, label for field names, helper for instructions and
recovery, and action for buttons. This is a fixed working scale, not a fluid
marketing hierarchy.

The prototype's page heading steps down to 25/30px at its narrow layout. Entered
text stays at 16/24px. Use sentence case, stable labels, and ordinary word spacing.
Keep explanatory prose around 65–75 characters per line when space permits;
tables follow data alignment rather than a prose measure.

Actual technical identifiers may use the existing IBM Plex Mono stack. The Frame
UI does not require a font download. A branded or non-Latin font must be checked
for glyph coverage, metrics, wrapping, and licensing before becoming a default.

**The Readable Value Rule.** Do not shrink entered values, critical instructions,
or recovery text to make a layout fit. Reflow the surrounding layout instead.

## Layout

Use proximity, alignment, and section headings to make relationships clear. The
spacing vocabulary moves from small detail gaps to separation between regions;
it is not a requirement to wrap every region in a card. Continuous tables and
lists stay continuous.

Fields form a reading sequence: label, guidance, control, recovery. Allow labels,
instructions, and errors to wrap. A related pair can share a row when both values
remain usable; it stacks when the content requires it. Summary contents remain
one reading column even when the summary sits beside a form.

The prototype demonstrates a centered 1208px shell, 24px wide-screen gutters and
16px narrow gutters. Its 900px and 720px layout changes belong to the review and
settings recipes, not to every component. The library must fit its container;
small components should not infer their available space from the viewport.

Frame's ordinary Button and size-bearing fields default to a comfortable 44px
minimum. Explicit `sm` / `md` / `lg` map to 32/44/48px; larger Button sizes retain
64/80px. Minimums may grow with content and text scaling. Checkbox, switch, and
embedded-button hit targets need their own review in the later component slices.

**The Stable Recovery Rule.** Reserve enough space for the form's expected errors
to keep its commit action stable, while allowing longer messages to grow.

## Elevation & Depth

Surfaces are opaque. Background steps, spacing, and thin boundaries do most of the
grouping. Ordinary form surfaces have no ambient shadow. A floating popover uses
the observed `0 8px 24px rgb(0 0 0 / 14%)` shadow. A modal separates its task with
an opaque surface and the `rgb(18 22 32 / 50%)` backdrop.

Depth describes temporary hierarchy, not importance. Keep focus outlines outside
control borders and visible above adjacent surfaces. A stronger shadow is not a
replacement for correct overlay stacking, focus containment, or dismissal.

The prototype inherits the library's productive motion: short color feedback,
popover entrance, and modal entrance. Preserve their reduced-motion treatment.
Motion must explain a state or relationship; it must not delay the task. Exact
inherited durations and easing are recorded in the sidecar.

Frame times motion on a six-step ladder: 130ms for hover, colour, and release
feedback, 175ms for popover and tooltip entrance, 230ms for panel and disclosure
changes, 310ms for modal and backdrop entrance, with 410ms and 730ms reserved for
large surfaces. Entrances use an expo-style ease-out (`0.16, 1, 0.3, 1`); exits are
shorter and accelerate. Pressable controls scale by 0.96–0.98 while pressed and
spring back over the release duration. Fields, accordion rows, and disclosure rows
answer a press with ink rather than travel. An overlay grows from the edge that
touches its trigger, never from center. A reader who asks for reduced motion gets no
travel, scale, or entrance animation, and every state change lands instantly.

## Shapes

Controls have gently curved corners; grouped surfaces are a little softer;
temporary dialogs are softer again. The three frontmatter roles express this
relationship. Use a full one-pixel input border, not the subtler surface divider.

The Phase 2 recovery anatomy keeps an invalid input's upper control corners. Its lower corners tighten to
3px, joining a recovery band with the control's lower corner radius. The band has
side and bottom borders and overlaps the shared edge by one pixel. The focus
outline remains a separate two-pixel line with a two-pixel offset. Action focus
uses the prototype's three-pixel offset.

Round radio marks and switch tracks communicate their established control types.
Do not force them into the rectangular control-radius rule. Status markers and
continuous data rows likewise follow their own anatomy.

## Components

### Actions

A filled neutral primary button leads a decision. A quiet neutral secondary and
unfilled ghost support it. Danger uses a destructive fill with explicit wording.
These four core choices keep the hierarchy small, with Frame's palette and 10px
corners. Blue remains the focus and selection signal.

Use the action type role and comfortable minimum. Hover and press give distinct
feedback; keyboard focus has an external outline. Icon-only actions need a
meaningful accessible name and a usable target. Existing outlined `tertiary`,
outlined `danger-tertiary`, and unfilled `danger-ghost` treatments remain supported.

### Fields and recovery

The visible label remains above the control. Necessary guidance stays visible
when an error appears. The error icon is supporting information; the words explain
how to recover. Required status is visible and programmatic. A read-only value
stays legible, focusable, and copyable; it is different from an unavailable value.

The prototype uses CSS grid to place guidance above the input while RAC maintains
its description/error relationships. Phase 1 preserves the existing library's
label → control → help/error order and adds stable part hooks. Phase 2 makes the
intended reading order, persistent guidance, and attached recovery explicit in
the default composition.

### Selection

Checkboxes support independent and mixed choices. Radios select one option from
a group. Switches toggle a setting. Use a label beside the mark, not a mark whose
meaning appears only on hover. The selected fill defaults to focus blue (`primary`),
with first-class semantic color options: `secondary`, `success`, `warning`, and `danger`.
When a control is invalid (`[data-invalid]`), the error state takes strict precedence
over any custom color. A form setting applied only by Save should use a checkbox or
explicitly state that it is a draft, as detailed in the system specification.

### Feedback and notifications

Alerts, inline notifications, and toasts provide three rich visual variants:

- **Subtle (default):** Soft surface tint with a matched, full 1px border. Per the
  Impeccable craft floor, heavy colored left-accent borders (>1px) are avoided in favor of
  complete, balanced boundary definitions.
- **Solid:** High-emphasis saturated fill with white high-contrast text and icons,
  ideal for urgent banners and high-priority toast announcements.
- **Bordered:** Neutral card background with crisp 1px semantic outline and subtle
  badge-framed icons, maintaining high legibility across dark and light surfaces.

### Temporary surfaces

A dialog or drawer has a title, concise context, reachable dismissal, and explicit actions.
Its fields use the same anatomy as the page. A nested select menu belongs visually
and behaviorally to that dialog. Theme, locale, keyboard direction, focus return,
and the close order must all survive the portal.

**Drawer (Sheet)** provides slide-over inspection and secondary task surfaces from any screen
edge (`start`, `end`, `top`, `bottom`). It enforces bidirectional mirroring so `end`
naturally slides from the left in RTL and from the right in LTR.

## Do's and Don'ts

### Do

- **Do** keep guidance visible while recovery is shown.
- **Do** keep focus distinct on selected and invalid controls.
- **Do** use stronger boundaries for controls than for ordinary surfaces.
- **Do** let content, translations, and text scaling increase a component's height.
- **Do** verify the same task in both themes and at narrow widths.
- **Do** carry verified code and token decisions into Figma at the final handoff.

### Don't

- **Don't** use placeholders as the only field labels.
- **Don't** rely on color alone for validation, selection, or status.
- **Don't** clip an error to preserve a screenshot's height.
- **Don't** turn every content section or data row into a rounded card.
- **Don't** infer a public API or full accessibility support from a prototype image.
- **Don't** copy a reference library's visual identity or API wholesale.
