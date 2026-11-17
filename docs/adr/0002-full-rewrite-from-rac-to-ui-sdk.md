# Full rewrite from React Aria Components to ui-sdk, as a multi-framework library

Status: accepted, 18 November 2026

Hashti rewrites all components from React Aria Components onto ui-sdk, superseding ADR-0001.
The library is unreleased with zero consumers, so no compatibility layer exists: RAC props,
patterns, and names leave entirely (`onPress` → `onClick`, `isDisabled` → `disabled`, no
`composeRenderProps`, no slot injection), and the component inventory itself is renegotiated —
components take ui-sdk's names, redundant Hashti-only components are removed, and ui-sdk
components Hashti lacks may be added. RAC is deleted package-by-package as each migration ticket
lands and is removed from the catalog with the last one.

`@hashti/styles` becomes the design system's center of gravity: the token pipeline from
`packages/tokens` moves into it (pruned to tokens the stylesheets actually use), and all
component CSS is remapped from RAC's state vocabulary (`data-hovered`, `data-pressed`,
`data-entering`…) to ui-sdk's (`data-open`, `data-checked`, `data-starting-style`…) via one
canonical attribute map. Because ui-sdk normalizes behavior and attributes across React, Vue,
Svelte, Solid, and web components, that single stylesheet set serves every future
`packages/<framework>` binding — the multi-framework bet lives in the CSS contract, not in
per-framework code. `@hashti/react` is a thin layer: it wraps a ui-sdk component only where
Hashti adds API (variants, sizes, compound anatomy) and re-exports otherwise. `packages/agent`
is deleted; agent operability comes from `@ui-sdk/react/agent`, which the RAC-based bridge was
built to mimic.

## Considered Options

- **Fresh repository ("clean room")** — rejected: Hashti's value is Frame (tokens, styles,
  DESIGN.md) and the workspace infrastructure, none of which is coupled to RAC; a new repo pays
  the setup cost again for no design gain.
- **Keep `@hashti/agent` alongside ui-sdk** — rejected: with all components on ui-sdk primitives,
  ui-sdk's own agent surface discovers them natively, and two registries means an empty snapshot
  (ADR-0001's own warning).
- **Preserve the RAC-era component API** — rejected: with zero consumers, compatibility shims
  are pure cost, and they would fossilize RAC naming inside an otherwise clean library.
- **Per-ticket attribute remapping** — rejected: CSS selectors are global; ten tickets guessing
  at the RAC→ui-sdk attribute mapping would produce two dialects. One map, one sweep, then
  per-ticket visual verification.

## Consequences

- `@ui-sdk/core/web.css` is imported once at app entry points, layered under `@hashti/styles`
  (`@layer ui-sdk` declared before any Tailwind import); it never enters the published library.
- TICK-000 (component inventory + naming, recorded in GLOSSARY.md) and TICK-000b (attribute map
  + selector sweep) precede all component tickets. A contract-validation spike after the Button
  ticket renders the same styled Button in a second framework before the remaining tickets
  proceed.
- All "Cinder" and Carbon-lineage naming is purged repo-wide; the design system is Hashti.
- `apps/playground` is frozen for the duration of the rewrite; docs and Storybook stay green as
  the per-ticket verification surfaces.
