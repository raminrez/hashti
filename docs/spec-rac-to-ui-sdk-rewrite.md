# Spec: Rewrite Hashti from React Aria Components to ui-sdk

Synthesized 18 November 2026 from the grill-with-docs session. Governing decisions:
[ADR-0002](../adr/0002-full-rewrite-from-rac-to-ui-sdk.md) (supersedes ADR-0001).
Component dispositions: [component-inventory.md](../component-inventory.md).
Vocabulary: [GLOSSARY.md](../../GLOSSARY.md).

## Problem Statement

Hashti's components are built on React Aria Components. RAC's prop idioms (`onPress`,
`isDisabled`, `isSelected`), its provider requirements (`I18nProvider`), and its
React-only reach conflict with where Hashti is going: a component library whose styles
serve React, Vue, Svelte, Solid, and web components from one stylesheet set, with agent
operability built in. Maintaining a RAC-based inventory alongside that goal means two
behavior engines, a hand-maintained agent bridge (`packages/agent`), and a component
catalog shaped by what RAC happened to ship rather than what Hashti wants to be.

## Solution

Rewrite every component on ui-sdk, in place, as an unreleased library with zero
consumers: no compatibility layer, no RAC names or patterns. `@hashti/styles` becomes
the design system's center — token pipeline moves in (pruned to used tokens), all
component CSS remapped to ui-sdk's state-attribute vocabulary via one canonical
attribute map. `@hashti/react` becomes a thin layer: wrap only where Hashti adds API
(variants, sizes, compound anatomy), re-export otherwise. The component inventory is
renegotiated against ui-sdk's catalog: ui-sdk names win, redundant components are
removed (Modal, Sheet, NavigationTree, PreviewTrigger, GridList), missing ones are
adopted (Calendar, DateInput, PasswordInput, HoverCard, Collapsible, Menu). Agent
operability comes from `@ui-sdk/react/agent`; `@hashti/agent` is deleted.

## User Stories

1. As a developer consuming Hashti, I want components with standard DOM prop names
   (`onClick`, `disabled`, `checked`), so that the API matches the web platform I
   already know.
2. As a developer consuming Hashti, I want to restyle any component through stable
   `hashti-*` hooks and `data-*` state attributes, so that my customizations survive
   library upgrades.
3. As a developer consuming Hashti, I want one stylesheet import to style every
   component, so that setup is a single line.
4. As a developer building a Persian/Arabic interface, I want every component to lay
   out correctly in RTL without configuration, so that bidirectional support is free.
5. As a developer consuming Hashti, I want light and dark themes of Frame applied by a
   root attribute, so that theming needs no provider tree.
6. As a developer consuming Hashti, I want a Button with variants, sizes, icon-only and
   pending states, so that actions look consistent across my app.
7. As a developer consuming Hashti, I want links that keep button behavior (focus,
   pending, disabled) through a Link component, so that navigation and actions share
   one behavior set.
8. As a developer consuming Hashti, I want field anatomy (label, description, error)
   that wires itself to any input, so that form accessibility is automatic.
9. As a developer consuming Hashti, I want selection controls (Checkbox, Radio, Switch,
   SegmentedControl) with consistent sizing and state attributes, so that forms read as
   one system.
10. As a developer consuming Hashti, I want text inputs (Input, Textarea, NumberInput,
    OtpInput, SearchField, FileInput, TimeInput) sharing one field anatomy, so that
    every input row behaves identically.
11. As a developer consuming Hashti, I want Select, Listbox, ComboBox, TokenInput, and
    Command that share list and popup behavior, so that choosing-from-options feels
    the same everywhere.
12. As a developer consuming Hashti, I want Dialog and Drawer as my two overlay
    surfaces, so that I don't choose between four overlapping ones.
13. As a developer consuming Hashti, I want a Drawer that can be non-draggable, so
    that desktop edge panels and mobile sheets are one component.
14. As a developer consuming Hashti, I want Tooltip and Toast for feedback, so that
    transient information has a standard home.
15. As a developer consuming Hashti, I want Tabs and Accordion for progressive
    disclosure, so that dense pages stay navigable.
16. As a developer consuming Hashti, I want one Tree with sections and headers, so
    that hierarchical navigation needs a single import.
17. As a developer consuming Hashti, I want a styled semantic Table, so that tabular
    data matches the system before a full data grid exists.
18. As a developer consuming Hashti, I want presentational primitives (Kbd, Badge,
    Card, Tag, EmptyState, CodeSnippet, Layout, Separator, Breadcrumbs) with no
    behavior baggage, so that content composition is cheap.
19. As a developer consuming Hashti, I want a Theme helper that sets theme, dir, and
    lang on the DOM root, so that internationalization needs no RAC provider.
20. As a developer consuming Hashti, I want Calendar, DateInput, PasswordInput,
    HoverCard, Collapsible, and Menu available, so that I don't leave the system for
    common patterns.
21. As a designer maintaining Hashti, I want tokens generated from one source inside
    the styles package, so that values can't drift between packages.
22. As a maintainer of Hashti, I want one canonical attribute map, so that every
    stylesheet speaks ui-sdk's state vocabulary consistently.
