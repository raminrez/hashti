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
| 013  | Popover component (ui-sdk popover + Hashti styles)     | P1 | M | 012 | DONE |
| 014  | Tooltip component (ui-sdk tooltip + Hashti styles)     | P1 | S | 013 | DONE |
| 015  | Toast component (ui-sdk toast + Hashti styles)         | P1 | M | 014 | DONE |
| 016  | Tabs component (ui-sdk tabs, line variant)             | P1 | M | 015 | DONE |
| 017  | Accordion component (ui-sdk accordion + Hashti styles) | P1 | M | 016 | DONE |
| 018  | Slider component (ui-sdk slider + Hashti styles)       | P1 | M | 017 | DONE |
| 019  | Menu component (ui-sdk menu + Hashti styles)           | P1 | M | 018 | DONE |
| 020  | Listbox component (ui-sdk listbox + Hashti styles)     | P1 | M | 019 | DONE |
| 021  | Kbd component (Hashti-owned keycap glyph)              | P2 | S | 020 | DONE |
| 022  | Toggle component (ui-sdk toggle + group)               | P1 | S | 021 | DONE |
| 023  | Collapsible component (ui-sdk collapsible)             | P1 | S | 022 | DONE |
| 024  | Progress component (ui-sdk progress)                   | P1 | S | 023 | DONE |
| 025  | Meter component (ui-sdk meter)                         | P1 | S | 024 | DONE |
| 026  | ScrollArea component (ui-sdk scroll-area)              | P1 | M | 025 | DONE |
| 027  | HoverCard component (ui-sdk hover-card)                | P1 | S | 026 | DONE |
| 028  | Badge component (Hashti-owned status marker)           | P2 | M | 027 | DONE |
| 029  | Link component (Hashti-owned; also styles Button as-a) | P2 | S | 028 | DONE |
| 030  | AvatarGroup + getInitials (Hashti-owned, wraps Avatar) | P2 | M | 029 | DONE |
| 031  | Timeline component (ui-sdk timeline, vertical)         | P1 | M | 030 | DONE |
| 032  | Rating component (ui-sdk rating, star fill)            | P1 | S | 031 | DONE |
| 033  | SegmentedControl (ui-sdk segmented-control)            | P1 | M | 032 | IN PROGRESS |

**Reassessment checkpoint 2 (post-cycle-20)** — ui-sdk ships 54 components;
20 styled. Full roadmap in "Reassessed order v2" below.

## Reassessed order v2 (post-cycle-20, framework-agnostic styles rule active)

Standing rule added: component CSS targets ONLY class names + ui-sdk data
attributes (never React DOM specifics) so `@hashti/styles` can back future
Vue/Svelte packages verbatim.

S batch (small primitives, no popups):
toggle → collapsible (reuses accordion panel recipe) → progress → meter →
scroll-area → hover-card (popover sibling) → Badge (Hashti-owned) → Link
(Hashti-owned; Button render-as) → timeline → rating

M batch (form inputs + segmented families):
segmented-control (tabs indicator recipe) → password-input → number-input →
date-input → time-input → file-input → otp-input → pagination → toolbar →
carousel → resizable → alert-dialog (dialog sibling) → drawer (dialog
sibling) → menubar (menu sibling) → trigger-menu

L batch (heavy surfaces):
combobox (→ multiselect with chips after) → autocomplete → command →
token-input → calendar → date-picker (calendar + popover) → navigation-menu
→ tree → preferences → color-picker → waterfall → image-cropper

Advanced features after coverage (per program brief): select multiple,
combobox multiselect with chips, then per-plan maintenance deferrals
(submenus, checkbox menus, icons, shortcuts, context menus, promise toasts,
queue config, sheet presentation, RTL, vertical variants).

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
