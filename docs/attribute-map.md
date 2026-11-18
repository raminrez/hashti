# Attribute Map

The canonical translation from React Aria Components (RAC) state attributes to ui-sdk state
attributes, applied once to every stylesheet in `packages/styles/src` (TICK-000b, ADR-0002).
This table is also the porting contract for future Vue/Svelte/Solid/web bindings: Hashti CSS
targets the ui-sdk column, never the RAC column.

Sources: `node_modules/@ui-sdk/react/docs/llms.txt`, `docs/styling-and-animation.md`,
`docs/rendering.md`, and each component page under `docs/components/` (each has a
"Data Attributes" section listing the attributes per part). Where a mapping is
per-component rather than global, the Notes column says so.

## How to read this

- **Presence attributes** (`data-disabled`, `data-open`, …) are bare — present means true.
- **Value attributes** (`data-orientation="vertical"`, …) carry a value.
- **Pseudo-class mappings** mean ui-sdk emits no attribute; style the native CSS state
  instead. ui-sdk docs style hover with `:hover` and focus rings with `:focus-visible`
  throughout (see `docs/styling-and-animation.md`, and the `Toggle` walkthrough in
  `llms.txt` → "First Component").

## RAC → ui-sdk

| RAC attribute | ui-sdk equivalent | Notes |
|---|---|---|
| `data-hovered` | `:hover` (pseudo-class) | ui-sdk emits no hover attribute; docs style hover with `:hover` / Tailwind `hover:` (`llms.txt` First Component; `styling-and-animation.md`). Per-component exception: `ScrollArea`/`Resizable` emit `data-hovering` (`components/scroll-area.md`, `components/resizable.md`) — Hashti ships neither yet. On calendar days, RAC `data-hovered` during range picking becomes `data-preview` (see `data-selection-*` below). |
| `data-pressed` (transient, on Button/items) | `:active` (pseudo-class) | ui-sdk `Button` emits only `data-pending` and `data-disabled` (`components/button.md` → Data Attributes). ui-sdk's `data-pressed` is the **latched** state of `Toggle` (`components/toggle.md`), i.e. RAC `data-selected` on ToggleButton — do not confuse the two. |
| `data-pressed` (on ToggleButton, meaning "on") | `data-pressed` | Same name, but now the only `data-pressed` in the system. RAC's latched-vs-pressing split (`data-selected` vs `data-pressed`) collapses into ui-sdk `data-pressed`. |
| `data-focus-visible` | `:focus-visible` (pseudo-class) | ui-sdk docs use `:focus-visible` everywhere (`styling-and-animation.md` example, `components/tree.md`: "style a focused row … with `:focus-visible`"). |
| `data-focused` | `:focus` / `data-highlighted` | Per-component. On list-like items (RAC ListBox/Menu/Command items, where it marks the active descendant) → `data-highlighted` (`components/listbox.md`: "`data-highlighted`: Present on the item that has focus"). On text-entry segments (RAC DateSegment) → `:focus`. `Field` parts and `OtpInput` parts do emit `data-focused` (`components/field.md`, `components/otp-input.md`) — keep it there. |
| `data-focus-within` | `:focus-within` (pseudo-class) | Native equivalent; ui-sdk emits no such attribute. |
| `data-selected` | per-component | Checkbox, Radio, Switch → `data-checked` (ui-sdk also emits the inverse `data-unchecked`) (`components/checkbox.md`, `radio.md`, `switch.md`). ToggleButton → `data-pressed` (`components/toggle.md`). Tabs, Listbox, Select items, Menu, Tree, Calendar days → stays `data-selected` (`components/tabs.md`, `listbox.md`, `select.md`, `menu.md`, `tree.md`, `calendar.md`). |
| `data-indeterminate` | `data-indeterminate` | Survives on Checkbox, CheckboxIndicator, Tree (`components/checkbox.md`, `tree.md`), and Progress (`components/progress.md`). The `data-checked="mixed"` form in the ticket draft is **not** what ui-sdk emits. |
| `data-checked` | `data-checked` | RAC name and ui-sdk name agree (checkbox/radio/switch/menu-checkbox-item/tree-checkbox). |
| `data-entering` | `data-starting-style` | `styling-and-animation.md` → "Animate Opening and Closing"; also on CheckboxIndicator (`components/checkbox.md`) and TabsPanel (`components/tabs.md`). |
| `data-exiting` | `data-ending-style` | Same sources. Note: `data-closed` describes the closed state but does not keep content mounted for an exit — exit styles go on `data-ending-style`. |
| `data-expanded` | per-component | Accordion/Disclosure → `data-open` / `data-closed` (`components/accordion.md`; ui-sdk Accordion covers RAC Disclosure). Tree branches → stays `data-expanded` (`components/tree.md`). Toast stack → stays `data-expanded` (`components/toast.md`). Drawer at largest snap point → `data-expanded` (`components/drawer.md`). |
| `data-open` | `data-open` | Names agree (`components/popover.md`, `dialog.md`, `select.md`, …). |
| `data-disabled` | `data-disabled` | Universal in ui-sdk; every component's Data Attributes section lists it. |
| `data-readonly` | `data-readonly` | Survives verbatim (`components/checkbox.md`, `switch.md`, `input.md`, `select.md`, …). |
| `data-required` | `data-required` | Survives verbatim (same sources). |
| `data-invalid` | `data-invalid` | Survives; note ui-sdk `Switch` gets it from the surrounding `Field` (`components/switch.md`), and `Field` spreads `data-invalid`/`data-valid` to all its parts (`components/field.md`). |
| `data-orientation` | `data-orientation` | Same values (`horizontal`/`vertical`) on Tabs, ToggleGroup, Slider, Toolbar, Separator, Listbox (`components/tabs.md`, `toggle.md`, `slider.md`, `toolbar.md`, `separator.md`, `listbox.md`). |
| `data-direction` (RAC Slider) | `:dir(rtl)` / `[dir="rtl"]` | ui-sdk has no direction attribute; it reads direction from the DOM (`docs/component-inventory.md` Theme row: "ui-sdk reads direction from the DOM"). Existing selectors already pair `[data-direction="rtl"]` with `:dir(rtl)`; sweep drops the attribute branch. **Exception:** `.hashti-sort-icon[data-direction]` (ascending/descending marker on the css-only Table) is Hashti-owned and stays. |
| `data-drop-target` | per-component | File drop (RAC DropZone) → FileInputDropzone's `data-dragging`, refined by `data-drag-accept` / `data-drag-reject` (`components/file-input.md`). RAC ListBox/GridList/TreeItem drop targets → **no ui-sdk equivalent** (ui-sdk Tree/Listbox ship no drag-and-drop); those rules are removed as dead CSS. |
| `data-dragging` | per-component | Survives on Slider thumb, Drawer, FileInputDropzone, Resizable handle (`components/slider.md`, `drawer.md`, `file-input.md`, `resizable.md`). RAC ListBox/GridList/Tree item dragging → no ui-sdk equivalent; removed. |
| `data-allows-sorting` | (Hashti-owned) | RAC Table-only. ui-sdk ships no table; Hashti Table is css-only (`docs/component-inventory.md`). Kept as a Hashti-owned attribute until the post-rewrite table project. |
| `data-resizing` | (Hashti-owned) | Same as `data-allows-sorting` (RAC ColumnResizer). |
| `data-placeholder` | per-component | SelectValue → `data-placeholder` on SelectValue (`components/select.md`). RAC DateSegment placeholder → `data-empty` on the segment ("Present while the segment is empty. It shows its placeholder.", `components/date-input.md`). |
| `data-empty` | `data-empty` | Names agree: Select/Combobox empty lists, TokenInput, DateInput (whole and per-segment) (`components/select.md`, `combobox.md`, `token-input.md`, `date-input.md`). Hashti's own `data-empty` on search-field/table stays Hashti-owned. |
| `data-filled` | `data-filled` | Names agree: Input/Textarea/OtpInput (`components/input.md`, `textarea.md`, `otp-input.md`). |
| `data-today` | `data-today` | Calendar day (`components/calendar.md`). |
| `data-unavailable` | `data-unavailable` | Calendar day (`components/calendar.md`). |
| `data-outside-month` | `data-outside` | Calendar day outside the visible month (`components/calendar.md`). |
| `data-selection-start` / `data-selection-end` | `data-range-start` / `data-range-end` | Calendar range edges; ui-sdk adds `data-range-middle`, and `data-preview` for the range being picked (from its start to the day under pointer/focus) — that last one is where RAC's hover-range styling moves (`components/calendar.md`). |
| `data-current` | `data-current` | Names agree: PaginationLink (`components/pagination.md`), Tree item (`components/tree.md`). Hashti's `data-current-ancestor` (navigation-tree) stays Hashti-owned. |
| `data-pending` | `data-pending` | Names agree: Button, Drawer, Toast, Tree item (`components/button.md`, `drawer.md`, `toast.md`, `tree.md`). (Hashti's Button already sets it; ui-sdk Button emits it while its press-handler promise runs.) |
| `data-type` on DateSegment | `data-type` | Survives on `date-input-segment`/`time-input-segment` with the same values incl. `literal` (`components/date-input.md`). |
| `data-type` on toast | `data-type` | Survives on ui-sdk Toast; values are `default`, `success`, `error`, `info`, `warning`, `loading` (`components/toast.md`). Align Hashti's `data-kind` toast values to this set (see below). |

## Hashti-owned attributes (unchanged)

These are set by Hashti components or themes, not by RAC, and stay as they are:

- `data-variant` (also absorbs `data-kind` — see below), `data-size`, `data-color`,
  `data-tone`, `data-status`, `data-hashti-status`, `data-hashti-status-variant`,
  `data-placement`, `data-shape`, `data-layout`, `data-elevation`, `data-backdrop`,
  `data-icon-only`, `data-hashti-input-icon`, `data-inline`, `data-multiline`,
  `data-interactive` (Card), `data-revert-active` (AILabel), `data-current-ancestor`,
  `data-stack-index`, `data-hashti-size-default`, `data-allows-sorting`, `data-resizing`.
- `data-hashti-theme`, `data-hashti-layer`, `data-theme` (theme plumbing; the generated
  `tokens.css` accepts all three selectors).
- Sheet-only carryovers (`data-swipe-direction`, `data-position`, `data-overscroll-padding`,
  `data-has-descendants`, `data-has-child-items`, `data-has-submenu`): Sheet merges into
  ui-sdk Drawer and Tree rebuilds on `@ui-sdk/react/tree` (TICK-007, TICK-010); these stay
  Hashti-owned until those tickets rewrite the components and their CSS. ui-sdk Drawer
  offers `data-side`, `data-snap-point`, `data-dragging`, `data-expanded`,
  `data-interactive`, `data-driver` for the rebuild (`components/drawer.md`).

## Renames that are Hashti policy, not ui-sdk behavior

| Old | New | Why |
|---|---|---|
| `data-kind` | `data-variant` | AGENTS.md: "NO `kind` — use `variant`". Applies to Hashti's notification/toast/alert-dialog/badge `kind` prop. On Toast specifically, prefer ui-sdk's `data-type` value set (`components/toast.md`) when TICK-008 lands. |

## Removed without replacement

- RAC ListBox/GridList/TreeItem drag-and-drop selectors (`data-drop-target`, item
  `data-dragging`, DropIndicator rules) — no ui-sdk equivalent (ui-sdk Tree/Listbox have no
  DnD; `components/tree.md`, `components/listbox.md` list no drag attributes). GridList is
  dropped from the rewrite entirely (`docs/component-inventory.md`).

## Ambiguities the docs left (and how the sweep resolves them)

- **`data-pressed` collision.** ui-sdk overloads the word: `Toggle`'s latched state is
  `data-pressed`, while RAC's momentary "finger is down" has no ui-sdk attribute at all.
  The sweep maps transient-press selectors to `:active` and toggle-on selectors to
  `data-pressed`, component by component.

## Spike correction (TICK-013, 2026-11-18)

The map itself was right. The crack was in the **loading path**, not the selectors:
`@hashti/react/styles.css` was a pre-sweep duplicate of `packages/styles/src/index.css`
still using `[data-hovered]` / `[data-pressed]` / `[data-focus-visible]`. Storybook and the
docs app loaded the duplicate, so swept selectors never reached the review surface. Fixed by
turning `@hashti/react/styles.css` into a one-line re-export of `@hashti/styles` and deleting
the duplicated react-local CSS. Confirmed with pixel-identical captures across `@ui-sdk/web`
and `@ui-sdk/react` against the swept stylesheet. See `docs/spike-button-report.md`.
- **`data-focused` vs `data-highlighted`.** ui-sdk never documents `data-focused` on
  list/menu items; `components/listbox.md` says `data-highlighted` is "the item that has
  focus". The sweep uses `data-highlighted` for items and `:focus` for segments.
- **Meter.** ui-sdk Meter carries no state attributes at all — "the reading is in
  `--meter-value`" (`components/meter.md`). Hashti Meter keeps its own
  `data-status`/`data-variant` hooks.
- **Tag / removable tags.** ui-sdk has no Tag; removable tokens live in TokenInput
  (`token-input-token`, `token-input-token-remove`). Hashti's presentational Tag keeps
  `data-selected`/`data-disabled` as Hashti-owned hooks until the TokenInput ticket lands.
