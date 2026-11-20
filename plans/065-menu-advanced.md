# Plan 065: Menu advanced — submenus, checkbox/radio items, icons, shortcuts

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end. Do not update `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: M · **Risk**: MED (nested popup styling;
  several item variants)
- **Depends on**: 019 Menu (merged)
- **Lane**: Particle-5 (orchestrator glm-5.3-flash; sub-agent panes in
  particle mode — good split: one sub-agent per doc section)

## Why

Menu depth (submenus), item types (checkbox/radio), icons and shortcuts.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/menu.md` —
  sections: Submenus (57), Shortcuts (137), Icons (192), Checkboxes (270),
  Radio Group (339), Submenu Delay (473). Read each + Data Attributes for
  the parts/states they introduce (submenu trigger/content, item
  `data-checked`/`data-indeterminate`/radio `data-selected`, icon slot,
  shortcut `kbd` rendering).
- Current styles: `packages/styles/src/menu.css` (base item/trigger/content
  recipes there).

## Design rules

- **Submenu trigger**: chevron-end affordance (`inline-size: 1rem`,
  secondary ink); `[data-open]`-equivalent state per docs → pressed tint.
- **Submenu content**: reuse the menu-content surface recipe verbatim (same
  radius/shadow/padding) — nesting must look identical.
- **Checkbox item**: leading check indicator slot; `[data-checked]` →
  filled check (reuse the checkbox glyph recipe from
  `packages/styles/src/checkbox.css` sizing to the item's density);
  `[data-indeterminate]` → dash.
- **Radio item**: leading dot; `[data-selected]` → filled dot (radio.css
  recipe).
- **Icon in item**: leading slot `inline-size: 1rem`, secondary ink,
  aligned with label.
- **Shortcut**: trailing `hashti-menu-item` kbd styling — reuse
  `hashti-kbd` recipe sizing (0.75rem, subtle border) if the docs render a
  kbd element; otherwise muted secondary ink, right-aligned.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/menu.css` (extend)
- `apps/docs/src/components/menu-demo.tsx` (extend with a submenu +
  checkbox + radio + icons + shortcuts example)
- `apps/docs/content/docs/menu.mdx` (document the additions)

## Steps (parallelizable: one sub-agent per doc section)

1. Docs recon: all five sections + data attributes. Note part names.
2. Per section: CSS + demo example. Typecheck after each.
3. Final typecheck + rendered pass (submenu opens nested content,
   checkbox toggles, radio selects, icons/shortcuts render).

## Done

- [ ] typecheck exit 0 · [ ] no hex in touched css · [ ] rendered checks
  above pass · [ ] commits per step

## STOP

- A section's parts aren't exported from the ui-sdk menu entry — quote.
- Submenu positioning needs JS-computed styles — report.
- Verification fails twice.
