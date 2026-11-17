# TICK-000: Component Inventory & Naming

**Phase:** 0 — Foundation (blocks all other tickets)
**Priority:** Critical
**Effort:** Medium

## Goal
Produce the definitive Hashti component inventory against the ui-sdk catalog, per ADR-0002:
every component takes a canonical name, and each is marked **wrap** (Hashti adds API: variants,
sizes, compound anatomy), **re-export** (ui-sdk component as-is under Hashti styles),
**remove** (redundant), or **add** (ui-sdk component Hashti lacks and wants). No RAC-era name
survives by default; ui-sdk's name wins unless there's a reason recorded in GLOSSARY.md.

## Method
- Read `node_modules/@ui-sdk/react/docs/llms.txt` and each candidate component's doc page.
- Walk the current `packages/react/src/components/` inventory (45 components) against ui-sdk's
  exports (`@ui-sdk/react/package.json`).
- Known collisions to resolve (ui-sdk name ← Hashti/RAC name): accordion ← disclosure,
  otp-input ← input-otp, token-input ← token-field, date-input/time-input ← date-picker/time-field
  internals, segmented-control ← content-switcher, separator ← divider, menu ← dropdown patterns.
- Presentational-only candidates (kbd, badge, empty-state, code-snippet) may stay as pure
  CSS-class components with no ui-sdk primitive — decide per component, record why.

## Deliverable
`docs/component-inventory.md`: table of canonical name → disposition (wrap/re-export/remove/add)
→ ui-sdk entry → owning ticket. Names recorded in GLOSSARY.md where they're Hashti-specific.

## Acceptance Criteria
- [ ] Every current component has a disposition
- [ ] Every wrap/re-export maps to a `@ui-sdk/react/*` entry that exists in the installed version
- [ ] Renames recorded in GLOSSARY.md
- [ ] TICK-001…010 revised to match the inventory (names, wrap-vs-re-export scope)
- [ ] User approves the inventory before TICK-000b starts
