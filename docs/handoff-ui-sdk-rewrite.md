# Continue the ui-sdk rewrite

Snapshot: 18 November 2026. Continue on `rewrite/migrate-from-rac-to-ui-sdk`.
The user confirmed that this branch, including its uncommitted changes, is the
rewrite's working state. No other branch or worktree needs merging to resume it.

This handoff accompanies a WIP checkpoint of the 71 previously staged files
(4,320 insertions / 4,725 deletions). Its parent is
`8e54452e1d2d94fa55a9d49d9cbadb832a2c20b6`. Those edits were already present;
the handoff session inspected and preserved them without changing implementation.
The user authorized committing with `-n`; this checkpoint is not a claim that
the tickets or overall rewrite pass all acceptance checks.

## Read first

1. `AGENTS.md` — absolute prohibition on RAC compatibility APIs and patterns.
2. `docs/adr/0002-full-rewrite-from-rac-to-ui-sdk.md` — accepted architecture.
3. `docs/component-inventory.md` — approved scope, canonical names, decisions log.
4. `docs/attribute-map.md` — shared DOM/state styling contract.
5. `.tickets/README.md` and the relevant ticket, interpreted using the caveats below.
6. `DESIGN.md` for visual authority; `.agents/skills/ui-sdk/SKILL.md` and the
   installed ui-sdk docs before implementing components.

`docs/spec-rac-to-ui-sdk-rewrite.md` provides the larger implementation specification.
Some relative links in existing specs are stale; the paths above are correct.

## Architecture that is actually active

Only ADR-0002 is active. ADR-0001 is explicitly superseded. Rewrite all behavior on
`@ui-sdk/react` / `@ui-sdk/core`, with standard props (`onClick`, `disabled`,
`checked`, `open`) and ui-sdk naming. There are zero external consumers, so do not
keep RAC shims or resurrect retired names.

`@hashti/styles` owns all tokens and component CSS for future React, Vue, Svelte,
Solid, and Web Component bindings. React wraps only where Hashti adds API; otherwise
it re-exports. Preserve `hashti-*` hooks, ui-sdk state attributes, logical CSS,
Frame light/dark themes, and Persian/Arabic RTL.

The old `packages/tokens` pipeline has moved into `packages/styles`.
`packages/react/src/styles.css` forwards to `@hashti/styles`; duplicate React CSS
was removed during the contract spike. App entry points load ui-sdk's `web.css`
as documented in AGENTS.md; it must not ship inside the styles package.

`packages/agent` must eventually be deleted in favor of ui-sdk's native agent
surface. It still exists and is built today: that is unfinished migration work,
not a reason to follow ADR-0001. `apps/playground` stays frozen during the rewrite;
docs and Storybook are the ongoing verification surfaces.

## Completed in commits before this checkpoint

The ticket roadmap marks 11 of 17 named tickets done. This is recorded progress,
not independent proof of every acceptance criterion:

| Tickets | Result | Implementation commit |
| --- | --- | --- |
| 000 | Approved component inventory and rename/removal decisions | `7661e08` |
| 000b | Attribute map, CSS sweep, token pipeline moved into styles | `dde1587` |
| 014 | Cinder/Carbon lineage purge | `d54c550` |
| 001, 012 | Separator, presentational batch, RAC-free Theme | `e1423ab` |
| 002 | Button, Link, Toggle, Breadcrumbs | `599ecff` |
| 013 | Same Button stylesheet in React and Web Components | `997d2f3` |
| 003, 004, 005, 007 | Toolbar/SegmentedControl; selection controls; fields and inputs; Dialog/Drawer/Popover | `b40f66c` |

TICK-005 expanded to include Field, Input/TextArea, NumberInput, OtpInput,
SearchField, FileInput, TimeInput, Meter, Pagination, Progress, Slider, and initial
DateInput re-exports. Some source directory names still use the old terminology.

The contract spike report (`docs/spike-button-report.md`) records zero pixel
difference across tested React/Web Component Button states, themes/RTL evidence,
and the fix for duplicate CSS. Those historical captures were not rerun during
this handoff. Its recommendation to delete `apps/spike-button` has not been
carried out; generated JS and screenshots remain tracked there.

## Work preserved in this WIP checkpoint

| Ticket | Existing changes | Status to use when continuing |
| --- | --- | --- |
| 006 | Select, Listbox, ComboBox, Autocomplete re-export, TokenInput, Command; stories, unit tests, exports, CSS | Substantial implementation present; review behavior and acceptance before marking done |
| 008 | Tooltip and Toast implementation, Tooltip stories, related callers/tests | Implementation present; review queue/timers, announcements, keyboard/hover, portal behavior, visuals |
| 009 | Tabs and Accordion replacing Disclosure, CSS, docs demos, stories, tests | Individual ticket says DONE, roadmap still unchecked; reconcile after verification |

The checkpoint also includes shared stylesheet updates, AGENTS.md overlay/SSR CSS
caveats, and Storybook/browser-test caller updates. Old `command-palette/`,
`token-field/`, `list-box/`, and `disclosure/` React directories are replaced by
`command/`, `token-input/`, `listbox/`, and `accordion/`.

## Fresh verification on this exact implementation

Bun 1.4.4 was available. These commands were run during handoff:

| Command | Observed result |
| --- | --- |
| `git diff --cached --check` | Passed for the original staged changes |
| `bun run build:packages` | Passed; builds styles, agent, React |
| `bun run build:storybook` | Passed; output `dist/storybook` |
| `bun run test` | 150 pass, 2 fail, 152 tests across 24 files; same failures on repeat |
| `bun run typecheck` | Main check passed for 225 files; Storybook typecheck failed |
| `bun run lint` | Failed in source/stories, vendored skill scripts, and generated spike JS |

