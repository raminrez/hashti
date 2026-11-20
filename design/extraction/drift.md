> **ARCHIVED 2026-11-20 — imported from ancestor repo (hashti-next); describes an implementation shape (packages/tokens, Storybook, docs/verification.md) that no longer exists here. Treat as historical record.**

# Drift report — 2026-11-19

## 1. Commits since 2026-11-05 (whole repo)

149 commits, 2026-11-05 → 2026-11-19. Volume by day:

| Day   | Commits |
| ----- | ------- |
| 11-05 | 1       |
| 11-06 | 21      |
| 11-07 | 5       |
| 11-08 | 10      |
| 11-09 | 14      |
| 11-10 | 4       |
| 11-11 | 45      |
| 11-12 | 9       |
| 11-13 | 27      |
| 11-14 | 7       |
| 11-19 | 6       |

What changed, in arcs:

- **Cinder → Hashti rebrand** (11-05/06): repo-wide rename to `@hashti/react` + `@hashti/tokens`, Carbon traces purged from catalog and Storybook, modular component re-architecture, docs consolidated into one Astro/Fumadocs app (`apps/docs`). 91 stub stories/tests deleted, `cinder` → `hashti` class names.
- **CSS architecture split** (11-11): per-component stylesheets plus a guard that enforces them; dead `color.css` removed; cascade layer order declared before component CSS.
- **Field module** (11-11): single anatomy module, standalone field parts, ten fields on it.
- **Verification harness** (11-11): one harness replacing six throwaway Playwright scripts.
- **Component quality sweep** (11-13): 30 reported defects fixed by four agents; dark overlays/disabled/selection follow tokens; wide table scroll fix; motion named per property; reduced-motion and press states.
- **Landing + brandbook** (11-12/13): landing page rebuilt from Hashti components, Astryx motion ladder, brandbook cards.
- **Design system extraction** (11-19, today): `25575f6` extracts Hashti design system from Carbon; `fb9f065` adds design-system audit + theme consolidation plan.
- **Storybook 11** (11-19): `cf649b0` workflow + skills, `f5a8133` build compatibility fix, fresh verification screenshots.
- **Agent tooling** (11-19): agent-browser skill docs; `.impeccable/` design.json added.

## 2. Storybook stories

72 files under `apps/storybook/stories/`. Components:

ActionableNotification, AILabel, Alert, AlertDialog, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, CodeSnippet, ColorPicker, ComboBox, CommandPalette, ContentSwitcher, Contribution (doc page), DatePicker, Dialog, Disclosure, Divider, Drawer, DropZone, EmptyState, FieldStatus, FileUploader, Form, GridList, Header, InputOTP, Installation (doc page), Introduction (doc page), InlineNotification, Kbd, Layout, Link, ListBox, Loading, Menu, Meter, Modal, NativeSelect, NavigationTree, NumberField, Pagination, Popover, PreviewTrigger, ProgressBar, ProgressCircle, ProgressIndicator, Radio, SearchField, Select, Settings, Sheet, SideNav, Slider, StructuredList, Switch, Table, TableBatchActions, Tabs, Tag, TextArea, TextField, Tile, TimeField, Toast, TokenField, Toolbar, Tooltip, Tree.

Only 3 are doc pages (Introduction, Installation, Contribution); 69 are component stories.

## 3. frame.css — path corrected

`apps/docs/src/prototypes/frame.css` **does not exist**. `apps/docs/src/` has no `prototypes/` dir at all (only components, content.config.ts, layouts, lib, pages, styles).

The live file is `packages/react/src/frame.css`. Verdict: **not a dated reference** — it is current and maintained:

- zero `cinder` references (fully migrated to `hashti`)
- uses the current `@layer hashti.themes` + `@scope` scoping with `--hashti-*` tokens throughout (`--hashti-control-radius`, `--hashti-body-compact-01-*`, `--hashti-spacing-0N`)
- last touched 2026-11-13 by `ea23d8e` (notification variant unification) and the quality sweep

So nothing to clean up; the prototype path in the task brief is just stale. Stale copies exist in `.worktrees/tick-001-divider` and `.worktrees/tick-002` (leftover worktrees, both with a second `packages/styles/src/frame.css` variant).

## 4. `.impeccable/design.json`

31.6 KB, `schemaVersion: 2`, title `Design System: Hashti — Frame`, generated `2026-11-06T18:55:48Z`. Six top-level keys: `schemaVersion`, `generatedAt`, `title`, `extensions`, `components`, `narrative`.

**Components: 8 entries** (each: name, kind, refersTo?, description, html, css)

1. Primary action
2. Outlined alternative
3. Quiet action
4. Guided field
5. Attached recovery
6. Current navigation
7. Review status (no `refersTo`)
8. Grouped form surface

**Shadows (1):**

- `popover` — `0 8px 24px rgb(0 0 0 / 14%)`

**Motion (8):**

- `duration-fast-01` 130ms
- `duration-fast-02` 175ms
- `duration-moderate-01` 230ms
- `duration-moderate-02` 310ms
- `duration-slow-01` 410ms
- `ease-standard-productive` cubic-bezier(0.2, 0, 0.38, 0.9)
- `ease-entrance-productive` cubic-bezier(0, 0, 0.38, 0.9)
- `ease-exit-productive` (cubic-bezier, exit variant)

Also present: `extensions.colorMeta`, `typographyMeta`, `breakpoints`; `narrative` has northStar, overview, keyCharacteristics, rules, dos, donts.
