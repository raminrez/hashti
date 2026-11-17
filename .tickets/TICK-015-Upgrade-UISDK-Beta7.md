# TICK-015: Upgrade @ui-sdk/* to 0.1.0-beta.7

**Phase:** 0 — Foundation
**Priority:** Medium
**Effort:** Low

## Blocked until 2026-11-20

beta.7 was published 2026-11-17 00:05 UTC. The release-age policy requires waiting
(~3 days); do not override it. Bump `@ui-sdk/core` and `@ui-sdk/react` in the workspace
catalog on **2026-11-20 or later**. If a newer beta exists by then, apply the same rule
to that version instead.

## Acceptance Criteria
- [ ] Catalog bumped, `bun install` clean
- [ ] `bun run typecheck` and `bun run build:packages` pass
- [ ] Re-check TICK-000 inventory + `docs/attribute-map.md` against beta.7's shipped docs
      (`node_modules/@ui-sdk/react/docs/llms.txt`) — betas move fast; catch any renames
      before component tickets start
