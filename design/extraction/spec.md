# Hashti / Frame — extracted spec (read-only digest)

Sources: `docs/design-system.md` (6 Nov 2026), `docs/verification.md`, `docs/component-library-plan.md` (8 Nov 2026), plus visual authority `DESIGN.md` and one drawer fact from `docs/component-review.md`.

---

## 1. Named rules and doctrines (exact wording)

Principles (§2):

1. **"Clarity before decoration."** Group with alignment and spacing before adding containers.
2. **"Useful defaults, reachable parts."** Ordinary labeled field stays short to write; composing its parts must not require copying behavior.
3. **"One owner for each behavior."** RAC/native own primitive interaction; Hashti owns correct composition and appearance; applications own domain rules, authorization, persistence, request lifecycle.
4. **"Meaning survives change."** Themes, custom classes, long text, narrow screens, input methods preserve names, state, focus, relationships, recovery.
5. **"Feedback stays with the task."** Field errors belong to fields; save failures belong to the form.
6. **"Maintain one system."** Reuse packages, token generator, RAC model, catalog, consumer verification.
7. **"Make claims as specific as the evidence."** Live example ≠ automated scan ≠ manual evaluation ≠ complete support.

DESIGN.md:

- **The Readable Value Rule** — "Do not shrink entered values, critical instructions, or recovery text to make a layout fit. Reflow the surrounding layout instead."
- **The Stable Recovery Rule** — "Reserve enough space for the form's expected errors to keep its commit action stable, while allowing longer messages to grow."
- **"Depth describes temporary hierarchy, not importance."**
- Do/Don't floor: keep guidance visible during recovery; focus distinct on selected + invalid; stronger boundaries for controls than surfaces; content/translations/text scaling may grow height; verify both themes and narrow widths. Never: placeholder-only labels, color alone, clipping an error, card-ifying every region, inferring API/a11y from a prototype, copying a reference identity/API.

Recurring operational doctrines:

- "Hit target and painted mark are separate."
- "Labels can grow; marks do not shrink." (choice batch)
- "Progress must not depend on animation alone."
- "Every relevant combination needs an explicit recipe, including selected + focused and invalid + focused."
- Surface hierarchy: **canvas → ordinary surface → contextual surface → temporary overlay**; that layer level is not z-index or shadow strength.
- Primary actions neutral; **focus and selection are blue**.
- "No family becomes verified simply because its colors inherit from the new theme."
- "Generated token files are outputs, not a second place to invent values."
- "For implemented facts, source and current verification win over an outdated description."

---

## 2. Accessibility + i18n requirements constraining visuals

Target **WCAG 2.2 AA** with specific evidence; a zero-violation axe run is "regression evidence, not an accessibility certification."

- Contrast: normal text 4.5:1, large 3:1, required non-text controls/state indicators 3:1 vs adjacent colors. Every theme/state pairing, not just default. Approved pairs (light/dark): text 14.94/13.87, muted 5.75/7.64, text-on-primary 14.35/13.87, focus blue 5.91/8.43, control border 3.62/4.13, error 5.90/7.38, warning 6.40/7.37, success 6.14/7.75.
- Targets: **24×24 CSS px** AA minimum; **44×44 is the stronger Hashti ordinary-control goal**, not yet met by all checkbox/switch/embedded targets. Test real clickable bounds and spacing.
- Focus: one-pixel full control border + **external 2px focus outline**, offset 2px on fields, 3px on actions. Outline must survive invalid state and forced colors. Focused content must be unobscured by fixed headers/action bars/overlays. Test selected + focused and invalid + focused.
- Reflow **320 CSS px**, text resize **200%**, browser zoom/reflow **400%**, text-spacing overrides. Essential 2-D content may scroll inside an identified region only. Never letterbox by clipping.
- Also required: forced colors, reduced motion, coarse pointers (44px), no hover-only affordances, keyboard/non-drag alternative for drag tasks, manual screen-reader pass alongside scans.
- Sizes in scalable units where appropriate; component height may grow with content and text scaling.

i18n / direction:

- `Theme locale` is the source of RAC formatting **and keyboard direction**; DOM `lang`/`dir` must agree everywhere, including portalled popover, modal, tooltip, toast (Theme computes `lang ?? locale`; `lang=""` is explicit).
- Use logical properties and natural wrapping; test expansion, long unbroken identifiers, mixed-direction text, CJK breaking. "Do not assume one language is always the longest."
- Directional arrows follow reading direction when meaning does; **check marks, media controls, logos do not automatically mirror**.
- Isolate user-generated direction with `bdi` / local `dir="auto"`; LTR identifiers in RTL UI need deliberate handling.
- Localize every authored string (pending/clear/close/copy/pagination counts/file errors/thumb names/feedback); reuse RAC translations; no hardcoded English; format with locale-aware APIs; preserve date/time-zone/calendar/numeric semantics.
- A single icon + text; never color-only or sparkle-only meaning.
- DOM-only RTL injection is a layout stress test, not localization proof. Current prototype hardcodes `en-US`.

---

## 3. Phase status (latest dated entries)

**Phase 1 — complete, 6 Nov 2026 approvals; exit passed.** Delivered: Frame semantic tokens (8 themes generated; Frame maps 343 entries incl. 25 Frame-owned overrides), additive `frame-light`/`frame-dark` (`relay-light`/`relay-dark` defaults retained, four Carbon themes kept), Frame ordinary default **44px**, explicit `sm/md/lg` = 32/44/48, Button `xl/2xl` = 64/80, `Theme appearanceClassName` repeated on Popover/ModalOverlay/Tooltip/ToastRegion (omitted inherits, string replaces, `""` clears), single `hashti` layer with sublayer order `tokens, reset, components, themes, accessibility`, `@scope`-based theme recipes, BEM-ish part hooks (`.hashti-field__label|__control|__help|__description|__error`, `.hashti-select__value|__listbox`), Modal part access (`overlayClassName`, `overlayRef`, `modalStyle`). Proof: 42 captures at 1440/768/390/320, native CSS + CSS Modules + Tailwind 4.3.5 consumers, 106 observations, axe 0 violations (11 contrast incompletes reviewed, lowest 5.08:1), RTL (Hebrew provider) dialog+Select, 0px submit movement.

**Phase 2 — in progress. Delivered so far (all at recorded scope):**

- Batch 1 (7 Nov): Storybook workbench (10.6.6 / Vite 8.3.6); **Button, Link** — 21 stories, 42 theme cases. Four core treatments `primary`, `secondary`, `ghost`, `danger`; `tertiary`, `danger-tertiary`, `danger-ghost` compatible.
- Batch 2 (7 Nov): **TextField, TextArea, NumberField, SearchField, Form** — 33 stories, 108 cases, 74 captures, 28 native observations. `FieldLayout` owns label → persistent guidance → control → recovery; 12 callable compound namespaces; recovery minimums 58px/78px, boundary 432/433px.
- Extension (8 Nov): appearance-only **status** warning/error/success + inline icons + localized required/optional wording + **label help** (Tooltip + named dialog Popover) across 12 field namespaces — 8 stories, 62 total, 132 cases.
- Batch 3 (8 Nov, latest): **Checkbox, Radio, Switch** — 18 stories / 15 plays, 80 stories / 178 indexed cases; 62 retained PNGs; rendered acceptance being closed. 44px ordinary label minimum, 18px Checkbox mark / 5px corners, 18px Radio mark, Switch 32×16 / 48×24 with logical thumb travel, compact table selection 16px mark / 18px target.

**Remaining:** close choice rendered acceptance → **Select, Toasts n/a, Modal/Dialog, Popover, Tooltip** plus **settings** and **nested-editing** composition stories → complete the **14-entry slice** (`button, link, text-input, text-area, number-input, search, checkbox, radio-button, toggle, dropdown, form, modal, popover, tooltip`) → Phase 3 selection/navigation (11), Phase 4 data/structure (9), Phase 5 dates/files/feedback (11) → Phase 6 docs website + release proof (45 entries reconciled) → Phase 7 Figma last. Unperformed: manual AT, Firefox/WebKit, physical devices/touch, real IME/autofill/translation, representative users, broad zoom/text-resize, comprehensive SSR/hydration. Select must not gain a fake read-only prop.

Aggregate latest: passed 8 Nov 2026, 15:04:34–15:10:18 UTC.

---

## 4. Behavior specs that change visuals

