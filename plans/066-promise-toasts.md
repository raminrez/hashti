# Plan 066: Promise toasts

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end. Do not update `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: S · **Risk**: LOW (lifecycle states on the
  existing Toast)
- **Depends on**: 015 Toast (merged)
- **Lane**: Particle-6 (orchestrator glm-5.3-flash)

## Why

Toasts that follow a Promise: loading → success/error states.

## Facts (READ the docs first)

- `packages/react/node_modules/@ui-sdk/react/docs/components/toast.md` —
  section Promise (444) and Async Action (733). Read both + Data
  Attributes for the promise states (`data-pending`/`data-loading`,
  success/error equivalents — follow the docs' exact names).
- Current styles: `packages/styles/src/toast.css`.

## Design rules

- **Pending**: leading spinner affordance — a border-spinner (two-tone
  border, `spin` keyframe, `prefers-reduced-motion` → static half-opacity
  dot) sized to the toast's icon slot; ink secondary.
- **Success**: leading check in `--hashti-support-success` ink.
- **Error**: leading alert in `--hashti-support-critical` ink (verify the
  exact token names in `design/tokens.css` — use what exists).
- State changes animate opacity of the icon slot (fast-01), not the whole
  toast.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/toast.css` (extend)
- `apps/docs/src/components/toast-demo.tsx` (add a promise example — a
  button that fires a fake promise toast)
- `apps/docs/content/docs/toast.mdx` (document promise toasts)

## Steps

1. Docs recon (promise states + part names).
2. State CSS (spinner/check/alert). Verify: no hex; spinner keyframes
   respect reduced-motion.
3. Demo + docs. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] rendered check: pending spinner
      spins, resolves to check or alert ink · [ ] commits per step

## STOP

- ui-sdk exposes no promise state attributes — report what it exposes.
- Verification fails twice.
