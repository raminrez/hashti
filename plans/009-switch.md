# Plan 009: Align the Switch component with the design spec (ui-sdk switch + Hashti styles)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Do not update `plans/README.md`; the reviewer
> maintains it.
>
> **Drift check (run first)**: `git diff --stat 623383b..HEAD -- packages apps/docs/content design`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED (replaces an existing skeleton component, wrapper + core primitive)
- **Depends on**: plans/008-radio (DONE)
- **Category**: migration (component build-out, cycle 9)
- **Planned at**: commit `623383b`, 2026-11-20

## Why this matters

Switch is the last component of the ui-sdk-backed list. It already exists as
a skeleton (core primitive + `createParts` + old-keyed stylesheet); this
cycle brings it to the established pattern: ready-made ui-sdk parts, the
`hashti-switch` class, the `hashti-choice` row, and the DESIGN.md track
geometry.

## Current state

- `packages/core/src/switch.ts` — a Hashti-owned `hashtiSwitch` primitive
  (toggle api, checked state). ui-sdk ships the switch behavior; the
  primitive is superseded. Delete it (Step 3).
- `packages/react/src/index.tsx` — exports Switch via
  `createParts(hashtiSwitch, { root: "button" })`. Replaced by a wrapper.
- `packages/styles/src/switch.css` — old-keyed styles on
  `[data-slot="switch"]` with a `::before` thumb, 0.15s transitions, and
  design tokens already mapped (cycle 4): border-subtle-00 border,
  layer-accent-01 track, support-success checked, icon-on-color thumb,
  focus ring. Step 2 replaces the whole file with the thumb-part structure
  and DESIGN.md geometry.
- `apps/docs/content/docs/switch.mdx` — exists; Step 4 rewrites it.
- `apps/docs/content/docs/meta.json` — `pages`:
  `["index", "avatar", "button", "checkbox", "input", "label", "radio", "separator", "switch", "textarea"]`
  (switch already listed).

### ui-sdk Switch facts (from `packages/react/node_modules/@ui-sdk/react/docs/components/switch.md`)

- Import: `import { Switch, SwitchThumb } from "@ui-sdk/react/switch"`.
- Composition: `Switch` → `SwitchThumb`. The thumb stays mounted and
  receives the switch's state, so CSS slides it between ends.
- Wrap the switch and its text in a label.
- `checked`/`defaultChecked`/`onCheckedChange`.
- Data attributes: Switch carries `data-checked`/`data-unchecked`/
  `data-disabled`/`data-readonly`/`data-required`/`data-invalid`;
  SwitchThumb carries the same minus `data-invalid`.

### Design rules that bite (from `design/DESIGN.md` §Selection, `design/css-conventions.md`)

- **Track**: 44×24px (`2.75rem` × `1.5rem`), full-round; `sm` 34×18 with a
  14px thumb (compact is opt-in via `data-size="sm"`; Hashti adds
  `data-size`).
- **Thumb**: 20px (`1.25rem`), full-round, `var(--hashti-icon-on-color)`
  surface.
- **Track surface**: off = `var(--hashti-layer-accent-01)`; on =
  `var(--hashti-support-success)` (the design's toggle-on color, mapped in
  cycle 4).
- **Logical travel**: the thumb slides toward the inline end — use logical
  properties (`inset-inline-start` + a translate on the inline axis), so RTL
  mirrors without extra rules.
