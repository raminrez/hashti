# Hashti

A design system for the web: the **Frame** visual language, headless interaction
primitives from ui-sdk, and framework-agnostic styles — with first-class RTL
support for Persian and Arabic.

Pre-release. The React package is migrating from React Aria Components to
`@ui-sdk/react`; see [the rewrite specification](docs/spec-rac-to-ui-sdk-rewrite.md)
and the ticket queue in `.tickets/`.

## Packages and apps

- `packages/styles` — `@hashti/styles`: tokens, themes, and per-component CSS.
- `packages/react` — `@hashti/react`: React components on ui-sdk behavior.
- `packages/agent` — `@hashti/agent`: agent-operability surface (registry, `snapshot`/`act`/`query`).
- `apps/docs` — documentation site. `apps/storybook` — component workbench. `apps/playground` — agent-surface sandbox.

## Quickstart

```sh
bun add @hashti/styles @hashti/react
```

```tsx
import { Button, Theme } from "@hashti/react";
import "@hashti/styles";

export function Example() {
  return (
    <Theme theme="light">
      <Button variant="primary">Save</Button>
    </Theme>
  );
}
```

## Develop

Use Bun **1.4.4** (pinned in `.bun-version` and `package.json`):

```sh
bun install --frozen-lockfile
bun run storybook     # component workbench
bun run dev           # documentation site
bun run check         # format, lint, types, tests, builds, package verification
```

Tokens are authored in `packages/styles/src/tokens/tokens.json`; run
`bun run build:tokens` after editing to regenerate the distributed CSS.
Linting uses Oxlint, configured in `.oxlintrc.json`, with a small set of
intentional accessibility-rule exceptions recorded there.

## Read next

- [DESIGN.md](DESIGN.md) — visual authority: tokens, geometry, motion.
- [PRODUCT.md](PRODUCT.md) — product commitments and scope.
- [GLOSSARY.md](GLOSSARY.md) — shared vocabulary.
- [docs/attribute-map.md](docs/attribute-map.md) — state-attribute contract for the rewrite.
- [docs/component-inventory.md](docs/component-inventory.md) — per-component migration dispositions.

## License

[Apache-2.0](LICENSE), with [upstream attribution](NOTICE).
