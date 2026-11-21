---
name: Hashti — Frame
description: Clear fields, quiet surfaces, and dependable interaction.
colors:
  action-light: "#272a32"
  action-hover-light: "#434754"
  action-active-light: "#555b6b"
  on-action-light: "#ffffff"
  secondary-light: "#eef1f6"
  secondary-hover-light: "#dde1e8"
  secondary-active-light: "#cbd2dc"
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
  error-hover-light: "#91212d"
  error-active-light: "#771b25"
  error-surface-light: "#ffe8eb"
  warning-light: "#75500d"
  warning-surface-light: "#fff0ce"
  success-light: "#246343"
  success-surface-light: "#e1f2e8"
  ai-start-light: "#5b3fc4"
  ai-end-light: "#8b3fb0"
  action-dark: "#f1f2f6"
  action-hover-dark: "#d2d7e4"
  action-active-dark: "#b6bfd2"
  on-action-dark: "#22242a"
  secondary-dark: "#2c2f38"
  secondary-hover-dark: "#3e424d"
  secondary-active-dark: "#515765"
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
  error-hover-dark: "#ffb8be"
  error-active-dark: "#ffc5ca"
  error-surface-dark: "#452830"
  warning-dark: "#e7c383"
  warning-surface-dark: "#3e3321"
  success-dark: "#a4d9b8"
  success-surface-dark: "#203a2b"
  ai-start-dark: "#c4b0ff"
  ai-end-dark: "#e6b3e0"
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
  mark: "5px"
  group: "14px"
  drawer: "16px"
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
  button-secondary:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.text-light}"
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
  button-danger:
    backgroundColor: "{colors.error-light}"
    textColor: "{colors.on-action-light}"
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

# Design System: Hashti — Frame

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
- Presses answer with ink and a slight scale, never with delayed feedback.

**Authority and scope · 20 November 2026, reconciled to current tree.** Frame is
the design direction recorded here. The authored token values live in
[`design/tokens.css`](design/tokens.css); every token reaches consumers as a
`--hashti-<token-name>` custom property; themes switch on `data-theme`
(`light`, `dark`, `system` following `prefers-color-scheme`), and `light` is the
document default. There is no separate tokens package in this tree; edit
`design/tokens.css` directly.

The full catalog ships as `@hashti/react` (wrappers over ui-sdk parts) with
styles in `@hashti/styles`; all 54 ui-sdk components shipped in cycles
001–069, phase-2 advanced behaviors are complete
([archived roadmap](plans/phase2-roadmap.md)), and `Theme` — Hashti-original,
cycle 070 — scopes tokens to a subtree and carries overlay portals. Per-component behavior and
accessibility requirements are described here; per-component appearance lives
in the stylesheets, which follow the
[CSS conventions](design/css-conventions.md): cascade order
`hashti.tokens → hashti.components`, class hooks
(`hashti-<block>__<element>`), modifiers only via attributes, `data-slot` is
ui-sdk's and is never renamed, and ui-sdk's `data-*` attributes express state
(`data-open`, `data-selected`, `data-hovered`, `data-focus-visible`,
`data-invalid`, `data-pending`, …). Figma is a later handoff from
the completed code-based system.

## Colors

The palette is a cool neutral foundation with small, purposeful areas of color.
Frontmatter names describe this visual specification; they are not new exported
CSS variable names. Each light role has a separately authored dark counterpart.
Every role maps to a public `--hashti-*` token in
[`design/tokens.css`](design/tokens.css).

