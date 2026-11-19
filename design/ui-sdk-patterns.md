# Building Hashti on ui-sdk

The bridge between `design/` (Hashti) and the installed `@ui-sdk/react` /
`@ui-sdk/core` (`0.1.0-beta.13`). Nothing here comes from the old component
library: every behavior below is either a ui-sdk API quoted from
`node_modules/@ui-sdk/react/docs/`, or work Hashti owns.

Read with: `design/DESIGN.md` (visual authority), `design/design-system.md`
(interaction contracts), `design/css-conventions.md` (CSS shape),
`node_modules/@ui-sdk/react/docs/llms.txt` (ui-sdk ground truth).

## 0. Where code lives

| Package           | Owns                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `@hashti/react`   | React components: compose `@ui-sdk/react` parts, add Hashti class names, anatomy, and variants.                                    |
| `@hashti/styles`  | Every Hashti stylesheet: `layers.css` (cascade order), `index.css` (imports `design/tokens.css`), then one CSS file per component. |
| `design/`         | Token source (`tokens.css`), visual + interaction specs. Never copied into a package.                                              |
| `apps/playground` | Dev harness. Imports `@hashti/styles/layers.css`, `@hashti/styles/index.css`, `@ui-sdk/core/web.css`.                              |

`@hashti/react` wraps; it does not re-implement. A Hashti component is a thin
composition layer: ui-sdk supplies state, keyboard, focus, ARIA and
dismissal; Hashti supplies appearance, the class contract, geometry, and the
behavior recipes DESIGN.md/design-system.md demand (44px minimums, focus ring
matrix, recovery band, status vocabulary).

## 1. Mapping: old concept → ui-sdk, or own it

The old system's examples are gone from this repo. The table maps each
**capability** the design system needs. "Own it" means Hashti writes it, in
`@hashti/react` or `@hashti/styles`, because ui-sdk has no equivalent.

