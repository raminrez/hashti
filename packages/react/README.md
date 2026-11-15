# @hashti/react

React Aria Components (**RAC**) with Carbon reference styling, Relay themes, and
reusable Frame foundations.
Version **0.1.0**; Cinder and the package scope are working names.

## Installation

In the Cinder workspace, run `bun run pack`. In a separate React app:

```sh
bun add /path/to/cinder/dist/packages/cinder-react-0.1.0.tgz \
  /path/to/cinder/dist/packages/cinder-tokens-0.1.0.tgz \
  react@19.3.1 react-dom@19.3.1 react-aria-components@1.22.1
```

Tokens are an explicit peer so an application provides one shared copy. Both local
archives are needed because the scope has not been published. The tested
baseline is React/React DOM 19.3.1 and RAC 1.22.1. The declared peer ranges allow
React 19 and RAC 1.22+, but those other versions have not been independently tested.

ESM JavaScript and TypeScript declarations are exported from `@hashti/react`.
Import `@hashti/react/styles.css` once; this static stylesheet includes all tokens,
themes, and component CSS. No Cinder CSS compiler is required.
React, React DOM, RAC, and `@internationalized/date` are external to the JS bundle.

```tsx
import { Button, Layer, Stack, TextField, Theme } from "@hashti/react";
import "@hashti/react/styles.css";

export function Settings() {
  return (
    <Theme theme="frame-light" locale="en-US">
      <Layer>
        <Stack gap={6}>
          <TextField label="Workspace name" defaultValue="Cinder studio" />
          <Button onPress={() => console.log("Saved locally")}>Save workspace</Button>
        </Stack>
      </Layer>
    </Theme>
  );
}
```

## Frame foundations — Phase 1

