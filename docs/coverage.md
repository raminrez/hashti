# Cinder implementation coverage

**Baseline:** Cinder 0.1.0, 8 November 2026. Carbon v11 visual rules, RAC 1.22.1
interaction, React 19.3.1, and Bun 1.4.4. This describes the implemented source and
examples. Dated execution results are in [verification](verification.md).

## Frame choices — Phase 2 third batch

Checkbox, Radio, and Switch each add **six stories / five authored plays**. The
static workbench now indexes **80 stories / 178 story/theme/motion cases**: 62
preserved stories plus 18 choice stories. Code, Storybook, and installed-package
gates passed on **8 November 2026**; rendered acceptance is being closed separately.

| Area                 | Implemented bounded scope                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choice behavior      | Native label/input ownership, controlled/default values, actual Space/label input, Radio arrow navigation and disabled skipping; Switch Enter may submit rather than toggle                                               |
| Values and recovery  | Repeated CheckboxGroup `FormData.getAll()`, one Radio value, checked read-only submission/immutability, disabled omission, mixed state derived from members, native/group validation and detached recovery                |
| Frame appearance     | 44px ordinary label minimum; 18px Checkbox marks with 5px corners and 18px Radio marks; blue selected/mixed marks; neutral/blue group error borders; standalone invalid hover stays red; compact table geometry unchanged |
| Shared compatibility | Long-label wrapping, non-shrinking marks, read-only cursors, disabled-mixed paint, and forced colors across themes; unchanged `selection.tsx`, APIs, refs, render props, eight themes, and seven Button variants          |
| Switch and locales   | sm/md tracks and logical LTR/RTL thumbs; no required/invalid/validation/mixed API; real Persian/Arabic/German providers, long text, and isolated Latin identifiers                                                        |

Final source execution passes **32 cases / 113 filtered / 0 failures** across four
files. Focused Storybook execution passes **46 choice cases / 132 filtered /
0 failures**; the 132 existing cases were not rerun against this build. Formatting,
lint, strict source/Storybook/public declarations, production packing, both native
CSS/CSS Modules and Tailwind **4.3.5** consumers, and preserved baseline journeys pass.
The renderer retains **62/62 PNGs**, with zero geometry/contrast failures, axe
violations, or recorded console/page errors. Visual reviews and all **50 `bypass`
incompletes** remain separately contextualized, not automated WCAG passes.