23. As a maintainer of Hashti, I want the same stylesheet to style a component in
    React and a second framework, so that future Vue/Svelte/Solid/web bindings are
    bindings only.
24. As an agent operating a Hashti interface, I want components discoverable through
    ui-sdk's agent system, so that I can find and act on them without a Hashti-specific
    bridge.
25. As a maintainer of Hashti, I want RAC fully removed — dependencies, providers,
    prop idioms — so that no contributor reintroduces it.

## Implementation Decisions

- **In-place rewrite**, not a fresh repository. The value being kept is Frame: tokens,
  stylesheets, DESIGN.md, and the workspace infrastructure. RAC was behavior plumbing
  and leaves completely. (ADR-0002)
- **Thin layer rule**: a Hashti component wraps its ui-sdk counterpart only when it
  adds API (variants, sizes, compound parts, icons); otherwise the ui-sdk component is
  re-exported and styled via its parts and state attributes.
- **Component inventory** is fixed by docs/component-inventory.md: canonical names
  (Separator not Divider, Accordion not Disclosure, SegmentedControl not
  ContentSwitcher, OtpInput, TokenInput, NumberInput, TimeInput, Command, Listbox,
  FileInput not Dropzone, HoverCard not PreviewTrigger), removals (Modal→Dialog,
  Sheet→Drawer, NavigationTree→Tree, GridList dropped, Table css-only), and additions
  (Calendar, DateInput, PasswordInput, HoverCard, Collapsible, Menu).
- **Attribute map before components**: one ticket produces the RAC→ui-sdk state
  attribute table and sweeps every stylesheet, so ten component tickets don't guess
  ten dialects. The map is also the porting contract for future framework packages.
- **Overlay consolidation**: two surfaces — Dialog (absorbs Modal; Hashti `size` and
  `backdrop` variants on top) and Drawer (absorbs Sheet; keeps a non-draggable desktop
  panel mode).
- **Theme without RAC**: a Hashti-owned context sets theme class, `dir`, and `lang` on
  the DOM root; ui-sdk reads direction from the DOM. RAC `I18nProvider` is deleted.
- **Token consolidation**: the token generator moves from the tokens package into the
  styles package, pruned to tokens stylesheets actually reference (usage oracle: the
  stylesheets; DESIGN.md must equal reality afterward). The tokens package is deleted.
- **Agent surface**: ui-sdk's agent system replaces `@hashti/agent`, which is deleted.
- **Per-ticket RAC removal**: RAC stays installed until the final cleanup ticket; each
  ticket lands green. The final ticket removes `react-aria-components` and
  `@internationalized/date` from the catalog. (Expand–contract.)
- **Contract-validation spike**: after Button lands, the same styled Button renders
  from a second framework against the unmodified stylesheet, proving the
  framework-agnostic CSS contract before the remaining tickets commit to it.
- **ui-sdk version**: pinned to 0.1.0-beta.6 for the rewrite's start; the beta.7 bump
  is gated by the release-age policy to 2026-11-20, with an inventory re-check against
  beta.7's shipped docs.
- **Playground frozen** during the rewrite; docs and Storybook are the verification
  surfaces and stay green.
- **Naming purge**: no Cinder, no Carbon lineage anywhere; the design system is Hashti.

## Testing Decisions

- **The seam is the rendered DOM and the stylesheet.** Tests assert on what a consumer
  or agent can observe: the `hashti-*` hook, ui-sdk part names and state attributes,
  keyboard interaction, and (in browser) computed styles — never on component
  internals.
- **Seams, highest first**: (1) Storybook stories are the per-component verification
  surface — every wrapped/re-exported component gets stories exercising its variants,
  sizes, and states; (2) existing browser tests (Playwright, `tests/browser`) catch
  interaction and RTL regressions at the page seam; (3) unit tests at the package
  boundary for anything with logic (initials, platform key symbols, token generation).
- **The attribute sweep is verified by grep + rendering**: after TICK-000b, no
  RAC-vocabulary attribute remains in the styles package, and Storybook states render
  correctly against ui-sdk-rendered attributes.
- **The spike is a screenshot comparison**: Button states in React vs the second
  framework, same stylesheet, including RTL.
- Prior art: the repo's existing `tests/unit`, `tests/browser`, and per-component
  Storybook stories; ui-sdk's own testing docs (`@ui-sdk/react` docs) for keyboard and
  ARIA expectations.

## Out of Scope

- A behavior-rich data grid (sorting, column resizing, load-more): Table ships
  css-only; GridList is dropped. Revisit as its own project on `@ui-sdk/core`.
- Vue, Svelte, Solid, and web component packages beyond the spike: the contract is
  proven, the packages come later.
- `apps/playground`: frozen until the rewrite completes.
- Deferred ui-sdk additions (ScrollArea, Rating, Resizable, Carousel, Menubar,
  Timeline, NavigationMenu): noted in the inventory, unscheduled.
- Any RAC compatibility: shims, prop aliases, deprecation paths — all explicitly
  rejected (ADR-0002).

## Further Notes

- `@ui-sdk/core/web.css` is a docs/Storybook base layer only; it never ships inside
  `@hashti/styles`. App entries layer it under Tailwind per AGENTS.md.
- The release-age policy is a hard gate: no fresh-release installs without the user's
  explicit say-so (TICK-015).
