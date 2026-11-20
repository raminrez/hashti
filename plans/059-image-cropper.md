# Plan 059: ImageCropper — viewport, selection, handles

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition triggers, stop and report — do not improvise. Do not update
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat <base>..HEAD -- packages apps/docs/content design`
> Compare "Current state" excerpts against live code; on mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (geometry-heavy; ui-sdk drives crop math — read the docs for
  the CSS variable contract before styling)
- **Depends on**: plans/054-calendar (DONE)
- **Category**: migration (component build-out, cycle 59)
- **Parallel lane**: Particle-5

## Why this matters

ImageCropper is the last heavy surface. ui-sdk owns the crop math; our
styles frame the viewport, selection, grid and handles.

## Current state

- `packages/styles/src/resizable.css` — the handle/drag exemplar.
- `packages/react/src/resizable/resizable.tsx` — wrapper exemplar.
- `apps/docs/content/docs/meta.json` — insert `"image-cropper"` after
  `"hover-card"`.

### ui-sdk ImageCropper facts (READ the full docs page first)

- Import: `import { ImageCropper, ImageCropperViewport, ImageCropperImage, ImageCropperSelection, ImageCropperGrid, ImageCropperHandle, ImageCropperZoom, ImageCropperRotate, ImageCropperFlip } from "@ui-sdk/react/image-cropper"` (verify).
- Composition: `ImageCropper` (holds crop + `src`) → `ImageCropperViewport`
  (give it a size; padding keeps the image off edges) →
  `ImageCropperImage` (`alt`), `ImageCropperSelection` (a slider you drag
  or move with arrow keys) → `ImageCropperGrid` (thirds lines),
  `ImageCropperHandle` (`position` like `"se"`, sits BESIDE the selection,
  on its edge/corner). Then `ImageCropperZoom`, `ImageCropperRotate`,
  `ImageCropperFlip` controls.
- READ the Usage and Data Attributes sections fully: selection geometry
  likely comes through CSS variables — follow the docs exactly and note
  the variable names in your report.

### Design rules that bite (derived)

- **Root `hashti-image-cropper`**: `display: flex; flex-direction: column;
gap: 0.75rem;`
- **Viewport `hashti-image-cropper-viewport`**: `position: relative;
overflow: hidden; border-radius: var(--hashti-border-radius-08);
background: var(--hashti-layer-02);` — size from the consumer (demo sets
  one).
- **Image `hashti-image-cropper-image`**: `display: block;
max-inline-size: 100%;` (transform state is ui-sdk's).
- **Selection `hashti-image-cropper-selection`**: `position: absolute;
border: 1px solid var(--hashti-layer-01); box-shadow: 0 0 0 9999px
rgba(0 0 0 / …)` — NO, rgba literal is a hex-rule violation; instead use
  the overlay recipe the docs suggest or a `--hashti-*` scrim token if one
  exists (check `design/tokens.css`; if none, outline the selection with a
  1px border + `outline: 9999px` trick only if a token exists — otherwise
  STOP and report). Corner radius per tokens. `cursor: move;`
- **Grid `hashti-image-cropper-grid`**: thirds lines — `1px` lines in
  `var(--hashti-border-subtle-00)` (ui-sdk may render the lines for you —
  check the DOM).
- **Handle `hashti-image-cropper-handle`**: `position: absolute;
inline-size: 0.625rem; block-size: 0.625rem; border-radius: 50%;
background: var(--hashti-layer-01); border: 1px solid
var(--hashti-border-strong-01);` positioned per its `position` prop
  (corner/edge); `cursor` per direction (nwse/nesw-resize).
- **Zoom/Rotate/Flip controls**: quiet icon buttons (the toolbar recipe).
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands

| Purpose   | Command             | Expected |
| --------- | ------------------- | -------- |
| Install   | `bun install`       | exit 0   |
| Typecheck | `bun run typecheck` | exit 0   |

## Scope

**In scope** (only these):

- `packages/react/src/image-cropper/image-cropper.tsx` — create
- `packages/react/src/image-cropper/index.ts` — create
- `packages/react/src/index.tsx` — add the re-export line
- `packages/styles/src/image-cropper.css` — create
- `packages/styles/index.css` — add one import line
- `apps/docs/src/components/image-cropper-demo.tsx` — create
- `apps/docs/content/docs/image-cropper.mdx` — create
- `apps/docs/content/docs/meta.json` — add `"image-cropper"`

**Out of scope**: aspect-ratio presets UI; lint/test infra.

## Git workflow

- Branch `particle/059-image-cropper` in your worktree.
- Commit per logical step; never push/merge/touch main.

## Steps

1. **Wrappers** — `join` helper pattern per part; export all + barrel.
   Verify: typecheck exit 0.
2. **Stylesheet** — rules above. Verify: no hex; `grep -c "data-"
packages/styles/src/image-cropper.css` → ≥ 3.
3. **Demo + page** — viewport with a demo image (a picsum URL or an inline
   SVG data URI — pick what the docs' demo does), zoom/rotate/flip controls.
   meta.json entry. Verify: typecheck exit 0.

## Done criteria

- [ ] `bun run typecheck` exits 0
- [ ] `grep -rn "hashti-image-cropper" packages/react/src packages/styles/src` hits
- [ ] no hex in `packages/styles/src/image-cropper.css`
- [ ] import + meta entries present
- [ ] `git status --porcelain` clean of out-of-scope files
- [ ] one commit per step

## STOP conditions

- Any part not exported from `@ui-sdk/react/image-cropper` — quote the error.
- The selection overlay needs a scrim color and no `--hashti-*` token
  exists for it — report and stop (do not invent a hex).
- A verification fails twice after a reasonable fix attempt.
- Fix needs an out-of-scope file.