| Need                           | ui-sdk provides (real API)                                                                                                                                                                                                                          | Hashti owns                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Controlled/uncontrolled state  | `value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`, `pressed`/`defaultPressed`, `checked`/`defaultChecked`; change `details` carry `reason`, `event`, `source`, `cancel()`                                                 | Naming of Hashti props on wrappers; nothing else                                                                       |
| Headless primitive definition  | `definePrimitive({ name, options, state, controlled, sync, live, api, slots })`; slots built by `slot({ role, focus, keys, present, attrs, state, press, on, bind, props, selects, direct, live })`                                                 | Which composites need a new primitive (only when ui-sdk ships no component)                                            |
| Change reporting               | `createChange(context)`, `createCommit(context)`, `dispatch(context, "onX", …)`, reasons like `"item-press"`, `"escape-key"`, `isDismissal(reason)`                                                                                                 | Hashti reason choices in its own primitives                                                                            |
| One tab stop in a group        | `createRovingFocus(context, { slot, key, orientation, loop, remember, disabled, focusable, preferred, claims, move })`; `roving.tabIndex(state, part)`, `roving.bind(el, part)`, `roving.keydown(event, el)`, `roving.items()`, `roving.focus(key)` | When a group gets `remember: false` (tabs-like) vs `true` (toolbar-like)                                               |
| Grid / table focus             | `createGridFocus(context, { key, rows, cols, pageSize, disabled, reveal })`, `byCell`                                                                                                                                                               | Grid semantics per family (row names, selection scope)                                                                 |
| Focus when items vanish        | `createFocusRecovery({ fallback })`, `keepFocus(fn)`, `spatialMove()`, `nearestInDirection(rect, items, [x,y])`                                                                                                                                     | Choosing the fallback target per component                                                                             |
| Typeahead                      | `createTypeahead()`, `isTypeaheadKey(event)`, `labelOf(el)`                                                                                                                                                                                         | None                                                                                                                   |
| Selection (single/multi/range) | `createSelection(context, { key, set, order, multiple, selectable })`; `choose`, `toggle`, `extend`, `anchor`, `setAnchor`, `toggleAll`, `isSelected`                                                                                               | Which keys are selectable; linking selection to `createChange`                                                         |
| Collections as data            | `items` accepts `ListData` (strings, `{ value, label, keywords, disabled }`, `{ type: "group" }`, `{ type: "separator" }`); `itemToValue` / `itemToLabel` / `isItemEqualToValue`                                                                    | Nothing for Select/Combobox/Menu/Tree; Hashti-owned lists use plain arrays                                             |
| Overlays                       | `createPopup(context, { preset, slot, trigger, role })` with `popoverPreset`, `dialogPreset`, `tooltipPreset`, `hoverCardPreset`; or the shipped `Popover`, `Dialog`, `Drawer`, `Menu`, `Tooltip`, `Hover Card`, `Select`, `Combobox`               | Surface styling, shadows, scrim, geometry                                                                              |
| Portal / positioning           | Popups render **in place** in the browser's top layer; no Portal part. `position(anchor, el, { side, align, sideOffset, alignOffset, collisionPadding, arrow, arrowPadding })`; `container` for shadow roots/iframes                                | Re-expressing theme/direction once `container` moves content out of the themed subtree; `data-theme` on that container |
| Initial and final focus        | `initialFocus` (`"auto"`, `"content"`, `"none"`, selector, element, fn), `finalFocus`, dialog `modal: true \| "trap-focus" \| false`                                                                                                                | Which element each Hashti overlay should land on                                                                       |
| Dismissal order and policy     | Escape goes to the topmost layer (`bindLayer`'s dismissal stack); `dismissible={false}`, `onDismissAttempt(details)`, `closeOnOutsidePress`, `bindPersistentLayer(el)`                                                                              | Product policy per overlay (unsaved-work guards)                                                                       |
| Toast / announcements          | `OverlayHost`, `toast.success(...)`, `data-type` on toasts; `announce(text, { priority: "assertive" })`, `prepareAnnouncements(doc)`                                                                                                                | Toast visual variants (subtle/solid/bordered), queue limit 3                                                           |
| i18n: locale, direction        | `pageLocale()`, `userLocale()`, `toLocale(tag)`, `isRTL(el)`; `Date Picker`/`Number Input` take `locale` and default to the page's `lang`; `formatDate`/`parseDate`, `formatNumber`/`parseNumber`                                                   | Copy for Hashti-authored strings; locale a11y labels Hashti writes                                                     |
| Forms, labels, validation      | `Field`, `FieldLabel`, `FieldDescription`, `FieldError` (`match`, `state.message`), `FieldControl`, `FieldSet`, `invalid`, native `required`; every part carries `data-invalid`/`data-disabled`                                                     | Recovery band geometry, description-vs-error coexistence rules, error precedence over custom selection color           |
| Pending work                   | `Button` owns it: return a Promise from `onClick`, `pendingAnnouncement`, `aria-busy`, `data-pending`, focus retained; `focusableWhenDisabled` for explanation-by-tooltip                                                                           | Spinner swap markup (`data-show="idle" \| "pending"`), "read-only fields while pending" rule                           |
| Read-only vs disabled          | `readOnly` on Input, Textarea, Select, Combobox, Checkbox, Switch, Listbox; `data-readonly` attributes                                                                                                                                              | Read-only appearance (dashed border, accent surface) and copyable value rules                                          |
| Shortcuts                      | `useShortcut`, element `shortcut="mod+k"`, `matchesShortcut`, `formatShortcut`, `ariaKeyshortcuts`                                                                                                                                                  | Which Hashti actions get shortcuts                                                                                     |
| Pointer/platform               | `createPointerKind({ initial })`, `bindViewport`, `bindAvoidKeyboard`                                                                                                                                                                               | Coarse-pointer CSS (44px)                                                                                              |
| Visually hidden text           | **No equivalent**                                                                                                                                                                                                                                   | Own: `.hashti-visually-hidden` in the reset/accessibility layer                                                        |
| Focus-visible detection        | CSS `:focus-visible`; `isFocusFromKeyboard()` when script must know; overlays expose `data-modality="keyboard\|pointer"`                                                                                                                            | The ring itself (see §3)                                                                                               |
| Hover                          | CSS `:hover` in ui-sdk's own examples; no `data-hovered` is emitted                                                                                                                                                                                 | Hover styling via `:hover`, guarded with `@media (hover: hover)`                                                       |
| Color scheme / theme           | `createColorScheme({ storage })` + `Preferences` produce `data-color-scheme`                                                                                                                                                                        | **Keep `data-theme`**: the Hashti contract, not `data-color-scheme` (see §2)                                           |
| Class names                    | Parts take `className`; `mergeProps` joins class names, styles and refs; `render` passes attributes, handlers and ref through                                                                                                                       | The `hashti-*` BEM hooks and `data-variant`/`data-size`/`data-kind`                                                    |

### Gaps that stay Hashti's

- **No theme/locale provider.** There is no `I18nProvider` or theme context.
  Locale is read from the page (`lang`) or passed per component; Hashti's
  theme is a DOM attribute, so it must be present on the element that hosts a
  popup when `container` moves it elsewhere.
- **No appearance variants.** ui-sdk never emits `data-variant` or
  `data-size`. Hashti adds them on its own roots (or on the ui-sdk part root)
  and styles them.
- **No `data-hovered` / `data-focus-visible`.** Interaction states ui-sdk
  does emit: `data-pressed`, `data-selected`, `data-highlighted`,
  `data-open`/`data-closed`, `data-checked`/`data-unchecked`/`data-indeterminate`,
  `data-invalid` (Field parts, Switch), `data-readonly`, `data-required`,
  `data-disabled`, `data-pending`, `data-filled` (Input), `data-side`,
  `data-align`, `data-starting-style`, `data-ending-style`. Everything else
  is CSS pseudo-classes (`css-conventions.md`'s "style the attribute" rule
  becomes: style the attribute where ui-sdk emits one, the pseudo-class
  where it does not).
- **No description-replacing-error slot logic.** `FieldDescription` and
  `FieldError` are separate elements with separate ids, so Frame's
  "guidance stays visible while recovery shows" is the default; Hashti must
  not hide the description.
- **No pending form / read-only-on-submit recipe.** The application composes
  Button pending + `readOnly` fields; Hashti documents the recipe.

## 2. Theming: `data-theme` × ui-sdk's layer and tokens

Facts that make coexistence clean:

1. `@ui-sdk/core/web.css` wraps everything in `@layer ui-sdk` and defines its
   palette as `--ui-*` properties with `light-dark(...)`. The palette is
   chosen by the CSS `color-scheme` property.
2. `design/tokens.css` sets `color-scheme: light` / `dark` (and
   `@media (prefers-color-scheme: dark)` for the `system` mode) inside
   `@layer hashti.tokens`, i.e. in a later layer than `ui-sdk`. So Hashti's
   `data-theme` already controls which side of `light-dark()` ui-sdk's own
   defaults resolve to. No `data-color-scheme` attribute is needed, and none
   should be introduced.
3. `tokens.css` keeps the standard contract: `light` is the document default,
   `[data-theme="dark"]` overrides it, `system` follows
   `prefers-color-scheme`, and every value is `--hashti-*`.

Layer order is declared once, in `packages/styles/layers.css`:

```css
@layer ui-sdk, hashti.tokens, hashti.reset, hashti.components, hashti.themes, hashti.accessibility;
```

- `ui-sdk` first → ui-sdk's behavior CSS (hiding closed content, resetting the
  native popover box, backdrop dimming) loses to every Hashti rule.
