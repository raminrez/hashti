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
  Needs a plan before deletion; do not mass-delete. Status: resolved
  (2026-11-21, cycle g4-prune-tokens). Pruned by reference: 455 of the 538
  declared tokens removed (syntax, tag, chat, AI, type/fluid type roles,
  numeric spacing + container ladder, layer/field/border alias families,
  status/support extras); 83 kept — token totals 538 → 83. Seven tokens
  (`border-strong`, `border-subtle`, `field`, `icon-interactive`,
  `link-primary-hover`, `overlay-radius`, `size-md`) kept because plans/ and
  design/extraction/ prose name them; `text-helper`, `text-placeholder`,
  `button-primary-active`, `border-subtle-03` kept because
  design-system/scripts/contrast-audit.mjs pairs them.
- **G5 — Off-ladder control heights.** toolbar buttons and drawer/popover/
  dialog closes at 36px, menubar triggers at 32px, segmented-control 40px —
  interactive controls below the 44px minimum with no `sm` mapping. Expected:
  explicit compact tier documented in DESIGN.md, or sizes mapped to the
  32/44/48 ladder. A before/after showcase (Storybook `Foundations/G5 Control
Heights`, story-only overrides) measured all six offenders; decided
  2026-11-21: keep the shipped heights — 44px read too tall on toolbar and
  menubar surfaces, a 32px-everywhere tier was not useful. The tier is now
  documented in DESIGN.md (Components → Actions → Control height tier).
  Status: resolved by decision (2026-11-21).
- **G6 — Textarea ghost scroll-sync unverified.** The inline-completion demo
  copies scrollTop on scroll, but the demo's suggestions never overflow the
  textarea, so scroll sync was unverified at runtime. Verified 2026-11-21
  with a 40-line story (`.storybook/stories/InlineCompletionScroll.stories.tsx`)
  whose play function scrolls the textarea to 240 and back and asserts the
  ghost follows. Two real bugs surfaced: the ghost was `display: flex`, so
  the typed span and suggestion were separate flex items (ghost 3880px tall
  vs textarea 1960px); and the content-box textarea was wider than the
  ghost's border box and reserved a scrollbar the ghost did not (client widths
  318px vs 329px). Fixed in `inline-completion.css`: block ghost,
  border-box control inside the wrapper, `scrollbar-gutter: stable` on both.
  Ghost and textarea now share clientWidth 303 and line counts within 1.5
  lines. Status: resolved (2026-11-21).
