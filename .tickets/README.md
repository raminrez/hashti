# Migration Blueprint: React Aria Components to @ui-sdk

This roadmap tracks the full rewrite of Hashti components onto `@ui-sdk/core` and
`@ui-sdk/react`. Strategy and rationale: [ADR-0002](../docs/adr/0002-full-rewrite-from-rac-to-ui-sdk.md)
(supersedes ADR-0001). Component-by-component dispositions:
[docs/component-inventory.md](../docs/component-inventory.md) (approved 18 Nov 2026).

## Architecture Principles
1. **Thin layer**: `@hashti/react` wraps a ui-sdk component only where Hashti adds API
   (variants, sizes, compound anatomy); otherwise it re-exports. No RAC props, names, or
   patterns survive (`onClick`, `disabled`, `checked` — never `onPress`/`isDisabled`/`isSelected`).
2. **DOM & Styling Contract**:
   - Class hook: `.hashti-<component>`
   - State attributes: ui-sdk's vocabulary (`data-open`, `data-checked`, `data-highlighted`,
     `data-starting-style`…), mapped from RAC's in TICK-000b. `data-variant` / `data-size` /
     `data-disabled` are Hashti's own.
   - All styles live in `@hashti/styles` and must stay framework-agnostic: the same stylesheet
     serves React, Vue, Svelte, Solid, and web component bindings.
3. **Accessibility & RTL**:
   - WCAG 2.1 AA keyboard & screen reader interactions (inherited from ui-sdk).
   - Native CSS logical properties for bidirectional LTR & Persian/Arabic RTL.
4. **Agent-Operability**:
   - Components on ui-sdk primitives are discovered by ui-sdk's native agent system
     (`@ui-sdk/react/agent`). `@hashti/agent` is deleted.

## Ticket Sequence

Work the frontier: any ticket whose blockers are all done. Initial frontier:
**TICK-000b** (blocks everything), **TICK-014** (independent). TICK-015 joins on
2026-11-20 and must land before TICK-002. Blocking edges are declared at the top of
each ticket file.

### Phase 0: Foundation (blocks everything)
- [x] **TICK-000**: [TICK-000-Component-Inventory.md](TICK-000-Component-Inventory.md) — Component
  inventory: canonical names, wrap / re-export / css-only / remove / add. **Done:**
  [docs/component-inventory.md](../docs/component-inventory.md).
- [x] **TICK-000b**: [TICK-000b-Attribute-Map.md](TICK-000b-Attribute-Map.md) — RAC→ui-sdk
  attribute map + stylesheet sweep; token pipeline moves from `packages/tokens` into
  `packages/styles` (pruned to used tokens); `packages/tokens` deleted.
- [ ] **TICK-015**: [TICK-015-Upgrade-UISDK-Beta7.md](TICK-015-Upgrade-UISDK-Beta7.md) — Upgrade
  `@ui-sdk/*` to 0.1.0-beta.7. **Blocked until 2026-11-20** (release-age policy).

### Phase 1: Pure Content & Display Components (Lowest Risk)
- [x] **TICK-001**: [TICK-001-Kbd-Badge-Separator.md](TICK-001-Kbd-Badge-Separator.md) —
  `Kbd`, `Badge`, `Separator` (was Divider, re-export of `@ui-sdk/react/separator`).

### Phase 2: Fundamental Interactive Actions
- [ ] **TICK-002**: [TICK-002-Button-Link.md](TICK-002-Button-Link.md) — `Button`, `Link`
  (Button with `render={<a>}`), `Toggle`; css-only `Breadcrumbs` composing Link.
- [ ] **TICK-013**: [TICK-013-Contract-Spike.md](TICK-013-Contract-Spike.md) — Contract-validation
  spike: styled Button from a second framework against unmodified `@hashti/styles`.
  **Blocks Phase 3+ if the contract cracks.**
- [ ] **TICK-003**: [TICK-003-Toolbar-ContentSwitcher.md](TICK-003-Toolbar-ContentSwitcher.md) —
  `Toolbar`; ContentSwitcher → `SegmentedControl`.

### Phase 3: Form Controls & Inputs
- [ ] **TICK-004**: [TICK-004-Checkbox-Radio-Switch.md](TICK-004-Checkbox-Radio-Switch.md) —
  `Checkbox`, `Radio`, `Switch`.
- [ ] **TICK-005**: [TICK-005-TextField-TextArea-NumberField.md](TICK-005-TextField-TextArea-NumberField.md) —
  `Field` anatomy; `Input` / `Textarea` (was TextField), `NumberInput`, `OtpInput`, `SearchField`,
  `FileInput` (was Dropzone), `TimeInput`; plus field-adjacent wraps `Meter`, `Pagination`,
  `Progress`, `Slider`.
- [ ] **TICK-006**: [TICK-006-Select-ListBox.md](TICK-006-Select-ListBox.md) — `Select`, `Listbox`,
  `ComboBox`, `Autocomplete` (re-export), `TokenInput`, `Command` (was CommandPalette).

### Phase 4: Overlays & Floating Panels
- [ ] **TICK-007**: [TICK-007-Modal-Dialog-Popover.md](TICK-007-Modal-Dialog-Popover.md) —
  `Dialog` (absorbs Modal, incl. AlertDialog-style confirm), `Drawer` (absorbs Sheet,
  keeps `draggable={false}` desktop mode), `Popover`.
- [ ] **TICK-008**: [TICK-008-Tooltip-Toast.md](TICK-008-Tooltip-Toast.md) — `Tooltip`, `Toast`.

### Phase 5: Collections & Adoptions
- [ ] **TICK-009**: [TICK-009-Tabs-Disclosure.md](TICK-009-Tabs-Disclosure.md) — `Tabs`;
  Disclosure → `Accordion`.
- [ ] **TICK-010**: [TICK-010-Tree-GridList-Table.md](TICK-010-Tree-GridList-Table.md) — `Tree`
  (absorbs NavigationTree, keeps Section/Header parts); css-only semantic `Table`;
  GridList dropped.
- [x] **TICK-012**: [TICK-012-Presentational-Theme.md](TICK-012-Presentational-Theme.md) —
  css-only batch (`Card`, `CodeSnippet`, `EmptyState`, `Layout`, `Tag`, inline notifications)
  + `Theme` provider (RAC `I18nProvider` deleted).
- [ ] **TICK-016**: [TICK-016-Adopt-New-Components.md](TICK-016-Adopt-New-Components.md) — Adopt
  `Calendar`, `DateInput`, `PasswordInput`, `HoverCard` (replaces PreviewTrigger), `Collapsible`,
  `Menu`; resolve ColorPicker coverage + OverflowMenu rebuild target.

### Phase 6: Cleanup
- [x] **TICK-014**: [TICK-014-Purge-Cinder-Carbon.md](TICK-014-Purge-Cinder-Carbon.md) — Purge
  Cinder/Carbon lineage repo-wide (may run any time).
- [ ] Final: remove `react-aria-components` and `@internationalized/date` from the catalog,
  delete `packages/agent`, delete remaining RAC-only code, `bun run check` green.
