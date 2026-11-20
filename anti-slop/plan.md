# Anti-slop plan: hashti-new

Audited 2026-11-20 with the anti-slop-audit skill, based on [Yuri Mikhin](https://github.com/mikhin)'s [10 anti-AI slop moves for frontend projects going faster than humans can review](https://evilmartians.com/chronicles/ten-anti-slop-moves-for-frontend-projects-going-faster-than-humans-can-review). The numbers below come from that run (probe at `$TMPDIR/anti-slop-probe/`, now gone — this file carries them). Each rollout step measures again before it starts. The steps themselves are in [todo.md](todo.md).

## Fit

Component library program, 1 author, ~400 commits in 2 days (rebuilt repo, `hashti-new`). The code is meant to outlive a quarter (a published-style component catalog with docs), readers include future contributors and docs consumers, and a bug in a shipped component CSS contract breaks every consumer. Full audit justified, but the codebase is small (281 source files, 40k lines, thin wrappers), so most counts are tiny. Vendored agent-skill assets (`.agents/`, `.claude/`) dominate every raw tool total and are excluded from all verdicts below.

## Stack

- bun monorepo; frameworks: Astro + React 19 (docs islands), TypeScript 7.0 via catalog
- linter: oxlint 1.94 (type-aware via tsrs backend); formatter: `bun fmt` (no Prettier)
- unit tests: bun test runner, **0 test files**; e2e: none
- API: none (6 `fetch` calls are docs-site internal) → move 1 n/a
- git hooks: lefthook 2.2 (pre-commit staged gates, pre-push full gates); agent hooks: none
- agent files: AGENTS.md (root, apps/docs); agents used: opencode (herdr terminals)
- CI: **none, and no git remote configured** — hooks are the only gate until a remote exists

## Variants

| Point                        | Chosen                   | Why, in this repo's numbers                                                                                           |
| ---------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Lint backlog                 | cleanup                  | Real-code counts are tiny (largest candidate set: 21 sonarjs hits in packages/react) — fix and promote in the same PR |
| Mutation testing in CI       | n/a                      | 0 test files, no Stryker runner for bun                                                                               |
| `exactOptionalPropertyTypes` | skip (count-gated fails) | 95 new errors (47 react, 48 docs), dominated by React props/framework types — the noisy case                          |
| react-doctor                 | report                   | 3 warnings total; a gate for 3 findings is overhead without a backlog to protect                                      |

## Assumptions

- Single developer, commits through lefthook on `dev`; no PR flow exists (0 PR merges), so "CI gate" means pre-push hook until a remote is added.
- The 13 `nameElsewhere` type exports (`BadgeProps`, `AvatarGroupProps`, …) are intentional public API of a component library, not dead code — knip gets an ignore, not deletions.
- `design/tokens.css` self-clones (358L at :574 <> :934) are the light/dark theme blocks — intentional, excluded from jscpd.
- tsgolint (tsrs backend) crashed once during the audit with a payload-parse error, then passed on rerun — flaky, watch it.

## Where the project stands

| #   | Move                        | Status   | Measured (real code, vendored excluded)                                                                                  | Verdict                                 |
| --- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 1   | API contract                | n/a      | no spec, no backend                                                                                                      | skip                                    |
| 2   | Strict TypeScript           | partial  | `strict`+`noUnused*`+`verbatimModuleSyntax` on; `noUncheckedIndexedAccess` 0 new errors; `exactOptionalPropertyTypes` 95 | adopt nUIA, skip eOPT                   |
| 3   | Linter as a behavior filter | partial  | sonarjs 21 (packages/react), jsx-a11y 38 (docs demos), effects 0, `no-non-null-assertion` 1, `no-explicit-any` 0         | triage sonarjs sample; skip preset      |
| 4   | Layer boundaries            | done-ish | 3 packages with clean one-way deps enforced by convention (AGENTS.md recipe)                                             | skip tooling                            |
| 5   | Scar rules                  | partial  | 2 default-override candidates with measured zero-cost (see below)                                                        | adopt as stylelint rules                |
| 6   | Rules in front of the model | partial  | AGENTS.md present; pre-commit covers all committing agents; no after-turn hook                                           | keep; trim at end                       |
| 7   | Mutation testing            | n/a      | 0 tests, bun runner unsupported by Stryker                                                                               | skip                                    |
| 8   | Dead code                   | partial  | knip: 146 "unused" files → 0 real (89 vendored + 57 MDX false positives); 1 real fileLocal export                        | adopt with config fix                   |
| 9   | Duplicates                  | partial  | logic clones 0 real; 1 real styles clone (dialog ↔ alert-dialog, 22L)                                                    | adopt jscpd script + gate on new clones |
| 10  | CI gate                     | missing  | all 5 check scripts exist, run only in pre-push; **no remote**                                                           | skip until remote                       |
| +   | react-doctor                | missing  | 3 warnings (badge, kbd, docs components)                                                                                 | adopt as report                         |

### Move 2 notes

`tsconfig.base.json` already has `strict`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`. Measured per workspace with CLI flags: `--noUncheckedIndexedAccess` → 0 errors (utils, react, docs) — one-PR adopt, never cheaper. `--exactOptionalPropertyTypes` → 47 (react) + 48 (docs) errors, React-props noise → skipped per the count-gated variant.

### Move 3 notes

Probe ran oxlint 1.94.0 = the installed version. Rules already at `error` in `.oxlintrc.json`: whole `correctness` + `suspicious` categories, `reportUnusedDisableDirectives`. Rules at `off` on purpose (documented in the repo handoff/AGENTS context): `react-in-jsx-scope` (react-jsx transform), `restrict-template-expressions` (breaks the guarded `hashti-x${className ? … : ""}` join pattern — 15 false positives), `jsx-a11y/anchor-has-content` (Link spreads children), `jsx-a11y/prefer-tag-over-role`. No rule sits at `warn`. The probe's all-warnings run found: sonarjs 21 in packages/react (sample before adopting anything — `no-nested-conditional` and `cognitive-complexity` are the signal rules; the vendored 334 are ignored), jsx-a11y 38 in docs demos (the wrapper-components setting already handles the control mappings; sample before promoting), effects 0 in real code despite 33 `useEffect` (docs islands legitimately set state after mount — expected for Astro islands).

### Move 8 notes (knip verification)

Raw: 146 unused files. Verified: 89 are `.agents/skills` (vendored, untracked-by-convention), 57 are `apps/docs` demo components imported **from MDX files** (`import { BadgeDemo } from "../../src/components/badge-demo"` in `content/docs/*.mdx`) — knip doesn't parse MDX, so these are false positives; the 2 "unused dependencies" (`@hashti/react`, `@ui-sdk/react` in apps/docs) are the same MDX cause. Real findings: 1 `fileLocal` export (`docsImageRoute` in `apps/docs/src/lib/shared.ts` — used in-file, drop `export`) and 13 `nameElsewhere` type exports = public API (keep, configure knip). Fix = knip config entries for MDX + ignores for vendored dirs, then knip reads true zero.

### Move 9 notes (jscpd verification)

All logic and component clones are vendored skill assets. Real: one styles clone, `packages/styles/src/alert-dialog.css:46` ↔ `dialog.css:46` (22 lines of shared dialog geometry — sibling components; read before merging into a shared block, low priority). `design/tokens.css` clones are theme-block duplication, excluded.

## When checks run

Seconds from the audit run (whole-repo, cold; changed-files runs faster).

| Moment                                       | Budget    | Checks (seconds here)                                                                   |
| -------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| Agent turn: after-turn hook                  | skipped   | none — single dev on opencode; pre-commit catches at commit                             |
| Pre-commit (lefthook, staged files)          | ~10 s     | existing: bun fmt --staged, oxlint staged, stylelint staged, per-workspace tsc          |
| Pre-push (lefthook — the gate; no CI/remote) | no budget | existing gates + **knip (7.2 s)** + **jscpd new-clones (6.8 s)** once at zero-backlog   |
| CI                                           | none      | skip: no git remote. When one exists: typecheck+lint+lint:css+format:check+test on push |
| Scheduled                                    | none      | none: 1 author reads own reports; react-doctor runs as an on-demand command             |
| Re-audit                                     | —         | after the last rollout step lands, or when a remote/CI is added                         |

## Scar rule candidates

| Incident or measured cost                                                                                                                                                      | What the rule matches                                                                                                                                                                      | Hits now (grep: an upper bound) | Message (what failed, why, what instead)                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------------------- |
| AGENTS.md:68 "Never: React DOM specifics, `:has(react-…)`" — framework-agnostic styles contract (default override)                                                             | stylelint `selector-disallowed-list` blocking `:has(` selectors referencing react; `declaration-property-disallowed-list` for inline-style-producing patterns is n/a (styles are CSS-only) | 0 (upper bound, grep)           | Styles must bind via `hashti-*` classes + ui-sdk data attributes only |
| 069 RTL audit found the codebase logical-property clean — guard the invariant before it erodes (default override, measured cost: a physical `margin-left` ships broken in RTL) | stylelint `declaration-property-disallowed-list`: `margin-left/right`, `padding-left/right`, `text-align: left/right`, `left`/`right` insets where logical exists                          | 0 (per 069 audit)               | Use logical properties (`margin-inline-start`, `inset-inline-*`)      |
| `pnpm-workspace.yaml` stray file — "harmless, never commit" (repo handoff); a `git add .` would ship it                                                                        | not a lint rule: add to `.gitignore`                                                                                                                                                       | 1 stray file                    | Bun monorepo — pnpm config is foreign here                            |
| b27365b toast spinner: reveal rule clobbered the spin `animation` — **no reliable static rule** (cross-rule cascade conflict)                                                  | —                                                                                                                                                                                          | —                               | skipped: not syntax-matchable; covered by rendered docs check         |

## Skipped

- **API contract (1):** no backend, no spec. Revisit if Hashti grows a server component.
- **`exactOptionalPropertyTypes`:** 95 React-props errors. Revisit if the packages grow heavy non-React-props logic.
- **sonarjs full preset:** 334 of 355 hits are vendored assets; adopting the preset buys config noise for a 21-hit real backlog. Cherry-pick after triage instead.
- **Layer boundaries (4):** three packages, one-way deps, enforced by the AGENTS.md recipe. Revisit when a 4th package or a state/API layer appears.
- **Mutation testing (7):** 0 tests, bun unsupported by Stryker. Revisit when the first test suite lands (the `join` helper test is the natural start) and logic grows beyond wrappers.
- **CI gate (10):** no git remote. Revisit the day a remote exists — every check script already exists, so it's one workflow file.
- **After-turn agent hook:** single-dev setup; pre-commit covers every committing agent.

## Log

- 2026-11-20 — audit run. Pre-audit fix already merged on `dev` (`5440cab`): `.claude` added to oxlint `ignorePatterns` (3,648 vendored errors → lint green). tsc section measured manually via workspace `tsc` CLI (bun's isolated `node_modules/.bun` layout hid typescript from the probe).
- 2026-11-20 — step 1, branch `chore/anti-slop-1-detectors`, commit `efca04c` (local mode, no remote). knip 146 unused files → 0 (config: workspaces + MDX-caused demo ignores); 11 unused exported types → 0 by re-exporting the prop types from the barrel instead of the plan's "named ignore for each" (deviation: re-export is the honest public-API fix and needs no ignore entries). jscpd: logic 0 clones; markup 8 CSS clones, all sibling popup-component geometry (alert-dialog/dialog/drawer/menu/popover, autocomplete/combobox) — known intentional pattern, report-only until step 9. react-doctor 3 warnings (unchanged, report-only). jscpd configs are strict JSON (its parser rejects JSONC), so the ignore reasons live here and in AGENTS.md, not inline. Latent bug fixed en route: lefthook typecheck jobs used `bun --filter react`/`utils`, which never matched `@hashti/react`/`@hashti/utils` — the jobs had never run since hooks landed. Two spurious knip hints remain (`**/.agents/**` "no matches", though the ignore works; root devDeps' catalog refs). Unverified on a real PR: nothing (no CI exists).
- 2026-11-20 — steps 2, 3, 5 (subagent, same branch): `d1e7099` docsImageRoute file-local (knip exit 0, typecheck green); `d69a34c` noUncheckedIndexedAccess on — 0 new errors as predicted, no fixes needed; `0568e4a` pnpm-workspace.yaml gitignored. All three Done-when conditions met.
- 2026-11-20 — step 4 (subagent, same branch): `3417644` stylelint guards at `error` — `property-disallowed-list` (physical margin/padding-left/right; plan said `declaration-property-disallowed-list`, which doesn't exist in stylelint 18 — same intent, correct rule name), `declaration-property-value-disallowed-list` (text-align left/right), `selector-disallowed-list` (`:has(` referencing react; 13 legitimate `:has(` usages verified quiet). Plant test: all three fire; `lint:css` green after plant removed.
- 2026-11-20 — steps 6+7 (subagent triage, read-only): sonarjs sample re-run — 21 hits, unchanged (16 `no-nested-template-literals` = the repo's guarded className-join idiom, already protected by the `restrict-template-expressions` off-decision; 4 `no-nested-conditional` = props-normalization chains in badge/kbd, correct and idiomatic; 1 `cognitive-complexity` = Badge 18 vs 15, marginal). **No rules adopted** — the two rules with hits are style-only on intentional idioms; `no-dead-store`/`super-linear-regex`/`no-nested-assignment`/`no-useless-assignment` have 0 real hits (audit counts were vendored-only). `cognitive-complexity` deferred: right tripwire when a package grows real logic beyond wrappers; adopting then means splitting Badge, not raising the threshold. Side finding: `sonarjs/unused-import` fires 10× in apps/docs `.astro` files — the documented template false positive, not a finding.
- 2026-11-20 — step 10 (subagent, same branch): `8f1dbf0` AGENTS.md trim, every deletion plant-proven (6-rule plant file, all fired, removed): hex-in-CSS half deleted (`color-no-hex` enforces), `:has(react-…)` item deleted from the Never list (`selector-disallowed-list` enforces), stale "No lint setup yet" line deleted (false claim). Kept: tokens-only half (no check sees raw non-color values — noted as convention), BEM naming line (check covers only the `^hashti-` prefix), React-DOM-specifics/inline-style/JS-in-CSS (unenforced), all workflow/architecture lines. apps/docs/AGENTS.md checked, nothing matching.
- 2026-11-20 — step 9 (subagent, same branch): `7c3f91f` pre-push gate — `deadcode` (plain knip, 0 issues) + `duplicates` via new script `duplicates:new` (`--baseline-from-ref dev --fail-on-new-clones`, both configs; the 8 known sibling-geometry CSS clones are baselined). Plant tests: knip fails on planted dead file, jscpd fails on planted clone ("Found 9 clones (1 new)"), both green after removal. Full `lefthook run pre-push` verified green EXCEPT the pre-existing `test` command: `bun test` with 0 test files exits 1 on bun 1.4.4 — the gate predates this step and has never been able to pass. Fix decided by orchestrator: write the first real test (`@hashti/utils` `join`, the natural target named in the repo handoff) rather than weakening the gate.
