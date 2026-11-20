# Ramin

## Fri Nov 20, 2026

- README rewritten for the wrapper architecture — stale `@hashti/core` rows and
  the old `definePrimitive` recipe out
- oxlint now ignores vendored `.claude` assets like `.agents`; lint was red
  with 3,648 vendored errors
- anti-slop audit (Evil Martians probe) — plan in `anti-slop/`, then rolled out
  all 11 steps through sub-agents
- knip down to zero: MDX-imported demo components configured away, one dead
  export dropped
  **I decided:** re-export the prop types (`BadgeProps`, `AvatarGroupProps`, …)
  from the barrel rather than add ignore entries — they are the public API
- `noUncheckedIndexedAccess` on — zero new errors, free strictness
- stylelint guards: physical `margin-left`/`padding-right`/`text-align: left`
  banned, `:has(react…)` selectors banned — both plant-proven
- sonarjs triaged: adopted nothing — all 21 real hits were the repo's own
  className-join idiom
  **I decided:** react-doctor stays report-only; two findings kept with reasons
  (kbd index key on a static list, field-demo preventDefault on purpose)
- first test suite: `join` in `@hashti/utils`
  **why:** bun test with zero files exits 1, so the pre-push test gate could
  never pass — wrote the test instead of weakening the gate
- pre-push gate: knip + jscpd new-clones vs `dev`; AGENTS.md trimmed to what no
  check enforces, every deletion plant-proven
- react-doctor installed through its own installer; kept the CI workflow
  dormant, dropped its per-package `doctor` script
  **why:** the installer's script drops the release-age and privacy flags the
  root script carries
- merged the anti-slop branch to dev, 12 commits
- handoff cleanup list done via sub-agents: shadow token, roadmap archived,
  `DrawerHandle` re-exported, textarea inline-completion variant
- found why every component rendered unstyled: stylelint's autofix rewrote
  the css imports and Vite silently dropped the whole layer
  **I decided:** rendered checks must assert a computed style, not just class
  names — the regression passed every cycle check invisibly

_Postponed: CI workflow + scheduled react-doctor until a git remote exists_
_Postponed: handoff cleanup list — segmented-control rgba shadow, Textarea
inline-completion variant, DrawerHandle re-export, roadmap archive note_
