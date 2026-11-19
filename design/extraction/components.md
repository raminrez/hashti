# Hashti React — component extraction report

Scope read: `packages/react/src/{frame.css,layers.css,relay.css,styles.css,theme.tsx,utils.ts,index.ts}`,
every `components/*/index.ts`, all 49 component folders, `packages/tokens/src/frame.ts` + `tokens.css`,
`docs/css-conventions.md`, `docs/component-library-plan.md`, `DESIGN.md` (Frame). Read-only; nothing edited.

Cascade order (authority): `hashti.tokens → hashti.reset → hashti.components → hashti.themes → hashti.accessibility`
(`layers.css:2`). Frame lives in `hashti.themes`, scoped
`@scope ([data-hashti-theme="frame-light"|"frame-dark"]) to ([data-hashti-theme])`. Therefore every value in
`frame.css` beats the same selector in `styles.css`/component CSS. Where both still apply to _different_
properties, both persist — noted below.

---

## 1. Component inventory (49 dirs) + fourteen-entry Frame slice

The Phase 2 "fourteen-entry slice" (`docs/component-library-plan.md` §Phase 2):
`button, link, text-input, text-area, number-input, search, checkbox, radio-button, toggle, dropdown, form, modal, popover, tooltip`.
All fourteen are shipped; a few slice names map to a component family.