- **Row**: `hashti-choice` (44px label target) — reuse verbatim.
- **Press scale**: the switch is a control, not a bare mark — no scale rule
  (the track doesn't scale; the press feedback is the state change).
- **Focus ring**: `:focus-visible` → 2px `var(--hashti-focus)`, 2px offset,
  on the track.
- **Invalid**: `data-invalid` arrives from a surrounding Field — border
  `var(--hashti-support-error)`; the Field cycle completes the recovery
  band.
- Colours only via `var(--hashti-*)`; a hex in component CSS is a bug.

## Commands you will need

| Purpose   | Command             | Expected on success |
| --------- | ------------------- | ------------------- |
| Install   | `bun install`       | exit 0              |
| Typecheck | `bun run typecheck` | exit 0, no errors   |

## Scope

**In scope** (the only files you should modify or create):

- `packages/core/src/switch.ts` — delete
- `packages/core/src/index.ts` — becomes empty of exports (keep the file
  with a comment, or delete it if the package allows an empty barrel —
  prefer keeping the file with a placeholder comment so the package keeps
  its entrypoint)
- `packages/react/src/switch/switch.tsx` — create
- `packages/react/src/switch/index.ts` — create
- `packages/react/src/index.tsx` — replace the Switch export
- `packages/styles/src/switch.css` — replace whole file
- `apps/docs/src/components/switch-demo.tsx` — create
- `apps/docs/content/docs/switch.mdx` — rewrite
- `apps/docs/content/docs/meta.json` — unchanged (switch already listed)

**Out of scope** (do NOT touch, even though they look related):

- Field anatomy / recovery band — Field cycle
- `hashti-choice` — already global via checkbox.css
- Any lint/test infrastructure

## Git workflow

- Work on the branch checked out in your worktree (`particle/009-switch`).
- Commit per logical step; plain imperative messages.
- Do NOT push, merge, or rebase.

## Steps

### Step 1: Create the Switch wrappers in `@hashti/react`

`packages/react/src/switch/switch.tsx`:

```tsx
"use client";

import type { ComponentProps } from "react";
import {
  Switch as UiSwitch,
  SwitchThumb as UiSwitchThumb,
} from "@ui-sdk/react/switch";

type SwitchSize = "sm" | "md";

interface SwitchProps extends ComponentProps<typeof UiSwitch> {
  size?: SwitchSize;
}

function Switch({ size, className, ...props }: SwitchProps) {
  return (
    <UiSwitch
      className={`hashti-switch${className ? ` ${className}` : ""}`}
      data-size={size}
      {...props}
    />
  );
}

function SwitchThumb({
  className,
  ...props
}: ComponentProps<typeof UiSwitchThumb>) {
  return (
    <UiSwitchThumb
      className={`hashti-switch__thumb${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Switch, SwitchThumb };
```

`packages/react/src/switch/index.ts`:

```ts
export { Switch, SwitchThumb } from "./switch";
```

**Verify**: `bun run typecheck` → exit 0 (the barrel still references the
old export until Step 3).

### Step 2: Replace `packages/styles/src/switch.css`

Whole file:

```css
.hashti-switch {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  inline-size: 2.75rem;
  block-size: 1.5rem;
  padding: 0.125rem;
  border: none;
  border-radius: 9999px;
  background: var(--hashti-layer-accent-01);
  cursor: pointer;
  transition: background-color var(--hashti-duration-fast-01)
    cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-switch[data-size="sm"] {
  inline-size: 2.125rem;
  block-size: 1.125rem;
}

.hashti-switch[data-checked] {
  background: var(--hashti-support-success);
}

.hashti-switch[data-disabled] {
  background: var(--hashti-button-disabled);
  cursor: not-allowed;
}

.hashti-switch[data-invalid] {
  outline: 1px solid var(--hashti-support-error);
}

.hashti-switch:focus-visible {
  outline: 2px solid var(--hashti-focus);
  outline-offset: 2px;
}

.hashti-switch__thumb {
  display: block;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 9999px;
  background: var(--hashti-icon-on-color);
  box-shadow: none;
  inset-inline-start: 0;
  translate: 0 -50%;
  position: absolute;
  top: 50%;
  transition: translate var(--hashti-duration-fast-01)
    cubic-bezier(0.16, 1, 0.3, 1);
}

.hashti-switch[data-size="sm"] .hashti-switch__thumb {
  inline-size: 0.875rem;
  block-size: 0.875rem;
}

.hashti-switch[data-checked] .hashti-switch__thumb {
  translate: 1.25rem -50%;
}

.hashti-switch[data-size="sm"][data-checked] .hashti-switch__thumb {
  translate: 1rem -50%;
}

.hashti-switch[data-disabled] .hashti-switch__thumb {
  background: var(--hashti-text-disabled);
}
```

Geometry notes:

- Track 44×24 with 2px padding (`0.125rem`); thumb 20px; the thumb's travel
  is `track inline-size − thumb − 2×padding` = `2.75rem − 1.25rem − 0.25rem`
  = `1.25rem` on the checked state. For `sm` (34×18, 14px thumb): travel
  `2.125rem − 0.875rem − 0.25rem` = `1rem`. If the arithmetic does not match
  what you measure, trust the DESIGN.md sizes and adjust the translate so
  the thumb lands flush at the inline end — and note the deviation in your
  report.
- `inset-inline-start: 0` + positive `translate` = logical travel: in RTL
  the thumb mirrors automatically. Do not add `[dir="rtl"]` rules.
- The `data-invalid` outline is a placeholder pending the Field cycle's
  recovery recipe — keep it minimal.

`packages/styles/index.css` — the switch import line already exists; keep it
but ensure it reads `@import "./src/switch.css" layer(hashti.components);`
(position: after checkbox, before separator — unchanged).

**Verify**: `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/switch.css` → no matches; `grep -c "data-checked" packages/styles/src/switch.css` → ≥ 3.

### Step 3: Point the barrel at the wrapper; delete the core primitive

`packages/react/src/index.tsx` — remove the `createParts`/`hashtiSwitch`
import and the `Switch` line it produced; add:

```tsx
export { Switch, SwitchThumb } from "./switch";
```

Delete `packages/core/src/switch.ts`. In `packages/core/src/index.ts`
replace the export with a placeholder comment:

```ts
// Hashti-owned primitives live here when ui-sdk ships no equivalent
// behavior. Current components all compose ui-sdk primitives directly.
```

**Verify**: `bun run typecheck` → exit 0; `grep -rn "hashtiSwitch" packages` → no matches.

### Step 4: Docs demo component and page

`apps/docs/src/components/switch-demo.tsx`:

```tsx
"use client";

import { Switch, SwitchThumb } from "@hashti/react";

export function SwitchDemo() {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label className="hashti-choice">
        Airplane mode
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Weekly digest
        <Switch>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Managed by organization
        <Switch disabled defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Compact switch
        <Switch size="sm">
          <SwitchThumb />
        </Switch>
      </label>
    </div>
  );
}
```

Rewrite `apps/docs/content/docs/switch.mdx`:

```mdx
---
title: Switch
description: Toggles a setting on or off.
---

import { SwitchDemo } from "../../src/components/switch-demo";

## Usage

<SwitchDemo client:load />

## Props

| Prop                         | Type           | Description                               |
| ---------------------------- | -------------- | ----------------------------------------- |
| `checked` / `defaultChecked` | `boolean`      | The state.                                |
| `size`                       | `"sm" \| "md"` | Track size: 34×18 or 44×24. Default `md`. |

Wrap the switch and its text in a `<label className="hashti-choice">`. Styling lives in `@hashti/styles` under `.hashti-switch` — a 44×24 full-round track, 20px thumb sliding to the inline end, checked fill in the design's toggle-on color.
```

**Verify**: `bun run typecheck` → exit 0.

## Test plan

No test runner exists in this repo; none is added by this plan. Verification
is: typecheck gates, the greps in Steps 2–3, and the reviewer's rendered
check (track 44×24, thumb 20px, slide on toggle, checked fill, disabled
treatment, sm size, focus ring, RTL logical travel by inspection of the CSS).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `bun run typecheck` exits 0 from the repo root
- [ ] `grep -rn "hashtiSwitch" packages` returns nothing
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}" packages/styles/src/switch.css` returns nothing
- [ ] `grep -c "data-checked" packages/styles/src/switch.css` → ≥ 3
- [ ] `git status --porcelain` lists no files outside the in-scope list
- [ ] Work committed on the worktree branch, one commit per step

## STOP conditions

Stop and report back (do not improvise) if:

- `Switch`/`SwitchThumb` is not exported from `@ui-sdk/react/switch` — quote
  the error.
- The thumb travel arithmetic cannot land the thumb flush at the inline end
  with the DESIGN.md sizes — report your measurement instead of inventing
  sizes.
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching an out-of-scope file.

## Maintenance notes

- After this cycle the ui-sdk-backed list is exhausted; the next cycle is
  the reassessment the program calls for.
- `data-invalid` on the switch awaits the Field cycle's recovery recipe.
- RTL travel comes free from the logical properties; verify visually in the
  Field cycle's RTL pass.
