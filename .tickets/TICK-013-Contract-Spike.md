# TICK-013: Contract-Validation Spike — Second Framework

**Phase:** 2 — After TICK-002 (Button) lands, before remaining component tickets
**Priority:** High
**Effort:** Low

## Goal
Prove the multi-framework CSS contract (ADR-0002) before the rest of the rewrite commits to it:
render the styled Hashti Button from a second ui-sdk framework package (Svelte or web components —
whichever is cheaper to scaffold) against `@hashti/styles`, unmodified.

## Why here
Button is the cheapest probe: one element, ~five state attributes, variants and sizes exercised.
A contract crack found now costs an afternoon; found after TICK-010 it costs a re-audit of every
stylesheet.

## Method
- Scaffold a minimal throwaway harness (not a published package) under `apps/` or a temp worktree
- Install the matching `@ui-sdk/*` framework package
- Render Button in rest/hover/pressed/disabled/pending + each variant and size
- Compare rendered output against the React Storybook stories for the same states

## Acceptance Criteria
- [ ] Same stylesheet, both frameworks, visually identical states (screenshot comparison)
- [ ] RTL renders correctly in both
- [ ] Any selector that assumed React-specific DOM nesting is fixed in `packages/styles` and
      re-verified in React
- [ ] Findings appended to `docs/attribute-map.md` if the map was wrong anywhere
- [ ] Harness deleted or converted into the seed of `packages/<framework>` — decide with user
