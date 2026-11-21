# Gap journal

Recorded by the design-system improve pass on 2026-11-20. Each entry keeps its
source, the original expectation, and the next actionable step. Recording
neither blocks work nor authorises repairs; system work goes to craft.

- **G1 — No Theme component ships.** DESIGN.md claims Phase 1 includes
  `Theme appearanceClassName` and `useOverlayTheme`; neither exists in
  `packages/react/src`. Source: grep over `packages/react/src` for
  `data-theme|useTheme|appearanceClassName` → zero. Expected: a Theme
  mechanism in `@hashti/react` carrying `data-theme`, layer, `dir`, `lang`
  through portals. Next step: design and ship a Theme wrapper as its own
  cycle. Status: resolved (2026-11-20, cycle 070). Shipped shape:
  `Theme` renders `.hashti-theme[data-theme]` (theme prop `light|dark|system`,
  system resolves via `prefers-color-scheme` with a change listener; SSR
  renders light) and provides `{ container }` through context;
  `useOverlayTheme()` exposes it to wrappers. The 12 overlay wrappers
  (dialog, alert-dialog, drawer, popover, menu, select, combobox,
  autocomplete, tooltip, hover-card, date-picker, navigation-menu) pass it as
  their root part's `container`, and ui-sdk portals content, backdrop, and
  viewport into it. `dir`/`lang` are plain div props on the same container;
  there is no separate layer concept to carry (tokens key on `[data-theme]`
  directly).
- **G2 — Invalid state keyed four ways.** CSS queried `aria-invalid`
  (input.css, textarea.css), `data-invalid` (date-input, time-input,
  date-picker, switch, field), `:has(.hashti-field__error)` (field.css).
  Shipped: CSS keys `data-invalid` only. `Input`/`Textarea` wrappers mirror a
  passed `aria-invalid` onto `data-invalid` (so standalone invalid controls
  style), and `field.css` keys the field's `data-invalid` — ui-sdk puts it on
  the control inside the field (field.md, `useFieldControl`). Status: resolved
  (2026-11-21).
- **G3 — Hover pattern split.** 57 files use `:hover` (5 were unguarded;
  guards fixed 2026-11-20); link.css keys `data-hovered`. Decision made
  2026-11-20 (css-conventions.md): `:hover` + hover-media guard is the
  shipped pattern, `data-hovered` additive. Migrate link.css only if a
  consumer needs it. Status: resolved by documentation (2026-11-20).
- **G4 — Dead tokens.** ~474 of 535 tokens in design/tokens.css are
  unreferenced (syntax/tag/chat families, type roles, numeric spacing ladder).
  Expected: either migrate components onto named type/spacing roles or prune.
  Needs a plan before deletion; do not mass-delete. Status: open
  (2026-11-20).
- **G5 — Off-ladder control heights.** toolbar buttons and drawer/popover/
  dialog closes at 36px, menubar triggers at 32px, segmented-control 40px —
  interactive controls below the 44px minimum with no `sm` mapping. Expected:
  explicit compact tier documented in DESIGN.md, or sizes mapped to the
  32/44/48 ladder. Needs a design decision. Status: open (2026-11-20).
- **G6 — Textarea ghost scroll-sync unverified.** inline-completion demo
  copies scrollTop on scroll, but the demo's suggestions never overflow the
  textarea, so scroll sync is unverified at runtime. Expected: end-to-end
  proof with overflowing content. Status: open (2026-11-20).
