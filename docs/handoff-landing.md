# Handoff — landing page and foundations (brandbook)

Written 2026-11-13. Branch `feat/landing-brandbook` (head `e8bfe17`) continues from
`fix/component-quality-sweep` (`841685d`). Work in a fresh session; the component sweep is finished.

## What already changed (do not redo)

- **Home page** (`apps/docs/src/components/HomePage.tsx`, rendered by `apps/docs/src/pages/index.astro`):
  the four rooms are now a numbered passage (01–04) on a hairline spine instead of four cards; the
  hero specimen is one panel + one hairline card (was three stacked surfaces with a shadow); a proof
  strip states the measured facts (44px, 4.5:1, one stylesheet, 326 stories); nav has hover/focus
  ink. Verified at 1280 and 375.
- **Brandbook** (`apps/docs/content/docs/foundations/brandbook.mdx`): the duplicated H1 is gone, and
  the colour and typography sections now describe the palette and stack the code actually ships
  (ink action, `#365CCB` focus, Frame neutrals, status pairs; system sans, IBM Plex Mono for
  identifiers; heritage hues marked decoration-only). The old text claimed `#08BDBA` turquoise as
  the primary accent and Satoshi/Vazirmatn/JetBrains, none of which the library uses.

## What to do next, in this order

1. **Read before touching anything**: `DESIGN.md` (visual authority), `PRODUCT.md`, `AGENTS.md`,
   `docs/css-conventions.md`. Load the `ui-taste` skill and follow its `polish` playbook; it is the
   workflow this work follows. There is **no image-generation tool** in this environment, so build
   against the existing identity and verify with real screenshots — do not claim a generated target.
2. **Home page, remaining polish**: the hero headline and lede are good; the weaknesses left are
   (a) the specimen's internal spacing is slightly tight against its card edge, (b) the proof strip
   numbers and labels could align on a shared baseline at 375, (c) the footer is thin — it names
   Hashti, four links and "Apache 2.0" with no version or build note, (d) there is no dark-theme
   screenshot of the final page in the handoff evidence. Fix those, keep the passage.
3. **Brandbook, remaining polish**: the vector-asset cards (`brandbook/BrandbookAssets.tsx`) are
   fine; what the page still lacks is (a) a clear-space diagram rendered as a figure rather than a
   bullet list, (b) the geometry formulas section reads as prose where a small diagram would explain
   the arch proportion faster, (c) the voice section is a list of adjectives with no before/after
   copy example. Add figures and one concrete copy example; do not invent new brand claims.
4. **Foundations pages generally** (`apps/docs/content/docs/foundations/*`): check each for the same
   failure the brandbook had — a documented token, colour or typeface that the code does not ship.
   `grep` the hex values and font names in a page against `packages/tokens/src/frame.ts`.

## How to verify (this repo's recipes)

```sh
bun run build:docs && rm -rf dist/site && mkdir -p dist/site && cp -r apps/docs/dist/. dist/site
```

`build:docs` only fills `apps/docs/dist`; `dist/site` is what the preview serves — forgetting the
copy is the number one cause of "my fix didn't apply". The docs preview binds IPv4 only: use
`127.0.0.1:4400`, never `localhost` (Playwright resolves `localhost` to `::1` and hangs).

Screenshots: serve `dist/site` yourself with `Bun.serve` and drive it with Playwright
(`waitUntil: "commit"`, then `waitForSelector("h1")`); the dev preview stalls browser connections.
Take 1280 and 375, light and dark (`globals=theme:Frame dark` works for Storybook stories, not the
docs site — switch its `data-hashti-theme`, or use the page's own toggle).

Full gate before any commit: `bun run check` (format, lint, typecheck, 183 unit, build, storybook
build, 48 browser tests, pack, consumer verify).

## Traps worth knowing

- Three stylesheets define a lot of the same selectors; the theme layer outranks the component layer.
  Do not "fix" a colour in `styles.css` if `frame.css` also declares it — check the built
  `dist/styles.css`.
- `styles.css` must import `layers.css` first, or the reset outranks components (this cost a week).
- A portaled overlay carries `data-hashti-theme` itself and is therefore both the `@scope` root and
  its limit; scoped theme rules never reach it.
- Story play functions run nowhere in CI; `scripts/sweep-stories.ts` and `tests/harness.ts` are the
  checked-in verification (axe, geometry, ink, states) — use them instead of ad-hoc scripts.

## Still open from the component review, not part of this handoff

Calendar extracted as its own component with month/year pickers, the notification/Alert/Loading
colour-variant system, SideNav rebuilt on `NavigationTree`, TableBatchActions' floating shape,
FieldStatus layout, ColorPicker knob offsets, ActionableNotification variants, TokenField showcase
stories, DateRange 30-day gap. They are logged in `docs/component-review.md`.