| #   | dir             | exported                                                                                                                                                                                     | one-line purpose                                                  | slice                          |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------ |
| —   | autocomplete    | `Autocomplete`                                                                                                                                                                               | RAC combobox-autocomplete wrapper (no stylesheet; unstyled shell) | supporting                     |
| 1   | avatar          | `Avatar`, `AvatarGroup`, `getInitials`                                                                                                                                                       | user image/initials + presence dot + overlap group                | —                              |
| 2   | badge           | `Badge`, `AILabel`                                                                                                                                                                           | count/status pill; AI label with gradient revert chip             | —                              |
| 3   | breadcrumbs     | `Breadcrumbs`, `BreadcrumbItem`                                                                                                                                                              | RAC breadcrumb nav                                                | —                              |
| 4   | button          | `Button`, `Link`, `ToggleButton`, `ContentSwitcher`                                                                                                                                          | actions, navigation, single-select segmented control              | **button + link**              |
| 5   | card            | `Card{,Header,Body,Footer}`, `Tile`, `ClickableTile`, `SelectableTile`, `ExpandableTile`                                                                                                     | surface containers + tile variants                                | —                              |
| 6   | checkbox        | `Checkbox`, `CheckboxGroup`                                                                                                                                                                  | binary/tri-state + group with field anatomy                       | **checkbox**                   |
| 7   | code-snippet    | `CodeSnippet`                                                                                                                                                                                | monospace block with copy                                         | —                              |
| 8   | color           | `ColorArea/Slider/Wheel/Field/Swatch/Picker…`                                                                                                                                                | RAC colour primitives suite                                       | —                              |
| 9   | combobox        | `ComboBox`, `ComboBoxCreateItem`                                                                                                                                                             | filterable select, single/multi, chip + create                    | dropdown (secondary)           |
| 10  | command-palette | `CommandPalette` (+`Context`, `useCommandPaletteContext`)                                                                                                                                    | modal quick-action search                                         | —                              |
| 11  | date-picker     | `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar`                                                                                                                                 | date entry + calendars                                            | —                              |
| 12  | dialog          | `Dialog`, `AlertDialog`                                                                                                                                                                      | modal body; confirm dialog with kind header                       | modal                          |
| 13  | disclosure      | `Disclosure`(+`Group/Trigger/Panel/Indicator/Context`)                                                                                                                                       | expand/collapse                                                   | —                              |
| 14  | divider         | `Divider`                                                                                                                                                                                    | RAC separator                                                     | supporting                     |
| 15  | drawer          | `Drawer`                                                                                                                                                                                     | edge sheet for side tasks, placement + size                       | modal                          |
| 16  | dropzone        | `DropZone`, `FileTrigger`, `FileUploader`, `acceptsFile`                                                                                                                                     | drag/drop upload surface                                          | —                              |
| 17  | empty-state     | `EmptyState`                                                                                                                                                                                 | zero-state block (icon/title/body/action)                         | —                              |
| 18  | field           | `Field`, `FieldLayout`, `fieldParts`, `useFieldAnatomy`, `useFieldPresentation`, `fieldClassName`, `FieldLabel/Description/Help/Error/Status/…`                                              | the shared field anatomy module (all fields build on it)          | supporting                     |
| 19  | grid-list       | `GridList`(+`Item`, `Root`, `LoadMore`, `EmptyState`, `DragHandle`, `Checkbox`)                                                                                                              | selectable grid collection                                        | —                              |
| 20  | input-otp       | `InputOTP`                                                                                                                                                                                   | segmented one-time-code input                                     | —                              |
| 21  | kbd             | `Kbd`                                                                                                                                                                                        | keycap glyph                                                      | —                              |
| 22  | layout          | `Grid`, `Stack`, `List`, `Header`, `SideNav`, `HeaderNav`, `HeaderName` etc.                                                                                                                 | page shell primitives                                             | supporting                     |
| 23  | list-box        | `ListBox`, `ListBoxItem`, `ListBoxSection`                                                                                                                                                   | option collection (popover body)                                  | supporting                     |
| 24  | meter           | `Meter`, `deriveMeterTone`                                                                                                                                                                   | linear/circular quantity gauge                                    | —                              |
| 25  | modal           | `Modal` (+`ModalBackdrop`)                                                                                                                                                                   | centered dialog surface + scrim                                   | **modal**                      |
| 26  | navigation-tree | `NavigationTree`(+`Item`, `Section`, `Indicator`, `Header`, …)                                                                                                                               | hierarchical nav tree                                             | —                              |
| 27  | number-field    | `NumberField`                                                                                                                                                                                | numeric input with steppers                                       | **number-input**               |
| 28  | pagination      | `Pagination`, `paginationRange`                                                                                                                                                              | page stepper                                                      | —                              |
| 29  | popover         | `Popover`, `OverflowMenu`                                                                                                                                                                    | anchored overlay surface / overflow menu                          | **popover**                    |
| 30  | preview-trigger | `PreviewTrigger`                                                                                                                                                                             | hover/peek preview trigger                                        | —                              |
| 31  | progress        | `ProgressBar`, `ProgressCircle`, `ProgressIndicator`, `Skeleton`, `InlineLoading`, `Loading`                                                                                                 | determinate/indeterminate progress + skeletons                    | —                              |
| 32  | radio           | `Radio`, `RadioGroup`                                                                                                                                                                        | single-choice options + group                                     | **radio-button**               |
| 33  | search-field    | `SearchField`                                                                                                                                                                                | search input with icon + clear                                    | **search**                     |
| 34  | select          | `Select`                                                                                                                                                                                     | dropdown select (chips/badge multi display)                       | **dropdown**                   |
| 35  | sheet           | `Sheet`(+`Overlay/Backdrop/Content/Root/Handle/Trigger`)                                                                                                                                     | gesture sheet with snap points                                    | —                              |
| 36  | slider          | `Slider`                                                                                                                                                                                     | range/value slider                                                | —                              |
| 37  | switch          | `Switch`                                                                                                                                                                                     | on/off toggle                                                     | **toggle**                     |
| 38  | table           | `Table`, `TableLoadMore`, `TableBatchActions`, `Column`                                                                                                                                      | scrollable data table                                             | —                              |
| 39  | tabs            | `Tabs`                                                                                                                                                                                       | RAC tabs (line variant)                                           | —                              |
| 40  | tag             | `Tag`, `TagGroup`, `FilterTag`                                                                                                                                                               | static/filter chips                                               | —                              |
| 41  | text-field      | `TextField`, `TextArea`                                                                                                                                                                      | single/multi-line text input                                      | **text-input + text-area**     |
| 42  | theme           | `Theme`, `Layer`, `useTheme`, `useOverlayTheme`                                                                                                                                              | theme root/portal boundary                                        | supporting                     |
| 43  | time-field      | `TimeField`, `DateField`                                                                                                                                                                     | time/date segment inputs                                          | —                              |
| 44  | toast           | `ToastProvider`, `useToast`, `InlineNotification`, `Alert`, `ActionableNotification`                                                                                                         | queued toasts + inline feedback                                   | —                              |
| 45  | token-field     | `TokenField`, `Token`, `useTokenFieldContext`                                                                                                                                                | multi-token editor input                                          | —                              |
| 46  | toolbar         | `Toolbar`, `ToolbarGroup`, `ToolbarItem`, `ToolbarSeparator`                                                                                                                                 | action bar (context disables children)                            | —                              |
| 47  | tooltip         | `Tooltip`, `TooltipTrigger`                                                                                                                                                                  | hover/focus hint                                                  | **tooltip**                    |
| 48  | tree            | `Tree`(+`Item`, `Content`, `Indicator`, `Checkbox`)                                                                                                                                          | hierarchical collection                                           | —                              |
| 49  | (index)         | `Form`, `Label`, `Input`, `Text`, `FieldError`, `Group`, `Heading`, `Menu*`, `SelectValue`, `TabList`, `DateInput`, `Slider*`, `Collection`, `VisuallyHidden`, `useFilter`, `useListData`, … | raw RAC re-exports                                                | **form** = `Form` (no wrapper) |

