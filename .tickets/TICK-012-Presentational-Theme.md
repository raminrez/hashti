# TICK-012: Presentational Batch + Theme Provider

**Phase:** 1.5 — After TICK-001, parallel-safe with component tickets
**Priority:** Medium
**Effort:** Medium

## Goal
Migrate the css-only components (per `docs/component-inventory.md`): `Card`, `CodeSnippet`,
`EmptyState`, `Layout` (Stack/Grid/Header/SideNav/…), `Tag` (static variant), and the
inline/actionable notifications split out of `toast/`. Plus the `Theme` provider: delete the
RAC `I18nProvider`, replace with a Hashti context that sets `dir`/`lang` on the DOM root —
the last RAC dependency in the providers layer.

## Acceptance Criteria
- [ ] Each component renders with its `.hashti-*` hook, no ui-sdk primitive needed
- [ ] `theme/` contains zero `react-aria-components` imports (grep-clean)
- [ ] `Toast` split complete: Toast stays for TICK-008, confirm-dialog parts for TICK-007,
      InlineNotification/ActionableNotification land here as css-only
- [ ] Inline notifications styled per DESIGN.md status colors
- [ ] `bun run build:packages` + storybook green
