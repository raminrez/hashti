# Agent notes

House rules live in `DESIGN.md` (visual authority) and `PRODUCT.md` (references). This file
records what each agent re-learns the hard way about building Hashti components.

## ABSOLUTE RULE: Pure @ui-sdk Rewrite (NO RAC Compatibility)

Hashti is performing a **100% clean rewrite** onto `@ui-sdk/react` and `@ui-sdk/core`.
We have **ZERO external consumers**. Do NOT preserve React Aria Components (RAC) props,
patterns, naming conventions, or shims.

### Strictly FORBIDDEN Props & Patterns:
- ❌ NO `onPress` — use standard `onClick`
- ❌ NO `isDisabled` — use standard `disabled`
- ❌ NO `isSelected` — use standard `checked` / `selected` / `pressed`
- ❌ NO `defaultSelected` — use `defaultChecked` / `defaultValue`
- ❌ NO `isIndeterminate` — use `indeterminate` or `checked="indeterminate"`
- ❌ NO `isReadOnly` — use standard `readOnly`
- ❌ NO `isRequired` — use standard `required`
- ❌ NO `isInvalid` — use standard `invalid` or native form validation
- ❌ NO `isOpen` — use `open` / `onOpenChange`
- ❌ NO `slot` — ui-sdk does not use RAC slot injection
- ❌ NO `kind` — use `variant`
- ❌ NO `RAC*` imports or wrappers
- ❌ NO `composeRenderProps`
- ❌ NO complex backward-compatibility adapter layers or type unions

### REQUIRED Native @ui-sdk/react Patterns:
- **Buttons / Actions**:
  - Use `Button` from `@ui-sdk/react/button`
  - Props: `onClick`, `disabled`, `pendingAnnouncement`, `focusableWhenDisabled`, `render`, `ref`, `children`
  - Hashti additions: `variant` ("primary" | "secondary" | "danger" | "ghost" | "outline"), `size` ("sm" | "md" | "lg"), `iconOnly` (boolean)
- **Toggles**:
  - Use `Toggle` from `@ui-sdk/react/toggle`
  - Props: `pressed`, `defaultPressed`, `onPressedChange`, `disabled`
- **Checkboxes**:
  - Use `Checkbox`, `CheckboxIndicator` from `@ui-sdk/react/checkbox`
  - Props: `checked` (`boolean | "indeterminate"`), `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`
- **Radio & RadioGroup**:
  - Use `Radio`, `RadioGroup` from `@ui-sdk/react/radio`
  - Props: `value`, `defaultValue`, `onValueChange`, `disabled`, `name`
- **Switch**:
  - Use `Switch`, `SwitchThumb` from `@ui-sdk/react/switch`
  - Props: `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`
- **Field & Inputs**:
  - Use `Field`, `FieldLabel`, `FieldDescription`, `FieldError` from `@ui-sdk/react/field`
  - Use `Input` from `@ui-sdk/react/input`, `Textarea` from `@ui-sdk/react/textarea`
  - Props: `value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `readOnly`
- **Separators / Dividers**:
  - Use `Separator` from `@ui-sdk/react/separator` (or semantic `<hr>` / `<div>` with `role="separator"`)
  - Props: `orientation` ("horizontal" | "vertical")

## UI-SDK and Styling Ground Truth

Hashti styling lives exclusively in `@hashti/styles`.

### DOM Contract:
- Root class: `.hashti-<component>`
- Data attributes: `data-variant`, `data-size`, `data-state`, `data-disabled`, `data-pending`
- Logical CSS properties ONLY: `margin-inline-start`, `padding-inline`, `border-block-start`, etc.
- Native bidirectional LTR & Persian/Arabic RTL support

## Documentation Authority
Before writing any component:
1. Follow the `ui-sdk` skill if it's installed (it is, in `.agents/skills/ui-sdk`)
2. Read `node_modules/@ui-sdk/react/docs/llms.txt`
3. Read the specific component doc: `node_modules/@ui-sdk/react/docs/components/<component>.md`
4. Check exports: `node_modules/@ui-sdk/react/package.json`
5. When building a component ui-sdk doesn't ship, also search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `docs/rendering.md` next to it

## Stylesheet Entry
Import the default styles once at each app's entry: `import "@ui-sdk/core/web.css"`. If the app
uses Tailwind CSS, start its global stylesheet with these lines instead, in place of its own
`@import "tailwindcss"`, so Tailwind's base styles don't reset them:

```css
@layer ui-sdk;
@import "tailwindcss";
@import "@ui-sdk/core/web.css" layer(components);
```

`web.css` is a docs/storybook base layer only — it never ships inside `@hashti/styles`.
