# TICK-009: Tabs & Disclosure (Accordion)

**Phase:** 5 — Complex Collections & Data
**Priority:** Medium
**Effort:** Medium
**Depends on:** TICK-003

## Goal
Migrate `Tabs` and `Disclosure`/Accordion from `react-aria-components` to `@ui-sdk/react`.

## Files to Touch
- `packages/react/src/components/tabs/`
- `packages/react/src/components/disclosure/`

## ui-sdk Primitives
See: `docs/components/accordion.md`, `docs/lists-and-menus.md`

## Acceptance Criteria
- [ ] Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, keyboard left/right navigation
- [ ] `data-selected` on active tab, `data-orientation`
- [ ] Disclosure: `role="button"` trigger + collapsible region, `aria-expanded`
- [ ] `.hashti-tabs`, `.hashti-tab`, `.hashti-tab-panel`, `.hashti-disclosure`
- [ ] Animation: `data-state="open"/"closed"` for height transition
- [ ] No `react-aria-components` imports
- [ ] 183 unit tests pass
- [ ] `bun run build:packages` succeeds

## DOM Contract
```tsx
// Tabs
<div class="hashti-tabs" data-orientation="horizontal">
  <div class="hashti-tabs__list" role="tablist">
    <button class="hashti-tab" role="tab" data-selected="" aria-selected="true">Tab A</button>
    <button class="hashti-tab" role="tab">Tab B</button>
  </div>
  <div class="hashti-tab-panel" role="tabpanel">Content A</div>
</div>

// Disclosure
<div class="hashti-disclosure" data-state="open">
  <button class="hashti-disclosure__trigger" aria-expanded="true">Title</button>
  <div class="hashti-disclosure__content">Body</div>
</div>
```
