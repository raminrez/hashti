# Plan 063: Rating half-star masks

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end — stop and report instead of improvising. Do not update
> `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: S · **Risk**: LOW (pure CSS masking on the
  existing Rating)
- **Depends on**: 032 Rating (merged)
- **Lane**: Particle-3 (orchestrator on glm-5.3-flash; sub-agents via herdr
  panes in particle mode)

## Why

Fractional ratings (3.5) currently round. Half-star support fills partially
via a mask/clip layer.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/rating.md` —
  look for fractional/half/allowHalf or how the fill value maps to stars;
  read the Data Attributes for per-star fill state (`data-filled`,
  `data-half` or a `--fill` percentage variable — follow what the docs
  say).
- Current styles: `packages/styles/src/rating.css`.

## Design rules

- If ui-sdk exposes a per-star fill fraction variable (e.g. `--fill`), the
  half star is: filled layer `inline-size: var(--fill)` with `overflow:
  hidden` over an empty star — the classic two-layer mask.
- If it exposes only `data-half`, style half as a 50% clip
  (`clip-path: inset(0 50% 0 0)` on the filled glyph layer).
- Hover preview states per docs.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/rating.css` (extend)
- `apps/docs/src/components/rating-demo.tsx` (add a half-star example)
- `apps/docs/content/docs/rating.mdx` (document fractional values)
- No wrapper changes expected unless props pass-through is missing.

## Steps

1. Docs recon (fill mechanics). Note the exact mechanism.
2. Half-star CSS. Verify: no hex; uses a mask/clip technique.
3. Demo + docs. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] rendered check: a 3.5 rating shows
  three full + one half + one empty · [ ] commits per step

## STOP

- ui-sdk provides no fractional fill mechanism (only whole steps) — report
  what the docs actually expose.
- Verification fails twice.
