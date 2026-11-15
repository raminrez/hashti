# Component review — one by one

Reviewed against `DESIGN.md` (visual authority), Astryx (visual reference), HeroUI v3 and
IntentUI (architecture and React Aria usage). Every row is either a fix that landed or a written
"no change" with the reason. Evidence is from Storybook at `:6006` (light 1280, light 375, dark
1280), axe `wcag2a`+`wcag2aa`, and Playwright probes.

Branch: `fix/hashti-design-qa`.

## Global defects found by the sweep (fix once, not per component)

These were invisible in a per-component read because each one is a single line that silently
disables a stylesheet layer. They are fixed first, and every later verdict assumes them.

1. **Root font size was forced to 14px by the theme reset** (`styles.css`), so every rem token
   resolved 12.5% low: controls measured 28/39/42px where DESIGN says 32/44/48, list rows 18px,
   helper text 10.5px. The reset now sets flow text one level below the theme root, and the
   geometry measures exactly 32/44/48.
2. **RAC's own class was dropped by wrappers.** Passing `className` to a React Aria component
   replaces its `react-aria-<Name>` class, and both stylesheets key much of their styling on those
   names. `ListBoxItem` was the worst case: no padding, no hover, no selected fill, 18px rows.
   Restored on ListBox item/section, Slider track/fill/thumb, GridList (+item), Tree (+item),
   Color parts, Disclosure panel, DropZone, Sheet parts, Toolbar, Separator.
3. **Legacy teal fallbacks** (`var(--hashti-primary, #08bdba)`) survived in 9 component files.
   Frame-only is confirmed, so these now read `var(--hashti-focus)`.
4. **Eight component stylesheets were never imported** — `input-otp`, `breadcrumbs`,
   `code-snippet`, `divider`, `field`, `layout`, `navigation-tree`, `slider` — so their rules were
   dead while `styles.css` and `frame.css` carried the live copies. They are deleted. The input OTP
   was the visible casualty: its only focus styling lived in the dead file, so the digits fell back
   to the browser's default ring. The live copy now paints the Frame ring on keyboard focus only.
5. **Thirteen legacy glow focus rings** survived the earlier "one focus ring" commit, and each one
   stacked a 12px blue halo on top of the shared ring. All thirteen now use the standard 2px ring
   at a 2px offset. The migration script had also left four identical selectors in each rule; those
   are collapsed.
6. **Motion durations** were hardcoded in 207 places at 70–700ms while the token ladder is
   130/175/230/310/410/730. They now use the ladder tokens (`--hashti-duration-fast-01` etc.).
7. **Three progress fills still animate `width`**, which is a layout property. It is the one case
   where the measurement is the point, so it stays for now; convert to `scaleX` with a logical
   `transform-origin` when those components are next touched.
8. **Story assertions raced the entry animation.** `data-entering` is `opacity: 0` for one frame,
   so `toBeVisible()` immediately after opening was failing across Modal, Popover, Tooltip, Menu,
   Breadcrumb, Command Palette and Settings stories. Assertions now retry.

## Per component

Legend: **fix** = a change landed, **no change** = reviewed, nothing justified, **gap** = defect
logged here and deferred with a reason.

### Actions

| Component | Verdict                                                                                                                                                                                                                                                                                                                                                                           | Notes                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Button    | fix: a disabled Toolbar disabled nothing (React Aria's Toolbar has no `isDisabled`, and our wrapper's `aria-disabled` never reached the DOM), so the buttons inside stayed tabbable and operable while only looking dim. Button now reads `ToolbarContext` and renders real `disabled`. Otherwise 44px default, 32/44/48 sizes, one 2px ring at 3px offset, press scale 0.96–0.98 |
| Link      | no change                                                                                                                                                                                                                                                                                                                                                                         | Inline underline is opt-in; focus ring shared.                         |
| Toolbar   | fix                                                                                                                                                                                                                                                                                                                                                                               | Root and separator lost their RAC classes; separator styling was dead. |

### Collections

