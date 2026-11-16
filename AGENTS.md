# Agent notes

House rules live in `DESIGN.md` (visual authority) and `PRODUCT.md` (references). This file
records what each agent re-learns the hard way about building Hashti components.

## UI-SDK and Styling ground truth

Hashti has migrated styling into `@hashti/styles`.

### Building components with @ui-sdk

- Use `@ui-sdk/core` (`definePrimitive`) and `@ui-sdk/react` for component primitives and behavior.
- Emphasize the standard HTML/DOM contract: `.hashti-<component>`, `data-variant`, `data-size`, `data-state`, and native RTL with logical CSS properties.
- `@hashti/agent` is retired in favor of native `ui-sdk` agent capabilities.

### Composition and CSS

- Keep class names structured around `.hashti-<component>` adhering to the standard DOM contract.
- Use logical CSS properties for native RTL support.
- Avoid proprietary wrappers when `ui-sdk` primitives cover the requirement.

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it is installed, and read
`node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, also search
`node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.
