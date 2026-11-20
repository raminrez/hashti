---
sourcesHash: 73d447e2017d00b4e6a3f8c06222c770bb1761dead57689bf16050592f808435
id: tabs
description: >-
  Switches between related panels with one tab selected at a time, through a
  tablist with arrow-key navigation. The Hashti wrapper fixes the
  `hashti-tabs` classes on every part.
status: discoverable
sources:
  - packages/react/src/tabs/tabs.tsx
  - packages/react/src/tabs/index.ts
  - packages/styles/src/tabs.css
examples:
  - apps/docs/content/docs/tabs.mdx
---

# Tabs

## Purpose

Tabs switch between related views that share the same space — settings
sections, a preview and its source — with one tab selected at a time.
`@hashti/react` wraps ui-sdk's Tabs parts unchanged except for the
`hashti-tabs*` classes.

## When to use

- Several views of one object share the same space and the user switches
  between them, not compares them side by side.
- Each tab opens the panel with the same `value`.

## When not to use

- The content is one flow broken into steps: a step sequence needs its own
  pattern; tabs are peers, not steps.
- Navigation to different pages: use links; tabs select panels in place.
- Choosing one value for a form: use [Select](select.md) or ui-sdk's Radio.

## Public API

Exported from `@hashti/react` (`packages/react/src/tabs/index.ts`):

- `Tabs` — every ui-sdk Tabs prop forwards unchanged: `value` / `defaultValue`
  (`null` selects nothing; the default is the first enabled tab, which never
  calls `onValueChange`), `onValueChange(value, details)`, `orientation`
  (which arrow keys move between tabs), `activation` (`"automatic"` selects
  on arrow-key focus, `"manual"` waits for Enter or Space), `loop`,
  `hiddenUntilFound`, `controller` (from `createTabsController()`), `render`.
- `TabsList` — takes no options of its own; give it an accessible name.
- `TabsTab` — `value` (pairs it with the panel of the same value), `disabled`
  (keeps the tab focusable but stops selection, as the tabs pattern asks).
- `TabsIndicator` — takes no props; its CSS variables hold the selected tab's
  box (`--active-tab-left/top/width/height` on the list).
- `TabsPanel` — `value`, `keepMounted`, `hiddenUntilFound`.

## States

Per ui-sdk docs, the parts carry their `data-slot`s and:

- `data-selected` — on the selected tab and its panel.
- `data-orientation` (`horizontal`, `vertical`) — on Tabs, TabsList, TabsTab,
  TabsIndicator and TabsPanel.
- `data-activation-direction` (`none`, `left`, `right`, `up`, `down`) — which
  way the last selection moved on screen; use it to slide panels in.
- `data-disabled` — on a tab that can't be selected.
- `data-starting-style` / `data-ending-style` — on the panel for its enter
  and exit transitions.
- `data-has-icons` / `data-has-icon` — so items without icons line up.

The stylesheet (`packages/styles/src/tabs.css`) keys `data-selected`,
`data-disabled`, `data-orientation="vertical"`,
`data-activation-direction="none"`, `data-starting-style` and
`data-ending-style`, and positions the indicator with the
`--active-tab-*` variables. Modifiers are attributes only and values come
from tokens, per `design/css-conventions.md`.

## Observable promises

Per ui-sdk docs (`@ui-sdk/react/docs/components/tabs.md`):

- Arrow keys move between tabs — left/right or up/down per `orientation`;
  with `activation="automatic"` they select as soon as they focus a tab, with
  `"manual"` Enter or Space selects.
- Hidden panels stay out of the page unless `keepMounted`; with
  `hiddenUntilFound` they stay findable by the browser's find in page, which
  then selects their tab.
- On the server, panels that render before the list don't know the selected
  tab yet, so a layout with the panels first needs `defaultValue` or a
  controlled `value`.