| Component      | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| ListBox        | fix: item styling was entirely dead (see global 2); rows are now 44px with hover, selected, focus-visible and disabled states. Known gap: `ListBox.DragHandle` and `ListBox.Checkbox` place a focusable control inside the option, which axe reports as `nested-interactive` (negative `tabindex` and `aria-hidden` do not satisfy it, and React Aria's own drag-handle pattern has the same shape). The reorderable demo reorders from the option itself; the handle part stays pointer-only until the pattern is revisited |
| GridList       | fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Root and item RAC classes restored.                            |
| Tree           | fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Tree and TreeItem RAC classes restored.                        |
| NavigationTree | fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Teal link fallback replaced with focus ink.                    |
| Autocomplete   | no change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Pure composition over RAC Autocomplete; no styling of its own. |

### Content

| Component                                                        | Verdict   | Notes                                                                                                                                       |
| ---------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Tag                                                              | fix       | Remove target was 14px; now 24px and still keyboard-operable (Enter removes, focus falls to the tag). The `a11y:gap` Storybook tag is gone. |
| Divider                                                          | fix       | Separator RAC class restored.                                                                                                               |
| Card, Tile, Avatar, Badge, EmptyState, Kbd, CodeSnippet, AILabel | no change | Surface roles, tokens only, no interactive state to audit.                                                                                  |

### Data

| Component         | Verdict   | Notes                                                                               |
| ----------------- | --------- | ----------------------------------------------------------------------------------- |
| Table             | no change | Row/Cell keep their RAC classes; batch bar is a real region with an explicit label. |
| StructuredList    | no change | Continuous rows, no card per row (DESIGN).                                          |
| TableBatchActions | gap       | Accessible name is a hardcoded English string, see i18n below.                      |

### Feedback

| Component                                                  | Verdict                                                                                                                                                                                                                                                                                                                | Notes                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Tooltip                                                    | fix: text failed AA at 1.04:1. Cause was cascade order, not the palette — a tooltip portals out of the Theme, carries `data-hashti-theme` itself, and the reset's `color: var(--hashti-text-primary)` beat the component's inverse ink. The Frame tooltip rule now states the inverse pair (13.9:1 light, 13.4:1 dark) |
| ProgressBar / ProgressCircle / Meter                       | fix                                                                                                                                                                                                                                                                                                                    | Selected-fill teal fallback replaced.                                      |
| Toast                                                      | fix                                                                                                                                                                                                                                                                                                                    | Dismiss label is hardcoded; also listed under i18n.                        |
| Alert, InlineNotification, ActionableNotification, Loading | no change                                                                                                                                                                                                                                                                                                              | Subtle/solid/bordered variants match DESIGN; no heavy left-accent borders. |

### Fields

| Component                                                  | Verdict                                                                                                       | Notes                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select                                                     | fix                                                                                                           | Chip removal was pointer-only inside a focusable trigger. The trigger now answers Backspace/Delete by dropping the last chip, and chips are no longer a broken nested button. Multiple selection coverage added (`MultipleSelection` story) — it had none, which is how the defect survived. |
| ComboBox                                                   | fix: same chip treatment as Select. Its trigger's accessible name is a hardcoded "Open items list" (see i18n) |
| Checkbox, Radio, Switch                                    | fix                                                                                                           | Teal selected fill replaced with focus ink (DESIGN: selection fill defaults to focus blue).                                                                                                                                                                                                  |
| Slider                                                     | fix                                                                                                           | Track, fill and thumb RAC classes restored; fill and thumb styling had been dead.                                                                                                                                                                                                            |
| NativeSelect                                               | fix                                                                                                           | Guidance was replaced by the error, so it vanished exactly when needed. Description and error are now separate nodes, both referenced from `aria-describedby`.                                                                                                                               |
| InputOTP                                                   | fix                                                                                                           | Each digit carries `aria-invalid`, and the focus treatment is now the Frame keyboard-only ring: clicks paint nothing, keyboard focus paints one 2px ring.                                                                                                                                    |
| TextField, NumberField, SearchField, DatePicker, TimeField | no change                                                                                                     | Field anatomy, recovery band and sizes verified (controls 44px, date picker 46 with its border); DatePicker's teal calendar fallback replaced.                                                                                                                                               |
| TokenField                                                 | fix                                                                                                           | The token's remove control was a `tabIndex={-1}` 16px button: unreachable by keyboard and under the 24px target. It is now a tab stop with a 24px hit area (no `nested-interactive`, verified with axe).                                                                                     |

### Forms

| Component             | Verdict                                                                                                                                                                                                                                                                                                              | Notes                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| FileUploader          | fix                                                                                                                                                                                                                                                                                                                  | Error id wired into the drop zone's `aria-describedby`; guidance stays visible. |
| DropZone              | fix                                                                                                                                                                                                                                                                                                                  | RAC class restored.                                                             |
| ColorPicker and parts | fix: all color parts keep their RAC classes (swatch, area, slider, wheel and field styling had been dead), and the convenience picker now passes `colorSpace="hsb"` with its HSB channels. Without it, committing a hex in its own field turned the value RGB and the area threw `Unknown color channel: saturation` |
| Form                  | no change                                                                                                                                                                                                                                                                                                            | RAC Form plus our field parts.                                                  |

### Layout and navigation

| Component                                                        | Verdict   | Notes                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion, Disclosure                                            | fix       | Panels never opened properly: the CSS keyed the open state on a `data-expanded` attribute React Aria puts on the disclosure, not the panel, so content stayed clipped to a sliver. The panel is now animated from React Aria's measured `--disclosure-panel-height`, and the accordion uses the same panel anatomy as Disclosure (both classes plus the inner wrapper), which also restored its padding. |
| Tabs                                                             | fix       | Current-tab teal fallback replaced with focus ink.                                                                                                                                                                                                                                                                                                                                                       |
| Pagination                                                       | fix       | `.hashti-pagination-item` rules styled an element nothing renders, including a legacy glow focus ring. Removed.                                                                                                                                                                                                                                                                                          |
| Breadcrumbs, ContentSwitcher, Header, ProgressIndicator, SideNav | no change | Composition over RAC; no dead selectors or off-token ink found.                                                                                                                                                                                                                                                                                                                                          |

### Overlays

| Component                     | Verdict   | Notes                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal                         | fix       | Entry was animated twice — a 200ms opacity/scale transition in `modal.css` on top of frame.css's keyframes — so the dialog painted at `opacity: 0` while a second animation fought it. The component file now only declares the base surface; frame.css owns entry and exit. Story visibility race also fixed (global 4). |
| Dialog                        | added     | Had no story at all. Now has playground, anatomy, focus/dismissal and RTL stories with play tests.                                                                                                                                                                                                                        |
| Drawer                        | fix       | Dead glow focus ring on the close button removed. RTL slide is verified working: `end` mirrors to the left edge via the `-rtl` keyframes and `inset-inline-end`.                                                                                                                                                          |
| Sheet                         | fix       | Overlay, backdrop, content and root RAC classes restored.                                                                                                                                                                                                                                                                 |
| Popover, Menu, CommandPalette | fix       | Story visibility races fixed.                                                                                                                                                                                                                                                                                             |
| AlertDialog, PreviewTrigger   | no change | AlertDialog reuses Dialog plus Modal; PreviewTrigger keeps its own non-modal semantics.                                                                                                                                                                                                                                   |

## Gaps logged, not fixed in this pass

1. **Hardcoded English accessible names** in 10 components: Drawer ("Close drawer"), Pagination
   ("Previous page", "Next page"), Toast ("Dismiss notification"), ComboBox ("Open items list"),
   CommandPalette ("Search commands", "Clear search"), DatePicker ("Choose a date"), Table batch
   bar, TokenField ("Remove token"), Color parts ("Hue", "Alpha", "Hex color"). The library
   exercises Persian and Arabic stories everywhere, so these strings should come from props or
   RAC's localized defaults. Deferred because it adds ten props and each one needs a docs change.
2. **Select chips are hand-rolled instead of the documented TagGroup composition.** Keyboard
   removal exists (Backspace) but is unannounced, and the chips cannot be tabbed. The sanctioned
   shape is `TagGroup` inside `SelectValue` with `onRemove` → `state.setValue`, and a `Group`
   trigger instead of a `Button` (React Aria's Select doc, IntentUI's `MultipleSelect`). Needs the
   trigger to become a Group, so it is a design decision, not a patch. Marked `shortcut:` in
   `select.tsx`.
3. **Slider thumb hit target is 18px** (DESIGN defers checkbox/switch/embedded targets to their own
   slice; the thumb belongs to that slice). The track itself is fine.
4. **The easing tokens still carry Carbon's curves** (`cubic-bezier(0.2, 0, 0.38, 0.9)` and
   friends) while DESIGN specifies an expo-style ease-out `(0.16, 1, 0.3, 1)` for entrances and
   shorter accelerating exits. Durations now follow the ladder; changing the curves changes the
   feel of every component at once, so it needs its own visual pass.
