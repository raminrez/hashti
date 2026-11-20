# Cycle 070 — Theme component (gap G1)

Goal: ship a `Theme` mechanism in `@hashti/react` that carries `data-theme`,
`dir`, `lang` through portal boundaries, so Hashti components inside a themed
subtree style correctly even when their overlays portal to `document.body`.

## Background

- `design/tokens.css` keys all tokens on `[data-theme="light"|"dark"]`
  (`light` is the document default). No `@layer hashti.themes` scope — tokens
  are plain `[data-theme=…]` selectors.
- ui-sdk popups (dialog, alert-dialog, popover, menu, select, combobox,
  autocomplete, drawer, tooltip, hover-card, date-picker, navigation-menu)
  accept `container?: DocumentFragment | Element | null` and portal to body
  by default. Today no wrapper passes it, so an overlay opened inside a
  `<div data-theme="dark">` inherits the document theme, not the subtree's.
- ui-sdk has NO Theme part — this is Hashti-original (wrapping is not
  possible; we compose nothing for the root).

## Deliverables

1. `packages/react/src/theme/theme.tsx` + `index.ts`:
   - `Theme` — renders `<div class="hashti-theme" data-theme={resolved} dir?
lang?>` and provides context `{ container: HTMLDivElement | null }`.
     Props: `theme?: "light" | "dark" | "system"` (default `"system"`) plus
     div props. `system` resolves via `matchMedia("(prefers-color-scheme:
dark)")` with a change listener (client-side; SSR renders `light`).
   - `useOverlayTheme()` — returns the context (null-safe outside a Theme).
   - Barrel line in `packages/react/src/index.tsx`.
2. Overlay wrappers (the 12 listed above): their popup parts pass
   `container` from `useOverlayTheme()` when present. Check each part's
   `.d.ts` for which part takes `container` (e.g. popover: root AND content
   — pass on the part that actually portals; verify per component, do not
   guess). Non-popup components untouched.
3. Styles: add `packages/styles/src/theme.css` ONLY if a rule is needed
   (tokens only). If the wrapper needs no CSS, skip the file and say so in
   the report — do not ship an empty file.
4. Docs: `apps/docs/content/docs/theme.mdx` + `meta.json` entry. Demo: a
   `Theme theme="dark"` block containing a Dialog; opening it with the
   document in light must show dark dialog tokens. Compound parts go in a
   demo component under `apps/docs/src/components/` rendered with
   `client:load` (AGENTS.md rule).
5. Update `design-system/gaps.md`: G1 → resolved with the shipped shape.
   DESIGN.md authority block: Theme is now shipped (remove "planned" wording).

## Constraints (from AGENTS.md)

- Class contract `hashti-theme`; modifiers via attributes only.
- Styles: tokens only, no hex, no physical l/r.
- No new `!`, `as any`, disables. knip must stay at zero.
- Commit on every step. Never merge/push. STOP and report instead of
  improvising if the design conflicts with what you find.

## Verification gates

- From the worktree root: `bun install` first (fresh worktree), then RAW
  `bun run typecheck` (never via rtk), `bun run lint`, `bun run lint:css`,
  `bun run deadcode`, `bun test`, `bun run duplicates`.
- Rendered proof (docs server, port 4324 to avoid conflicts):
  document `data-theme="light"`, page contains `<Theme theme="dark">` with a
  dialog; open it; assert the portaled `.hashti-dialog-content` computed
  `background-color` matches the dark token value (assert computed styles,
  not class presence). Also verify `theme="system"` follows the OS setting.