No `list-box`/`preview-trigger`/`autocomplete`/`sheet`/`table`/`command-palette` stylesheet debt remains
(per `docs/css-conventions.md` §Status).

---

## 2. Button — variants and exact treatments

Source: `components/button/button.tsx` (`data-variant`, `data-size`, `data-icon-only`,
`data-hashti-size-default`), `button.css` (components layer), `frame.css:8–127` (themes layer, wins),
`relay.css` (other theme). Default `variant="primary"`; omitted `size` renders `size="lg"` markup **but**
sets `data-hashti-size-default`, and `frame.css:23` pins `--control-height: var(--hashti-size-md)` → 44px.
Explicit sizes: `sm` 2rem/32px, `md` 2.75rem/44px, `lg` 3rem/48px (`frame.ts` `size-md: 2.75rem`).

Base treated by Frame (`frame.css:8`):
`justify-content:center; gap:spacing-03 (8px); min-inline-size:0; max-inline-size:100%;
overflow-wrap:anywhere; padding:spacing-02 spacing-05 (4px 16px); border-radius:--hashti-control-radius (0.625rem/10px);
font: body-compact-01 (0.875rem / 500 / line-height 20/14 ≈1.43 / 0); color:--frame-button-ink`.

| variant             | rest                                                                                                                                     | hover                                                          | press                                            | focus-visible                                                                                           | disabled                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **primary**         | bg `button-primary` L `#272a32` D `#f1f2f6`; ink `text-on-color` L `#fff` D `#22242a`; border transparent                                | bg `button-primary-hover` `#434754`/`#d2d7e4`                  | bg `button-primary-active` `#555b6b`/`#b6bfd2`   | `outline:2px solid --hashti-focus; offset calc(2px+1px)=3px; box-shadow:none; border-color:transparent` | ink `text-disabled`=`control` `#7f8795`/`#7d8493`; bg `button-disabled`=`raised` `#eef1f6`/`#2c2f38`; border transparent |
| **secondary**       | bg `button-secondary` `raised` `#eef1f6`/`#2c2f38`; ink `text-primary` `#25272c`/`#f1f2f6`                                               | bg `button-secondary-hover`=`divider` `#dde1e8`/`#3e424d`      | bg `button-secondary-active` `#cbd2dc`/`#515765` | as primary                                                                                              | ink text-disabled; bg button-disabled; border transparent                                                                |
| **tertiary**        | transparent; **border 1px `border-strong`=`control` `#7f8795`/`#7d8493`**; ink text-primary                                              | bg `button-tertiary-hover`=`raised`; border kept               | bg `button-tertiary-active`=`divider`            | ring as primary, `border-color` stays `--hashti-border-strong`                                          | transparent bg; border `border-disabled`=`divider`; ink text-disabled                                                    |
| **ghost**           | transparent, no border; ink `text-primary` (frame overrides base `link-primary`); `padding-inline: spacing-04 (12px)` when not icon-only | bg `--button-hover` (base ghost = `background-hover`=`raised`) | bg `--button-active`=`divider`                   | ring as primary, border transparent                                                                     | transparent; ink text-disabled                                                                                           |
| **danger**          | bg `button-danger-primary`=`error` `#aa2735`/`#ffacb3`; ink on-colour                                                                    | bg `danger-hover` `#91212d`/`#ffb8be`                          | bg `danger-active` `#771b25`/`#ffc5ca`           | ring as primary                                                                                         | as primary disabled                                                                                                      |
| **danger-tertiary** | transparent; ink `button-danger-secondary`=`error`                                                                                       | ink→on-colour, bg `--button-hover`=`danger-hover`              | bg `danger-active`                               | ring, `border-color:error`                                                                              | transparent, border disabled                                                                                             |
| **danger-ghost**    | transparent; ink error                                                                                                                   | ink→on-colour, bg `danger-hover`                               | bg `danger-active`                               | ring, border transparent                                                                                | transparent, ink text-disabled                                                                                           |

Geometry / interaction extras:

