# Storybook Workbench — audit ledger

storiesLocation: colocated

- **Co-located** component stories live in `packages/react/src/<component>/<Name>.stories.tsx`.
- `.storybook/stories/` holds setup proofs only (currently `CssCheck`), not component stories.
- All other skill output (discovery JSON, audit findings, wrappers) stays under `.storybook/`.

## Pipeline status

- [x] `sb-setup` — Storybook 10.6.8 installed with bun; native setup prompt run; preview aligned to Hashti tokens/theme; CssCheck story added.
- [x] `sb-inventory` — done; `.storybook/project-inventory.json` + component-usage + component-pages; ProjectInventory wrapper scaffolded.
- [x] `sb-health` — done; `.storybook/design-system-health.json` written (0 errors / 9 warnings / 433 info); DesignSystemHealth wrapper scaffolded; vendored script patched for BSD-grep `--` bug.
- [x] `sb-flows` — next.
- [x] `sb-stories` — batches A (16) + B (16) in progress/parallel branches
- [ ] `sb-wrappers` — next
- [ ] `sb-audit`
