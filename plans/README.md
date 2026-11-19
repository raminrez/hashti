# Implementation Plans

Component build-out program for hashti-next. One plan per component cycle,
simplest first. Execute in the order below unless dependencies say otherwise.
Each executor: read the plan fully before starting, honor its STOP conditions.

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001  | Separator component (ui-sdk separator + Hashti styles) | P1 | S | — | DONE |

Next in program order — **ui-sdk-backed components only** (naming follows
ui-sdk): Label → Avatar → Button (all variants) → Input → Textarea →
Checkbox, Radio, Switch. Reassess after those.

**Deferred — ui-sdk ships no equivalent, Hashti-owned per the naming rule;
do not plan these until the ui-sdk-backed list is exhausted:** Kbd, Badge,
Link (no dedicated ui-sdk link; revisit as Button `render={<a href/>}` when
Button lands).

Naming rule: Hashti follows ui-sdk component names wherever ui-sdk ships one
(Separator, not Divider; Input/Textarea, not TextField/TextArea). Hashti-only
components (Badge, Kbd) keep their own names.

Status values: TODO | IN PROGRESS | DONE | BLOCKED (with one-line reason) | REJECTED (with one-line rationale)

## Dependency notes

- 002 (Label / Kbd) should reuse the file shape established by 001.

## Findings considered and rejected

- No `@hashti/core` primitive for Divider: ui-sdk ships `separator` with the
  exact behavior needed; a Hashti primitive would add state ownership the
  architecture forbids duplicating.
