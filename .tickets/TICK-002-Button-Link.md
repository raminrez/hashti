# TICK-002: Migrate Button & Link to @ui-sdk/react/button

**Status:** DONE

## Overview
Migrate `Button` and `Link` from React Aria Components (`RACButton`, `RACLink`) to `@ui-sdk/react/button`.

## Scope
1. **Target Files**:
   - `packages/react/src/components/button/button.tsx`
   - `packages/styles/src/components/button/button.css`
2. **Behavior & State Requirements**:
   - [x] Wrap `@ui-sdk/react/button`.
   - [x] Ensure support for `variant`: collapsed to the ui-sdk set — `primary`, `secondary`, `danger`, `ghost`, `outline` (RAC's `tertiary`/`danger-tertiary`/`danger-ghost` folded per AGENTS.md; `outline` covers the bordered-quiet treatment).
   - [x] Ensure support for `size`: `sm` (32px), `md` (44px), `lg` (48px).
   - [x] Async pending handling via `@ui-sdk/react/button`: native Promise handling, screen reader announcement (`pendingLabel` → `pendingAnnouncement`), spinner rendering (`.hashti-spinner` appended while `data-pending`).
   - [x] Disabled states: `disabled`, `focusableWhenDisabled`.
   - [x] Standard DOM classes: `.hashti-button`, `data-variant`, `data-size`.
   - [x] `agentConfirm` maps to ui-sdk's `data-agent-confirm` mark (docs/agents.md).
   - [x] `Link` wraps `@ui-sdk/react/button` with `render={<a>}`; disabled/href-less renders a span with link semantics.
   - [x] `Toggle` (was ToggleButton) wraps `@ui-sdk/react/toggle`; `ContentSwitcher` wraps `ToggleGroup` (single, `deselectable={false}`).
   - [x] `Breadcrumbs` is css-only: `nav > ol` of Hashti `Link`s, `.hashti-breadcrumbs` hook; last crumb gets `aria-current="page"` unless set.
3. **Verification**:
   - [x] All unit tests in `tests/unit` pass (`bun test tests/unit packages/react/src`: 124 pass, 0 fail, 4 skip — the 4 skipped SheetTrigger/PreviewTrigger tests asserted RAC ButtonContext slot-injection and are re-enabled by TICK-007).
   - [x] Run `bun run build:packages` to ensure clean TypeScript types and bundling (exit 0).
   - [x] `bun run build:storybook` succeeds; root `tsc` clean (230 files).