The approved `frame-light` and `frame-dark` foundations and customization contracts
below are implemented. These themes are additive: `white`, `g10`,
`g90`, `g100`, `relay-light`, and `relay-dark` keep their existing defaults.
Each Frame map contains 343 entries, including 25 theme-owned typography/size
foundation overrides. The six older maps, 191 global foundations, and 36 structured
Carbon typography objects retain their values; see the
[token guide](../tokens/README.md#authored-frame-values).

Phase 1 representative installed-package proof passed for native CSS, real Bun CSS
Modules, and Tailwind 4.3.5. The workspace's
[Phase 1 verification](../../docs/verification.md#frame-phase-1) records the executed checks; the
[coverage matrix](../../docs/coverage.md) records implemented family scope.

Minimum heights for ordinary Buttons and single-line fields at a 16px root are:

| Theme family | Button, size omitted | Field, size omitted | Explicit `sm` / `md` / `lg` |
| ------------ | -------------------- | ------------------- | --------------------------- |
| Carbon/Relay | 48px                 | 40px                | 32 / 40 / 48px              |
| Frame        | 44px                 | 44px                | 32 / 44 / 48px              |

Fields still default to `size="md"`. Button retains its resolved
`data-size="lg"` when size is omitted; Frame distinguishes omission internally
to use 44px. That internal marker is not a public CSS hook. Use the `size` prop
for explicit sizing. Button's `xl` and `2xl` remain 64px and 80px in every theme.
TextArea keeps its multiline `rows` contract rather than a size prop.

These are foundation contracts, not a claim that the full catalog has completed
Frame review. The current field/form batch adds persistent guidance, attached
recovery, and additive compound APIs. Grouped, collection, and date compounds are
included for shared anatomy and API compatibility only, not completed later-family
Frame review. The [Phase 2 plan](../../docs/component-library-plan.md#phase-2--first-complete-frame-slice)
and [coverage matrix](../../docs/coverage.md) track the wider family scope; the
[field/form verification](../../docs/verification.md#frame-fields--phase-2-second-batch) distinguishes executed evidence
from authored stories and fixtures.

## Button and Link

Use **Button** to perform an action and **Link** to navigate. Choose one primary
action per decision. Destructive variants need explicit wording such as “Delete
draft”; color alone does not explain the consequence.

Cinder's recommended Frame button set has four choices:

| Variant     | Use                                                     |
| ----------- | ------------------------------------------------------- |
| `primary`   | The main action: a strong neutral fill.                 |
| `secondary` | Supporting actions: a quiet neutral fill.               |
| `ghost`     | Low-emphasis actions: unfilled until interaction.       |
| `danger`    | Destructive actions: an explicit label and danger fill. |

This compact hierarchy follows the emphasis guidance in [Base](../../docs/research-base.md),
[HeroUI](../../docs/research-heroui.md), and [Astryx](../../docs/research-astryx.md).
Cinder keeps its own Frame palette and geometry.

The canonical [Button stories](../../apps/storybook/stories/Button.stories.tsx) and
[Link stories](../../apps/storybook/stories/Link.stories.tsx) cover appearance,
keyboard/pointer interaction, pending and recovery, customization, long labels,
and Persian and Arabic `Theme locale` boundaries. They inherit Frame light/dark from Storybook's
preview. Story coverage is distinct from the executed browser/AT evidence in
the [verification record](../../docs/verification.md).

### Button props and behavior

| Prop                    | Contract                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`               | `primary` (default), `secondary`, `ghost`, or `danger` for new Frame work. Existing `tertiary`, `danger-tertiary`, and `danger-ghost` values remain supported.                            |
| `size`                  | Omitted: Frame 44px, Carbon/Relay 48px. Explicit `sm`, `md`, `lg`, `xl`, `2xl` use the [theme minimums](#frame-foundations--phase-1).                                                     |
| `iconOnly`              | Defaults to `false`. Gives the icon a square target at the resolved size; supply `aria-label` or `aria-labelledby` on Button.                                                             |
| `isDisabled`            | Native disabled button: unavailable, skipped in tab order, and does not activate.                                                                                                         |
| `isPending`             | Application-owned pending state. RAC prevents press/hover interaction and repeat activation while retaining focusability.                                                                 |
| `pendingLabel`          | Accessible progress label; defaults to `"Pending"`. Supply the operation in the application's language, such as `"Saving draft"`.                                                         |
| `onPress`               | RAC's normalized mouse, touch, keyboard, and assistive-technology activation callback. Returning a promise does not set `isPending` automatically.                                        |
| `type`, `name`, `value` | Native form contract. `type` defaults to `"button"`; use `"submit"` explicitly. RAC temporarily changes a pending submit button to `type="button"` to prevent implicit repeat submission. |

The compatibility stories cover the existing outlined `tertiary`, outlined
`danger-tertiary`, and unfilled `danger-ghost` treatments.
Hover and press use RAC state; keyboard focus has an external two-pixel
outline with a three-pixel offset. Minimum heights and labels can grow with text.
The compact 32px size is intentional; use the ordinary 44px minimum for comfortable
standalone targets.

#### Pending, naming, and request ownership

Keep the action's children and accessible label stable while pending to preserve
its identity and dimensions. Frame and Relay visually replace the retained content
with the centered progress mark. `isPending` keeps focus; adding `isDisabled` also
applies native disabling and loses that focus-retaining contract.

RAC 1.22.1 includes the progress label in its pending announcement and browser
accessible name: for example, **“Save draft” → “Save draft Saving draft”**. The action
text is retained, not replaced by “Saving”. The nested progressbar is independently
named by `pendingLabel`. Some DOM-based accessible-name helpers omit this embedded
progress text; the browser accessibility tree is the authority for the combined
name. Cinder does not freeze or rewrite caller-authored children: a `children`
render function can still change its text, and the caller owns that label change.

Applications own the request, pending lifetime, failure message, and retry. Keep
recoverable data in place, announce a consequential failure near the action, and
let the same action retry. The **Save and retry** story demonstrates this complete
path with a local simulated request and deterministic interaction checks. It uses
`isPending` without `isDisabled`, preserves focus and button dimensions, and keeps
the draft after failure. Localize both the action text and `pendingLabel`; a
spinner alone cannot name an icon-only action.

```tsx
<Button isPending={isSaving} pendingLabel="Saving draft" onPress={saveDraft}>
  Save draft
</Button>

<Button variant="ghost" iconOnly aria-label="Copy workspace link" onPress={copyLink}>
  <Icon name="copy" />
</Button>
```

### Link props and navigation

An enabled, nonempty `href` renders a native `<a>`, preserving browser navigation,
Enter activation, open-in-new-tab behavior, and upstream `target`, `rel`, and
`download` props. Space is not link activation. Use an actual destination rather
than an `onPress` action disguised as navigation. Applications own any router
integration and current-page `aria-current` value.

- `inline` defaults to false. Standalone links acquire an underline on interaction;
  `inline` keeps it visible within prose. It changes decoration, not DOM display
  or navigation. Frame hover/press strengthens the underline without moving text.
- `isDisabled` removes navigation and activation, exposes `aria-disabled="true"`,
  and skips the link in tab order. RAC renders a `<span role="link">` rather than
  leaving a disabled-looking anchor with a live destination. Explain dependencies
  in nearby text.
- Without a nonempty `href`, RAC likewise renders a `<span role="link">`. This
  upstream behavior is preserved, but it has no native URL to open or copy.
- Link text names the destination. Name icon-only links explicitly; Cinder `Icon`
  is decorative by default. If opening a new tab, include that information in the
  link text when it would otherwise surprise the user.

```tsx
<p>
  Read the{" "}
  <Link href="/guidelines" inline>
    publishing guidelines
  </Link>{" "}
  before sharing.
</p>
```

### DOM, refs, and customization

| Component/part   | Actual target and responsibility                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button           | One `<button>` with `hashti-button`; `ref`, `className`, and `style` target it.                                                                                                                                                 |
| Pending progress | A `div.hashti-spinner` with `role="progressbar"` inside Button while pending. RAC supplies the announcement relationship; Cinder supplies the indeterminate appearance and `pendingLabel`.                                      |
| Link             | `hashti-link` on the anchor, or on RAC's fallback span. `className`, `style`, and the ref reach that same element. The inherited ref type is `HTMLAnchorElement`; it is an actual anchor only with an enabled, nonempty `href`. |

Both components preserve RAC `children`, `className`, and `style` render functions.
Custom classes are appended to the Cinder root hook. A `render` function must
return one correct native element and pass all supplied DOM props and the ref
through. Button expects `<button>`; Link's render props distinguish `<a>` from
`<span>` using a nonempty authored `href` and the render state's `!isDisabled`.
An inert `href` can remain on RAC's fallback span, so `"href" in domProps` alone
does not identify an anchor. Replacing handlers, IDs, or the element type can
break the interaction and labeling contracts.

Appearance hooks are `data-variant`, `data-size`, and `data-icon-only` on Button,
and `data-inline` on Link. RAC owns `data-hovered`, `data-pressed`, `data-focused`,
`data-focus-visible`, and `data-disabled` on both; Button additionally exposes
`data-pending`, and Link exposes `data-current`. Drive those states with props and
real input rather than writing the attributes yourself. Button's omitted-size
marker remains private.

Use public semantic variables such as `--hashti-button-primary`,
`--hashti-button-primary-hover`, `--hashti-button-primary-active`,
`--hashti-text-on-color`, `--hashti-link-primary`, `--hashti-focus`, and
`--hashti-control-radius`, or an ordinary custom class. The stories show root refs,
class/style render functions, and a custom DOM render while retaining the base
classes, labels, and interaction. Private recipe variables are not customization
contracts. See [CSS integration](#css-integration) for cascade order.

## Relay themes

Use `theme="relay-light"` or `theme="relay-dark"` on the existing `Theme` component.
The first Relay slice styles Button, TextField, Select, Checkbox/CheckboxGroup,
Radio/RadioGroup, Switch, ContentSwitcher, and Dialog/Modal/Popover compositions.
The remaining families keep their baseline geometry with the selected theme's
tokens. The original `white`, `g10`, `g90`, and `g100` themes remain available.

- Switch has its own `sm`/`md` track geometry; Checkbox and Radio do not expose
  a size prop.
- Controls, popovers, and dialogs have 8/12/20px corners. Labels and control text
  use IBM Plex Sans at 14/20px; buttons and field labels use weight 500.
- `variant` applies to Button: `primary`, `secondary`, `tertiary`, `ghost`, `danger`,
  `danger-tertiary`, and `danger-ghost`. Validation is a field state, not a variant.
- `isPending` keeps a Button focusable and prevents repeat activation. Keep its
  children stable; Relay replaces their appearance with a progress mark without
  changing the width. `pendingLabel` labels that progress mark and defaults to
  `"Pending"`; localize it alongside the action, e.g. `pendingLabel="Saving"`.
  Applications own when pending starts and ends. Icon-only buttons need an
  `aria-label`.

Relay uses native CSS `@scope` to stop styling at a nested Theme boundary,
including portals. See [CSS integration](#css-integration) for cascade order and
browser requirements. Reduced-motion preferences remove transitions and animation.

The running workspace's `/relay` page shows the states, token values, live
compositions, and customization examples. `docs/relay.md` records the specification.

## Composition contracts

- Use RAC's `onPress` for actions. Fields expose their upstream controlled/default
  value APIs. `Select` and `ComboBox` use the current `value`/`defaultValue`/`onChange`
  API; multiple selection uses `selectionMode="multiple"` and arrays of keys.
- Provide a visible convenience `label`, compound `.Label`, or accessible name.
  RAC connects labels, descriptions, and validation errors. `Form` defaults to
  native submit-time validation; `validationBehavior="aria"` marks required/invalid
  state through ARIA without native submission blocking.
- Controls preserve upstream render props, events, and refs. TextField and TextArea
  expose a `ref` to the outer `div` and an `inputRef` to the default input or textarea.
  With custom children, supply the control ref yourself. SearchField retains its
  `inputProps` contract.
- Cinder wrappers retain their base classes when `className` is customized. Direct
  RAC re-exports such as `Label`, `Input`, `Text`, `FieldError`, `MenuItem`,
  `ListBoxItem`, `Tab`, and `TreeItem` retain RAC's behavior: a custom class replaces
  the default. Include the `react-aria-*` class yourself to retain the existing
  stylesheet hooks. Raw Label and Text accept a string `className`; Input and
  FieldError also accept class render functions.
- Dynamic collections need stable item IDs and `textValue` when children are more
  than plain text. Use upstream collection children/functions and selection types.
  Select options may use `Text slot="label"` and `Text slot="description"`; the
  description stays in the menu and is hidden in the selected value.
- A fully controlled ComboBox owns both `value` and `inputValue` in the application.
  RAC calls `onChange` or `onInputChange` for an interaction, not both. Update the
  input text on selection and clear the selected key when the input is cleared;
  Cinder does not reconcile application-controlled state.
- TextField, TextArea, NumberField, SearchField, and date-field conveniences retain
  custom replacement `children`, including RAC state render functions. Raw RAC
  replacements still work. Select and ComboBox convenience `children` remain their
  option collections, not replacement triggers or full trees. Use `.Root` to own
  the whole RAC tree; item generics and single/multiple value types are preserved.
- Pair `DialogTrigger` with `Modal` or `Popover` and a named `Dialog`. Use a
  `Heading slot="title"` or `aria-label`; Escape restores trigger focus.

The exports include controls, text/number/date fields, selection, tables and other
collections, tabs, disclosures, breadcrumbs, overlays, notifications, files,
pagination, content, layout, and shell primitives. Run the docs for all 45 families.

### Default and custom field anatomy

Default field roots and compound `.Root`s keep `hashti-field` and their family
classes, such as `hashti-text-field`, `hashti-text-area`, and `hashti-select`.
Cinder-owned default anatomy and compound parts share these stable BEM-style hooks
alongside the existing classes:

| Hook                        | Default part                                                  |
| --------------------------- | ------------------------------------------------------------- |
| `hashti-field__label`       | Associated label                                              |
| `hashti-field__label-row`   | Label and its separate help button                            |
| `hashti-field__necessity`   | Localized required/optional wording                           |
| `hashti-field__label-help`  | Named field-help button                                       |
| `hashti-field__control`     | Standalone input/textarea, grouped control, or Select trigger |
| `hashti-field__help`        | Recovery container; also `hashti-field-help`                  |
| `hashti-field__description` | Description text                                              |
| `hashti-field__error`       | Validation error                                              |
| `hashti-field__status`      | Appearance-only feedback, with its own description ID         |
| `hashti-field__status-icon` | Decorative inline feedback icon                               |
| `hashti-select__value`      | Selected value                                                |
| `hashti-select__listbox`    | Options in the detached Select popover                        |

RAC classes such as `react-aria-Label`, `react-aria-Input`, `react-aria-Text`,
`react-aria-FieldError`, `react-aria-SelectValue`, and `react-aria-ListBox` are
retained on the default parts, as are existing Cinder family/part classes.
RAC slots establish relationships; the BEM classes provide styling hooks.
State selectors belong on the element that owns the state: for example,
`.hashti-field[data-invalid]` for the field and
`.hashti-field__control[data-focused]` for a RAC Input's focus state.

The convenience API remains callable:

```tsx
<TextField
  name="email"
  label="Work email"
  type="email"
  description="Use your work address."
  errorMessage="Enter a valid work email."
  isRequired
/>
```

In `frame-light` and `frame-dark`, defaults follow **label → persistent guidance →
control → recovery**. The description stays before the control and remains visible
when validation fails; the Help part contains the RAC error. The six existing
Carbon/Relay themes keep **label → control → help/error**, including the rule that a
nonempty error replaces the visible description in the help container. Their
defaults, APIs, and classes are unchanged. Custom children keep their authored order.

Frame's Help immediately after a control reserves a bounded, padded **one-line
recovery minimum**, not a fixed error height or a promise that arbitrary text cannot
move the next action. Longer and rich errors wrap and grow. The
[Form story recipe](../../apps/storybook/stories/forms.css) increases required-field
Help minimums to **58px** (`3.625rem`) and **78px** (`4.875rem`) in a container at or
below `24rem`, at a 16px root. Those are application recipe minimums, not global
field sizes; long errors may exceed them and move Save rather than clip. Optional
fields are not made invalid or given the larger required-field budget.

#### Additive compound namespaces

Each namespace below is still the existing callable convenience component.
`.Root` accepts the original RAC props and original whole-tree `children` contract,
including state render functions; it does not insert convenience labels, controls,
or feedback. Cinder exports the corresponding `*RootProps` alongside the existing
convenience `*Props`. TextArea.Root uses RAC's **TextField** root props; `rows`,
`placeholder`, and native textarea events belong on TextArea.Input. It has no `size`
prop. Other sized field roots retain `size="md"` by default.

All twelve `.Root` refs target **`HTMLDivElement`**. Shared parts retain their exact
RAC/native prop and ref types, not a generalized field-part interface:

| Shared part     | Public prop type                                             | Default DOM and ref target                                                            |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `.Label`        | `FieldLabelProps` = RAC Label props + `FieldLabelOptions`    | `<label>`; `HTMLLabelElement`; optional help sits outside the label                   |
| `.Description`  | `FieldDescriptionProps` = RAC Text component props           | `<span>`; `HTMLElement`; defaults to `slot="description"`, which callers may override |
| `.Help`         | `FieldHelpProps` = native `ComponentProps<"div">`            | `<div>`; `HTMLDivElement`; ordinary DOM props, not RAC render props                   |
| `.ErrorMessage` | `FieldErrorMessageProps` = RAC FieldError component props    | `<span>`; `HTMLElement`; `elementType="div"` for block-level recovery children        |
| `.Status`       | `FieldStatusProps` = RAC Text props without children/slot/id | `<span>`; `HTMLElement`; content and ID belong to the root's `status`                 |
| `.StatusIcon`   | `FieldStatusIconProps` = Cinder Icon props without name      | `<svg>`; decorative; actual invalidity takes precedence over presentation status      |

The family-specific parts below are the exported members; there are no new flat
component exports for them. Ref targets are shown in parentheses.

| Namespace         | Additional parts and ref targets                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TextField`       | `Input` → RAC Input (`HTMLInputElement`); `TextArea` → RAC TextArea (`HTMLTextAreaElement`); `Control` → RAC Group (`HTMLDivElement`)                                                                                                                                                                                                            |
| `TextArea`        | `Input` → RAC TextArea (`HTMLTextAreaElement`); `Control` → RAC Group (`HTMLDivElement`)                                                                                                                                                                                                                                                         |
| `NumberField`     | `Input` → RAC Input (`HTMLInputElement`); `Control` → RAC Group (`HTMLDivElement`); `Button` → Cinder Button (`HTMLButtonElement`), with `slot="decrement"` or `slot="increment"`                                                                                                                                                                |
| `SearchField`     | `Input` → RAC Input (`HTMLInputElement`); `Control` → RAC Group (`HTMLDivElement`); `ClearButton` → Cinder Button (`HTMLButtonElement`)                                                                                                                                                                                                          |
| `CheckboxGroup`   | `Checkbox` → existing Cinder Checkbox (`HTMLLabelElement`); inherited `inputRef` targets `HTMLInputElement`                                                                                                                                                                                                                                      |
| `RadioGroup`      | `Radio` → existing Cinder Radio (`HTMLLabelElement`); inherited `inputRef` targets `HTMLInputElement`; `Options` → native div (`HTMLDivElement`)                                                                                                                                                                                                 |
| `Select`          | `Trigger` → Cinder Button (`HTMLButtonElement`); `Value` → RAC SelectValue (`HTMLSpanElement`); `Popover` → Cinder Popover (`HTMLElement`); `ListBox` → RAC ListBox (`HTMLDivElement`)                                                                                                                                                           |
| `ComboBox`        | `Input` → RAC Input (`HTMLInputElement`); `Control` → RAC Group (`HTMLDivElement`); `Trigger` → Cinder Button (`HTMLButtonElement`); `Value` → RAC ComboBoxValue (`HTMLDivElement`); `Popover` → Cinder Popover (`HTMLElement`); `ListBox` → RAC ListBox (`HTMLDivElement`)                                                                      |
| `DateField`       | `Input` → RAC DateInput (`HTMLDivElement`); `Segment` → unchanged RAC DateSegment (`HTMLSpanElement`)                                                                                                                                                                                                                                            |
| `TimeField`       | `Input` → RAC DateInput (`HTMLDivElement`); `Segment` → unchanged RAC DateSegment (`HTMLSpanElement`)                                                                                                                                                                                                                                            |
| `DatePicker`      | `Input` → RAC DateInput (`HTMLDivElement`); `Segment` → unchanged RAC DateSegment (`HTMLSpanElement`); `Control` → RAC Group (`HTMLDivElement`); `Trigger` → Cinder Button (`HTMLButtonElement`); `Popover` → Cinder Popover (`HTMLElement`); `Calendar` → existing Cinder Calendar (`HTMLDivElement`)                                           |
| `DateRangePicker` | `Input` → RAC DateInput (`HTMLDivElement`), with `slot="start"` or `slot="end"`; `Segment` → unchanged RAC DateSegment (`HTMLSpanElement`); `Control` → RAC Group (`HTMLDivElement`); `Trigger` → Cinder Button (`HTMLButtonElement`); `Popover` → Cinder Popover (`HTMLElement`); `Calendar` → existing Cinder RangeCalendar (`HTMLDivElement`) |

`FieldInputProps`, `FieldTextAreaProps`, `FieldControlProps`, and
`FieldDateInputProps` are the respective RAC Input, TextArea, Group, and DateInput
component props, including their refs. DateInput requires a segment-rendering
`children` function; it is a segmented div, not a native input. Select/ComboBox Root,
Value, and ListBox retain their item generics. Their roots preserve the RAC
single/multiple key contracts through `SelectRootProps<T, M>` and
`ComboBoxRootProps<T, M>`; multiple roots use `M = "multiple"` and key arrays.

Slots retain each underlying type. `.Root` supports RAC `slot?: string | null`:
`slot={null}` opts out of inherited slot props. `.Control` and date `.Input` also
retain RAC nullable slots. Native Input and textarea leaves retain
**`slot?: string`**, not `null`; do not widen them to match the root. Search clear,
ComboBox trigger, and picker trigger buttons use RAC's default button context
without a special slot name. Number buttons and date-range inputs use the explicit
slots in the table.

Root `onChange` receives the RAC value (for example, a string or number). Input
`onChange` and `onInput` receive native React events. Native props such as
`placeholder`, `spellCheck`, `rows`, and a control ref go on the leaf. The shorthand
TextField/TextArea `ref` still targets the root, and `inputRef` targets only their
default leaf; custom children supply their own leaf ref. SearchField's existing
shorthand `inputProps.className` remains a **complete override**, including removal
of `react-aria-Input`; SearchField.Input instead appends custom classes to its RAC
base class.

Namespaced Label/Description accept string classes; Help/RadioGroup.Options accept
native string classes and styles. Stateful RAC parts retain their upstream
class/style/children functions where supported. Wrappers append custom classes to
their base hooks. A `render` callback must return one expected native element and
pass through every supplied DOM prop and ref; it is not a replacement state system.
Raw aliases such as date Segment retain RAC's class-replacement behavior.

```tsx
import { TextField } from "@hashti/react";

<TextField.Root name="email" type="email" autoComplete="email" isRequired>
  <TextField.Label>Work email</TextField.Label>
  <TextField.Description>Use your work address.</TextField.Description>
  <TextField.Input
    placeholder="name@example.com"
    className={({ isFocused }) => (isFocused ? "focused-email" : "")}
  />
  <TextField.Help>
    <TextField.ErrorMessage>
      {({ validationDetails }) =>
        validationDetails.valueMissing ? "Enter your work email." : "Enter a valid work email."
      }
    </TextField.ErrorMessage>
  </TextField.Help>
</TextField.Root>;
```

For grouped families, the control hook belongs on **Control once**, not on each
inner Input. NumberField, SearchField, ComboBox, and picker Inputs carry only their
RAC leaf class. `TextField.Input`, `TextField.TextArea`, `TextArea.Input`,
`DateField.Input`, and `TimeField.Input` already carry the control hook; inside an
optional TextField.Control or TextArea.Control, use a raw RAC Input or textarea to
avoid duplicating it. SearchField adds ClearButton, while ComboBox adds Trigger. Keep
Help next to the control for attached Frame recovery. If using an explicit
small/large size, also size the composed button parts to match.

```tsx
import { NumberField } from "@hashti/react";

<NumberField.Root name="reviewers" defaultValue={3} minValue={1} maxValue={12}>
  <NumberField.Label>Reviewers</NumberField.Label>
  <NumberField.Description>Choose one to twelve reviewers.</NumberField.Description>
  <NumberField.Control>
    <NumberField.Input />
    <NumberField.Button slot="decrement" aria-label="Fewer reviewers">
      −
    </NumberField.Button>
    <NumberField.Button slot="increment" aria-label="More reviewers">
      +
    </NumberField.Button>
  </NumberField.Control>
  <NumberField.Help>
    <NumberField.ErrorMessage />
  </NumberField.Help>
</NumberField.Root>;
```

Unlike convenience Select/ComboBox children, `.Root` children describe the whole
tree. Select's option `items` and item renderer go on Select.ListBox; ComboBox keeps
its upstream `items`/`defaultItems` on its Root and the option renderer on ListBox.

```tsx
import { Icon, ListBoxItem, Select } from "@hashti/react";

<Select.Root name="access" defaultValue="viewer">
  <Select.Label>Access</Select.Label>
  <Select.Description>Choose the access this teammate needs.</Select.Description>
  <Select.Trigger>
    <Select.Value />
    <Icon name="chevronDown" />
  </Select.Trigger>
  <Select.Help>
    <Select.ErrorMessage />
  </Select.Help>
  <Select.Popover>
    <Select.ListBox>
      <ListBoxItem id="viewer">Viewer</ListBoxItem>
      <ListBoxItem id="editor">Editor</ListBoxItem>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>;
```

These compounds do not imply completed grouped, collection, or date-family Frame
review. They expose compatible shared anatomy while those family reviews remain
separate.

#### Raw replacement children

Existing raw replacement children still work. To retain this styling, supply both
the raw RAC classes and the part hooks explicitly; Cinder does not inject or
rearrange a custom tree:

```tsx
import { useRef } from "react";
import { FieldError, Input, Label, Text, TextField } from "@hashti/react";

export function WorkEmail() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TextField name="email" type="email" isRequired>
      <Label className="react-aria-Label hashti-field__label">Work email</Label>
      <Input ref={inputRef} className="react-aria-Input hashti-field__control" />
      <div className="hashti-field-help hashti-field__help">
        <Text slot="description" className="react-aria-Text hashti-field__description">
          Use your work address.
        </Text>
        <FieldError className="react-aria-FieldError hashti-field__error">
          Enter a valid work email.
        </FieldError>
      </div>
    </TextField>
  );
}
```

This authored example keeps the legacy description-inside-help arrangement: a
nonempty error still replaces its visible description, even in Frame. Put guidance
before the control for Frame's persistent default arrangement. A class render
function on raw Input or FieldError must likewise return the raw class and BEM
hook to retain this styling. The flat `Label`, `Input`, `Text`, `FieldError`, `Group`,
`DateInput`, `DateSegment`, `SelectValue`, `ComboBoxValue`, and `Form` exports remain
the original RAC exports.

### Field status, necessity, and label help

All twelve field namespaces accept `status?: FieldStatus` and `isOptional?: boolean`.
Conveniences also accept `labelTooltip?: string`; compound `.Label` accepts
`FieldLabelOptions` (`isRequired`, `isOptional`, and `labelTooltip`).

```tsx
<TextField
  name="workspace"
  label="Workspace name"
  description="Use the name your team recognizes."
  labelTooltip="This name appears in the shared review list."
  isRequired
  status={{ type: "warning", message: "Check this name before saving." }}
/>
```

`FieldStatus` is `{ type: "warning" | "error" | "success"; message?: ReactNode }`.
It is **appearance only**: even `type: "error"` does not set `isInvalid`, change a
value, fail native validity, or block submission. RAC `isInvalid`, `validate`, native
constraints, and Form `validationErrors` remain authoritative. Actual validation
suppresses the presentation message and shows the validation error/icon instead.
Do not use success appearance as evidence that server validation has passed.

In Frame, visible status attaches beneath a bordered control. CheckboxGroup and
RadioGroup feedback stays detached at group level. Older themes retain their field
order and use readable text with status-colored icons; Frame uses its paired status
foregrounds and surfaces. Long messages grow and wrap. DateRangePicker's existing
control wraps its dates and action when they do not fit; it does not shrink segments.

Status has a separate mounted description ID, not RAC's `slot="description"`.
Existing guidance and caller `aria-describedby` remain associated. A compound Root
does not insert Status: place `.Status` in `.Help` explicitly; omitting or unmounting
it leaves no dangling status description. `.Control` includes the inline icon for
grouped controls. For a bare Input/textarea/date input, place `.StatusIcon` next to
the control and opt into `data-hashti-input-icon` on Root to share the grid cell
without wrapping or replacing the native element. Raw exports remain raw.

```tsx
<NumberField.Root
  name="reviewers"
  defaultValue={3}
  status={{ type: "success", message: "The count is recorded in this draft." }}
>
  <NumberField.Label labelTooltip="Count everyone who can review the draft.">
    Reviewers
  </NumberField.Label>
  <NumberField.Control>
    <NumberField.Input />
    <NumberField.Button slot="decrement" aria-label="Fewer reviewers">
      <Icon name="minus" />
    </NumberField.Button>
    <NumberField.Button slot="increment" aria-label="More reviewers">
      <Icon name="plus" />
    </NumberField.Button>
  </NumberField.Control>
  <NumberField.Help>
    <NumberField.ErrorMessage />
    <NumberField.Status />
  </NumberField.Help>
</NumberField.Root>
```

When a message is omitted, a visually hidden localized status word describes the
inline icon. Status does not create a live region; applications own announcements
for asynchronous results. Application labels, help, messages, and validation copy
remain caller-localized.

Cinder-owned labels inherit actual `isRequired` and append localized necessity
wording. Required wins over optional; `isOptional` only adds a visible optional
marker, never changes validity. A `.Label isRequired` marker is likewise presentation
only: set `isRequired` on Root for actual required behavior. Avoid manually adding
a second marker. Raw `Label` replacements retain authored wording and are unchanged.
Built-in necessity, icon-only status, and help-control strings cover English,
Persian, Arabic, and German, with English fallback, using the effective RAC locale.

Label help uses a named info button outside the label. Stationary hover or keyboard
focus shows a Tooltip; RAC tooltips dismiss on scroll. Click, Enter/Space, or tap
opens a dialog Popover with reachable dismissal and focus return. The popover uses
RAC's default focus/accessibility behavior and does not open the field's select,
calendar, clear, or stepper action. Help's accessible name is localized “About” plus
the label. The `hashti-field__label-popover` hook targets the detached help surface;
Theme supplies its appearance and locale. Coarse-pointer help/dismissal targets
have a 44px minimum.

### Form and validation ownership

`Form` is unchanged RAC, with a native `HTMLFormElement` ref. RAC owns validation
timing, invalid/required state, first-invalid focus, and the description/error
associations. Use the upstream `isRequired`, constraints, `validate`,
`validationBehavior`, and `Form validationErrors` contracts. ErrorMessage is RAC
FieldError with Cinder classes: it appears when RAC reports an error, and its
children may read `ValidationResult`, including `validationDetails` and
`validationErrors`. Use Cinder's necessity wording or author it on raw labels, and
provide useful localized recovery; Theme
locale does not guarantee that browser-generated validation text uses that language.

Applications own requests, pending lifetime, returned name-to-error mappings,
service failure feedback, and retry. The
[Form stories](../../apps/storybook/stories/Form.stories.tsx) use `onSubmit` with
`event.preventDefault()` and a fresh `FormData(event.currentTarget)` snapshot to
retain drafts rather than use an auto-resetting React action. They guard in-flight
native/implicit submission as well as use Button `isPending`; pending appearance
alone is not a request lock. Read-only controls remain selectable and included in
FormData, unlike disabled controls. Server-side validation and authorization remain
the application's responsibility. Authored stories are not execution evidence;
see the [verification record](../../docs/verification.md) for completed checks.

## Checkbox, Radio, and Switch

These controls retain RAC's native inputs, controlled/default values, event props,
and label-root composition. For Checkbox, Radio, and Switch, the root `ref`,
`className`, `style`, and `render` target the `HTMLLabelElement`; `inputRef` targets
its contained `HTMLInputElement`. Group roots remain `HTMLDivElement` targets.
Root class callbacks retain the Cinder class, and style/children callbacks receive
the current RAC state. A custom `render` must preserve the supplied DOM props and
children, including the native input and label relationship.

| Control                | Value and interaction contract                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Checkbox`             | Independent choice; `isSelected` / `defaultSelected` / `onChange`; Space or the visible label toggles it                                                           |
| `CheckboxGroup`        | `value` / `defaultValue` / `onChange` arrays; one repeated native entry per selected, enabled member with the group's `name`                                       |
| `RadioGroup` + `Radio` | One group `value` / `defaultValue` / `onChange`; native `name` and radio `value`; arrows move and select within the group, skipping disabled members               |
| `Switch`               | Immediate setting; `isSelected` / `defaultSelected` / `onChange`; Space or the visible label toggles it; Enter may submit a containing form, not toggle the switch |

Read repeated CheckboxGroup entries with `new FormData(form).getAll("channels")`,
not `Object.fromEntries`, which keeps only the last entry for a repeated name.
Unchecked and disabled choices are omitted. Checked read-only choices remain
focusable, immutable, and included in submission. A selected Switch submits its
`name` and `value` through a native checkbox input with the accessible `switch`
role; it does not create a separate settings or persistence engine.

`Checkbox isIndeterminate` sets the mixed mark and native `indeterminate` property;
it does not select members or add a third form value. Derive a select-all checkbox's
`isSelected` and `isIndeterminate` from its selected members and update those
members in application code. A read-only mixed snapshot is not a select-all action.

Checkbox supports required/invalid state. CheckboxGroup and RadioGroup own group
validation, guidance, and recovery through their existing convenience and compound
parts. Actual validation suppresses appearance-only `status`. Frame group errors
retain neutral resting marks and blue selected/mixed marks, with detached group
recovery. A standalone invalid Checkbox keeps its red border, including during
hover; disabled paint wins. Radio required/invalid state belongs to RadioGroup.
Switch does **not** expose required, invalid, validation, or mixed-state APIs.

Frame's ordinary choice labels have a **44px minimum height** and can grow with
wrapping text. Checkbox marks are **18px with 5px corners**; compact table selection
retains its existing **16px mark and 18px target**. Radio marks stay **18px**.
Switch supports `size="sm"` and `size="md"` (default): **32×16px** and **48×24px**
tracks with **10px** and **18px** thumbs, a **3px inset**, and logical LTR/RTL travel.
Other-theme normal-state geometry remains unchanged. Across themes, long labels
wrap without shrinking marks, read-only labels use a default cursor, and forced
colors retain recognizable selected/disabled marks.

Use a Checkbox for a preference applied only by Save. The
[Checkbox](../../apps/storybook/stories/Checkbox.stories.tsx),
[Radio](../../apps/storybook/stories/Radio.stories.tsx), and
[Switch](../../apps/storybook/stories/Switch.stories.tsx) stories demonstrate state,
native values, recovery, custom rendering/refs, and Persian/Arabic/German labels.
Switch stories change only local preview state; applications own real requests
and failure feedback. See [verification](../../docs/verification.md) for the bounded
executed scope and remaining manual checks.

## Theme, locale, and portals

`Theme` is the coherent appearance and locale boundary; `useTheme()` exposes its
effective theme, layer, direction, language, and appearance class.

- An omitted `theme` selects `white`, including in nested Themes. Every Theme
  resets the layer to 0. `Layer` advances to 1, then 2, then saturates at 2.
- `locale` controls formatting, RAC translations, reading direction, and keyboard
  direction. Omitted locale uses the effective surrounding RAC locale.
- HTML language is `lang ?? effectiveRACLocale`. An explicit `lang=""` is preserved.
  A nested Theme without `lang` computes its language from its own effective locale
  again; it does not inherit an outer Theme's explicit language override.
- `appearanceClassName?: string` is the portable recipe. Omission inherits the
  parent's effective recipe, a string replaces it, and `""` clears it. Clearing
  the class does not cancel ordinary CSS inheritance.

The effective appearance class is applied to the Theme root and four detached
roots: Popover, ModalOverlay, Tooltip, and ToastRegion. Those roots also receive
theme/layer attributes, direction, and language, including updates while open.
Ordinary Theme `className`, `style`, `id`, event handlers, and arbitrary props are
not copied to portals.
Declare the variables and fonts a recipe needs on the recipe's matched roots;
variables inherited only from a page ancestor cannot reach detached content.

A raw nested `I18nProvider` changes RAC locale but does not update Cinder's portal
boundary. Native `lang`/`dir` attributes on Layer are DOM-local. Introduce a nested
`Theme` when a locale or language change must stay coherent through portals.
An explicit `lang` on Popover, Modal, or Tooltip overrides the bridged HTML
language, including `lang=""`; it does not change formatting or direction.

ToastRegion uses the recipe at its `ToastProvider`, not the Theme of a descendant
calling `useToast()`. Theme changes around that provider update its region while
preserving the provider's queue.

### A portable appearance recipe

This recipe supplies its own variables at every matching root. The scoped part
selectors stop at nested Theme boundaries and start again on matching portal roots.

```css
/* workspace.css */
.workspace-appearance {
  --hashti-focus: #0b57b5;
  --workspace-label-weight: 600;
}

@scope (.workspace-appearance) to ([data-hashti-theme]) {
  .hashti-field__label {
    font-weight: var(--workspace-label-weight);
  }

  .hashti-select__listbox {
    padding: 0.5rem;
  }
}
```

```tsx
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  ListBoxItem,
  Modal,
  Select,
  TextField,
  Theme,
} from "@hashti/react";
import "@hashti/react/styles.css";
import "./workspace.css";

export function WorkspaceSharing() {
  return (
    <Theme theme="frame-light" locale="en-US" appearanceClassName="workspace-appearance">
      <TextField label="Workspace name" defaultValue="Cinder studio" />
      <DialogTrigger>
        <Button variant="secondary">Edit sharing</Button>
        <Modal isDismissable>
          <Dialog>
            <Heading slot="title">Workspace sharing</Heading>
            <TextField label="Invite by email" type="email" />
            <Select label="Access" defaultValue="viewer">
              <ListBoxItem id="viewer">Viewer</ListBoxItem>
              <ListBoxItem id="editor">Editor</ListBoxItem>
            </Select>
            <Button slot="close">Done</Button>
          </Dialog>
        </Modal>
      </DialogTrigger>
    </Theme>
  );
}
```

The label rule reaches both fields, and the listbox rule reaches the Select's
second portal. A selector depending on a page-only ancestor would not do that.

### Overlay targets

Popover and Tooltip keep `className`, `style`, and `ref` on the same portalled
surface (`hashti-popover` / `hashti-tooltip`). Their custom classes merge with the
base and effective appearance classes.

Modal has two elements, with additive access to each:

| Modal prop                                              | Target                                |
| ------------------------------------------------------- | ------------------------------------- |
| `className`, `ref`                                      | Inner `hashti-modal` surface          |
| `modalStyle`                                            | Inner `hashti-modal` surface          |
| `overlayClassName`, `overlayRef`                        | Outer `hashti-modal-overlay` backdrop |
| `style`, `render`, native props such as `id` and `lang` | Outer `hashti-modal-overlay` backdrop |

The inherited appearance class and theme/layer/language attributes are on the
outer overlay; the inner surface inherits through it. `className` and
`overlayClassName` accept strings or RAC render functions and retain their base
classes. `style` and `modalStyle` accept inline styles or RAC style render functions.

## CSS integration

The distributed stylesheet uses one top-level `cinder` cascade layer, ordered
internally as `cinder.tokens`, `cinder.reset`, `cinder.components`, `cinder.themes`,
and `cinder.accessibility`. Normal unlayered application CSS wins over Cinder's
normal layered declarations. Native nesting, cascade layers, and `@scope` require
a modern browser. Current browser verification is Chromium-only; see the
[verification record](../../docs/verification.md) for the tested scope.

Use ordinary CSS or CSS Modules with your application's bundler. To adapt the
recipe above to a CSS Module, rename `.workspace-appearance` to `.appearance`
and keep the Cinder part selectors global: `:global(.hashti-field__label)` and
`:global(.hashti-select__listbox)`. Import the module as `styles`, then pass
`appearanceClassName={styles.appearance}`. The variables stay on the recipe class
itself so each portal can resolve them.

Carbon and Relay boundaries keep their typography defaults. Baseline styles for
raw RAC parts are scoped within `[data-hashti-theme]`. A raw RAC component imported
directly inside Theme is indistinguishable from the same component re-exported by
Cinder and receives those styles. The boundary isolates neighboring raw RAC
controls outside it, not raw components intentionally placed inside it.

### Tailwind

The isolated Phase 1 fixture pins both **Tailwind CSS** and **`@tailwindcss/cli`**
to **4.3.5**, with real preflight and generated utilities. Establish this order
before the imports in the application's CSS entry:

```css
@layer theme, base, cinder, components, utilities;
@import "tailwindcss";
@import "@hashti/react/styles.css";
```

Cinder already declares its own layer, so import it without a second `layer(cinder)`
wrapper. This order places preflight before Cinder and application components and
utilities after it. With this CSS entry, the Cinder stylesheet is already imported
once. Tailwind is optional application build tooling, not a Cinder runtime
dependency. The [Phase 1 verification](../../docs/verification.md#frame-phase-1)
records the passing installed-consumer proof for this pinned version.

### Installed-package fixture commands

From Cinder's root:

```sh
bun run build
bun scripts/pack.ts
bun run test:package
```

The [consumer fixtures](../../tests/fixtures/consumer/README.md) install both
tarballs into two isolated apps with no workspace aliases. Both use `strict: true`
and `skipLibCheck: false`. The native app builds `index.html` for Carbon/Relay,
`frame.html` for plain CSS and a real Bun CSS Module, and a generated
`composition.html` entry for the compound API fixture. The second app compiles
`tailwind.css` through the pinned CLI and builds `tailwind.html`, importing the
generated CSS once. The verifier builds both apps and drives their Frame pages in
Chromium; fixture source or build coverage alone is not new execution evidence.

## Visual and behavioral boundary

Cinder's original themes follow Carbon v11; Relay is an authored extension using
the same initial independent API. RAC Switch uses Space (Enter can submit a containing form). ContentSwitcher
uses radio-group semantics; use Tabs for tab-to-panel relationships. Table, GridList,
and TagGroup are interactive grids; Tree is a treegrid. Date inputs are segmented,
and dialog Popover uses RAC's modal focus model. NativeSelect remains available for
native select behavior. Toast relies on RAC's `UNSTABLE_*` APIs and is experimental.

Carbon variants such as AI label, toggletip, advanced shell panels, selectable tiles,
and advanced table features are not implied by a similarly shaped primitive. See
the workspace's `docs/coverage.md` for the exact supported scope and verification.

## Fonts and TypeScript

Frame uses a system sans-serif stack and needs no web-font installation. Carbon
and Relay retain IBM Plex Sans with CSS fallbacks. To match their example typography:

```sh
bun add @fontsource/ibm-plex-sans@5.3.0
```

```tsx
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
```

IBM Plex Mono is separate and optional for code, date segments, and other
`font-mono` roles in any theme; otherwise those roles use the monospace fallback:

```sh
bun add @fontsource/ibm-plex-mono@5.3.0
```

```tsx
import "@fontsource/ibm-plex-mono/latin-400.css";
```

If the app's bundler does not provide CSS import declarations, add
`declare module "*.css";` to an included `env.d.ts`. Apps that import date constructors
directly should declare `@internationalized/date@3.12.4` as a dependency too.

## License

Apache-2.0. See `LICENSE` and `NOTICE` shipped with this package. Carbon is an IBM
project; RAC is an Adobe project. Fonts retain their separate SIL Open Font License.