- `hashti.tokens` before `hashti.components` → component CSS can read tokens.
- `hashti.components` before `hashti.themes` → a themed recipe may still
  refine a component.
- No `!important`; no new layer without adding it to this line and to
  `design/css-conventions.md`.

Component stylesheets live in `@hashti/styles` and are imported from
`index.css`. They use only `var(--hashti-*)` values; ui-sdk's `--ui-*` names
are an implementation detail of the default look, not a Hashti contract.

Themes and overlays: ui-sdk content stays inside the DOM (top layer, not a
portal), so `[data-theme]` ancestry keeps working, and `@scope`-based frame
rules still apply. The exceptions are explicit `container` moves into a
shadow root or iframe: then Hashti must place `data-theme`, `lang` and `dir`
on that container itself. That is the portal rule, re-expressed for a library
whose popups are not portalled.

Theme preference (optional, later): `createPreference({ values: ["light",
"dark", "system"], defaultValue: "system", attribute: "data-theme", global:
true, storage: createLocalStorage("theme") })` plus `Preferences` writes the
saved value on `<html>` **before hydration** with its inline script. That
keeps the attribute contract and removes a flash of the wrong theme. `system`
stays CSS-only, as today.

## 3. Component recipe

### Step 1 — choose the ui-sdk entry, don't rebuild it

