# Implementation Plans

Component build-out program for hashti-next. One plan per component cycle,
simplest first. Execute in the order below unless dependencies say otherwise.
Each executor: read the plan fully before starting, honor its STOP conditions.

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001  | Divider component (ui-sdk separator + Hashti styles) | P1 | S | — | IN PROGRESS |

Next in program order (not yet planned): Label / Kbd → Badge / Avatar →
Button (all variants) → Link → TextField, TextArea → Checkbox, Radio, Switch.

Status values: TODO | IN PROGRESS | DONE | BLOCKED (with one-line reason) | REJECTED (with one-line rationale)

## Dependency notes

- 002 (Label / Kbd) should reuse the file shape established by 001.

## Findings considered and rejected

- No `@hashti/core` primitive for Divider: ui-sdk ships `separator` with the
  exact behavior needed; a Hashti primitive would add state ownership the
  architecture forbids duplicating.
