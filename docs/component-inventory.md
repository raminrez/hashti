# Component Inventory

Approved 18 November 2026 — the disposition of every Hashti component under the ui-sdk
rewrite (ADR-0002).
`@hashti/react` is a thin layer over `@ui-sdk/react`: wrap only where Hashti adds API
(variants, sizes, compound anatomy, icons); otherwise re-export. No RAC compatibility.

Dispositions:

- **wrap** — Hashti component wraps the ui-sdk one and adds API (variant/size props,
  compound parts, icons). Example: Button wraps `@ui-sdk/react/button` to add variant/size.
- **re-export** — ui-sdk component exported as-is; Hashti styles target its data-slot/state attrs.
- **css-only** — no behavior needed; stays a Hashti presentational component with just a class hook.
- **remove** — redundant or not wanted.
- **add** — ui-sdk component Hashti lacks and should adopt.

Style inventory: `packages/styles/src/components/` has 35 entries; components marked "no
`@hashti/styles` CSS" below currently ship styling from `packages/react/src/styles.css` /
theme files or have none yet. Ticket references were renumbered after the decisions log below was resolved.

## Summary table

| Canonical Hashti name | Disposition | ui-sdk entry | Owning ticket | Notes |
|---|---|---|---|---|
| Accordion (was Disclosure) | wrap | `@ui-sdk/react/accordion` | TICK-009 | Adds size, variant (`default`/`card`/`flush`), chevron icon. ui-sdk Accordion covers RAC Disclosure + DisclosureGroup (incl. single-expand groups). |
| Alert (in toast/ dir) | wrap | `@ui-sdk/react/alert-dialog` | TICK-007 | Split out of toast.tsx: `Alert`/`InlineNotification`/`ActionableNotification` are notification variants inherited from the original catalog. AlertDialog is ui-sdk's modal-confirm; the inline variants are css-only. Decide split: AlertDialog wrapper → TICK-007; InlineNotification css-only → TICK-001 or a notification ticket. |
| Autocomplete | re-export | `@ui-sdk/react/autocomplete` | TICK-006 | Current Hashti wrapper adds only a filter default. Re-export; used by Combobox/CommandPalette composition. |
| Avatar | wrap | `@ui-sdk/react/avatar` | TICK-012 | Hashti adds size scale, initials (`getInitials` with locale), `AvatarGroup` with overlap. Wrap for those; ui-sdk avatar handles image/fallback. Owned by the presentational batch. |
| Badge | css-only | — | TICK-001 | `<span>` with `content`/count + `AILabel` variant. No behavior. |
| Breadcrumbs | css-only | — | TICK-002 | Presentational: an `<ol>` of Hashti `Link`s. ui-sdk ships no breadcrumb by design. |
| Button | wrap | `@ui-sdk/react/button` | TICK-002 | Adds `variant`, `size`, `iconOnly`, `pendingLabel` (map to ui-sdk `pendingAnnouncement`), `agentConfirm` (map to ui-sdk agent `confirm`). RAC variants `tertiary`/`danger-tertiary`/`danger-ghost` collapse into the ui-sdk set per AGENTS.md (`primary`/`secondary`/`danger`/`ghost`/`outline`). |
| Card | css-only | — | TICK-012 | Presentational (`card.tsx`, `tile.tsx`). No ui-sdk card. Keep as Hashti presentational. |
| Checkbox | wrap | `@ui-sdk/react/checkbox` | TICK-004 | Adds size + field-anatomy composition (`FieldLayout`). `checked` accepts `"indeterminate"` per AGENTS.md. |
| CodeSnippet | css-only | — | TICK-012 | Hashti-only: single/multi/inline + copy button (composes Hashti `Button`). |
| ColorPicker (was color/) | wrap | `@ui-sdk/react/color-picker` | TICK-016 | Rename dir `color` → `color-picker`. Hashti ships ColorArea/Slider/Wheel/SwatchPicker/ColorField; verify ui-sdk part coverage (swatch picker, wheel) before committing — likely partial wrap + re-export mix. |
| ComboBox | wrap | `@ui-sdk/react/combobox` | TICK-006 | Adds size + field anatomy + Popover/ListBox composition. |
| CommandPalette → Command | wrap | `@ui-sdk/react/command` | TICK-006* | ui-sdk `command` is the palette (CommandInput/List/Group/Item/Shortcut); put in a `Dialog` for the modal palette. Hashti's Modal+Autocomplete+ListBox+Kbd assembly collapses into it. Rename to `Command` (ui-sdk's name).  |
| DatePicker | wrap | `@ui-sdk/react/date-picker` | TICK-016 | Adds Popover + Field composition, `RangeCalendar`. Wrap. Also adopt ui-sdk `calendar` + `date-input` re-exports (below). |
| Dialog | wrap | `@ui-sdk/react/dialog` | TICK-007 | ui-sdk Dialog has Backdrop/Content/Title/Description/Trigger/Close built in — Hashti's separate `Modal` (overlay+scrim) collapses into `DialogBackdrop`. Merge Modal into Dialog; keep Hashti `size`, `backdrop` (`dim`/`blur`/`none`), `AlertDialogKind` (danger/warning/info) on top. |
| Drawer | wrap | `@ui-sdk/react/drawer` | TICK-007 | ui-sdk Drawer is edge-anchored, draggable, snap points — covers Hashti `Drawer` and `Sheet`. Sheet merges into Drawer; Drawer keeps a `draggable={false}` mode for the desktop panel-from-edge case. |
| Dropzone → FileInput | wrap | `@ui-sdk/react/file-input` | TICK-005 | ui-sdk `file-input` is the dropzone/file-trigger primitive. Rename Dropzone → FileInput; Hashti keeps `variant` (`dashed`/`solid`/`card`) + `onDropFiles` convenience.  |
| EmptyState | css-only | — | TICK-012 | Presentational (icon/title/description/actions). |
| Field | wrap | `@ui-sdk/react/field` | TICK-005 | Hashti's field anatomy (`FieldLayout`, `FieldInput`, `FieldTextArea`, `FieldControl`, status/statusVariant/isOptional) maps onto `Field`/`FieldLabel`/`FieldDescription`/`FieldError`. Wrap to keep Hashti's layout/status API. |
| GridList | remove | — | TICK-010 | ui-sdk ships no grid-list (confirmed against docs index). Dropped from the rewrite; a future behavior-rich grid is a post-rewrite project on `@ui-sdk/core`. |
| InputOTP → OtpInput | wrap | `@ui-sdk/react/otp-input` | TICK-005 | Rename InputOTP → OtpInput (ui-sdk name). Wrap for size + Field composition. |
| Kbd | css-only | — | TICK-001 | `<kbd>` + platform key-symbol map. No behavior; ui-sdk doesn't ship one. |
| Layout | css-only | — | TICK-012 | Not one component: `Stack`, `Grid`, `GridColumn`, `Header`, `HeaderName`, `HeaderNav`, `SideNav`, `List`, `StructuredList`. All presentational class hooks. Consider splitting into separate entry points; no ui-sdk equivalent needed. |
| Link | wrap | `@ui-sdk/react/button` (`render={<a>}`) | TICK-002 | ui-sdk has no Link; use `Button` with `render` to an anchor (ui-sdk's `render` prop replaces RAC `as`). Hashti keeps a `Link` wrapper with its own variants for call sites. |
| ListBox → Listbox | wrap | `@ui-sdk/react/listbox` | TICK-006 | Rename ListBox → Listbox (ui-sdk casing). Adds size, sections, load-more, empty state. |
| Meter | wrap | `@ui-sdk/react/meter` | TICK-005 | ui-sdk ships meter. Hashti adds label/value parts. Wrap. Folded into TICK-005. |
| Modal | remove | — | TICK-007 | RAC's Modal/ModalOverlay split disappears; ui-sdk Dialog owns backdrop + focus + dismissal. Merge into Dialog. |
| NavigationTree → Tree | wrap | `@ui-sdk/react/tree` | TICK-010 | One `Tree` on ui-sdk's tree (Tree/TreeGroup/TreeItem/TreeItemIndicator/TreeItemLabel); navigation-tree's Section/Header/size API survives as Hashti compound parts. Remove `navigation-tree/`. |
| NumberField → NumberInput | wrap | `@ui-sdk/react/number-input` | TICK-005 | Rename. Adds size + Field composition + steppers. |
| Pagination | wrap | `@ui-sdk/react/pagination` | TICK-005 | Hashti also ships `NativeSelect` here (page-size picker); that folds into Select. Wrap ui-sdk pagination.  |
| Popover | wrap | `@ui-sdk/react/popover` | TICK-007 | Thin wrap + `OverflowMenu` variant (a Menu inside a Popover — keep as Hashti recipe over ui-sdk `menu` + `popover`, or ui-sdk `trigger-menu`; see Decisions log). |
| Progress | wrap | `@ui-sdk/react/progress` | TICK-005 | `ProgressBar` + `ProgressCircle` variants. ui-sdk progress covers bar; circle may stay a Hashti styled variant.  |
| Radio | wrap | `@ui-sdk/react/radio` | TICK-004 | `Radio` + `RadioGroup` with Field anatomy. |
| SearchField | wrap | `@ui-sdk/react/input` | TICK-005 | ui-sdk has no search entry. Thin Hashti wrapper over `Input type="search"` adding the search icon + clear button. |
| Select | wrap | `@ui-sdk/react/select` | TICK-006 | Adds size + Field anatomy + Popover/Listbox composition. |
| Separator (was Divider) | re-export | `@ui-sdk/react/separator` | TICK-001 | Rename Divider → Separator. Pure re-export; Hashti CSS targets `role="separator"` / data-orientation. |
| Sheet | remove (merge into Drawer) | `@ui-sdk/react/drawer` | TICK-007 | See Drawer. RAC Sheet ≈ ui-sdk Drawer with positions; keep one edge overlay. |
| Slider | wrap | `@ui-sdk/react/slider` | TICK-005 | Range + single.  |
| Switch | wrap | `@ui-sdk/react/switch` | TICK-004 | Adds size + color. `Switch` + `SwitchThumb` parts. |
| Table | css-only | — | TICK-010 | ui-sdk ships no table (confirmed). Ship a css-only semantic `<table>` style now; sorting/resizable/load-more behavior is a post-rewrite project on `@ui-sdk/core`. |
| Tabs | wrap | `@ui-sdk/react/tabs` | TICK-009 | Adds `variant` (`line`/contained) + size. |
| Tag | css-only | — | TICK-012 | Presentational `Tag` (color/size). The RAC `TagGroup`/`TagList` in the same file are behavior — fold into `TokenInput` (ui-sdk) for removable-tag use cases; keep presentational Tag for static labels. |
| TextField → Input / Textarea | wrap | `@ui-sdk/react/input`, `@ui-sdk/react/textarea` | TICK-005 | Split Hashti's TextField/TextArea roots onto ui-sdk `Input` and `Textarea` inside Field anatomy. Rename to match ui-sdk entries. |
| Theme | css-only (provider) | — | TICK-012 | Hashti-only: theme/layer context + sets `dir`/`lang` on the DOM root (ui-sdk reads direction from the DOM). RAC `I18nProvider` is deleted — the last RAC dependency in the providers layer. |
| TimeField → TimeInput | wrap | `@ui-sdk/react/time-input` | TICK-005 | Rename. Also re-export ui-sdk `date-input` for the DateField half. |
| Toast | wrap | `@ui-sdk/react/toast` | TICK-008 | `ToastProvider` + toast queue → ui-sdk toast. Inline/actionable notification variants split out (see Alert row). |
| TokenField → TokenInput | wrap | `@ui-sdk/react/token-input` | TICK-006* | Rename. Hashti's custom token field maps to ui-sdk token-input (tokens + input).  |
| Toolbar | wrap | `@ui-sdk/react/toolbar` | TICK-003 | Adds size/orientation/variant (`flat`/`raised`/`floating`) + disabled context. |
| Tooltip | wrap | `@ui-sdk/react/tooltip` | TICK-008 | Thin wrap (delay, placement). |

### Adopt from ui-sdk (`add`)

| Canonical Hashti name | Disposition | ui-sdk entry | Owning ticket | Notes |
|---|---|---|---|---|
| Calendar | add (re-export) | `@ui-sdk/react/calendar` | TICK-016 | Needed standalone (currently only reachable inside DatePicker). |
| DateInput | add (re-export) | `@ui-sdk/react/date-input` | TICK-016 | Replaces the DateField half of `time-field/`. |
| PasswordInput | add (re-export) | `@ui-sdk/react/password-input` | TICK-016 | Obvious design-system fit (visibility toggle); Hashti lacks it. |
| HoverCard | add (re-export) | `@ui-sdk/react/hover-card` | TICK-016 | Direct replacement for `preview-trigger/` (link preview on hover/focus with delays). Remove `preview-trigger/`. |
| Collapsible | add (re-export) | `@ui-sdk/react/collapsible` | TICK-016 | Single-panel show/hide; cheaper than Accordion for lone disclosures. |
| Menu | add (wrap) | `@ui-sdk/react/menu` | TICK-016 | Required to rebuild `OverflowMenu` and any action menus; Hashti currently has no menu. |
| ScrollArea | add (re-export) | `@ui-sdk/react/scroll-area` | deferred | Useful for Select/Listbox/Table overflow; not urgent. |
| Rating | add (re-export) | `@ui-sdk/react/rating` | deferred | Fits a design system; no current Hashti consumer. |
| Resizable | add (re-export) | `@ui-sdk/react/resizable` | deferred | Panel splitters; no current Hashti consumer. |
| Carousel | add (re-export) | `@ui-sdk/react/carousel` | deferred | Fits a design system; no current Hashti consumer. |
| Menubar | add (re-export) | `@ui-sdk/react/menubar` | deferred | Desktop-style app menus; niche. |
| Timeline | add (re-export) | `@ui-sdk/react/timeline` | deferred | Activity feeds; no current Hashti consumer. |
| NavigationMenu | add (re-export) | `@ui-sdk/react/navigation-menu` | deferred | Site-header mega-menu; overlaps with Hashti `layout/` HeaderNav — decide which owns header navigation. |
| Waterfall / FileInput-adjacent extras | skip | `@ui-sdk/react/waterfall`, `image-cropper`, `trigger-menu`, `async-options`, `shortcuts`, `text-match`, `preferences` | unscheduled | Not design-system surface (visualization/app glue) or covered elsewhere. `shortcuts` may pair with Kbd later. |

Not adopted from ui-sdk's non-component entries: `agent`, `observe`, `history`,
`gesture`, `overlays`, `primitive`, `color`, `date`, `number`, `label`, `text-match`,
`image`, `preferences` — utilities/building blocks, imported directly where a wrapper
needs them, not exposed as Hashti components.

## Rename map

| Old Hashti/RAC name | New canonical name | Verified against ui-sdk doc |
|---|---|---|
| Disclosure (+DisclosureGroup) | Accordion | `accordion.md` — items with trigger + panel, single/multi expand |
| Divider | Separator | `separator.md` — `orientation` prop |
| ContentSwitcher (ToggleButtonGroup, single-select) | SegmentedControl | `segmented-control.md` — one value, sliding indicator, radio-group semantics |
| ToggleButton (standalone) | Toggle | `toggle.md` — `pressed`/`defaultPressed`/`onPressedChange` |
| InputOTP | OtpInput | `otp-input.md` — OTPInput + Group/Slot/Separator parts |
| TokenField | TokenInput | `token-input.md` |
| NumberField | NumberInput | `number-input.md` |
| TimeField | TimeInput | `time-input.md` |
| TextField | Input (text) / Textarea | `input.md`, `textarea.md` |
| SearchField | SearchField (thin) over Input | no ui-sdk search entry; `input.md` |
| DateField (in time-field/) | DateInput | `date-input.md` |
| CommandPalette | Command | `command.md` — palette = Command inside Dialog |
| ListBox | Listbox | `listbox.md` |
| color/ (ColorPicker, ColorArea, …) | ColorPicker | `color-picker.md` |
| Dropzone | FileInput | `file-input.md` |
| NavigationTree | Tree | `tree.md` |
| PreviewTrigger | HoverCard | `hover-card.md` — link preview on hover/focus, `delay`/`closeDelay` |
| Modal | (removed — folds into Dialog) | `dialog.md` — DialogBackdrop/Content |
| Sheet | (removed — folds into Drawer) | `drawer.md` |
| ProgressBar/ProgressCircle | Progress | `progress.md` |
| TagGroup/TagList (removable tags) | TokenInput | `token-input.md` |

## Decisions log

Resolved 18 November 2026 (was: Open questions):

1. **Table + GridList (TICK-010).** ui-sdk ships neither. Descoped from the rewrite: Table
   ships as a css-only semantic `<table>` style, GridList is dropped. A behavior-rich data
   grid (sorting, resizing, load-more) is a post-rewrite project built on `@ui-sdk/core`,
   with its own ticket when that work is scheduled.
2. **Overlay consolidation.** Four RAC-era surfaces become two: `Dialog` (ui-sdk dialog +
   Hashti `size`/`backdrop`) absorbs `Modal`; `Drawer` (ui-sdk drawer) absorbs `Sheet` and
   keeps a `draggable={false}` mode for desktop edge panels. `modal/` and `sheet/` deleted.
3. **Breadcrumbs.** Kept as css-only, composing Hashti `Link`.
4. **Tree.** One `Tree`; navigation-tree's Section/Header/size API survives as Hashti
   compound parts; `navigation-tree/` deleted.
5. **Theme.** RAC `I18nProvider` replaced by a Hashti context that sets `dir`/`lang` on the
   DOM root. Theme shrinks to theme class + layer + dir/lang.
6. **OverflowMenu.** Rebuild target (`menu` + `popover` vs `trigger-menu`) is decided in
   TICK-016 after reading `trigger-menu.md` — a fact lookup, not a design decision.
7. **Ticket ownership.** TICK-012 = css-only presentational batch (Avatar group API where
   css-only applies, Card, CodeSnippet, EmptyState, Layout, Tag, Theme). Meter, Pagination,
   Progress, Slider, TimeInput, FileInput fold into TICK-005. TICK-016 = the `add` batch
   (Calendar, DateInput, PasswordInput, HoverCard, Collapsible, Menu).
8. **SearchField.** Kept as a thin Hashti wrapper (icon + clear over `Input type="search"`).
9. **Color components.** Whether ui-sdk `color-picker` covers swatch-picker and color-wheel
   is verified in TICK-016 against `color-picker.md`; uncovered parts are built on
   `@ui-sdk/core` or descoped then.
10. **Toast split.** Toast → TICK-008 (ui-sdk toast), AlertDialog-style confirm → TICK-007,
    inline/actionable notifications → css-only in TICK-012. The `toast/` directory breaks up
    along those lines.
