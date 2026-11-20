# Anti-slop TODO: hashti-new

The rollout steps of [plan.md](plan.md), one PR each, in order. The anti-slop-rollout skill takes the first unchecked one. The numbers, the reasoning, and the history are in the plan.

Backlog variant: **cleanup** — counts are tiny, so each rule lands fixed-to-zero and promoted to `error` in the same PR; the rollout ends with no rule at `warn`. There is no CI: the pre-push lefthook hook is the gate.

- [x] **1. Commit the plan and wire the detectors as commands**: make the audit's numbers reproducible.
  - Changes: commit `anti-slop/plan.md` + `anti-slop/todo.md`; `knip.jsonc` (or the `knip` block in root `package.json`): add MDX entry/parse config so `apps/docs/content/docs/**/*.mdx` imports count (kills the 57 demo false positives + 2 dependency false positives), ignore `.agents/`, `.claude/`, `design/`; add root scripts `deadcode` (`bunx knip`), `duplicates` (`bunx jscpd` with `--ignore` for `.agents/**`, `.claude/**`, `design/tokens.css`, minimum-tokens tuned so the real codebase reads clean), `doctor` (`npx -y --min-release-age=7 react-doctor@latest --no-telemetry --no-supply-chain`); list the three commands in AGENTS.md.
  - Commands: `bun run deadcode`, `bun run duplicates`, `bun run doctor`
  - Done when: knip reports only the 13 intentional public-API type exports (+ a named ignore for each), jscpd reports 0 real-code clones, react-doctor reports its 3 warnings; all three commands recorded in AGENTS.md
  - Depends on: none
- [x] **2. Drop the one real dead export**: `docsImageRoute` in `apps/docs/src/lib/shared.ts` is used only in-file.
  - Changes: remove `export` from `docsImageRoute` (keep the const; `getImageUrl` uses it)
  - Commands: `bun run deadcode`
  - Done when: knip's unused-exports list no longer names it; `bun run typecheck` green
  - Depends on: step 1
- [x] **3. Turn on `noUncheckedIndexedAccess`**: measured 0 new errors across utils/react/docs — free strictness.
  - Changes: `"noUncheckedIndexedAccess": true` in `tsconfig.base.json`
  - Commands: `bun run typecheck` (raw, never via rtk)
  - Done when: typecheck green in all 3 workspaces with the flag on
  - Depends on: none
- [x] **4. Stylelint guard rules for the styles contract** (scar/default-override candidates, both measured at 0 hits): physical-property ban + `:has(react` selector ban.
  - Changes: `stylelint.config.mjs`: `declaration-property-disallowed-list` (`margin-left`, `margin-right`, `padding-left`, `padding-right`, `text-align` values `left`/`right`) and `selector-disallowed-list` (regex blocking `:has(` selectors referencing react) — both as `error` with messages pointing at logical properties / the class contract; add to AGENTS.md's framework-agnostic section only if not already implied
  - Commands: `bun run lint:css`
  - Done when: `lint:css` green at 0 hits; a planted `margin-left: 4px` in a `packages/styles/src/*.css` scratch file fails it
  - Depends on: none
- [x] **5. Ignore the stray `pnpm-workspace.yaml`**: the handoff says "never commit"; make that mechanical.
  - Changes: add `pnpm-workspace.yaml` to `.gitignore`
  - Commands: `rtk git status` (file disappears from untracked)
  - Done when: `git status` no longer lists it
  - Depends on: none
- [x] **6. Triage the sonarjs sample in packages/react** (21 hits at audit): read all 21, classify real bug vs noise.
  - Changes: none from this step itself — it decides step 7's rule list
  - Commands: `bunx oxlint -A all -D sonarjs packages/react`
  - Done when: a list in the plan Log: per rule, hits, real/noise verdict
  - Depends on: step 1 (scriptability helps but raw oxlint works)
- [x] **7. Adopt the sonarjs rules that earned it** (from step 6's verdicts): fix to zero and promote in the same PR; rules that were all noise get skipped with the count in the Log. Expected candidates from the audit split: `no-nested-conditional`, `cognitive-complexity` (refactor-heavy — own PR if >~5 functions), `no-dead-store`, `super-linear-regex`.
  - Changes: `.oxlintrc.json` rules + the fixes
  - Commands: `bun run lint`
  - Done when: each adopted rule at `error` with 0 hits; a planted hit fails lint
  - Depends on: step 6
- [x] **8. Fix the 3 react-doctor warnings** (badge, kbd, docs components — read each before fixing; report variant, no gate): verify each is real, fix or document why not.
  - Changes: the named components
  - Commands: `bun run doctor`
  - Done when: `bun run doctor` reports 0 findings, or the Log names each kept finding with its reason
  - Depends on: none
- [x] **9. Wire knip + jscpd into the pre-push gate**: both at zero backlog after steps 1–2, so plain runs gate.
  - Changes: `lefthook.yml` pre-push: `deadcode` and `duplicates` commands
  - Commands: `git push` (dry-run against no remote fails — verify with `lefthook run pre-push`)
  - Done when: `lefthook run pre-push` runs both green; a planted dead file or clone fails it
  - Depends on: steps 1, 2, and 7's rules at zero (jscpd needs its config finalized in step 1)
- [x] **10. Trim the agent rules file**: delete every AGENTS.md line a check now enforces (hex-in-CSS, selector patterns, logical properties, framework-agnostic CSS bans — each now a stylelint/oxlint error), so the file only says what no check can. Keep `anti-slop/` until the re-audit confirms the gates hold.
  - Changes: AGENTS.md (root); list each deleted line next to the check that replaced it in the Log
  - Commands: none
  - Done when: no line restates a check that blocks; a plant of each deleted rule still fails its check
  - Depends on: steps 4 and 7
- [x] **11. Re-audit**: after the last step lands, or the day a git remote is added (then: CI workflow running typecheck+lint+lint:css+format:check+test becomes the deferred move-10 step, and react-doctor gets a scheduled `@latest` run). Update plan numbers, review ignore lists and rules that caught nothing.
  - Depends on: step 10
