# Task: Storybook Documentation & Brand Overhaul for Hashti Design System

## Goal

1. Build comprehensive Storybook documentation pages:
   - `apps/storybook/stories/01-Introduction.mdx`
   - `apps/storybook/stories/02-Installation.mdx`
   - `apps/storybook/stories/03-Contribution.mdx`
2. Enable Storybook Autodocs (`tags: ['autodocs']`) across all component stories with concise, useful component descriptions and usage guidelines.
3. Update Storybook configuration (`main.ts`, `preview.tsx`) to brand Storybook for Hashti (`hashti-storybook.raminrez.dev`), purge all `@cinder/*` references, and ensure smooth integration.

---

## 1. Documentation MDX Pages in Storybook

Create the following rich documentation pages in `apps/storybook/stories/`:

- `01-Introduction.mdx`:
  - Meta title: `Getting Started/Introduction`
  - Welcome to **هشتی Hashti Design System** (`hashti-storybook.raminrez.dev`).
  - The Iranian architectural portal concept (Hashti octagonal transitional vestibule, concentric arches).
  - Modern aesthetic: zero Carbon squareness, pure monochrome `#000000`/`#FFFFFF` with Persian turquoise, amber, and terracotta glazes.
  - Core principles: WAI-ARIA (RAC 1.22.1), Zero-Runtime scoped CSS, Compound composition ergonomics.
- `02-Installation.mdx`:
  - Meta title: `Getting Started/Installation`
  - Package installation: `bun add @hashti/react @hashti/tokens` or `npm install @hashti/react @hashti/tokens`.
  - CSS setup: Importing `@hashti/react/styles.css`.
  - Theme provider and direction setup (LTR & RTL support with Vazirmatn).
- `03-Contribution.mdx`:
  - Meta title: `Getting Started/Contribution`
  - Monorepo anatomy: `packages/react/src/components/<component>/` (HeroUI v3 architecture).
  - Component authoring checklist: Component TSX, scoped CSS, colocated Storybook story with play function tests, and unit tests.
  - Submitting changes and testing guidelines (`bun test`, `bun run check`).

---

## 2. Storybook Autodocs & Component Descriptions

- In `apps/storybook/.storybook/main.ts`:
  - Enable docs: `docs: { autodocs: 'tag' }`
  - Update stories glob: `stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)", "../../packages/react/src/components/**/*.stories.@(ts|tsx)"]`
- In every component story file:
  - Add `tags: ['autodocs']` to `meta`.
  - Add `parameters: { docs: { description: { component: "..." } } }` describing the component's purpose, key features, and RAC role.

---

## 3. Brand & Config Purge

- In `apps/storybook/package.json`:
  - Rename to `@hashti/storybook`.
  - Replace `@cinder/react` and `@cinder/tokens` with `@hashti/react` and `@hashti/tokens`.
- In `apps/storybook/.storybook/preview.tsx`:
  - Brand theme title: "Hashti Design System".
  - Configure theme and canvas backgrounds.

---

## 4. Verification Gates

1. `bun run typecheck:storybook` must pass with 0 errors.
2. `bun run build:storybook` must build successfully.
3. Commit with descriptive semantic commit message (`feat(storybook): add Hashti docs pages, autodocs, and brand configuration`).
