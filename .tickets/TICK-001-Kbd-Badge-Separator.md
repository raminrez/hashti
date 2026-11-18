# TICK-001: Standardize Kbd, Badge, Separator (Display Components)

**Status:** DONE

**Phase:** 1 — Pure Content & Display Components (Lowest Risk)
**Priority:** High (unblocks all other tickets)
**Blocked by:** TICK-000b (attribute map governs stylesheet selectors). Substantially done on RAC contracts; verify-only after 000b.
**Effort:** Low

## Goal
Standardize the three simplest display-only components (`Kbd`, `Badge`, `Separator`) to the Hashti DOM
contract and `@hashti/styles`. These components have no interactive state so they're ideal first targets.
Names follow the TICK-000 inventory (Divider likely becomes `Separator`, re-exported from
`@ui-sdk/react/separator`).

## Files to Touch
- `packages/react/src/components/kbd/kbd.tsx`
- `packages/react/src/components/badge/badge.tsx`
- `packages/react/src/components/divider/divider.tsx` (may not exist — create if missing)

## Acceptance Criteria
- [x] Each component renders with `.hashti-<name>` class (`.hashti-kbd`, `.hashti-badge`, `.hashti-separator` — Divider renamed to Separator per inventory)
- [x] `data-variant` attribute applied for Badge variants (prop renamed `kind` → `variant`; emits `data-variant`)
- [x] `data-size` attribute for components that support sizing (n/a — none of Kbd/Badge/Separator ship size variants in CSS)
- [x] No `react-aria-components` imports in these files
- [x] No `@hashti/agent` imports
- [x] Logical CSS properties used in component CSS (`packages/styles/src/components/`)
- [x] `bun test tests/unit` → 147 pass, 0 fail (full suite; scoped `tests/unit packages/react/src` = 128 pass, 0 fail)
- [x] `bun run build:packages` succeeds

## DOM Contract
```tsx
// Badge
<span class="hashti-badge" data-variant="success" data-size="md">...</span>

// Kbd
<kbd class="hashti-kbd">...</kbd>

// Divider
<hr class="hashti-divider" data-orientation="horizontal" />
// or
<div class="hashti-divider" data-orientation="vertical" role="separator" />
```

## Notes
- These are wrapper-only components. They should use plain HTML elements + CSS classes.
- If divider doesn't exist in the react package, create a minimal one.
- CSS should live in `packages/styles/src/components/` (already seeded — update if needed).
- RTL: use `border-inline-start` not `border-left` in CSS.
