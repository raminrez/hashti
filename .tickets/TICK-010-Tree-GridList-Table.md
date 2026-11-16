# TICK-010: Tree, GridList, Table

**Phase:** 5 — Complex Collections & Data
**Priority:** Low
**Effort:** High
**Depends on:** TICK-009

## Goal
Migrate the most complex collection components (`Tree`, `GridList`, `Table`) to `@ui-sdk/react`.
These require virtualization-ready selection, keyboard navigation, and complex ARIA roles.

## Files to Touch
- `packages/react/src/components/navigation-tree/` (or `tree/`)
- `packages/react/src/components/grid-list/`
- `packages/react/src/components/table/`

## ui-sdk Primitives
See: `docs/lists-and-menus.md`

## Acceptance Criteria
- [ ] Tree: `role="tree"`, `role="treeitem"`, expand/collapse, nested items
- [ ] GridList: `role="grid"` or `role="listbox"` with roving focus selection
- [ ] Table: `role="grid"`, sortable columns, row selection
- [ ] `data-selected`, `data-expanded`, `data-focused`, `data-disabled` on items
- [ ] `.hashti-tree`, `.hashti-grid-list`, `.hashti-table` root classes
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds
