# Task: Re-architect React Library & Modular Styling System for Hashti Design System

## Goal

Restructure `packages/react/src/` into a modular, per-component architecture (relicating HeroUI v3's architecture), replace the monolithic 4,890-line `styles.css` with modular per-component CSS, purge ALL Carbon designs and references (no square 0px borders, no `--cds-*` classes, no industrial gray look), and rebrand `@cinder/*` to `@hashti/*`.

---

## 1. Package Rebranding (@cinder -> @hashti)

- Update `packages/tokens/package.json`: `"name": "@hashti/tokens"`
- Update `packages/react/package.json`: `"name": "@hashti/react"` with dependency `"@hashti/tokens": "workspace:*"`
- Update root `package.json`, `tsconfig.json`, `tsconfig.build.json` in packages
- Update all imports from `@cinder/tokens` to `@hashti/tokens` and `@cinder/react` to `@hashti/react` across all packages, tests, docs, and apps.
- Update CSS variable prefix `--cds-*` and `--hashti-*` to `--hashti-*`.

---

## 2. Component Folder Structure (HeroUI v3 style)

Reorganize `packages/react/src/` so that EVERY component has its own dedicated directory under `packages/react/src/components/<component-name>/`:

Inside each folder:

1. `<component-name>.tsx` - Component logic using RAC 1.22.1 and HeroUI compound composition.
2. `<component-name>.css` - Modular CSS styles tailored for this component.
3. `<component-name>.stories.tsx` - Storybook stories with play interaction tests.
4. `<component-name>.test.tsx` - Colocated unit tests.
5. `index.ts` - Barrel export exporting all subcomponents, props, and types.

Components list to migrate:

- `button` (Button, ButtonGroup)
- `select` (Select, SelectTrigger, SelectValue, SelectPopover)
- `combobox` (ComboBox, ComboBoxInput, ComboBoxPopover)
- `color` (ColorPicker, ColorArea, ColorSlider, ColorWheel, ColorField, ColorSwatch, ColorSwatchPicker)
- `command-palette` (CommandPalette, CommandMenu)
- `token-field` (TokenField, TokenInput, TokenList)
- `sheet` (Sheet with snap points)
- `preview-trigger` (PreviewTrigger hovercards)
- `tree` (Tree, NavigationTree)
- `grid-list` (GridList)
- `list-box` (ListBox)
- `autocomplete` (Autocomplete)
- `modal` (Modal)
- `dialog` (Dialog)
- `popover` (Popover)
- `drawer` (Drawer)
- `checkbox` (Checkbox, CheckboxGroup)
- `radio` (Radio, RadioGroup)
- `switch` (Switch)
- `tabs` (Tabs, TabList, Tab, TabPanel)
- `accordion` (Accordion, AccordionItem)
- `disclosure` (Disclosure, DisclosureGroup)
- `toolbar` (Toolbar)
- `meter` (Meter)
- `dropzone` (DropZone, FileTrigger)
- `tag` (Tag, TagGroup)
- `badge` (Badge)
- `card` (Card)
- `text-field` (TextField)
- `number-field` (NumberField)
- `search-field` (SearchField)
- `time-field` (TimeField)
- `date-picker` (DatePicker)
- `pagination` (Pagination)
- `progress` (ProgressBar, ProgressCircle)
- `tooltip` (Tooltip)
- `toast` (Toast)
- `kbd` (Kbd)
- `empty-state` (EmptyState)
- `avatar` (Avatar)
- `table` (Table, TableHeader, TableRow, TableCell)
- `theme` (Theme, Layer)

In `packages/react/src/index.ts`:
Re-export all components cleanly from their component folders:
`export * from "./components/button";`
`export * from "./components/select";`
...

---

## 3. Modular Styling System (Hashti Modern Aesthetic — ZERO Carbon)

The user explicitly demands: "WTF?! components design in docs project are carbon! ... at the end, in this project, we don't want to have any carbon designs in this project".

- **Purge Carbon Visual Language**:
  - NO 0px sharp rectangular industrial boxes.
  - NO `--cds-*` class names or variables.
  - NO rigid, flat, drab gray industrial layouts.
- **Hashti Architectural Portal Aesthetics (HeroUI v3 + RAC Modern Design)**:
  - **Arched Geometries**: Elegant rounded curves (`border-radius: 12px` / `0.75rem` for inputs/buttons, `16px` / `1rem` for cards/dialogs, `9999px` for pills/chips/badges), evoking Iranian vaulted arches (_Tagh_ & _Hashti_).
  - **Tactile Micro-Interactions**: Smooth spring transitions (`transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1)`), subtle active press scale (`active:scale-[0.98]`), glowing focus rings (`ring-2 ring-focus ring-offset-2`).
  - **Frosted Glass & Depth**: Subtle backdrops (`backdrop-filter: blur(16px)`), modern layered elevation shadows (`box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3)` for popovers/menus/modals).
  - **Pure Monochrome + Glaze Accents**: Pure `#000000` ink, pure `#FFFFFF` canvas, and Iranian turquoise (`#00B4D8`), amber (`#F59E0B`), and terracotta (`#E76F51`) accents.
- **Root Stylesheet**:
  In `packages/react/src/styles.css`:
  Import all component CSS files:
  ```css
  @import "./components/button/button.css";
  @import "./components/select/select.css";
  ...
  ```
  Bun's CSS bundler compiles this into a single, optimized `dist/styles.css` during `bun run build:packages`.

---

## 4. Verification Gates

1. `bun run build:tokens`
2. `bun run build:packages`
3. `bun test tests/unit` (All tests must pass)
4. `bun run typecheck` (0 type errors)
5. Commit all changes with descriptive commit messages (`feat(react): re-architect components into modular folders with Hashti modern design`).
