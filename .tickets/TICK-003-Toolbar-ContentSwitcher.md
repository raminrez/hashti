# TICK-003: Toolbar & ContentSwitcher

**Phase:** 2 — Fundamental Interactive Actions
**Priority:** Medium
**Blocked by:** TICK-013 (contract proven).
**Effort:** Medium
**Depends on:** TICK-002 (Button)

## Goal
Migrate `Toolbar` and `ContentSwitcher` to use `@ui-sdk/react` primitives for roving tabindex
focus management and item selection. Remove all `react-aria-components` dependencies.

## Files to Touch
- `packages/react/src/components/toolbar/toolbar.tsx` (and sub-files)
- `packages/react/src/components/button/content-switcher.tsx` (if exists, else look for content-switcher dir)

## ui-sdk Primitives to Use
Check `node_modules/.bun/@ui-sdk+react@0.1.0-beta.6+98c4ab0ca8cf4886/node_modules/@ui-sdk/react/docs/`
for available Toolbar/RovingFocus primitives. Key docs: `lists-and-menus.md`, `introduction.md`.

## Acceptance Criteria
- [ ] `Toolbar` uses roving tabindex from `@ui-sdk/react` (or plain `role="toolbar"` + keyboard handlers if ui-sdk has no toolbar primitive)
- [ ] `ContentSwitcher` manages selected state without RAC
- [ ] `.hashti-toolbar`, `.hashti-content-switcher` root classes
- [ ] `data-orientation` on Toolbar
- [ ] `data-selected` on active ContentSwitcher item
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

## DOM Contract
```tsx
<div class="hashti-toolbar" role="toolbar" data-orientation="horizontal">
  <button class="hashti-button hashti-toolbar__item" ...>Bold</button>
</div>

<div class="hashti-content-switcher" role="tablist">
  <button class="hashti-content-switcher__item" role="tab" data-selected="true">Tab A</button>
  <button class="hashti-content-switcher__item" role="tab">Tab B</button>
</div>
```
