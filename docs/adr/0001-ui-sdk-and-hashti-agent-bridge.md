# Use ui-sdk for net-new components, and a hashti-owned agent bridge for React Aria components

Status: accepted, 14 November 2026

Cinder's 49 components are built on React Aria Components and rely on the approved Frame contract
(semantic tokens, one stylesheet import, `hashti-*` hooks, 44px controls). Rebuilding them on ui-sdk
would discard that contract for a pre-1.0 dependency, so ui-sdk is confined to components Cinder does
not ship (carousel, resizable, hover card, timeline, rating, segmented control, scroll area,
waterfall, menubar), pinned to an exact version and kept out of `@hashti/react` peer dependencies.

Agent operability is nevertheless a product requirement for Cinder's own components, and ui-sdk's
bridge only discovers primitives created by `definePrimitive` — React Aria components are invisible to
it. Cinder therefore ships an agent surface of its own: a registry hook for state and actions, DOM
marks for labels and permissions, and a separate `@hashti/agent` package that implements
`snapshot` / `act` / `query` and registers WebMCP tools with the same contract and the same defaults
as ui-sdk, so one model prompt works against both.

## Considered Options

- **Phantom primitives** — a zero-size `definePrimitive` twin per component reusing ui-sdk's bridge.
  Rejected: duplicated state, invisible DOM, and no guarantee the primitive can bind to an
  RAC-rendered element.
- **Migrating agent-critical components to ui-sdk** — contradicts the Frame contract and React Aria
  versioning.
- **New components only** — leaves 49 components opaque, which fails the requirement.

## Consequences

- Change callbacks gain a second argument, `details` (`source`, `reason`, `cancel()`). Additive, but
  every component that reports a change must pass it.
- Components import `useAgentSurface` from `@hashti/agent` and register themselves on mount. There is
  no DOM observation and no bridge inside the library, but `@hashti/react` now depends on
  `@hashti/agent`; that dependency stays external in the package build, because two copies mean two
  registries and an empty snapshot.
- Agent-driven changes reach the consumer's `onChange`. The component owns the value the consumer
  does not pass: an uncontrolled `TextField` or single `Select` repaints on an agent write, so a
  write is visible on screen, not only in the snapshot. A controlled component stays in the
  consumer's hands: the agent writes through `onChange`, and the screen follows the consumer's
  state, as it does for a person.
- Two behavior engines coexist. `web.css` never enters the library; it is confined to `apps/playground`.
- The `agent` surface in ui-sdk is documented as experimental, so the shared contract may change
  under us. The metadata hook and marks are ours and can outlive ui-sdk's shape.