5. **Six components still have a story but no docs page**: Header, SideNav, ProgressIndicator,
   Loading, FieldStatus, ActionableNotification. Menu, Slider, TextArea, NativeSelect, FileUploader
   and Form got pages in this branch.
6. **Legacy themes are still imported** (`styles.css` imports `relay.css`, and the reset still
   carries `white`/`g10`/`g90`/`g100` selectors). Frame-only is confirmed as the requirement, so
   this is deletable, but it is a large diff and belongs with the theme cleanup.

## Verification

| Check                                                                                                     | Before                                                      | After                                |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Storybook sweep, 318 stories, axe wcag2a+aa at 1280 light                                                 | 42 stories with findings (8 axe, 32 failing play functions) | 0 stories with findings              |
| Dark theme, the changed components (1280)                                                                 | 3 tooltip stories at 1.04:1                                 | 0 violations                         |
| RTL at 375 (Tag, Select, Drawer, Slider)                                                                  | —                                                           | 0 violations, no horizontal overflow |
| Docs pages for the six new pages, sampled 3                                                               | —                                                           | 0 violations                         |
| Default control geometry                                                                                  | 28 / 39 / 42px                                              | 32 / 44 / 48px                       |
| `bun run check` (format, lint, typecheck, 183 unit tests, builds, 2 browser tests, pack, consumer verify) | —                                                           | green                                |

Reproduce a single story with
`iframe.html?id=<story>&viewMode=story` on Storybook dev (`:6006`); a failing play function shows up
as `JestExtendError` in that page's console.
