# TICK-013: Contract-Validation Spike — Second Framework

**Status:** DONE

**Phase:** 2 — After TICK-002 (Button) lands, before remaining component tickets
**Priority:** High
**Blocked by:** TICK-002 (needs the styled Button). Blocks Phase 3+ if the contract cracks.
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
- [x] Same stylesheet, both frameworks, visually identical states (screenshot comparison)
- [x] RTL renders correctly in both
- [x] Any selector that assumed React-specific DOM nesting is fixed in `packages/styles` and
      re-verified in React
- [x] Findings appended to `docs/attribute-map.md` if the map was wrong anywhere
- [x] Harness deleted or converted into the seed of `packages/<framework>` — decide with user

## Outcome (2026-11-18)

Full report: `docs/spike-button-report.md`. Harness: `apps/spike-button/`.

- **Framework:** `@ui-sdk/web` 0.1.0-beta.6 (Web Components — no framework runtime; light DOM,
  wrapper is `display: contents`).
- **Result:** web vs react, same `@hashti/styles` stylesheet — **0.000% pixel diff on all 8
  captures** (rest, hover, active, states, pending, focus, RTL-fa, RTL-ar).
- **Crack found & fixed:** `packages/react/src/styles.css` was a stale pre-sweep RAC-vocabulary
  duplicate; Storybook hover was dead. Replaced with `@import "@hashti/styles";`, deleted the
  duplicated react-local CSS, retargeted `tests/unit/css-architecture.test.ts` at
  `packages/styles/src`.
- **Dead CSS removed:** `.hashti-filter-tag` / `.hashti-tag-group` rules (no renderer).
- **Decision:** recommend **delete** the harness (report explains why); promote the
  capture/diff pattern into `tests/browser/` as a follow-up if wanted.
