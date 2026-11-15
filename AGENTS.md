# Agent notes

House rules live in `DESIGN.md` (visual authority) and `PRODUCT.md` (references). This file
records what each agent re-learns the hard way about React Aria in this repo.

## React Aria ground truth

Docs are markdown at `https://react-aria.adobe.com/<Page>.md` (append `.md` to any docs URL).
Index: `https://react-aria.adobe.com/llms.txt`. Read the component page before touching its
component; the composer patterns are in it, not in our source.

### The class name rule that keeps biting us

Passing `className` to a RAC component **replaces** its default `react-aria-<Name>` class; RAC
does not merge. Both stylesheets here still key much of their styling on `.react-aria-*`, so a
wrapper that writes `className={classes("hashti-x", className)}` silently kills those rules.

When wrapping, keep both names:

```tsx
<SliderTrack className={cx("react-aria-SliderTrack", "hashti-slider-track")} />
```

Symptom to look for: a part with no padding, no hover, no selected fill, tiny hit area. Check
with `document.querySelectorAll("[class*='react-aria-']")` on a rendered story — a class the CSS
mentions but the DOM never shows is dead styling.

### Overlay states

`data-entering` lasts one frame for CSS transitions, so the transition belongs in the **default**
state and only the start values in `[data-entering]`; put a different transition in
`[data-exiting]`. Consequence for tests: never assert `toBeVisible()` immediately after opening —
the entry state is `opacity: 0`. Wrap the assertion in `waitFor`.

### Selection

`Select` and `ComboBox` with `selectionMode="multiple"` take **arrays** through `value` /
`defaultValue` / `onChange`. `selectedKeys` / `selectedKey` do not type or work there. Removal UI
belongs in a `TagGroup` inside `SelectValue` (`onRemove` → `state.setValue`), per the Select doc.
ARIA gives a button's children no focus, so a chip's close affordance inside a trigger button can
never be a tab stop: keyboard removal goes on the trigger (`Backspace`/`Delete`), and a plain
key handler passed to RAC's select trigger is replaced — listen on the element.

### Composition

- `classes()` in `utils.ts` keeps a RAC render-prop `className` and a base class together.
- `composeRenderProps` / `mergeProps` when extending a RAC part instead of cloning props.
- Contexts + `slot` (`useSlottedContext`) are how parts find each other; do not re-invent props.
- `render` prop is the supported way to swap the DOM element — keep the element type and spread
  the provided props.

## RAC utilities worth reaching for

| Utility                                                        | Use it when                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `mergeProps`                                                   | chaining handlers, joining class names, deduping ids and refs      |
| `useObjectRef`                                                 | forwarding a ref into a RAC hook or wrapped component              |
| `useId`                                                        | generating ids for label/description/error wiring (props id first) |
| `useLocale`                                                    | locale and layout direction (`dir`) for RTL logic                  |
| `useFilter` / `useCollator`                                    | locale-aware filtering and sorting instead of `String#includes`    |
| `useDateFormatter` / `useNumberFormatter` / `useListFormatter` | any formatted date, number, or list                                |
| `useListData` / `useTreeData`                                  | mutable local collections for lists and trees                      |
| `useField` / `useLabel`                                        | associating a control with label, description, and error           |
| `VisuallyHidden`                                               | text for screen readers only                                       |
| `FocusRing` / `FocusScope`                                     | keyboard-only ring class; focus containment and restore            |
| `PortalProvider`                                               | choose the portal container for overlays and toasts                |
| `SSRProvider`                                                  | React 16/17 SSR only; React 19 needs nothing                       |

## Field parts are standalone

`FieldLabel`, `FieldDescription`, `FieldErrorMessage`, `FieldHelp`, `FieldControl`,
`FieldStatusMessage` and `FieldStatusIcon` each render on their own — no field root, no provider
required. Prefer importing the one part a component needs over wrapping the whole anatomy, and
prefer `Field.*` (or `Field`) only when the full label → guidance → control → recovery order is
wanted. `FieldErrorMessage` degrades to a plain `role="alert"` span when React Aria has no
validation context to consult; inside a field root it stays the RAC part and validation gates it.
`tests/unit/field-parts-standalone.test.tsx` holds that contract.

## Verification recipes used in this repo

Storybook dev on `:6006` is the fastest truth: `iframe.html?id=<story-id>&viewMode=story`.
Playwright scripts are throwaway (never committed). Axe with tags `wcag2a`, `wcag2aa` on the story
and on the docs page. Play functions in stories run automatically, so a red assertion shows up as
`JestExtendError` in the page console — a story that fails its `play` leaves `#storybook-root`
inert, which makes later clicks look broken.

## Model routing (measured 2026-11-13 on `snapp`)

Same three tasks, graded mechanically (create a failing file the tests can check, answer a checkable
question about a 3,878-line stylesheet, describe a rendered screenshot). Transcripts were audited, not
just grepped — a keyword grader scored GLM's vision PASS twice when it had failed.

| Model                               | Vision                | Make a failing test pass | Long-context question |
| ----------------------------------- | --------------------- | ------------------------ | --------------------- |
| `xiaomi/mimo-v2.6-pro-ultraspeed`   | pass 12s              | pass 18s                 | pass 7s               |
| `deepseek/DeepSeek-V4.1-Flash-1017` | pass 60s              | pass 10s                 | pass 9s               |
| `kimi/kimi-k3.1-pro`                | pass 43s              | pass 41s                 | pass 27s              |
| `zai/glm-5.3`                       | file-read only 84s    | pass 55s                 | pass 61s              |
| `qwen/Qwen3-Coder-Next`             | **no image modality** | pass 27s                 | pass 32s              |

Routing that follows from it:

- **Bulk mechanical edits, story sweeps, screenshot capture:** `mimo-v2.6-pro-ultraspeed`. Two to three
  times faster than the rest and still correct.
- **Careful code changes where a test must pass:** `DeepSeek-V4.1-Flash-1017` — fastest correct code,
  strongest long-context, and it can read images.
- **Reading a big stylesheet or diff:** either of those two; both answer in under 10s.
- **Do not** use `qwen/Qwen3-Coder-Next` for anything visual. `zai/glm-5.3` only reads images when the
  agent opens them with a file-read tool; an inline `--file` attachment is rejected by the provider
  ("only supported type(s): 'text'").

Cross-check vision findings before acting on them: three models independently reported an accordion
"disconnected panel" defect that was an artefact of a downscaled contact sheet, while the one claim
that survived measurement (a 19px body indent) was reported with an exact number.

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it is installed, and read
`node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, also search
`node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.
