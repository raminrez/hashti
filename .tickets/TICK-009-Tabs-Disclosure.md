# TICK-009: Tabs & Disclosure (Accordion)

**Phase:** 5 — Complex Collections & Data
**Priority:** Medium
**Blocked by:** TICK-013.
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
- [x] Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, keyboard left/right navigation
- [x] `data-selected` on active tab, `data-orientation`
- [x] Disclosure: `role="button"` trigger + collapsible region, `aria-expanded`
- [x] `.hashti-tabs`, `.hashti-tabs__list`, `.hashti-tab`, `.hashti-tab-panel`, `.hashti-accordion`, `.hashti-accordion-item`, `.hashti-accordion-header`, `.hashti-accordion-trigger`, `.hashti-accordion-indicator`, `.hashti-accordion-panel`
- [x] Animation: `--accordion-panel-height` transition + `data-starting-style`/`data-ending-style` on panel
- [x] No `react-aria-components` imports
- [x] 183 unit tests pass
- [x] `bun run build:packages` succeeds

**Status:** DONE

## DOM Contract (shipped)
```tsx
// Tabs
<div class="hashti-tabs" data-variant="line" data-size="md" data-orientation="horizontal">
  <div class="hashti-tabs__list" role="tablist">
    <button class="hashti-tab" role="tab" data-selected aria-selected="true" data-size="md">Tab A</button>
    <button class="hashti-tab" role="tab">Tab B</button>
  </div>
  <div class="hashti-tab-panel" role="tabpanel">Content A</div>
</div>

// Accordion (replaces Disclosure)
<div class="hashti-accordion" data-variant="default" data-size="md">
  <div class="hashti-accordion-item" data-variant="default" data-open>
    <h3 class="hashti-accordion-header">
      <button class="hashti-accordion-trigger" aria-expanded="true">
        Title
        <span class="hashti-accordion-indicator"><svg>…</svg></span>
      </button>
    </h3>
    <div class="hashti-accordion-panel">
      <div class="hashti-accordion-panel-inner">Body</div>
    </div>
  </div>
</div>
```

`data-open` / `data-closed` on item/header/trigger/panel; panel animates `--accordion-panel-height`.
`variant` lives on `Tabs` root and on `Accordion` root (plus mirrored onto `AccordionItem` for styling).
