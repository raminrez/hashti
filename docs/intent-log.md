# Intent log

What we worked on, day by day, tagged with the PRs it produced. One short list
a day per person.

Composed from `docs/intent/` by `compose.rb`; edit your own file there, never
this one.

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
  **why:** bun test with zero files exits 1 — wrote the test instead of
  weakening the gate
- pre-push gate: knip + jscpd new-clones vs `dev`; AGENTS.md trimmed to what
  no check enforces
- react-doctor installed through its own installer; CI workflow kept dormant
  **why:** the installer's script drops the release-age and privacy flags the
  root script carries
- merged anti-slop branch to dev, 12 commits
- handoff cleanup list done via sub-agents: shadow token, roadmap archived,
  `DrawerHandle` re-exported, textarea inline-completion variant
- found unstyled components: stylelint rewrote css imports, Vite dropped layer
- ran a design-system improve survey (4 read-only agents): 14 findings,
  implemented via herdr agents, merged to dev
  **I decided:** hover = `:hover` + hover-media guard (57 files win over
  link.css's one-off); deferred Theme/invalid-state/dead-tokens to the gap
  journal instead of improvising them in a survey pass
- moved DESIGN.md to root, wrote PRODUCT.md, archived ancestor specs, added
  12 design-system contracts + gap journal
- vendored modern-web-guidance (legacy-scan: 0 findings)
  **I decided:** rendered checks must assert a computed style, not just class
  names — the regression passed every cycle check invisibly
- ran cycle 070: Theme component + useOverlayTheme — 12 overlay wrappers
  portal into the themed container; rendered proof passes
- authored design-system contracts batch 2 (12 more components, 24 total)
- researched harmony/harmonizer/oklch-picker: adopted APCA contrast method,
  not the palette; added `bun run contrast` gate; fixed 2 dark pairs

_Postponed: CI workflow + scheduled react-doctor until a git remote exists_
_Postponed: handoff cleanup list — segmented-control rgba shadow, Textarea
inline-completion variant, DrawerHandle re-export, roadmap archive note_