| Hashti family             | ui-sdk entry                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Button / Link             | `@ui-sdk/react/button` (`render={<a href/>}` for links)                                        |
| Text / number / search    | `/input`, `/textarea`, `/number-input`, `/password-input`, `/otp-input`                        |
| Checkbox / radio / switch | `/checkbox`, `/radio`, `/switch`                                                               |
| Select / ComboBox         | `/select`, `/combobox`, `/autocomplete`, `/listbox`                                            |
| Slider                    | `/slider`                                                                                      |
| Date / time               | `/date-picker`, `/date-input`, `/time-input`, `/calendar`                                      |
| Menu / tooltip            | `/menu`, `/menubar`, `/tooltip`, `/hover-card`                                                 |
| Dialog / drawer / popover | `/dialog`, `/alert-dialog`, `/drawer`, `/popover`                                              |
| Tabs / accordion          | `/tabs`, `/accordion`, `/segmented-control`, `/collapsible`                                    |
| Table / tree              | `/listbox` + grid behaviors, `/tree`, `/timeline`                                              |
| Notification              | `/toast` (+ `OverlayHost`), `/meter`, `/progress`                                              |
| Field anatomy             | `/field` (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl`, `FieldSet`) |
| Tag / chips               | `/token-input`, `/combobox` chips part                                                         |

### Step 2 — decide ownership

1. **Compose** (default): wrap the ui-sdk parts, keep their props unchanged,
   add `className` and nothing behavioral.
2. **Compose + primitive** when Hashti needs a behavior ui-sdk does not ship
   (for example a recovery-band composite): write `definePrimitive` in
   `packages/react/src/primitives/<name>.ts` — framework-free — and render it
   with `createParts(primitive, { root: "div", … })`, or write a part by hand
   with `usePrimitive` / `usePart`. Use `mergeProps` to combine own handlers
   with callers' (callers run first and can `preventDefault()`).
3. Never re-implement state, roving focus, selection, popup, or validation
   logic that a ui-sdk part already provides.

### Step 3 — file shape

```
packages/react/src/<component>/<component>.tsx   # "use client" if it holds state
packages/react/src/<component>/index.ts           # re-export
packages/react/src/primitives/<name>.ts           # only if needed
packages/react/src/index.ts                       # barrel
packages/styles/<component>/<component>.css       # imported by styles/index.css
```

### Step 4 — the class contract

- Root: `hashti-<block>`; parts: `hashti-<block>__<part>`; modifiers only
  through attributes.
- Keep ui-sdk's `data-slot` on every element it ships. `data-slot` is the
  primitive name for a root (`data-slot="select"`) and `<name>-<slot>` for a
  part (`data-slot="select-trigger"`). Hashti adds classes; it never deletes
  the attribute or renames it.
- Pass classes with `className`; ui-sdk merges ("Class names, styles, and
  refs combine"). The old rule about a class replacing a library class does
  not exist here.
- State lives in attributes on the part that owns it. Hashti adds only:
  `data-variant="primary|secondary|ghost|danger"`, `data-size="sm|md|lg"`,
  `data-kind="info|success|warning|error"`, plus `data-slot` anatomy names
  already defined in `css-conventions.md`.
- Compound anatomy: ui-sdk already names parts (Field, Select, Dialog,
  Drawer, Tabs, Accordion, Toast). Add `hashti-*__*` classes to those same
  DOM nodes; do not wrap them in extra elements just to own a class.

### Step 5 — geometry and visual rules

- Ordinary control minimum **44px**; explicit sizes 32/44/48; buttons
  64/80 only where large actions are specified. Implement as `min-block-size`
  on the root, driven by `[data-size]`, so content and text scaling can grow
  the control.
- Corners: control 10px, group/popover 14px, dialog 18px, drawer 16px,
  recovery band lower corners 3px.
- Focus ring, always external, never a glow:

  | Context                  | Ring                             |
  | ------------------------ | -------------------------------- |
  | Fields and text          | 2px outline, 2px offset          |
  | Action controls          | 2px outline, 3px offset          |
  | Overlay close buttons    | 2px outline, −2px offset (inset) |
  | Non-interactive surfaces | none                             |

  Present or absent on `:focus-visible`; the ring survives `[data-invalid]`
  and `forced-colors`.

- Recovery band: separate `FieldDescription` and `FieldError` elements,
  error band below the control with `margin-block-start: -9px` in the range
  given by DESIGN.md (1px overlap), control `z-index: 2`, band `z-index: 1`;
  reserve one padded recovery line (58px / 78px ≤24rem) in stable forms.
- Motion from the ladder (`--hashti-duration-fast-01` … `slow-02`), entrance
  `cubic-bezier(0.16, 1, 0.3, 1)`, press scale 0.96–0.98. ui-sdk popups get
  `data-starting-style` / `data-ending-style`; style both, and
  `motion-reduce` / `prefers-reduced-motion` removes travel and scale.

### Step 6 — check it

Build (`bun run build`), then, per component: keyboard walk-through, both
themes, 320px reflow, 200% text, forced colors, and axe `wcag2a`/`wcag2aa`.
ui-sdk also ships checks for its own patterns: `checkPattern(root, "radio-group")`
from `@ui-sdk/core/testing`, and `globalThis.__UI_SDK_STRICT__ = true` makes
development warnings fatal.

## 4. Behavior contracts checklist

Every Hashti component, before it is called done. Library-agnostic; each item
names the mechanism that satisfies it here.

**States that coexist**

- [ ] Default is understandable without hover.
- [ ] Hover answers enabled controls only, no layout movement
      (`@media (hover: hover)`).
- [ ] Pressed feedback is immediate: ink change plus the press scale.
- [ ] `:focus-visible` paints the ring from the matrix above, on the actual
      focus target (ui-sdk parts: Input, the `option` or `tab` that owns
      `roving.tabIndex`).
- [ ] Selected/current/mixed: `data-selected`, `data-checked`,
      `data-unchecked`, `data-indeterminate`, `aria-current` where relevant.
- [ ] Invalid: `data-invalid` on the Field parts, `aria-invalid` on the
      control, error text present, description still visible.
- [ ] Selected + focused and invalid + focused have explicit recipes; error
      paint outranks custom selection color.
- [ ] Read-only is legible, focusable, copyable, submitted, and rejects
      mutation (`readOnly` + `data-readonly`).
- [ ] Disabled is unavailable with correct semantics; guidance nearby stays
      at AA. Use `focusableWhenDisabled` when a tooltip must explain it.
- [ ] Pending prevents repeat activation, keeps focus, announces once
      (`aria-busy`, `data-pending`, `pendingAnnouncement`), keeps dimensions.
- [ ] Success confirms without stealing focus or coloring every input.
- [ ] Empty/failed/unavailable explains itself and offers the next action.

**Evidence rules**

- [ ] Hit target ≠ painted mark; target ≥24px, 44px in ordinary forms and on
      coarse pointers.
- [ ] `dir` and `lang` remain correct; `isRTL`-aware keyboard handling for
      Hashti-authored primitives; logical CSS properties; marks do not mirror.
- [ ] ui-sdk already localizes its own labels; Hashti-authored strings have a
      localization path and no hardcoded English.
- [ ] Overlay dismissal is inner-first (Escape hits the topmost layer).
- [ ] Focus returns to the trigger, or to `finalFocus`, on dismissal.
- [ ] Focused content is never hidden behind fixed headers or overlays.
- [ ] Reduced motion, forced colors, and 200% text keep every cue visible.
- [ ] axe zero violations is regression evidence, not certification; record
      the manual checks (keyboard, screen reader spot check, zoom).

## 5. What NOT to port

Do not carry these into `@hashti/react` or `@hashti/styles`:

- Any `react-aria-*` class, hook, context, or provider. `className` here
  does not replace a library class, so the old "keep both class names" rule
  is dropped.
- `useSlottedContext`, `slot="label|description|close"` props,
  `composeRenderProps`, `useObjectRef`, RAC's `mergeProps` (ui-sdk exports
  its own `mergeProps` from `@ui-sdk/react/primitive`), `FocusRing`,
  `FocusScope`, `PortalProvider`, `SSRProvider`, `VisuallyHidden` components
  as imports.
- `selectedKeys` / `selectedKey` / `Key` / `KeySet` and `Item`/`Section`
  collection composition. ui-sdk uses `value` (single, array for multiple)
  and data `items`, or explicit item parts with `createSelection`.
- `isRequired` and `validationBehavior="aria"`. Use native `required` and
  `Field invalid`; the application owns validation timing.
- `onPress` as the universal action name. ui-sdk: `onClick` on Button and
  DOM parts, `press` inside a primitive slot, `onValueChange` for state.
- `data-hovered`, `data-focus-visible`, `data-entering`, `data-exiting`,
  `data-pressed` from RAC (ui-sdk emits its own `data-pressed`, but not
  hover/focus-visible/entering/exiting; entry/exit are
  `data-starting-style`/`data-ending-style`).
- `Theme appearanceClassName`, the layer bridge props, and `inputProps`.
  ui-sdk has no such bridge; theme travels by DOM attribute and `container`
  is the documented exception.
- `@internationalized/date`, `I18nProvider`, `useLocale`, `GetInternals`
  style locale plumbing. Use `pageLocale`/`userLocale`/`toLocale`, the
  `locale` prop on date and number components, and `Intl` directly.
- The old portal/`@scope` bridging recipe. Popups are in place; only a
  deliberate `container` move needs theme/locale attributes re-applied.
- RAC `Collection`, `ToggleButtonGroup`-style APIs, `useDragAndDrop` names.
  ui-sdk: `createSelection`, `createRovingFocus`, `bindDrag`,
  `createReorder`, `createTransfer`.
- Token names from other libraries. Only `--hashti-*` values in Hashti CSS;
  `--ui-*` is private to the default ui-sdk look.