See the [public choice contract](../packages/react/README.md#checkbox-radio-and-switch)
and [dated evidence](verification.md#frame-choices--phase-2-third-batch). Select,
overlays, and settings/nested-edit compositions follow. The full fourteen-entry
slice, manual AT/device/IME/zoom/browser matrix, documentation website, and Figma
are not completed by this bounded batch.

## Frame field status — Phase 2 extension

At extension acceptance, the workbench indexed **62 stories**: the preserved 21 action and 33 field/form
stories plus **eight FieldStatus stories**. The status extension does not promote
shared choice, selection, or date callers to complete family acceptance.

| Area               | Implemented bounded scope                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Field status       | Twelve namespaces accept appearance-only warning/error/success; real validation takes precedence; values, native validity, and submission remain RAC/application-owned |
| Composition        | Default inline icons and explicit compound `.Status`/`.StatusIcon`; mounted status descriptions preserve guidance and caller associations without dangling IDs         |
| Frame feedback     | Attached below bordered controls, detached for CheckboxGroup/RadioGroup; long copy and date-range actions reflow without shrinking native values                       |
| Necessity and help | Required-over-optional wording; independent hover/focus Tooltip and click/keyboard dialog Popover; English, Persian, Arabic, German, and English fallback strings      |
| Compatibility      | Existing APIs, raw exports, native elements/drafts/caret/focus, slotted context children, refs, eight themes, and seven Button variants preserved                      |

**Bounded acceptance passed, 8 November 2026.** The frozen check passes
**41 unit/watcher tests / 2,005 assertions** and
**341 browser tests**, including **132 Storybook story/theme/motion cases** and
**37 status contracts**. Both installed consumers pass against matching archives.
All **52 retained captures / 16 scenes** are accounted for: 14 newly reviewed after
restart and 38 prior inspections reused after hash comparison. Six renderer source
hashes, ten relevant dependency hashes, and all PNG hashes match; live served bytes
were not rechecked because the old server is offline. All 16 retained axe audits
have zero violations; four isolated-canvas `bypass` incompletes have contextual
manual dispositions, not automated passes.

The [exact README consumer receipt](../test-results/status-readme-resumed-2026-11-08.final.json)
passes **13 accepted checks**: all three root installation workflows, all three
root TSX blocks, and both verbatim status examples compile, bundle, and run against
the matching final archives. An initial helper-only stepper selector failure and
its corrected continuation remain preserved; no published example needed a fix.

See the [public status contract](../packages/react/README.md#field-status-necessity-and-label-help)
and [dated evidence](verification.md#frame-field-status--phase-2-extension).
Checkbox/Radio/Switch family stories and overlay/task compositions remain next.
No exact lost Astryx screenshot comparison, manual AT, physical device/IME, broad
zoom, Firefox/WebKit, documentation website, or Figma completion is claimed.

## Frame fields — Phase 2 second batch

This batch added a **54-story workbench**: the preserved 21 action stories and
**33 field/form stories** (7 TextField, 6 TextArea, 8 NumberField, 7 SearchField,
and 5 Form). Stories import the public package and one prebuilt stylesheet.

| Area                      | Implemented bounded scope                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared composition        | Twelve callable compound namespaces with RAC-compatible `.Root`, `.Label`, `.Description`, `.Help`, `.ErrorMessage`, and family-specific parts; actual DOM refs, render functions, slots, and collection types            |
| Frame defaults            | Label → persistent guidance → control → recovery through `FieldLayout`; guidance survives validation; one-line recovery minimum; grouped controls own the control hook once                                               |
| TextField / TextArea      | Convenience and whole-tree composition, controlled/default values, native refs/events/rendering, native validation/FormData, read-only and disabled distinctions, sizes where supported, long content, and locale stories |
| NumberField / SearchField | Grouped input/buttons, numeric bounds/steps/display versus submitted values, clear/Escape focus, query submission, native callbacks/FormData, custom composition, and locale stories                                      |
| Form recipes              | Native first-invalid focus, simultaneous associated errors, preserved drafts, focus-retaining pending Save, application-owned duplicate prevention, local failure/retry, and returned `validationErrors`                  |
| Recovery layout           | Required-field recipe minimums of 58px/78px; tested viewport boundary 432/433px; longer errors grow instead of clipping; field-grid boundary 647/648px                                                                    |
| Compatibility             | Eight themes, callable conveniences, replacement children, SearchField's complete `inputProps.className` override, existing refs/classes, raw RAC exports, and all seven Button variants retained                         |

The compound surface also covers CheckboxGroup, RadioGroup, Select, ComboBox,
DateField, TimeField, DatePicker, and DateRangePicker because they share anatomy.
Their API/relationship compatibility and limited installed smoke are not completed
later-family Frame acceptance. RAC continues to own values, validation, state,
relationships, and events; Cinder adds no Form engine.

The [package contract](../packages/react/README.md#additive-compound-namespaces)
lists every part and ref target. The
[dated field/form evidence](verification.md#frame-fields--phase-2-second-batch)
distinguishes executed gates, visual review, native behavior, and remaining manual
work. Choice/toggle and overlay compositions, the documentation website, and Figma
remain outside this batch.

**Bounded acceptance passed, 7 November 2026.** The frozen full check passes
**25 unit/watcher tests / 1,976 assertions** and **280 browser tests**, including all
**108 Storybook story/theme cases**. Both strict installed consumers and the exact
README installation commands/snippets pass against the final archives. Visual
closure covers **74 captures** (72 identical prior verdicts reused and two corrected
originals inspected); **28 native observations** cover recovery, copying, values,
refs, duplicate prevention, and failure/retry. All 74 retained axe incompletes have
individual context dispositions, not WCAG conformance passes.

## Frame actions — Phase 2 first batch

The private [Storybook workspace](../apps/storybook/README.md) is the component
workbench. The first batch added **21 action stories**, still retained within the
current workbench. They use public package exports, one prebuilt stylesheet, and
Frame light/dark through `Theme`.

| Area                 | Implemented first-batch scope                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button               | Four core choices (`primary`, `secondary`, `ghost`, `danger`); existing `tertiary`, `danger-tertiary`, and `danger-ghost` retained; omitted and explicit sizes; icon-only, disabled, pending, and real interaction states |
| Request example      | Stable action content and dimensions, localizable progress, repeat prevention, retained draft, failure message, and retry; application-owned request state                                                                |
| Link                 | Native anchor navigation with enabled `href`; disabled/href-less span fallback; inline decoration, external destinations, keyboard/pointer behavior, and disabled tab skipping                                            |
| Customization        | Public refs, DOM renderers, state-based class/style callbacks, and render-function children for both actions                                                                                                              |
| Internationalization | Long German Button label, long unbroken Link text, Persian and Arabic locale scopes, localized pending labels, and isolated Latin workspace identifiers                                                                   |
| Developer workflow   | Serialized package rebuilds for source edits, strict public-declaration checks, static Storybook output, and a browser gate that waits for completed play and accessibility reporting                                     |

The [action contract](../packages/react/README.md#button-and-link) documents these
choices and ownership boundaries. The [first-batch verification](verification.md#frame-actions--phase-2-first-batch)
records executed proof. The full fourteen-entry slice remains in progress; shared
field anatomy and form recovery followed in the second batch above.

**First-batch acceptance passed, 7 November 2026.** The rebuilt Storybook's
**42 story/theme gates pass**. All **48 retained captures**
have completed light/dark review with no confirmed P0/P1/P2 product defects; all
32 retained axe incompletes are resolved for isolated-fixture applicability.
The final aggregate passes **25 unit/watcher tests with 1,976 assertions** and
**172 browser tests**. Final-build native input passes **16 observations** across
both themes. Native CSS/CSS Modules, pinned Tailwind 4.3.5, and the exact README
installation commands/snippets pass from the final archives. These scoped results
do not imply manual assistive-technology, device, zoom, or full-phase proof. Shared
fields, later catalog work, the documentation website, and Figma are not part of
this completed batch.

## Frame foundations — Phase 1

Frame's [visual rules](../DESIGN.md), [system specification](design-system.md),
and [ordered library plan](component-library-plan.md) define the implemented
foundations and remaining component slices. The package adds `frame-light` and
`frame-dark` alongside the four Carbon and two Relay themes: eight themes in total.
Representative installed-package proof has passed. See the
[Phase 1 evidence](verification.md#frame-phase-1) for the executed checks.

| Area                 | Phase 1 scope                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations          | Semantic light/dark roles, system sans type, 10/14/18px corners, 44px ordinary default, explicit 32/44/48px controls                                                                     |
| Styling              | One prebuilt stylesheet; one `cinder` layer; native CSS, real Bun CSS Modules, and Tailwind 4.3.5 preflight/utilities; scoped raw RAC styles                                             |
| Parts                | Cinder-owned default label/help/description/error hooks across twelve field callers; control hooks where applicable; Select value/listbox hooks; existing classes, refs, values retained |
| Themes and portals   | Inherited/replaced/cleared appearance and effective language on Popover, ModalOverlay, Tooltip, ToastRegion; nested themes/layers; independent Modal part access                         |
| Representative proof | Installed Button, TextField, and dialog → Select in Frame light/dark; native CSS/CSS Modules and isolated Tailwind consumers pass strict types, builds, and browser contracts            |

The Phase 1 workspace suite passed **126 browser tests across five files**, including
**44 contracts/fidelity tests**. Unit checks passed **22 tests with 1,945
expectations**; type checking covered **53 files**. Lint and the production build
also passed. These counts describe the workspace suite; the installed-consumer
gate separately verifies the two isolated apps above.

The full fourteen-entry Frame slice is **Phase 2**. Persistent guidance, attached
recovery, and the default field reading-order change were completed in its bounded
second batch, not Phase 1. Phase 1 hooks also reach later date/grouped-field callers without
promoting those families to complete Frame coverage. The following catalog remains
the baseline capability inventory; its Frame work is allocated exactly once as
14 + 11 + 9 + 11 entries in the plan. The development-only `/prototypes` comparison
has its own evidence in the
[prototype guide](prototypes-guide.md#verification).

## Relay web slice

The production `/relay` route uses the same exported components with
`theme="relay-light"` or `theme="relay-dark"`. The [Relay specification](relay.md)
records the authored values, API conventions, customization, and usage guidance.

| Area              | Implemented Relay scope                                                                                                                             | Evidence                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Button            | Seven variants; 32/40/48/64/80px heights; 8px corners; actual hover/press/focus, disabled, icon-only, and pending with a localizable progress label | R; P                                             |
| TextField         | Three heights, full borders, label/help/error anatomy, invalid focus, read-only copying, and controlled validation recovery                         | R; C; P                                          |
| Selection         | Checkbox/Radio groups, mixed/read-only/disabled/invalid where applicable, Switch's two track sizes, rounded ContentSwitcher                         | R                                                |
| Select and Dialog | Described options, disabled-option skipping, 12px popovers, 20px dialogs, named focus containment/return, nested portal theme/layer inheritance     | R; C; P                                          |
| Tokens            | Two authored palettes merged over Carbon roles; five Relay geometry tokens; same CSS, JSON, and typed exports                                       | U; R live token override; P                      |
| Gallery           | State matrices, realistic local compositions, both themes, token mappings, real prop guidance, and controlled/uncontrolled examples                 | R responsive overflow and axe; visual inspection |

**R** is [`relay.test.ts`](../tests/browser/relay.test.ts): real interaction,
pending accessible names/repeat prevention, validation, selection, nested portals,
responsive widths, reduced motion, forced colors, and automated accessibility in
both Relay themes. P includes an installed Relay consumer. The Carbon crosswalk
below remains a baseline inventory; the evidence key also identifies shared
contracts and representative Frame checks.

The other catalog families have not completed Relay-specific review. They receive
available theme tokens and shared anatomy styles, while keeping baseline geometry.
Relay does not add extra catalog families or imply full-library visual parity.

## What the number 45 means

The [Cinder catalog][catalog] has **45 reference entries**, each with an example,
anatomy, keyboard guidance, a focused prop table, and upstream sources. Carbon's
[current component index][carbon-index] lists **42 component families**, excluding
its Overview page. The two counts use different groupings:

- Carbon **Text input** becomes Text input and Text area: one extra entry.
- **Dropdown** becomes Dropdown, Combo box, and Multi-select: two extra entries.
- **Date picker** becomes Date picker, Date range picker, and Time picker: two extra entries.
- **Notification** becomes Notification and Toast: one extra entry.
- **Loading** gains a separate Skeleton entry: one extra entry.
- Carbon **UI shell header** and **UI shell left panel** share one Cinder UI shell entry.
- **AI label**, **Toggletip**, and **UI shell right panel** have no Cinder implementation.
- Carbon **Menu buttons** is represented by Cinder's Overflow menu composition.

Thus **42 − 3 − 1 + 7 = 45**. Thirty-nine upstream families have some representation,
including deliberately partial implementations. This is a catalog crosswalk, not a
percentage of Carbon parity. Supporting a family does not imply all its variants,
its Carbon React API, or its complete accessibility test matrix are implemented.

Additional exports such as Theme, Layer, Grid, Stack, Meter, Calendar, RangeCalendar,
DateField, and RAC composition parts do not add to the 45-page count.

## Evidence key

- **B — catalog browser checks:** all 45 examples render in the four Carbon themes. The
  whole reference page receives an axe scan in g10; each example receives a scoped
  scan in white, g90, and g100. The document is checked for horizontal overflow at
  1440, 768, and 390px. This does not exercise every state or viewport/theme pair.
- **I — interaction checks:** selected user journeys in [interactions.test.ts][interactions],
  normally in g100. The specific behavior is named in the table.
- **C — consumer contract checks:** controlled state, dynamic collections, custom
  DOM rendering, render props, refs, locale, layers, and portals in [contracts.test.ts][contracts].
  Theme/portal coverage includes all eight themes, nested Carbon isolation, live
  appearance/language changes, and independent Modal surface/backdrop targets.
- The **21 compound field cases** in
  [composition.test.ts](../tests/browser/composition.test.ts) separately cover the
  twelve callable namespaces, actual root/part refs, native events/validation and
  FormData, render children, slots, collections, and shared field anatomy. These
  cross-family contracts do not promote later families to completed Frame review.
- **F — fidelity checks:** 52 focused browser tests in [fidelity.test.ts][fidelity]
  cover Carbon geometry, typography, and states; shared field-part/ref/validation
  contracts; legacy size defaults; and Frame light/dark geometry, typography,
  all seven Button variants, inactive states, invalid focus, pending, and forced
  colors. Carbon color assertions cover all four
  original themes; geometry and typography use the fixture's specified viewports and states.
- **U — unit checks:** pinned token samples, authored Frame values, unchanged legacy
  maps/foundations/type objects, deterministic generation, CSS references, layer bounds,
  complete selected type definitions, pagination normalization, and file acceptance
  in [tests/unit][unit].
- **P — packed consumers:** strict declarations and two isolated production apps
  installed from both tarballs in [verify-package.ts][package-check]. Native CSS and
  real Bun CSS Modules share one app; pinned Tailwind 4.3.5 uses the other. Browser
  interactions cover representative Carbon/Relay and Frame controls, customization,
  and nested portals; this is not an exhaustive export-by-export test.

The table names implemented variants separately from verified journeys. A variant
without a dedicated interaction assertion may still be styled and typechecked;
it must not be read as separately audited. See [visual review](visual-review.md) for
the screenshot-based assessment.

## Carbon family crosswalk

Reference entries below resolve at `/components/<slug>` on the running site.

| Carbon family        | Cinder reference entry or entries                 | Implemented subset and boundary                                                                                                                                                                                                                                                                                                                                                                                                                | Evidence                                                                       |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| AI label             | —                                                 | Not implemented. Generated AI tokens are available, but no AI label, explainability popover, or AI-specific component variant is supplied.                                                                                                                                                                                                                                                                                                     | Token generation only                                                          |
| Breadcrumb           | `breadcrumb`                                      | RAC Breadcrumbs with linked/current items and Carbon separators. Dynamic collection support on the root; the convenience item has a small `href`/`isCurrent` API. Overflow collapsing and the full Carbon item API are absent.                                                                                                                                                                                                                 | B                                                                              |
| Button               | `button`                                          | Seven visual variants, icon-only, pending, disabled, and five heights: 32/40/48/64/80px. RAC press/render/ref contracts are retained. Carbon's 24px `xs`, fluid variants, and specialized button sets are absent.                                                                                                                                                                                                                              | B; I keyboard, disabled, pending; C; P                                         |
| Checkbox             | `checkbox`                                        | Checkbox and CheckboxGroup, mixed/selected/invalid/disabled states, controlled values, group labels and validation. 16px control with Carbon's small radius.                                                                                                                                                                                                                                                                                   | B; I mixed and keyboard state; C render props                                  |
| Code snippet         | `code-snippet`                                    | Selectable, scrollable plain code with optional copy, label, language metadata, and maximum height. Clipboard success/failure is announced. Syntax highlighting, inline-code variant, and expandable Carbon snippet behavior are absent.                                                                                                                                                                                                       | B; I exact clipboard content and denial                                        |
| Contained list       | `contained-list`                                  | Styled RAC GridList and GridListItem, selection, empty-state rendering, and collection composition. **Adaptation:** interactive grid semantics. No full Carbon contained-list kind/size/action API.                                                                                                                                                                                                                                            | B                                                                              |
| Content switcher     | `content-switcher`                                | ToggleButtonGroup and ToggleButton, three inherited sizes, controlled/default selection. The default is single required selection. **Adaptation:** radio-group semantics; use Tabs for linked panels.                                                                                                                                                                                                                                          | B; I arrow focus and Space selection; F density and boundaries                 |
| Data table           | `data-table`                                      | Styled RAC Table and Column with compositional rows/cells, four row densities, selection, and sort indicators. The sample workspace adds real client-side search, sorting, pagination, and empty states. **Adaptation:** grid navigation. Batch-action bars, row expansion, sticky columns, and virtualization are not packaged features. Resizer/DnD primitives are exported but have no completed Cinder example or dedicated verification.  | B; I filter, sort, select, paginate, empty                                     |
| Date picker          | `date-picker`, `date-range-picker`, `time-picker` | DatePicker, DateRangePicker, DateField, TimeField, Calendar, and RangeCalendar. Single/range values, bounded/unavailable dates, locale-aware segments, and themed calendar popovers. **Adaptation:** segmented editing instead of Carbon's text/parser model. The default calendar renders one month; alternate calendars, time zones, multi-month layouts, and full locale combinations are not independently audited.                        | B; I selected date, range endpoints, time segment; P date field render         |
| Dropdown             | `dropdown`, `combo-box`, `multi-select`           | Generic Select and ComboBox wrappers with labels/help/errors, single/multiple `value` APIs, option render functions, and three sizes. ComboBox supports filtering/custom-value policy and multiple-value display. **Adaptation:** current RAC Select/ComboBox behavior and listbox anatomy, not Carbon's selection-summary/chip API.                                                                                                           | B; I typeahead, filtering, selection, dismissal; C single/multiple generics; P |
| File uploader        | `file-uploader`                                   | RAC FileTrigger/DropZone plus controlled or local file lists, extension/MIME/size validation, mixed-batch acceptance, and removal. This chooses files locally; transfer, retry, server validation, progress, and upload-completion states are application work.                                                                                                                                                                                | B; U validation; I chooser and native mixed-file drop                          |
| Form                 | `form`                                            | Direct RAC Form with named values, native validation, validation errors, and ARIA validation opt-in. Cinder field helpers connect labels/descriptions/errors and reserve a shared help/error row. Form layout is composed with Stack/Grid.                                                                                                                                                                                                     | B; I invalid focus, corrected submission; C custom field anatomy; P            |
| Inline loading       | `inline-loading`                                  | Active, success, and error status with inline text. Timed completion transitions and Carbon's inactive state are not separate APIs.                                                                                                                                                                                                                                                                                                            | B                                                                              |
| Link                 | `link`                                            | RAC Link with normal/inline styling, disabled state, refs, and upstream navigation behavior.                                                                                                                                                                                                                                                                                                                                                   | B; used by verified navigation journeys                                        |
| List                 | `list`                                            | Semantic unordered and ordered lists, nested content, native attributes, and correctly typed refs. Ordered `start`/`reversed` attributes pass through. No custom item data model.                                                                                                                                                                                                                                                              | B; TypeScript native-prop fixture                                              |
| Loading              | `loading`, `skeleton`                             | Small/large labeled spinner and generic one/multi-line skeleton with width/height. Reduced-motion styling is provided. The skeleton is hidden from the accessibility tree; content-specific skeleton compositions are not supplied for every family.                                                                                                                                                                                           | B                                                                              |
| Menu                 | `menu`                                            | RAC Menu, MenuItem, sections, separators, triggers, and submenu primitives, with Carbon-aligned states. Disabled actions, collection selection, and keyboard navigation remain upstream. Context-menu, submenu, and every selection combination are not independently exercised.                                                                                                                                                               | B; I disabled action, keyboard choice, dismissal                               |
| Menu buttons         | `overflow-menu`                                   | A labeled icon Button + MenuTrigger + Popover + Menu composition. General menu and split/combo-button APIs are not separate Cinder wrappers.                                                                                                                                                                                                                                                                                                   | B; shared menu primitives                                                      |
| Modal                | `modal`                                           | ModalOverlay/Modal with xs/sm/md/lg sizing, Dialog, controlled state, dismissability, and named title composition. Theme/layer/direction travel through the portal. Footer/content anatomy is composed, rather than Carbon's full modal variants.                                                                                                                                                                                              | B; I focus containment, save, Escape, focus return; C all themes/RTL; P        |
| Notification         | `notification`, `toast`                           | InlineNotification has four kinds, low/high contrast, optional action/dismissal, and a configurable role (`status` by default). Action content does not implement Carbon's focus-managing ActionableNotification alertdialog. ToastProvider/useToast supply a three-visible queue and dismissible toasts using **experimental** RAC `UNSTABLE_*` APIs. Full callout variants are absent; timing and announcements lack manual AT verification. | B; I toast visibility/dismissal; F colors, targets, widths                     |
| Number input         | `number-input`                                    | RAC NumberField with localized formatting, increment/decrement, step, bounds, validation, and three sizes. Default browser-query role is textbox. Fluid and specialized inline layouts are absent.                                                                                                                                                                                                                                             | B; I keyboard bounds; dev HMR state preservation                               |
| Pagination           | `pagination`                                      | Controlled page/page-size state, native page-size picker, item/page counts, previous/next boundaries, and normalized empty/stale input. Page-number navigation and unknown-total/server-cursor pagination are not packaged.                                                                                                                                                                                                                    | B; U bounds; I table pagination                                                |
| Popover              | `popover`                                         | RAC positioning, controlled state, offset/placement, and Cinder portal attributes. **Adaptation:** the demonstrated DialogTrigger/Popover/Dialog composition is modal by default, with focus movement/containment. It is not Carbon's generic nonmodal presentational layer.                                                                                                                                                                   | B; I dismissal/focus return; C nested portal                                   |
| Progress bar         | `progress-bar`                                    | RAC ProgressBar with determinate/indeterminate display, label/help/value text, active/success/error styling. Meter is also exported. No full Carbon progress-bar sizing or icon/status anatomy API.                                                                                                                                                                                                                                            | B                                                                              |
| Progress indicator   | `progress-indicator`                              | Semantic ordered steps, complete/current/incomplete/invalid states, horizontal/vertical layouts, optional RAC step buttons, and disabled steps. It does not manage form validation, routing, or workflow transitions.                                                                                                                                                                                                                          | B                                                                              |
| Radio button         | `radio-button`                                    | RadioGroup and Radio with labels/help/errors, controlled values, horizontal/vertical orientation, and invalid/disabled states.                                                                                                                                                                                                                                                                                                                 | B; I roving keyboard selection                                                 |
| Search               | `search`                                          | RAC SearchField with icon, clear action, three sizes, controlled state, and accessible labeling. The docs examples filter actual data. Expandable/fluid search and backend search are absent.                                                                                                                                                                                                                                                  | B; I filter, empty state, Escape                                               |
| Select               | `select`                                          | `NativeSelect` deliberately uses native `<select>`/`<option>`, native event props (`disabled`, `onChange`), three sizes, label, description, and error association. This differs from the RAC-backed exported `Select` used by Dropdown.                                                                                                                                                                                                       | B; I page-size and theme controls                                              |
| Slider               | `slider`                                          | RAC Slider with single/range values, formatted output, named thumbs, bounds/step, and custom children. Default Cinder anatomy is horizontal. Carbon's paired editable number input and dedicated vertical styling are absent.                                                                                                                                                                                                                  | B; I bounds and noncrossing range                                              |
| Structured list      | `structured-list`                                 | Styled semantic description list (`dl`/`dt`/`dd`) for term/value content. **Adaptation:** no Carbon row/cell or selectable structured-list model.                                                                                                                                                                                                                                                                                              | B                                                                              |
| Tabs                 | `tabs`                                            | RAC Tabs, line/contained styles, horizontal/vertical layouts, controlled selection, manual/automatic activation, and compositional panels. Overflow navigation and closable tabs are not packaged.                                                                                                                                                                                                                                             | B; I disabled skipping, tab/panel relationships                                |
| Tag                  | `tag`                                             | Static Tag in ten colors and two sizes; interactive TagGroup/FilterTag with removal. **Adaptation:** removable collections use RAC grid semantics. Carbon's operational/selectable/dismissible tag variants are not all equivalent to these APIs.                                                                                                                                                                                              | B; I keyboard removal                                                          |
| Text input           | `text-input`, `text-area`                         | TextField supports three control heights; TextArea supports rows and vertical resizing. Both connect label/help/error content and allow custom anatomy and input refs. Password input type is available; visibility toggle, counters, fluid fields, and full AI variants are absent. TextArea has no `size` prop.                                                                                                                              | B; I form validation; C controlled/ref/anatomy; P                              |
| Tile                 | `tile`                                            | Static semantic container with Carbon-aligned surface/padding and native div props. Clickable, expandable, radio, and multi-select tile contracts are not implemented.                                                                                                                                                                                                                                                                         | B                                                                              |
| Toggle               | `toggle`                                          | RAC Switch with 48×24 and 32×16 tracks, controlled state, disabled treatment, and logical RTL thumb motion. **Adaptation:** Space toggles; Enter is not a toggle shortcut and can submit a containing form.                                                                                                                                                                                                                                    | B; I Space state; RTL direction fixture                                        |
| Toggletip            | —                                                 | Not implemented. A dialog popover is not a claim of equivalent Carbon toggletip behavior.                                                                                                                                                                                                                                                                                                                                                      | —                                                                              |
| Tooltip              | `tooltip`                                         | RAC Tooltip/TooltipTrigger, contextual theme/layer/direction, arrow, placement, and trigger delay. Tooltip content remains noninteractive.                                                                                                                                                                                                                                                                                                     | B; I keyboard focus; C portal inheritance                                      |
| Tree view            | `tree-view`                                       | Styled RAC Tree, item/content/section parts, selection, expansion, and chevron composition. **Adaptation:** treegrid semantics. NavigationTree is a different upstream API and is not re-exported; reorder and virtualized trees are unverified.                                                                                                                                                                                               | B; I expand/collapse                                                           |
| UI shell header      | `ui-shell`                                        | Header, HeaderName, HeaderNav, and native semantic composition. Basic header/navigation example. Carbon's full switcher, global-action, responsive panel, and focus-management APIs are absent.                                                                                                                                                                                                                                                | B                                                                              |
| UI shell left panel  | `ui-shell`                                        | Styled SideNav container with composed links. Basic structure, not a complete collapsed/expanded/rail panel implementation.                                                                                                                                                                                                                                                                                                                    | B                                                                              |
| UI shell right panel | —                                                 | Not implemented.                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                                              |

## Foundations and package-level scope

| Area                  | Shipped implementation                                                                                                                                                                                                    | Proof and boundary                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme data            | Eight maps: four Carbon from `@carbon/themes` 11.85.0 (313 entries each), two Relay (318 each), and two Frame (343 each, including 25 Frame-owned typography/size foundations).                                           | U verifies all six legacy maps are unchanged, Frame semantic samples/contrast pairs, and key completeness. Generated data is broader than implemented component scope.                                                                                    |
| Other foundations     | 191 unchanged global scalar values derived from `@carbon/layout` 11.63.0, `@carbon/type` 11.71.0, `@carbon/motion` 11.56.0, plus named Cinder conveniences.                                                               | Frame's 25 foundation overrides live in its theme maps. U verifies the global map is unchanged and every literal `--hashti-*` reference is defined; dynamically constructed CSS is outside that check.                                                    |
| Structured typography | `typeStyles` and `TypeStyleName` expose 36 unchanged selected Carbon type definitions with complete, sparse breakpoint overrides; token JSON contains the same data.                                                      | U verifies the full export is unchanged and compares complete compact/fluid/display objects with the pinned source; P consumes the export and JSON metadata. Scalar CSS variables remain base values; responsive interpolation is application-owned.      |
| Contextual layers     | Levels 0/1/2, saturating at 2. Most families select 01/02/03; `border-subtle` selects 00/01/02. `layer-background` identifies the containing surface.                                                                     | C measures separators/fields in every theme, nesting, and nested portals. Theme resets layer 0; Layer both advances context and paints its surface.                                                                                                       |
| Locale/direction      | Theme uses RAC locale inheritance and sets `lang`/`dir`; its API omits native `dir` to avoid contradictory keyboard direction.                                                                                            | C checks inherited locale and RTL portals. There is no translated Cinder documentation UI or broad language/calendar audit.                                                                                                                               |
| CSS and fonts         | One static stylesheet in top-level `cinder`, ordered `tokens`, `reset`, `components`, `themes`, `accessibility`. Frame uses system sans; Carbon/Relay use IBM Plex Sans with fallbacks. Plex Mono is separately optional. | P checks distributed CSS/token JSON, real Bun CSS Modules, Tailwind 4.3.5 preflight/utilities, and bundled Plex faces. Tarballs contain no font binaries. Custom raw RAC classes replace default hooks; Cinder BEM hooks belong to owned default anatomy. |
| Distribution          | ESM, declaration graph, stylesheet and token JSON exports, LICENSE/NOTICE, token peer, and tarballs with SHA-256 manifest.                                                                                                | P installs outside the repo with no source aliases and `skipLibCheck=false`, then bundles and drives real controls. Only the pinned dependency combination is independently tested.                                                                       |
| Documentation         | Homepage, live four-theme Carbon workbench, 45-entry reference, Relay gallery, foundation explorer, setup/research, search, and mobile navigation; development-only `/prototypes`.                                        | Route/interaction browser checks and screenshot inspection. Examples use labeled local sample data.                                                                                                                                                       |

Sources and implementation: [token generator][generator], [tokens][tokens],
[theme][theme], [buttons][buttons], [fields][fields], [selection][selection],
[collections][collections], [dates][dates], [overlays][overlays], [feedback][feedback],
[content][content], [files][files], [pagination][pagination], [layout][layout], and
[export surface][exports]. Detailed upstream findings are in [Carbon research](research-carbon.md)
and [RAC research](research-rac.md).

## Carbon fidelity follow-up

The priority findings in [Carbon research](research-carbon.md#prioritized-corrections-in-the-cinder-snapshot)
describe a pre-correction static snapshot. The following changes resolve the named
issues at the measured scope; they do not establish full visual or behavioral parity.

| Area              | Implemented correction                                                                                                                                                                 | Evidence and remaining boundary                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons           | Ghost buttons use an 8px gap and symmetric border-box padding; danger/ghost hover and pressed states, variant-specific two-inset focus, and ghost icon colors follow the pinned rules. | F checks real hover/press/keyboard focus in all four themes. Carbon's extra button families remain outside the packaged API.                                                                                        |
| Notifications     | Inverse support colors, 48px dismiss targets, 15px inline text padding, inverse focus, and 288/352px toast widths.                                                                     | F checks all kinds/themes and toast widths. InlineNotification remains a passive `status` region by default; optional action content does not implement Carbon's focus-managing ActionableNotification alertdialog. |
| Calendars         | `button-primary` / `text-on-color` selection, separate ordinary blue and selected inner focus, 288px width, 4/4/8px padding, and 40px navigation controls.                             | F checks four themes, single selection, range endpoints/interior, and real focus movement. RAC segmented editing and the one-month default remain deliberate adaptations.                                           |
| Toggle and Slider | Compact toggle: 10px thumb, 3px inset. Slider: 4px painted track/fill, 14→20px active single thumb, 16px range thumbs.                                                                 | F measures LTR/RTL toggle travel and real slider drag geometry; I checks keyboard bounds and noncrossing values. No packaged editable slider number input or vertical style.                                        |
| Typography        | Complete structured type definitions, compact headings, supporting-text tracking, 12/16px block code with 16px padding, and Mono date-input typography.                                | U verifies source data; F measures supporting text/code. The CSS exports base type values and does not automatically implement fluid interpolation.                                                                 |

## Intentionally separate from this release

- Carbon Charts, domain/product experiences, pictogram/illustration libraries,
  every Carbon icon, fluid variants, and complete Carbon React prop compatibility.
- RAC's newer Sheet, NavigationTree, TokenField, and other unexposed experimental
  APIs; raw re-exported helpers do not imply a styled and verified product pattern.
- Hosted backend services, file transfer, authentication, persistence, analytics,
  npm publication, and deployment. The example actions update local browser state.
- Manual screen-reader testing, Firefox/WebKit/mobile-device verification,
  catalog-wide forced-colors testing, broad zoom/locale coverage, SSR hydration, and a full
  pixel-by-pixel Carbon screenshot comparison. Automated axe results have a
  narrower scope than those activities.

## Reading and link coverage

Research reports distinguish acquisition from reading. A successfully archived
document is available evidence, not a claim that every example and API row was read.
The final catalog link audit checked **67 distinct source URLs** successfully; the
earlier 69-URL audit included now-consolidated invalid text-area and overflow-menu
paths. `.research/catalog-links.json` holds response status, final URL, and title.

[carbon-index]: https://www.carbondesignsystem.com/llms.txt
[catalog]: ../apps/docs/src/catalog.ts
[exports]: ../packages/react/src/index.ts
[generator]: ../packages/tokens/scripts/generate.ts
[tokens]: ../packages/tokens/src/index.ts
[theme]: ../packages/react/src/theme.tsx
[buttons]: ../packages/react/src/buttons.tsx
[fields]: ../packages/react/src/fields.tsx
[selection]: ../packages/react/src/selection.tsx
[collections]: ../packages/react/src/collections.tsx
[dates]: ../packages/react/src/dates.tsx
[overlays]: ../packages/react/src/overlays.tsx
[feedback]: ../packages/react/src/feedback.tsx
[content]: ../packages/react/src/content.tsx
[files]: ../packages/react/src/files.tsx
[pagination]: ../packages/react/src/pagination.tsx
[layout]: ../packages/react/src/layout.tsx
[interactions]: ../tests/browser/interactions.test.ts
[contracts]: ../tests/browser/contracts.test.ts
[fidelity]: ../tests/browser/fidelity.test.ts
[unit]: ../tests/unit
[package-check]: ../scripts/verify-package.ts
