# Hashti

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and designers building accessible, high-craft, and agent-operable product
interfaces across modern web frameworks (React, Vue, Svelte, Solid, and Web Components).
End users interacting with these interfaces experience clear controls, predictable interactions,
and full keyboard/screen-reader accessibility.

## Product Purpose

Hashti is an original, multi-framework design system and component library built on high-craft
visual foundations and robust headless primitives. Powered by `@ui-sdk/core` and framework
adapters (starting with `@ui-sdk/react`), Hashti unifies component ergonomics, native agent
operability (via WebMCP and agent bridge tools), and world-class Persian/Arabic RTL support.

## Capabilities and Constraints

- **Multi-framework architecture:** Built with `@ui-sdk/core` headless state machines and
  render engines supporting React (19+), Vue, Svelte, Solid, and Web Components.
- **Migration Roadmap:** Phased transition from React Aria Components (RAC) to `ui-sdk`.
  Phase 1 focuses on the React implementation (`@hashti/react`), followed by framework
  expansion packages.
- **Agent Operability:** First-class agent affordances (`snapshot`, `act`, `query`, WebMCP)
  integrated natively into component lifecycles via `@hashti/agent` and ui-sdk primitives.
- **Design Foundations:** Frame visual direction, native prebuilt CSS, semantic design tokens
  (`@hashti/tokens`), and `hashti-*` BEM/custom styling hooks.
- **Workspace:** Monorepo managed with Bun workspaces. Includes `@hashti/tokens`, `@hashti/react`,
  `@hashti/agent`, documentation (`apps/docs`), interactive playground (`apps/playground`),
  and Storybook (`apps/storybook`).

## Brand Commitments

- **Name:** Hashti (formerly referred to as Cinder in early prototypes; rebranded comprehensively).
- **Aesthetic Direction:** Frame visual direction is the baseline standard—clean, intentional,
  and tactile.
- **Voice:** Direct, precise, unpretentious, and technically grounded.
- **Reference Influences:**
  - *Astryx:* Field anatomy, state feedback, and validation clarity.
  - *HeroUI v3:* Component ergonomics and developer experience.
  - *Carbon:* UX reasoning, accessible interaction models, and systematic coverage.

## Accessibility & Inclusion

- Accessibility (WCAG 2.1 AA) and internationalization are non-negotiable core requirements.
- Full RTL (Right-to-Left) first-class support: Persian and Arabic authored examples with
  authentic typography, appropriate numeral systems, and directional layouts.
- Keyboard navigation, visible focus rings, ARIA semantics, and screen-reader announcements
  across all headless primitive integrations.

## Evidence on Hand

- Research reports, ADRs (e.g. `docs/adr/0001-ui-sdk-and-hashti-agent-bridge.md`), and design
  specifications in `docs/`.
- Prototype comparisons, interactive forms, and review states in `apps/playground` and `apps/docs`.
- Verified test suites for tokens, React package builds, and agent integration.

## Roadmap & Implementation Decisions

1. **Phased UI-SDK Migration:**
   - Migrate component behavior and state machines from React Aria Components to `@ui-sdk/core`
     and `@ui-sdk/react`.
   - Maintain Frame styling contracts, token bindings, and public API stability for consumer code.
   - Expand framework package targets (Vue, Svelte, Solid, Web Components) as `@ui-sdk/core`
     bindings are stabilized.
2. **Storybook & Package Verification:**
   - Keep Storybook stories up to date as the source of visual and interaction truth.
   - Comprehensive automated unit, a11y (axe), and browser verification for every migrated component.
3. **Documentation & Handoff:**
   - Update documentation site (`apps/docs`) reflecting multi-framework guides and agent APIs.
   - Final deliverables include synchronized Figma design system tokens and component mappings.
