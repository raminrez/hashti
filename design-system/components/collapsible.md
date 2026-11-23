---
sourcesHash: 3944efa5527b14f9fc80a2edbc17cbd231f19d771f23c55b92b931879c37bb8a
id: collapsible
description: >-
  Show and hide one panel of content with a native disclosure trigger,
  preserved contents and height animation, handled by ui-sdk.
status: discoverable
sources:
  - packages/react/src/collapsible/collapsible.tsx
  - packages/react/src/collapsible/index.ts
  - packages/styles/src/collapsible.css
examples:
  - apps/docs/content/docs/collapsible.mdx
---

# Collapsible

## Purpose

Shows and hides one panel of content. Hashti wraps ui-sdk's `Collapsible`,
`CollapsibleTrigger` and `CollapsiblePanel` unchanged, adding
`hashti-collapsible*` classes; appearance lives in
`packages/styles/src/collapsible.css`.

## When to use

- One panel to show and hide behind a summary that always shows. ui-sdk docs:
  "Show and hide a panel, preserve its contents, and animate its height."
- A draft or form inside the panel that must survive closing: `keepMounted`.
- Content the browser's Find or a deep link must be able to reveal:
  `hiddenUntilFound`.

## When not to use

- A set of panels with headings — use [Accordion](accordion.md).
- A panel that belongs to one of several views — use [Tabs](tabs.md).

## Public settings

Hashti wraps and re-exports the three parts only; all props forward to
ui-sdk.

- Root: `open`/`defaultOpen`/`onOpenChange` (`details.cancel()` stops the
  change), `onOpenChangeComplete` (after any animation), `disabled`,
  `controller` from `createCollapsibleController()` (one per mounted
  collapsible).
- Panel: `keepMounted` (stays in the page, hidden, while closed),
  `hiddenUntilFound` (kept as `hidden="until-found"` so browser Find and hash
  links can reveal it).
- Composition: the root and panel render divs, the trigger a native button;
  put headings or always-visible summaries around them.

## States

ui-sdk sets `data-open`, `data-closed` and `data-disabled` on every part,
plus `data-starting-style`/`data-ending-style` on the panel. The panel exposes
`--collapsible-panel-height`. `packages/styles/src/collapsible.css` keys:

- `[data-open]` on the trigger — the CSS-drawn caret rotates; the panel
  animates `block-size` from `var(--collapsible-panel-height)`.
- `[data-starting-style]`/`[data-ending-style]` — height 0, exits shorter than
  entrances; both stop under `prefers-reduced-motion`.
- `[data-disabled]` on the trigger, `:focus-visible` ring.

## Observable promises

Per ui-sdk docs:

- The collapsible follows the WAI-ARIA disclosure pattern: the trigger says
  whether the panel is open with `aria-expanded` and points to it with
  `aria-controls` while it's mounted.
- Enter or Space opens or closes the panel with focus staying on the trigger;
  Tab moves from the trigger into an open panel, and closing a panel while
  focus is inside it moves focus back to the trigger.
- A disabled trigger stays in the tab order and reports
  `aria-disabled="true"`; a disabled `<fieldset>` around the collapsible
  disables it too.
- Panels unmount when they close, so Tab skips their contents; `keepMounted`
  keeps a field's typed value. `hiddenUntilFound` opens the panel without an
  animation so the Find match is visible immediately (React serializes
  `hidden` as a boolean on the server, so it becomes findable after
  hydration).
- The panel stays mounted until its closing animation finishes, and a panel
  open on its first paint doesn't animate.
