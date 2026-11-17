# TICK-014: Purge Cinder & Carbon Lineage

**Phase:** Any time after TICK-000; must complete before any release
**Priority:** Medium
**Blocked by:** TICK-000. Independent of all component work; any time.
**Effort:** Low

## Goal
The design system is Hashti. Remove all "Cinder" naming and Carbon Design System lineage
references repo-wide.

## Scope
- `docs/research-cinder-*.md`, `docs/research-carbon.md` and similar: delete or fold anything
  still decision-relevant into DESIGN.md, then delete
- Grep sweeps: `cinder` (case-insensitive), `carbon`, stale `react-aria` references in docs
- GLOSSARY.md already purged (18 Nov 2026); verify no reintroduction
- Package names, CSS hooks (`hashti-*`), and user-facing docs must never mention either

## Acceptance Criteria
- [ ] `grep -ri cinder --exclude-dir=node_modules` → only historical ADR-0001/0002 context, if any
- [ ] `grep -ri carbon --exclude-dir=node_modules` → none (except unrelated words)
- [ ] DESIGN.md reads as Hashti's own voice, no lineage framing
