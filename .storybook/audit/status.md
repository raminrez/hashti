# Storybook Workbench — audit ledger

storiesLocation: colocated

- **Co-located** component stories live in `packages/react/src/<component>/<Name>.stories.tsx`.
- `.storybook/stories/` holds setup proofs only (currently `CssCheck`), not component stories.
- All other skill output (discovery JSON, audit findings, wrappers) stays under `.storybook/`.

## Pipeline status

- [x] `sb-setup` — Storybook 10.6.8 installed with bun; native setup prompt run; preview aligned to Hashti tokens/theme; CssCheck story added.
- [ ] `sb-inventory` — next; needs `.storybook/project-inventory.json`.
- [ ] `sb-health`
- [ ] `sb-flows`
- [ ] `sb-stories <Component>`
- [ ] `sb-wrappers`
- [ ] `sb-audit`