Failures to carry forward:

- `tests/unit/advanced-collections.test.tsx`: GridList selection-checkbox and
  drag-handle assertion. GridList is scheduled for deletion in TICK-010; do not
  rebuild it just to satisfy a superseded scope.
- `apps/storybook/.storybook/watch-packages.test.ts`: “Vite resolves public CSS
  after a missing build output is restored” aborts after its 3-second watcher
  timeout. Root cause is unconfirmed; it may depend on environment/file watching.
- Storybook TS2339: `ChildProcess.emit` missing at test lines 45/50/56/66 and
  `ChildProcess.once` missing at watcher lines 47/48.
- Lint includes unused imports/parameters in Tree, Drawer, text-field and Field;
  accessible-name rules on render-to-anchor uses in Button stories/Link;
  many errors in `apps/spike-button/public/*.js` and `.claude/skills/impeccable`.

No browser suite, docs build, formatting check, package verification, or full
`bun run check` was run in this handoff. A successful package/Storybook build does
not prove accessibility, RTL, or interaction acceptance for these WIP components.

## Remaining work and stale instructions

1. Review/finish 006, 008, 009, with behavioral/browser and theme/RTL verification;
   reconcile ticket statuses. Do not rewrite them from scratch.
2. TICK-010: ui-sdk Tree, absorb NavigationTree sections/headers, delete GridList,
   make Table semantic and CSS-only. Its individual ticket is stale: it still
   asks for GridList and behavior-rich grid Table. Follow the approved inventory.
3. TICK-016: Calendar/DateInput/DatePicker, PasswordInput, HoverCard replacing
   PreviewTrigger, Collapsible, Menu; resolve ColorPicker part coverage and
   OverflowMenu composition using installed ui-sdk docs. The file's heading
   incorrectly says TICK-014; the filename and roadmap designate TICK-016.
4. TICK-015: beta.7 upgrade is recorded as time-gated until **2026-11-20**.
   Current catalog uses `^0.1.0-beta.6`; lockfile resolves core/react/web to beta.6.
   Earlier work proceeded on beta.6 despite the roadmap's “before TICK-002” text.
   Preserve the lockfile with `bun install --frozen-lockfile`; when eligible,
   verify the selected release and recheck its docs/exports/attribute contract.
5. Final cleanup: remove `packages/agent`, RAC exports/imports/helpers/dependencies,
   `@internationalized/date` per the approved plan, and stale callers/docs/build
   wiring; achieve `bun run check` green.

RAC remains in React's barrel exports, `utils.ts`, legacy `field-anatomy.tsx`,
Color, GridList, Tree, NavigationTree, Table, DatePicker, several stories/demos,
and package manifests. AgentContract still imports `@hashti/agent`.
Installation guides and many MDX examples still teach RAC APIs.

`PRODUCT.md` still mentions keeping public API stability and `@hashti/agent`;
`DESIGN.md` contains historical RAC implementation notes. Their older migration
language does not override ADR-0002 or AGENTS.md. Several individual tickets have
obsolete docs paths, fixed “183 tests” counts, or RAC-era state-attribute examples.
Use the approved inventory, canonical attribute map, and installed component docs.

## Git and machine transfer

Before the checkpoint, HEAD was `8e54452` and the refreshed remote rewrite branch
was `f4b70b3`: 19 local-only commits, no remote-only commits. This WIP checkpoint
adds one more local commit. A normal remote clone will not contain this work
unless it has subsequently been pushed.

The original origin URL uses a machine-specific SSH alias:
`git@github-raminrez:raminrez/hashti.git`. Configure your own GitHub access on the
new machine. The transfer bundle contains this branch and all its ancestors;
it does not require access to the old machine or the remote.

Copy `hashti-rewrite-transfer-2026-11-18.tar.gz` to the new machine and run:

```sh
tar -xzf hashti-rewrite-transfer-2026-11-18.tar.gz
git clone -b rewrite/migrate-from-rac-to-ui-sdk hashti-rewrite-transfer-2026-11-18/repository.bundle hashti
cd hashti
git remote set-url origin git@github.com:raminrez/hashti.git
git status --short --branch
bun install --frozen-lockfile
bun run build:packages
```

Use Bun 1.4.4 (declared in package.json). Browser checks additionally need the
Playwright browser setup expected by `tests/browser`. `bun run storybook` and
`bun run docs` start the two active review surfaces.

Other worktrees are historical context, excluded from this transfer by scope:
the old playground worktree is clean; the Divider branch has an older separate
commit (its feature was later reimplemented on the rewrite); the old Button
worktree has 5 dirty files containing obsolete compatibility shims; the detached
homepage prototype has 4 untracked prototype files. There is also an old main
stash. None should be applied to the rewrite automatically.

## Prompt for the new session

> Continue Hashti's pure ui-sdk rewrite on rewrite/migrate-from-rac-to-ui-sdk.
> Read docs/handoff-ui-sdk-rewrite.md, AGENTS.md, ADR-0002, the component inventory,
> and the attribute map first. This branch includes the preserved WIP for
> TICK-006/008/009; inspect and finish it before starting over or marking it done.
> Follow the approved inventory over stale individual ticket criteria. Start by
> confirming the recorded test/typecheck failures and reviewing the WIP acceptance
> gaps, then continue with TICK-010/016, the date-eligible TICK-015 upgrade, and
> final RAC/agent removal. Keep the playground frozen; use docs and Storybook.