**Contrast policy · 20 November 2026.** Every foreground/background pair the
stylesheets actually compose must pass WCAG 2.x AA and the APCA
recommendation for its role (body text Lc ≥ 75, content text Lc ≥ 60,
non-text UI Lc ≥ 30). The pairs are audited by
`bun run contrast` (`design-system/scripts/contrast-audit.mjs`), which parses
both theme blocks of `tokens.css` and fails on any regression — run it after
any token value change. The methodology follows the
[Harmony palette](https://github.com/evilmartians/harmony): equal contrast per
role, mirrored light/dark pairs; the palette itself stays Hashti-authored.

### Primary

**Ink action** is the filled primary control in light mode. **Light action**
plays the same role in dark mode. Pair each with its matching on-action color,
and give each a hover and an active press step (`action-hover`, `action-active`).
An action does not become blue merely because it is important. The quiet
**secondary** fill (raised at rest, divider on hover) and the unfilled **ghost**
support it.

### Focus and selection

**Focus blue** identifies keyboard location, selected choices, current navigation,
and links. Selected surfaces support the indicator; they do not replace it. The
lighter information surface is for relevant supporting content.

**The Separate Signals Rule.** Focus, selection, current location, validation, and
destructive intent must remain distinguishable when they occur together. Error
state outranks any custom selection or status color.

### Neutral

**Canvas** sits behind **surface**. **Raised** distinguishes a toolbar, table
header, or inactive field region. Main text uses **text**; instructions and
secondary metadata use **muted**. **Divider** groups content. **Control border**
identifies an editable boundary and is deliberately stronger than a divider.
Higher layers saturate deliberately: layer 1 = surface, layer 2 = raised, layer
3 = raised; only the background ladder ascends canvas → surface → raised.

### Status

Use the error, warning, and success foreground/surface pairs with explicit text
and, when helpful, a small icon. Red means a problem or destructive intent; amber
means attention; green confirms a result. Danger actions carry hover
(`error-hover`) and active (`error-active`) steps. Success is feedback, not a
decoration on every completed input. Test the actual pairing after customization.

### AI accents

A purple gradient (`ai-start` → `ai-end`) marks AI-generated content and the AI
label's revert chip. It is decorative-only territory: never an action, focus, or
status color.

## Typography

One system sans family carries the working UI. The frontmatter lists the measured
roles: headline for page titles, title for sections, body for operational copy,
input for entered values, label for field names, helper for instructions and
recovery, and action for buttons. This is a fixed working scale, not a fluid
marketing hierarchy.

The page heading steps down to 25/30px at its narrow layout. Entered text stays
at 16/24px. Use sentence case, stable labels, and ordinary word spacing. Keep
explanatory prose around 65–75 characters per line when space permits; tables
follow data alignment rather than a prose measure.

Technical identifiers use the existing IBM Plex Mono stack; no font is bundled.
A branded or non-Latin font must be checked for glyph coverage, metrics,
wrapping, and licensing before becoming a default.

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
one reading column even when the summary sits beside a form. The field-grid
stacking boundary measured at 647/648px.

Frame's ordinary Button and size-bearing fields default to a comfortable 44px
minimum. Explicit `sm` / `md` / `lg` map to 32/44/48px; larger Button sizes
retain 64/80px. Minimums may grow with content and text scaling; a hit target
and its painted mark are separate concerns. The library must fit its container;
small components should not infer their available space from the viewport. Demo
shells (a centered 1208px page, 24/16px gutters, 900px and 720px breaks) belong
to their recipes, not to every component.

**The Stable Recovery Rule.** Reserve enough space for the form's expected errors
to keep its commit action stable, while allowing longer messages to grow. The
tested form recipe reserves one padded recovery line (58px minimum, 78px at or
below 24rem), with the save boundary at 432/433px.

## Elevation & Depth

Surfaces are opaque. Background steps, spacing, and thin boundaries do most of
the grouping. Ordinary form surfaces have no ambient shadow. Depth describes
temporary hierarchy, not importance: the canvas → surface → overlay ladder is
about containment, never z-index or shadow strength.

### Shadow Vocabulary

- **Popover** (`0 8px 24px rgb(0 0 0 / 14%)`): anchored overlays and menus. Dark themes add an inset hairline ring (`inset 0 0 1px 0 rgba(255,255,255,.2)`) and deepen to `0 8px 24px rgba(0,0,0,.5)`.
- **Modal** (`0 16px 48px rgb(0 0 0 / 14%)`): dialog surfaces, with the same dark hairline and a deeper dark variant.
- **Toast** (`0 10px 30px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)`): transient notices on surface.
- **Backdrop** (`rgb(18 22 32 / 50%)`): modal and drawer scrim; optional 6px blur behind dialogs, off for coarse pointers; the shadow and overlay tokens are _colors_, only ever composed into a stack.

Keep focus outlines outside control borders and visible above adjacent surfaces.
A stronger shadow is not a replacement for correct overlay stacking, focus
containment, or dismissal.

Motion times on a six-step ladder: 130ms for hover, colour, and release
feedback, 175ms for popover and tooltip entrance, 230ms for panel and disclosure
changes, 310ms for modal and backdrop entrance, with 410ms and 730ms reserved for
large surfaces. Entrances use an expo-style ease-out (`0.16, 1, 0.3, 1`); exits
are shorter and accelerate; the press uses `cubic-bezier(0.32, 0.72, 0, 1)` and
springs back over the release duration. Pressable controls scale by 0.96–0.98
while pressed (buttons 0.97, `sm` 0.98, `lg` 0.96; checkbox/radio marks 0.9;
calendar cells 0.94). Fields, accordion rows, and disclosure rows answer a press
with ink rather than travel. An overlay grows from the edge that touches its
trigger, never from center, with transform-origin set by placement. Focus is
never animated. A reader who asks for reduced motion gets no travel, scale, or
entrance animation, and every state change lands instantly while pending, focus,
and status cues stay visible.

## Shapes

Controls have gently curved corners (10px `control`); choice marks use their own
small radius (5px on checkbox marks, full-round radio and switch tracks); grouped
surfaces are a little softer (14px `group`); drawers are softer again (16px);
popovers, menus, and dialogs are softest (18px `overlay`). Use a full one-pixel
input border in the control-border color, not the subtler surface divider.

The recovery anatomy keeps an invalid input's upper control corners. Its lower
corners tighten to 3px, joining a recovery band with the control's lower corner
radius; the band has side and bottom borders, sits 1px under the control's shared
edge (`margin-block-start: -9px`, band `z-index:1`, control `z-index:2`), and
carries the status ink on its border. The focus outline is a separate two-pixel
line with a two-pixel offset on fields and a three-pixel offset on actions;
notification close buttons take it inset (`-2px`); non-interactive surfaces
(popover, dialog, tooltip) paint none.

Round radio marks and switch tracks communicate their established control types.
Do not force them into the rectangular control-radius rule. Status markers and
continuous data rows likewise follow their own anatomy.

## Components

### Actions

A filled neutral primary button leads a decision. A quiet neutral secondary and
unfilled ghost support it. Danger uses a destructive fill with explicit wording;
outlined `danger-tertiary` and unfilled `danger-ghost` remain supported, as does
outlined `tertiary` with its control-border stroke. These four core choices keep
the hierarchy small, with Frame's palette and 10px corners. Blue remains the
focus and selection signal.

Use the action type role and comfortable minimum. Hover and press give distinct
feedback (hover fills, press deepens and scales 0.96–0.98); keyboard focus has
an external 2px outline at a 3px offset. Text may wrap; icon-only actions take
a square hit target equal to the control height plus a meaningful accessible
name. Pending actions hide their label, show a spinner in the action's ink, and
prevent repeat activation.

#### Control height tier (decided 2026-11-21)

The shipped heights are intentional, not an oversight. Standard controls
(buttons, inputs, overlay closes) sit at 36px; dense navigational surfaces
(menubar triggers) at 32px; segmented-control items at 40px inside a 48px
root. The 44px ladder was evaluated against a before/after showcase and
rejected: 44px made toolbar and menubar surfaces visibly too tall, and a
32px-everywhere compact tier erased the distinction the current heights
already draw. Toolbars, menubars, and overlay headers are the dense contexts
that justify the smaller targets; forms keep the taller standard controls.

### Fields and recovery

The visible label remains above the control, with guidance directly beneath it —
guidance → value → recovery is Frame's fixed order, owned by the shared
field-anatomy module. Necessary guidance stays visible when an error appears.
The error icon is supporting information; the words explain how to recover.
Required status is visible and programmatic. A read-only value stays legible,
focusable, and copyable (dashed border, accent surface); it is different from an
unavailable value. Disabled fields keep readable guidance at AA.

The attached recovery band (warning/error/success ink) docks under the control
per the Shapes geometry; detached status (groups, switches) renders as a fitted
chip. Status banners are suppressed while the field is invalid — the error owns
the paint. Field focus is a 2px outline at a 2px offset, only on
`data-focus-visible`, lifting the control above adjacent surfaces; an invalid
field keeps that same focus ring instead of painting a second error outline.

### Selection

Checkboxes support independent and mixed choices (18px mark, 5px corners, 1px
control border). Radios select one option from a group (18px round mark, 10px
dot). Switches toggle a setting (44×24 track, 20px thumb; `sm` 34×18 with a 14px
thumb, logical travel). Use a label beside the mark, not a mark whose meaning
appears only on hover; choice rows keep a 44px ordinary minimum, with a compact
16px mark / 18px target reserved for dense tables. The selected fill defaults to
focus blue (`primary`), with first-class semantic color options: `secondary`,
`success`, `warning`, and `danger`. When a control is invalid
(`[data-invalid]`), the error state takes strict precedence over any custom
color — even selected ones. A group's error paint lives on the group, not on
each option. A form setting applied only by Save should use a checkbox or
explicitly state that it is a draft, as detailed in the system specification.

### Feedback and notifications

Alerts, inline notifications, and toasts provide three rich visual variants:

- **Subtle (default):** Soft status-tinted surface with a matched full 1px border (status color mixed into the subtle border). No heavy colored left-accent bars.
- **Solid:** High-emphasis saturated fill with on-color text and icons, for urgent banners and high-priority toasts; dark themes flip to the inverse fill.
- **Bordered:** Neutral surface with a crisp 1px status outline and a badge-framed icon, legible on both themes.

All use 10px corners, 12px padding, and the status foreground/surface pairs.
Toasts queue through the provider (max three visible) and enter by rising 8px
over 230ms. Progress never depends on animation alone; every state is also
announced.

### Temporary surfaces

A dialog or drawer has a title, concise context, reachable dismissal, and explicit
actions. Its fields use the same anatomy as the page. Popovers and menus take the
popover shadow, 18px corners, and zero padding when they host a menu or listbox;
modals take the modal shadow, 18px corners, and the 50% scrim (xs–lg widths,
320/440/560/720px); drawers slide from any edge with 16px corners that flatten
against their edge, full-height or full-width travel, and bidirectional
mirroring so `end` slides from the left in RTL and from the right in LTR. Theme,
locale, keyboard direction, focus return, and the close order must all survive
the portal (`Theme` renders the themed container and `useOverlayTheme` hands
it to the wrappers as the overlays' portal target, carrying `data-theme`,
`dir`, `lang`).
Escape dismisses inner-first (a Select closes before its Dialog), and focus
returns to the trigger.

## Do's and Don'ts

### Do

- **Do** keep guidance visible while recovery is shown.
- **Do** keep focus distinct on selected and invalid controls, and give every
  combination (selected + focused, invalid + focused) an explicit recipe.
- **Do** use stronger boundaries for controls than for ordinary surfaces.
- **Do** let content, translations, and text scaling increase a component's height.
- **Do** answer a press with ink and the press scale; never delay feedback on a transition.
- **Do** carry `dir`, `lang`, theme, and layer through portals on every overlay.
- **Do** verify the same task in both themes and at narrow widths.
- **Do** carry verified code and token decisions into Figma at the final handoff.

### Don't

- **Don't** use placeholders as the only field labels.
- **Don't** rely on color alone for validation, selection, or status.
- **Don't** clip an error to preserve a screenshot's height.
- **Don't** turn every content section or data row into a rounded card.
- **Don't** invent token values in generated `tokens.css` / `tokens.json`.
- **Don't** re-implement RAC interaction states with pseudo-classes; style the `data-*` attributes.
- **Don't** infer a public API or full accessibility support from a prototype image.
- **Don't** copy a reference library's visual identity or API wholesale.
