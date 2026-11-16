# TICK-002: Migrate Button & Link to @ui-sdk/react/button

## Overview
Migrate `Button` and `Link` from React Aria Components (`RACButton`, `RACLink`) to `@ui-sdk/react/button`.

## Scope
1. **Target Files**:
   - `packages/react/src/components/button/button.tsx`
   - `packages/styles/src/components/button/button.css`
2. **Behavior & State Requirements**:
   - Wrap `@ui-sdk/react/button`.
   - Ensure support for `variant`: `primary`, `secondary`, `tertiary`, `ghost`, `danger`, `danger-tertiary`, `danger-ghost`.
   - Ensure support for `size`: `sm` (32px), `md` (44px), `lg` (48px).
   - Async pending handling via `@ui-sdk/react/button`: native Promise handling, screen reader announcement, spinner rendering.
   - Disabled states: `disabled`, `focusableWhenDisabled`.
   - Standard DOM classes: `.hashti-button`, `data-variant`, `data-size`.
3. **Verification**:
   - All unit tests in `tests/unit` must pass.
   - Run `bun run build:packages` to ensure clean TypeScript types and bundling.