- `min-height: var(--control-height, size-md)`; text may wrap (`max-inline-size:100%`, `overflow-wrap:anywhere`).
- `[data-icon-only]`: `padding:0`; width = `--control-height`.
- Press scale (themes layer `frame.css:2515`): default `scale(0.97)`, `sm 0.98`, `lg 0.96`, on
  `transform fast-01 (130ms) cubic-bezier(0.32,0.72,0,1)`; release springs on `moderate-02 (310ms)` same curve.
  (Component layer's `scale(0.98)` in `button.css` is overridden by this.)
- Pending (`data-pending`): ink transparent, child `svg` `visibility:hidden`, inline `.hashti-spinner`
  absolutely positioned and painted `--frame-button-ink`; cursor progress.
- Focus is never animated: global `:focus-visible,[data-focus-visible]{transition-property:none !important}`.
- `svg:last-child` margin-inline-end reset to 0 by frame (base Carbon 4rem/-3rem trim removed).
- Relay theme differs: `padding:0 calc(spacing-05 - 1px)`, weight 500, tertiary border `button-tertiary`,
  focus offset `2px` (no +1), transitions 175ms `ease-standard-productive`.

`Link` (`frame.css:129`): `overflow-wrap:anywhere`; underline on hover/press, `text-decoration-thickness:0.125em`,
`text-underline-offset:0.15em`; focus ring 2px / offset 3px; disabled ink `text-disabled`.

---

## 3. Field anatomy

Order (`components/field/field-layout.tsx`), Frame branch:

```
FieldLabel            data-slot="label"   (optional necessity "(required)"/"(optional)")
FieldDescription      data-slot="description"   ← BEFORE control in Frame only
<control>             data-slot="control" / .react-aria-Input / .react-aria-TextArea
FieldStatusIcon       inline inside control (search/select/date), data-slot="icon"
FieldHelp             data-slot="help"
├─ FieldErrorMessage  data-slot="error"   (RAC FieldError; standalone → span role="alert")
└─ FieldStatusMessage attached|detached presentation banner
```

Non-Frame themes move `description` into the help block (after the control). Frame's rule is
guidance → value → recovery. `Field` = `Object.assign(FieldRoot, fieldParts)`; nearly every field
namespace re-exports `fieldParts` (Label/Description/Help/ErrorMessage/Status/StatusIcon).

Base field root: `display:flex; flex-direction:column; gap:spacing-03 (8px)`.
Control surface (`frame.css:157`): `min-height:var(--control-height,size-md); height:auto;
border:1px solid --hashti-border-strong (control colour); border-radius:--hashti-control-radius (10px);
background:--hashti-field (surface); color:text-primary; caret-color:focus; font:body-02`.
Input padding: `calc(spacing-02 - 1px) spacing-04` (3px 12px), end padding `--hashti-input-padding-end|spacing-04`.
TextArea: `min-height:5rem; padding-block:spacing-04`. Select trigger: `justify-content:space-between`,
`padding:calc(spacing-02-1px) spacing-04`, never scales on press.
Hover: border `text-primary`, bg `field-hover` (=raised). Readonly: bg `layer-accent`, **dashed** border.
Disabled: bg `button-disabled` (raised), border `border-disabled` (divider), ink text-secondary; label/SelectValue
text-disabled; guidance stays text-helper (AA).
Invalid: border `support-error`, `outline:none` at rest.

### Phase 2 recovery band (attached status) — exact geometry

Attached when `data-hashti-status-variant="attached"` (default) and status is visible, not invalid:

- Control bottom corners → `3px !important` (`border-end-start/end-radius`).
- Help block pulled up by **1px overlap**:
  `margin-block-start: calc(-1 * spacing-03 - 1px) = calc(-8px - 1px) = -9px !important; z-index:1`.
- Band: `width:100%; display:flex; align-items:center; gap:spacing-03 (8px);
padding:spacing-02 spacing-04 (4px 12px); margin-block-start:0;
border:1px solid --hashti-field-status-ink; border-block-start:none;
border-start-*-radius:3px; border-end-*-radius:var(--hashti-control-radius) (10px);
background:--hashti-field-status-surface; color:text-primary;
font:helper-text-01 (0.8125rem / 1.25rem); z-index:1; pointer-events:none`.
- Stacking: controls `position:relative; z-index:2`, band `z-index:1`.
- Detached band (CheckboxGroup/RadioGroup/Switch, or `data-hashti-status-variant="detached"`):
  `width:fit-content; max-width:100%; padding:spacing-02 spacing-03 (4px 8px);
margin-block-start:spacing-02 (4px); border:1px solid status-ink; border-radius:control-radius;
background:field-status-surface; align-items:flex-start`.
- `--hashti-field-status-ink` = `support-warning` by default when `data-hashti-status="warning"`;
  error/success take their semantic support colours. Status banner suppressed when `[data-invalid]`.

### Focus ring per context (`--hashti-focus-width:2px`, `--hashti-focus-offset:2px`, `--hashti-focus` L `#365ccb` D `#a9bdff`)

| context                                                               | outline           | offset              | notes                                                                                                                                                   |
| --------------------------------------------------------------------- | ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button / Link / ToggleButton                                          | `2px solid focus` | `calc(2px+1px)=3px` | box-shadow:none; button border transparent (tertiary/danger-tertiary keep semantic border)                                                              |
| Field input / `.hashti-field__control` / input-group / select trigger | `2px solid focus` | `2px`               | only on `[data-focus-visible]` (or `:has([data-focus-visible])`); plain `:focus` is `outline:none;box-shadow:none`; also `position:relative; z-index:3` |
| Field invalid + focus                                                 | `2px solid focus` | `2px`               | same ring overrides error border paint                                                                                                                  |
| Checkbox/Radio control, Switch track                                  | `2px solid focus` | `2px`               | _also_ components-layer glow survives: `0 0 0 2px background, 0 0 0 4px focus, 0 0 8px rgba(focus,0.35)`                                                |
| Toast                                                                 | `2px solid focus` | `2px`               |                                                                                                                                                         |
| Notification / Toast close button                                     | `2px solid focus` | `-2px` (inset)      | `box-shadow:none`                                                                                                                                       |
| Tag / FilterTag                                                       | `2px solid focus` | `2px`               |                                                                                                                                                         |
| Tooltip/Dialog/Popover                                                | `outline:none`    | —                   | non-interactive surface                                                                                                                                 |

Forced colours: all rings repaint `outline-color: Highlight`.

---

## 4. Overlays

### Popover (`components/popover/popover.css`, `frame.css:782`, `1168`)

- `border:1px solid --hashti-border-subtle (divider)`; `border-radius:--hashti-popover-radius` = **1.125rem (18px)**.
- Shadow (Frame): `0 8px 24px var(--hashti-shadow)` = `0 8px 24px rgb(0 0 0 / 14%)`.
  Component-layer also: `backdrop-filter:blur(8px)`, `outline:none`.
  Dark (`hashti.dark-elevation`): `inset 0 0 1px 0 rgba(255,255,255,.2), 0 8px 24px rgba(0,0,0,.5)`.
- Padding `spacing-04 (12px)`; **0** when it contains `.react-aria-Menu`/`.react-aria-ListBox`
  (`.hashti-select-popover`, `.hashti-date-popover` included).
- Entry/exit: `hashti-frame-overlay-in` **230ms (moderate-01) cubic-bezier(0.16,1,0.3,1)** scale .97→1 + opacity 0→1;
  exit `hashti-frame-overlay-out` **130ms (fast-01) ease-in** 1→.97 + 1→0.
- Transform origins by placement: top→`center bottom`; bottom→`center top`; left→`right center`; right→`left center`.
- Tooltip subset: entry **130ms** same curve, exit 130ms ease-in; radius `control-radius (10px)`.

### Modal (`components/modal/modal.css`, `frame.css:1135`, `2588`, `3693`)

- Surface: `border:1px solid border-subtle`; `border-radius:--hashti-overlay-radius` = **1.125rem (18px)**;
  `background:layer`; `box-shadow:0 16px 48px var(--hashti-shadow)` (= rgba(0,0,0,.14)); `overflow:hidden`;
  `max-width:90vw`, widths `xs 320px / sm 440px / md 560px / lg 720px`.
  Dark: `inset 0 0 1px 0 rgba(255,255,255,.2), 0 18px 48px rgba(0,0,0,.55)`.
- Backdrop: `--hashti-overlay` = **rgb(18 22 32 / 50%)**, no blur by default;
  `data-backdrop="blur"` → `backdrop-filter:blur(6px)`; `data-backdrop="none"` → transparent, no blur;
  coarse pointer forces blur off.
- Motion: overlay-in `hashti-frame-backdrop-in` **230ms ease-out** (opacity 0→1);
  overlay-out **130ms ease-in forwards**. Modal-in `hashti-frame-modal-in` **310ms (moderate-02)
  cubic-bezier(0.16,1,0.3,1)**, opacity 0→1 + scale .95→1; modal-out **130ms ease-in forwards** 1→.95.
  (Component-layer `hashti-fade-in`/`hashti-modal-in` in `styles.css:1635` are overridden by these.)

### Drawer (`components/drawer/drawer.css`, `styles.css:1698`)

- Corners: all four `--hashti-surface-radius` = **16px**; flush edge zeroed per placement —
  right/end zero `*-end-*`, left/start zero `*-start-*`, top zero start corners, bottom zero end corners.
  (Bottom placement additionally `border-start-*-radius: --hashti-overlay-radius` (18px) from styles.css.)
- Edges: fixed; left/right = full height; top/bottom = `width:100vw`; widths `sm 20rem / md 28rem / lg 38rem /
xl 48rem / full 100vw`; vertical max-heights `30/50/70/90vh`; `box-shadow:0 16px 48px rgba(0,0,0,.2)`.
- Backdrop: `--hashti-overlay` (same 50% scrim), optional 6px blur, none transparent.
- Motion: overlay in/out **230ms cubic-bezier(0.16,1,0.3,1)** (fade); panel slides
  `translate3d(±100%,0,0)` (sides) / `(0,±100%,0)` (top/bottom) **230ms cubic-bezier(0.16,1,0.3,1)**,
  exit `forwards`; RTL animation-name swaps for end/start. No scale/origin — full edge travel.

### Sheet (`components/sheet/sheet.css`)

- radius 16px; shadow `0 16px 48px rgba(0,0,0,.2)`; width `calc(100% - 1rem)`, max 800px,
  side sheets 360px; backdrop only bottom sheet `data-stack-index="0"`.
- `transform-origin`: bottom/center `center -150px`; top `center 150px`; left/start `150px center`;
  right/end `-150px center`; perspective 1000px (RAC gesture animation, not CSS keyframes).

---

## 5. Alert / toast / inline notification variants

`InlineNotification` (default `kind="info"`, variant = `lowContrast ? "subtle" : "solid"`, role `status`);
`Alert` = same with `role="alert"`; `ActionableNotification` (role `alertdialog`, variant default subtle);
`toast` (RAC queue, max 3 visible). Kind sets CSS vars (`styles.css:3024`):
`--notification-bg`, `--notification-color`, `--notification-color-inverse`.

| status (`data-kind`) | `--notification-bg` (L / D) | `--notification-color` (L / D)               | inverse colour  |
| -------------------- | --------------------------- | -------------------------------------------- | --------------- |
| info                 | `#edf2ff` / `#2c354e`       | `support-info` = focus `#365ccb` / `#a9bdff` | inverse focus   |
| success              | `#e1f2e8` / `#203a2b`       | `#246343` / `#a4d9b8`                        | inverse success |
| warning              | `#fff0ce` / `#3e3321`       | `#75500d` / `#e7c383`                        | inverse warning |
| error                | `#ffe8eb` / `#452830`       | `#aa2735` / `#ffacb3`                        | inverse error   |

| variant              | background             | border                                                                                                                                         | text                                | icon                                                                                                                                                           |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **subtle** (default) | `--notification-bg`    | `1px solid --notification-border` where border = `color-mix(in srgb, <semantic> 35%, --hashti-border-subtle)`; `border-inline-start-width:1px` | `text-primary`                      | `--notification-color` (+1rem end margin)                                                                                                                      |
| **solid**            | `--notification-color` | `1px solid --notification-color`                                                                                                               | `text-on-color` (#fff L, #151515 D) | `text-on-color`; description `color-mix(on-color 88%, transparent)`; buttons on-colour. Dark theme flips fill to `--notification-color-inverse` with white ink |
| **bordered**         | `layer-01` (surface)   | `1px solid --notification-color`                                                                                                               | `text-primary`                      | icon boxed: `padding:spacing-01 (2px); border-radius:control-radius; background:--notification-bg; box-sizing:content-box`                                     |

Structure / geometry:

- `.hashti-notification`: `border-radius:control-radius (10px); border 1px; padding:spacing-04 (12px);
gap:spacing-03; overflow:hidden`.
- `.hashti-toast`: `border-radius:10px; border 1px border-subtle; padding:spacing-03 spacing-04 (8px 12px);
background:layer-01; gap:8px; shadow 0 10px 30px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)`;
  entry via `@starting-style { opacity:0; translate:0 spacing-03 }` transition 230ms cubic-bezier(0.23,1,0.32,1).
  Title `body-compact-01/600`; description `helper-text-01 / text-secondary`.
- `.hashti-actionable-notification`: `display:flex; align-items:flex-start; gap:8px; padding:12px;
radius:10px; background:layer-01; border 1px`. Subtle sets bg to `--notification-bg`; solid bg semantic;
  bordered bg layer-01 + semantic border. Action buttons: outline in semantic colour, hover → `--notification-bg`;
  solid → transparent, border `currentColor`, hover `color-mix(currentColor 16%, transparent)`.
- Dismiss close button: `size-sm (32px)` square, `border-radius:control-radius`, `padding:0`.
- Forced colours: notifications/toasts/cards repaint border `ButtonText`.

---

## 6. Checkbox / Radio / Switch

Frame values in `frame.css:453–780` override `checkbox.css`/`radio.css`/`switch.css` (components layer).
Unselected base from components layer, overridden dimensions in themes layer:

| property               | Frame value                                                                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| row                    | `min-height:size-md (44px); gap:spacing-03 (8px)`; checkbox/radio `padding-block:spacing-04 (12px)`; `font body-01` / `body-compact-01` line-height                                                                   |
| checkbox control       | `1.125rem × 1.125rem` (**18px**), `border-radius:0.3125rem (5px)`, `border:1px solid border-strong` (`control` #7f8795/#7d8493), `margin-block-start:1px`                                                             |
| radio control          | `18×18`, `border-radius:9999px`, same 1px border; selected dot `::after` 10×10                                                                                                                                        |
| switch track           | 44×24, `border-radius:9999px`, `background:border-subtle`, `padding:2px`; `sm` 34×18                                                                                                                                  |
| switch thumb           | 20×20 circle, white, `box-shadow:0 1px 3px rgba(0,0,0,.2)`; `sm` 14×14                                                                                                                                                |
| transition             | control `transform fast-01 (130ms) cubic-bezier(0.16,1,0.3,1)`; switch bg/thumb `moderate-01 (230ms)` same curve                                                                                                      |
| press                  | checkbox/radio control `scale(0.9)` (component layer says .92, themes wins); unselected press bg `layer-active`                                                                                                       |
| hover                  | border `text-primary`                                                                                                                                                                                                 |
| selected fill          | checkbox bg+border `--hashti-focus` (#365ccb/#a9bdff), icon `icon-on-color`; radio border focus + dot focus; switch track focus, thumb `translateX(20px)` (sm `16px`)                                                 |
| colour variants        | `success`→`support-success`; `warning`→`support-warning` (checkbox icon ink `#161616`); `danger`→`support-error`; `secondary`→`icon-secondary` (dark: icon ink `background`)                                          |
| disabled               | border `icon-disabled`; selected checkbox bg `icon-disabled`; radio dot `icon-disabled`; switch track `border-disabled`, thumb `icon-disabled`; row opacity .5 + `cursor:not-allowed` (component layer)               |
| readonly               | cursor default; checkbox/radio **dashed** border + `layer-accent` bg; switch keeps pill: bg `layer-accent`, border `border-subtle`, thumb `icon-secondary`, transitions off                                           |
| invalid (unselected)   | border `support-error`                                                                                                                                                                                                |
| **invalid precedence** | `[data-invalid][data-selected]` and `[data-invalid][data-indeterminate]` paint `background/border` (or radio border+`::after`, switch track) `support-error !important` — always wins over selected + colour variants |
| group invalid          | options keep `border-strong`; selected options keep `focus` border — the **group** owns the error paint, not each option                                                                                              |
| table checkbox         | 1rem (16px), `padding:0`, `margin-block-start:0.125rem`                                                                                                                                                               |

Focus: outline 2px / offset 2px on the control or track (see table §3); component-layer glow remains.

---

## 7. Naming, theme and attribute conventions

From `docs/css-conventions.md` + code:

- **Layers** (declared once, `layers.css`): `hashti.tokens, hashti.reset, hashti.components, hashti.themes,
hashti.accessibility`. `frame.css` also writes `hashti.motion`, `hashti.coarse`, `hashti.dark-elevation`.
  `!important` is not a layer; order statement is line 1 of the entry sheet.
- **One file per component**: `components/<name>/<name>.css`, imported by `styles.css`. Shared parts
  (field anatomy, popover surface) stay in `frame.css` inside `@layer hashti.themes { @scope … }`.
- **BEM hooks**: block `hashti-<component>`; element `hashti-<component>__<part>` (e.g. `hashti-field__label`,
  `hashti-field__status`, `hashti-token__remove`); modifier suffix `--<modifier>`
  (`hashti-field__status--detached`, `hashti-token-field--multiline`, `hashti-tile--clickable`).
  Compound sub-parts often use flat hyphenated names (`hashti-drawer-header`, `hashti-actionable-notification-actions`).
- **RAC classes preserved**: `className` never replaces the default `react-aria-*`; wrappers keep both
  (`classes()` in `utils.ts` composes the RAC render-prop className; `cx()` joins literals). Selector intent:
  style own class, not `react-aria-*` from a component file; `:is()`/`:where()` for variants; exclude, don’t undo.
- **Theme classes**: root `hashti-theme` + `data-hashti-theme="<name>"` (default `frame-light`);
  nested `hashti-layer` + `data-hashti-layer="<n>"`. `appearanceClassName` replaces the portable root/portal recipe.
  Overlays carry `data-hashti-theme`/`data-hashti-layer`/`dir`/`lang` through `useOverlayTheme()` because CSS
  inheritance stops at a portal. Eight themes exist (`white, g10, g90, g100, relay-light, relay-dark, frame-light, frame-dark`);
  Frame styling is `@scope`-bound so it cannot leak into a nested theme.
- **State/variant attributes** (CSS never re-implements RAC states with pseudo-classes):
  `data-variant` (primary/secondary/tertiary/ghost/danger/danger-tertiary/danger-ghost; also
  subtle/solid/bordered for feedback; line for tabs), `data-size` (sm/md/lg/xl/full; xs for avatars/modal),
  `data-kind` (info/success/warning/error; danger for alert dialog), `data-color`
  (primary/secondary/success/warning/danger), `data-placement` (drawer/sheet/popover), `data-slot`
  (root/label/control/description/error/item/icon/close/remove), `data-hashti-status` (warning/error/success),
  `data-hashti-status-variant` (attached/detached), `data-hashti-size-default`, `data-icon-only`,
  `data-inline`, `data-multiline`, `data-backdrop` (blur/none), `data-low-contrast`.
  Interaction states from RAC: `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`,
  `data-indeterminate`, `data-disabled`, `data-readonly`, `data-invalid`, `data-pending`, `data-entering`,
  `data-exiting`, `data-expanded`.
- **Values from tokens**: colours/spacing/radii/durations/type are `var(--hashti-*)`; hex only as documented
  legacy fallback. Ladder: `fast-01 130ms, fast-02 175, moderate-01 230, moderate-02 310, slow-01 410, slow-02 730`.
  Easings: `ease-standard-productive cubic-bezier(.2,0,.38,.9)`, `ease-entrance-productive cubic-bezier(0,0,.38,.9)`,
  `ease-exit-productive cubic-bezier(.2,0,1,.9)`, motion curve `cubic-bezier(.16,1,.3,1)`,
  press curve `cubic-bezier(.32,.72,0,1)`.
- **Token shapes (Frame, `frame.ts`)**: `control-radius .625rem (10px)`, `group-radius .875rem`,
  `popover-radius` & `overlay-radius 1.125rem (18px)`, `surface-radius 16px` (declared in styles.css),
  `focus-width 2px`, `focus-offset 2px`. `--hashti-shadow` / `--hashti-overlay` are _colours_ and may only
  appear inside a shadow or as a scrim (a bare shadow value once lost dark elevation).

### Design-doc deltas worth flagging (extraction, not a fix list)

- `checkbox.css/radio.css/switch.css` still carry the older 20px mark, 6px radius and the box-shadow focus
  glow from the components layer; Frame’s themes layer wins on size (18px/5px) and paints `outline`, but the
  glow box-shadow is a different property and therefore still renders alongside the Frame ring.
- `styles.css` `:root { --hashti-surface-radius:16px }` vs Frame’s `--hashti-overlay-radius:18px`: modal/popover
  use 18px, drawer uses 16px.
- `--hashti-field-status-ink` has no frame.ts export; warning is set in `frame.css:317`, error/success arrive
  via `support-*` tokens on the band.

---

### Git activity since 2026-11-05 (`git log --oneline --since=2026-11-05 -- packages/react`)

```
25575f6 Extract Hashti design system from Carbon
ea23d8e feat(feedback): unify the notification variant system
b9ab269 fix(fields): DateRange gap and FieldStatus layout
1792760 fix(css): harden the architecture guard and delete the dead color.css
841685d fix(components): the quality sweep — 30 reported defects, four agents
e1f1190 fix(theme): declare the cascade layer order before any component CSS
2d8c6c9 feat(field): one anatomy module, standalone parts, ten fields on it
bc29c4d feat(css): give components their own stylesheets and a guard to keep them honest
d896ff1 fix(theme): dark overlays, disabled fields and selection follow the tokens
f9764a7 fix(react): let a wide table scroll instead of being clipped
93788f2 fix(react): repair the styling layers the theme review exposed
3e04657 fix(frame): one focus ring, painted by the keyboard only
ed371f5 feat(frame): time motion on the Astryx ladder and rebuild the brandbook cards
409ea71 fix(frame): name the properties each component transitions
6f15359 fix(frame): make micro-interactions answer the press, honour reduced motion
caf0809 chore: clear the lint gate and finish package verification
003e009 feat(docs): rebuild the home page from Hashti components
4462f41 chore: apply workspace formatting
ab35029 fix(frame): align focus rings, radii, backdrops, and neutral tones with DESIGN.md
c51fe89 fix: CommandPalette side-effect-free state updates, InputOTP digits-only, toast ref merge, getInitials tests
93a1a94 fix: repair build/preview pipeline, collapse doubled hashti classes, remove 91 stub stories/tests
1f710c1 refactor: update component class names from "cinder" to "hashti" across unit tests
d943448 feat(hashti): purge Carbon traces from catalog and storybook, revert component focus rings to interactive blue
6ea1888 feat(hashti): purge duplications, add live component previews, show/hide code, and native brandbook
d3f9904 feat(react): re-architect components into modular folders with Hashti modern design
afc482d feat(hashti): rebrand entire repository from cinder to hashti (@hashti/react, @hashti/tokens)
```
