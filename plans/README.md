# Implementation Plans

Component build-out program for hashti-next. One plan per component cycle,
simplest first. Execute in the order below unless dependencies say otherwise.
Each executor: read the plan fully before starting, honor its STOP conditions.

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001  | Separator component (ui-sdk separator + Hashti styles) | P1 | S | — | DONE |
| 002  | Label component (ui-sdk label + Hashti styles)         | P1 | S | 001 | DONE |
| 003  | Avatar component (ui-sdk avatar + Hashti styles)       | P1 | S | 002 | DONE |
| 004  | Button component (all variants)                        | P1 | M | 003 | DONE |
| 005  | Input component (ui-sdk input + Hashti styles)         | P1 | M | 004 | DONE |
| 006  | Textarea component (ui-sdk textarea + Hashti styles)   | P1 | S | 005 | DONE |
| 007  | Checkbox component (ui-sdk checkbox + Hashti styles)   | P1 | M | 006 | DONE |
| 008  | Radio component (ui-sdk radio + Hashti styles)         | P1 | M | 007 | DONE |
| 009  | Switch component (ui-sdk switch + Hashti styles)       | P1 | S | 008 | DONE |
| 010  | Field anatomy (ui-sdk field + recovery band)           | P1 | L | 009 | DONE |
| 011  | Select component (ui-sdk select + Hashti styles)       | P1 | L | 010 | DONE |
| 012  | Dialog component (ui-sdk dialog + Hashti styles)       | P1 | L | 011 | DONE |
| 013  | Popover component (ui-sdk popover + Hashti styles)     | P1 | M | 012 | IN PROGRESS |

**Reassessment checkpoint** — the ui-sdk-backed list from the program brief
is exhausted. See "Reassessed order" below.

## Reassessed order (post-cycle-9)

Foundation candidates before more components:

- **Field anatomy** (ui-sdk `/field`: Field, FieldLabel, FieldDescription,
  FieldError, FieldControl, FieldSet) — unlocks the recovery band, invalid
  precedence over selected fill, read-only/required recipes, and completes
  Input/Textarea/Checkbox/Radio/Switch integration. Several deferred items
  hang off it.

Then, in leverage order (ui-sdk-backed): Select → Dialog → Popover →
Tooltip → Toast → Tabs → Accordion → Slider → Menu → Listbox.

Deferred (Hashti-owned, no ui-sdk equivalent — do not plan until asked):
Kbd, Badge, Link (revisit as Button `render={<a href/>}`), AvatarGroup +
presence + getInitials, InputGroup + InputClear.

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
