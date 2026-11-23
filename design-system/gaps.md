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
- **G7 — Focus blue carries four unrelated jobs.** Progress fill, Slider
  value fill, Badge `info` kind, and the transient keyboard highlight in
  Command/Menu/Listbox/Combobox all borrow `--hashti-focus`. The Separate
  Signals Rule gives blue to focus, selection, and current location; a data
  fill, an informational badge, and a hover-tier highlight are none of those.
  Found in the 2026-11-23 visual refinement pass
  (.impeccable/review/findings.md §C34). Next step: one DESIGN.md decision —
  either name a data/accent ink for non-interactive blue uses or document the
  borrowed uses as intentional. Needs a plan before any component changes.
- **G8 — Read-only has no visual cue on Radio and Rating.** Both render
  pixel-identical to their selected states; read-only is semantics-only there.
  Found in the same pass (§C35). Next step: decide whether read-only needs a
  cue on non-text controls (the field recipe — dashed border + accent
  surface — does not transfer to a radio dot or a star row), or document
  semantics-only as the shipped behavior.
- **G9 — Tree leaf rows align to the chevron column.** A leaf's label sits
  where its parent's chevron is, one step left of the sibling branch's label.
  ui-sdk's tree DOM carries no leaf/branch marker a class could key on, so the
  fix needs either a ui-sdk hook or a wrapper-computed attribute (which the
  framework-agnostic styles rule forbids styling against). Found in the same
  pass (§B25). Next step: check ui-sdk for a part-level leaf signal before
  designing around it.
- **G10 — Number-input stepper hit targets are ~22px.** The split vertical
  stepper caps each button at half the 44px field; no painted-mark/hit-area
  split fixes that without a redesign (side-by-side steppers or an overlay
  stepper). Found in the same pass (§B31). Next step: a deliberate control
  anatomy decision, not a CSS patch.
- **G11 — Ghost controls have no rest-state affordance.** Popover, Dialog,
  AlertDialog triggers and Toast actions render borderless at rest and only
  reveal themselves on hover/focus; the toggle group's unpressed items read
  the same. This is the shipped ghost vocabulary (button.css), consistent
  across every surface — the 2026-11-23 pass kept it and flags it once here.
  Next step: a DESIGN.md line either blessing the borderless rest state or
  defining one; do not patch component by component.
