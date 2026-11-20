# PRODUCT.md — Hashti

## What this is

Hashti is a personal React component library that wraps
[ui-sdk](https://github.com/) parts with the Hashti "Frame" visual language.
Wrappers compose ui-sdk parts and add the `hashti-*` class contract; all
appearance lives in `@hashti/styles`. No behavioral re-implementation: ui-sdk
owns interaction, focus, and accessibility; Hashti owns appearance.

## People

- **Ramin** — sole maintainer. Builds and reviews one component per cycle with
  coding agents (opencode + herdr sub-agents). No external users yet.

## Goals

- Complete, consistent appearance for the full ui-sdk catalog in light and
  dark themes, verified by rendered checks, not by assumption.
- Keep wrappers thin: compose, add the class, nothing else.
- Keep `@hashti/styles` framework-agnostic so Vue/Svelte packages can use it
  verbatim later.

## Constraints

- Bun monorepo, bun packages; no remote yet — all work lands on `dev`.
- Tokens only in styles: `var(--hashti-*)` and ui-sdk CSS vars; no raw hex.
- Class contract: `hashti-<block>__<element>`, modifiers via attributes only.
- Gates per commit: typecheck (raw), lint, lint:css, format:check, deadcode,
  tests, duplicates.

## Selected direction

**Frame** — "A clear frame for the task" — is the selected visual direction,
specified in [DESIGN.md](DESIGN.md). Cool neutral surfaces, neutral primary
action, blue focus/selection, explicit status meaning, 44px default controls.
