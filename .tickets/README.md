# Migration Blueprint: React Aria Components to @ui-sdk (0.1.0-beta.6)

This roadmap tracks the migration of Hashti components to `@ui-sdk/core` and `@ui-sdk/react`.

## Architecture Principles
1. **Headless State & Primitives**: Use `@ui-sdk/core` (`definePrimitive`) and `@ui-sdk/react`.
2. **DOM & Styling Contract**: 
   - Class hook: `.hashti-<component>`
   - State attributes: `data-state`, `data-variant`, `data-size`, `data-disabled`, `data-invalid`, `data-hovered`, `data-pressed`, `data-focus-visible`
   - Styles imported from `@hashti/styles`
3. **Accessibility & RTL**:
   - WCAG 2.1 AA compliant keyboard & screen reader interactions.
   - Native CSS logical properties (`margin-inline`, `padding-inline`) for bidirectional LTR & Persian/Arabic RTL.
4. **Agent-Operability**:
   - Primitives automatically expose state and actions to `ui-sdk`'s native agent system (`@ui-sdk/react/agent`).

## Ticket Sequence

### Phase 1: Pure Content & Display Components (Lowest Risk)
- [x] **TICK-001**: [TICK-001-Kbd-Badge-Divider.md](TICK-001-Kbd-Badge-Divider.md) — Standardize standalone display components (`Kbd`, `Badge`, `Divider`) to `@hashti/styles` and `ui-sdk` contracts.

### Phase 2: Fundamental Interactive Actions
- [ ] **TICK-002**: [TICK-002-Button-Link.md](TICK-002-Button-Link.md) — Migrate `Button`, `Link`, and `ToggleButton` to `@ui-sdk/react/button`.
- [ ] **TICK-003**: [TICK-003-Toolbar-ContentSwitcher.md](TICK-003-Toolbar-ContentSwitcher.md) — Migrate `Toolbar` and `ContentSwitcher` using `ui-sdk` roving focus and selection behaviors.

### Phase 3: Form Controls & Inputs
- [ ] **TICK-004**: [TICK-004-Checkbox-Radio-Switch.md](TICK-004-Checkbox-Radio-Switch.md) — Migrate selection controls (`Checkbox`, `RadioGroup`, `Switch`).
- [ ] **TICK-005**: [TICK-005-TextField-TextArea-NumberField.md](TICK-005-TextField-TextArea-NumberField.md) — Migrate text input primitives and field anatomy.
- [ ] **TICK-006**: [TICK-006-Select-ListBox.md](TICK-006-Select-ListBox.md) — Migrate `Select`, `ListBox`, and dropdown popups.

### Phase 4: Overlays & Floating Panels
- [ ] **TICK-007**: [TICK-007-Modal-Dialog-Popover.md](TICK-007-Modal-Dialog-Popover.md) — Migrate `Modal`, `Dialog`, `Popover`, `Drawer`, and `Sheet`.
- [ ] **TICK-008**: [TICK-008-Tooltip-Toast.md](TICK-008-Tooltip-Toast.md) — Migrate feedback notifications and `Tooltip`.

### Phase 5: Complex Collections & Data
- [ ] **TICK-009**: [TICK-009-Tabs-Disclosure.md](TICK-009-Tabs-Disclosure.md) — Migrate `Tabs` and `Disclosure` / Accordion.
- [ ] **TICK-010**: [TICK-010-Tree-GridList-Table.md](TICK-010-Tree-GridList-Table.md) — Migrate advanced collection components (`Tree`, `GridList`, `Table`).