- **Stable recovery space:** bounded Frame controls reserve **one padded recovery line** (not a fixed max). Form recipe required-field minimums **58px** wider containers, **78px** at/below 24rem; 24px side padding puts the tested boundary at **432/433px**. Extra text grows, never clips; Save may move. Invalid control keeps upper corners, lower corners tighten to **3px** into a recovery band with side+bottom borders that **overlaps the shared edge by 1px**. Guidance stays visible; separate description and error IDs (never swap one ID for another). Group error paint is detached at group level; invalid checkbox/radio options keep neutral borders. Field-grid boundary 647/648px.
- **Read-only values:** legible, focusable, selectable, copyable, included in `FormData`, reject mutation; visually and behaviorally distinct from disabled. Pending form fields are **read-only, not disabled** (spinner-only pending is a known nonblocking gap). Non-editable selected value with no primitive read-only behavior renders as normal text.
- **Pending:** prevent repeat activation, retain useful focus, announce, "preserve content dimensions"; RAC flips pending Save `submit → button`.
- **Overlay dismissal:** named task, purposeful initial focus, containment when modal, reachable actions, **inner-first Escape** (Select closes before Dialog), return focus, page scrolling, matching portal appearance/locale across theme + locale changes while open. Toast appearance belongs to ToastProvider. Status/announcements bounded; a consequential failure uses an alert, not several live regions.
- **Drawer/Sheet RTL mirroring:** "It enforces bidirectional mirroring so `end` naturally slides from the left in RTL and from the right in LTR" (DESIGN.md §Temporary surfaces). Verified via `inset-inline-end` + `-rtl` keyframes (`docs/component-review.md`); a dead glow focus ring on its close button was removed and its "Close drawer" name is hardcoded English (logged gap).
- **Overlay geometry:** "An overlay grows from the edge that touches its trigger, never from center." Popover shadow `0 8px 24px rgb(0 0 0 / 14%)`; modal backdrop `rgb(18 22 32 / 50%)`; surfaces opaque, no ambient shadow on ordinary form surfaces.
- **State coexistence:** focus, current location, selection, invalidity, pending may co-occur; error state outranks any custom selection color.

---

## 5. Motion ladder, spacing vocabulary, size scale

**Motion — six-step ladder:** 130ms hover/colour/release · 175ms popover and tooltip entrance · 230ms panel and disclosure · 310ms modal and backdrop · 410ms and 730ms reserved for large surfaces. Entrance easing = expo-style ease-out `cubic-bezier(0.16, 1, 0.3, 1)`; exits shorter and accelerating. Pressable controls scale **0.96–0.98** while pressed and spring back over the release duration. Fields, accordion rows, disclosure rows answer a press **with ink, not travel**. Reduced motion = no travel, scale, entrance, pulsing, nonessential transitions — state lands instantly, while pending/focus/status cues stay visible.

**Spacing vocabulary** (`detail 4 · related 8 · control 12 · compact 16 · group 20 · section 24 · surface 28 · separation 32 · region 40` px) — component inset, related-part gap, group spacing, region separation are distinct relationships; not a licence to card-wrap regions.

**Size / radius / type:**

- Controls `sm 32 · md 44 · lg 48`; omitted ordinary Button and size-bearing fields 44; Button `xl/2xl` 64/80; older themes keep 48 omitted Button / 40 medium field. Minimums may grow.
- Corners: control **10px**, group/popover **14px**, dialog **18px**; recovery band lower corner 3px.
- Choice: Checkbox 18px mark / 5px corners, Radio 18px, Switch 32×16 / 48×24, compact table 16px mark / 18px target.
- Type roles: headline 30/36 w600 −0.03em · title 18/25.2 w600 · body 14/21 · input 16/24 · label 14/20 w600 · helper 13/20 · action 14/20 w500. Narrow page heading 25/30. Prose measure 65–75ch. One system sans; mono only for technical identifiers.
- Layout: 1208px centered shell, 24px wide / 16px narrow gutters; 900px and 720px breaks belong to review/settings recipes, not components; small components must not infer space from viewport.

---

Not checked: no code, tokens, or stylesheets inspected — visual values above are quoted from docs, and only DESIGN.md/component-review.md supplied the ladder, spacing, radius and drawer facts that the three named docs do not spell out.
