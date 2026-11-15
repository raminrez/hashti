# Task: Implement Live Interactive Hashti Component Previews in Documentation

## Problem Statement

Currently, documentation pages in `apps/docs/content/docs/components/` only show static markdown code fences (` ```tsx ... ``` `). Users browsing the docs do not see, touch, or interact with any actual rendered Hashti components!

## Objective

Embed live, interactive Hashti components directly into documentation pages so visitors can test buttons, select options from dropdowns, drag color sliders, open modals/sheets, trigger ⌘K command palettes, and manipulate token fields in real time.

## Architecture & Implementation Steps

### 1. Create `<ComponentPreview>` container (`apps/docs/src/components/preview.tsx`)

Build an elegant, theme-aware preview container matching Hashti's portal architecture:

- Crisp border (`border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden`)
- Preview stage with centered alignment, flexible padding (`p-6 md:p-8 flex items-center justify-center min-h-[160px] bg-neutral-50/60 dark:bg-neutral-900/40 relative`)
- Subtle dot pattern or architectural grid background
- Live component mounting inside standard Hashti `<Theme>` or inheriting `data-hashti-theme`

### 2. Build Interactive Demo Components (`apps/docs/src/components/demos/`)

Create self-contained client components showcasing actual `@hashti/react` components:

- `button-demo.tsx`: `<Button>` variants (primary, secondary, tertiary, ghost, danger) with click ripple, icon slots, loading state toggle.
- `select-demo.tsx`: `<Select>` with single select and multi-select (`multipleDisplay="chips" | "badge" | "text"`) and remove buttons.
- `combobox-demo.tsx`: `<ComboBox>` with dynamic item creation (`allowCreateItem`, `onCreateItem`).
- `color-picker-demo.tsx`: `<ColorPicker>` composite with 2D area, hue slider, alpha slider, hex field, and live swatch.
- `selection-demo.tsx`: `<Checkbox>`, `<RadioGroup>`, `<Switch>` with interactive state toggling.
- `sheet-demo.tsx`: `<Sheet>` swipeable modal triggered by a button with snap points `['25%', '50%', '90%']`.
- `modal-demo.tsx`: `<Modal>` / `<Dialog>` with backdrop blur, title, content, and cancel/confirm buttons.
- `command-palette-demo.tsx`: `<CommandPalette>` quick launcher with ⌘K shortcut listener and action execution.
- `token-field-demo.tsx`: `<TokenField>` editable prompt input with removable chip tokens.
- `tree-demo.tsx`: `<Tree>` and `<NavigationTree>` with expandable branches and selection.
- `feedback-demo.tsx`: `<Badge>`, `<Tag>` (selectable and dismissible), `<Meter>` (with interactive range slider to test low/optimum/high thresholds), `<ProgressBar>`.
- `tabs-demo.tsx`: `<Tabs>` with animated indicator and panel switching.
- `disclosure-demo.tsx`: `<Disclosure>` and `<Accordion>` with chevron rotation.
- `dropzone-demo.tsx`: `<DropZone>` with drag-over visual feedback and `<FileTrigger>`.

### 3. Register in `apps/docs/src/components/mdx.tsx`

Export all demo components and `ComponentPreview` in `getMDXComponents()` so they can be written directly inside any MDX file as JSX tags without manual imports.

### 4. Update Component MDX Pages (`apps/docs/content/docs/components/*.mdx`)

Add `<ComponentPreview>` at the top of each component page right under the introductory paragraph:

- `button.mdx` -> `<ComponentPreview><ButtonLiveDemo /></ComponentPreview>`
- `select.mdx` -> `<ComponentPreview><SelectLiveDemo /></ComponentPreview>`
- `combobox.mdx` -> `<ComponentPreview><ComboBoxLiveDemo /></ComponentPreview>`
- `color-picker.mdx` -> `<ComponentPreview><ColorPickerLiveDemo /></ComponentPreview>`
- `command-palette.mdx` -> `<ComponentPreview><CommandPaletteLiveDemo /></ComponentPreview>`
- `token-field.mdx` -> `<ComponentPreview><TokenFieldLiveDemo /></ComponentPreview>`
- `sheet.mdx` -> `<ComponentPreview><SheetLiveDemo /></ComponentPreview>`
- `modal.mdx` -> `<ComponentPreview><ModalLiveDemo /></ComponentPreview>`
- `checkbox.mdx`, `switch.mdx`, `radio.mdx` -> `<ComponentPreview><SelectionLiveDemo /></ComponentPreview>`
- `tree.mdx`, `navigation-tree.mdx` -> `<ComponentPreview><TreeLiveDemo /></ComponentPreview>`
- `tabs.mdx` -> `<ComponentPreview><TabsLiveDemo /></ComponentPreview>`
- `badge.mdx`, `tag.mdx`, `meter.mdx` -> `<ComponentPreview><FeedbackLiveDemo /></ComponentPreview>`
- `disclosure.mdx`, `accordion.mdx` -> `<ComponentPreview><DisclosureLiveDemo /></ComponentPreview>`
- `dropzone.mdx` -> `<ComponentPreview><DropZoneLiveDemo /></ComponentPreview>`

### 5. Verification

- Run `bun run build:docs` to ensure all static pages generate without hydration or compilation errors.
- Run Playwright to capture screenshots of `http://localhost:4321/docs/components/button`, `select`, `color-picker`, `command-palette`, `token-field`, `sheet`.
- Verify the actual Hashti components render visibly with their real styles, colors, and interactive states.
