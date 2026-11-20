# Plan 062: Inline completion (Input/Textarea inline suggest)

> **Executor/orchestrator instructions**: Execute step by step, verify every
> gate, COMMIT ON EVERY STEP, never merge/push/touch `dev`. STOP conditions
> at the end — stop and report instead of improvising. Do not update
> `plans/README.md`.
>
> **Drift check first**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`

## Status

- **Priority**: P1 · **Effort**: M · **Risk**: MED (ghost-text overlay
  positioning must track the caret without React DOM specifics in CSS)
- **Depends on**: 005 Input, 006 Textarea (merged)
- **Lane**: Particle-2 (orchestrator on glm-5.3-flash; sub-agents via herdr
  panes in particle mode)

## Why

Inline completion is the type-ahead ghost text inside Input/Textarea.

## Facts (READ the docs first)

- Find the ui-sdk docs entry: check
  `packages/react/node_modules/@ui-sdk/react/docs/components/input.md` and
  `textarea.md` for an inline-completion/autosuggest section; also grep the
  docs directory: `grep -rln "completion\|suggest" packages/react/node_modules/@ui-sdk/react/docs/components/`.
  If ui-sdk ships a dedicated part (e.g. `InputSuggest`), follow its docs;
  if the behavior is app-level (suggest API + overlay), implement the
  demo-level composition and style only the ghost layer.
- The ghost text must align with the input text: same font, padding, and
  start offset. Alignment via the control's own padding tokens — the
  overlay is positioned relative to the field wrapper.

## Design rules

- Field wrapper (`hashti-input`/`hashti-textarea` root) gets
  `position: relative` (verify it doesn't already).
- Ghost layer `hashti-inline-completion`: `position: absolute; pointer-events:
none; color: var(--hashti-text-secondary);` same font-size/line-height/
  padding as the control so text overlaps exactly.
- The suggest value renders after the typed text — the demo composes typed
  value + suggestion in the overlay; the control itself stays native.
- `[data-active]`/equivalent state per ui-sdk docs if it exposes one.
- Tokens only; hex is a bug.

## Scope (only these)

- `packages/styles/src/input.css` / `textarea.css` (position:relative if
  missing) + NEW `packages/styles/src/inline-completion.css`
- `packages/styles/index.css` (one import)
- `packages/react/src/inline-completion/` — ONLY if ui-sdk ships a part to
  wrap; otherwise skip (demo-level composition)
- `packages/react/src/index.tsx` (only if wrappers added)
- `apps/docs/src/components/inline-completion-demo.tsx` — create
- `apps/docs/content/docs/inline-completion.mdx` — create
- `apps/docs/content/docs/meta.json` — add entry

## Steps

1. Docs recon (grep as above). Decide wrap vs demo-composition; note the
   decision. Typecheck if wrappers added.
2. Ghost-layer stylesheet. Verify: no hex; overlay uses control-matching
   typography tokens.
3. Demo (an input with a small suggestion source; Tab or → accepts) + docs
   page + meta. Typecheck.

## Done

- [ ] typecheck exit 0 · [ ] no hex · [ ] ghost text visually aligns with
      typed text in the rendered check · [ ] commits per step

## STOP

- ui-sdk ships no completion part AND a wrapper would re-implement
  behavior — report (demo-composition is the fallback, say so).
- Ghost alignment requires per-render inline styles computed in React —
  report (frame-agnostic rule forbids it; propose the token-based
  alternative you found).
- Verification fails twice.
