# Hashti Storybook

Private React/Vite component workbench. Run from the repository root:

```sh
bun run storybook             # http://localhost:6006
bun run build:storybook       # dist/storybook
bun run typecheck:storybook   # config, stories, and public declarations
```

Each command first builds `@hashti/styles` and `@hashti/react` with the existing
package builder. `bun run typecheck` includes the Storybook check. Its TypeScript
configuration clears source aliases, so stories consume the same public `dist`
exports as applications. Config and stories use the repository's strict settings
and `skipLibCheck`; a separate React-only consumer check validates the public
declaration graph with `skipLibCheck: false`. This avoids unrelated Storybook
tooling declaration conflicts with TypeScript 7 and Bun/Vite globals.

During development, Vite watches the package source directories and token
generator. Changes trigger a serialized package rebuild, including declarations,
generated tokens, JS, and CSS. Edits during a build queue another pass. The preview
reloads after the final successful pass; generated outputs cannot trigger a loop.
Vite observes built files to invalidate resolver caches and defers their HMR to
that final reload. Rebuild failures appear in the terminal and the next source
edit retries. This is a full preview reload, so local story state resets. Restart
after dependency or build-configuration changes.

The rebuild queue's focused check is
`bun test ./apps/storybook/.storybook/watch-packages.test.ts`; it also runs with
`bun run test`. The normal `bun run check` includes the static Storybook build.

Stories live in `stories/**/*.stories.ts` or `.tsx`, import components from
`@hashti/react`, use `Meta`/`StoryObj` from `@storybook/react-vite`, and use
interaction helpers from `storybook/test`. The preview imports
`@hashti/react/styles.css` once and wraps every story with the public `Theme`.
The standard toolbar selects `frame-light` or `frame-dark` through `globals.theme`.
The Accessibility panel reports axe results, including incomplete checks for
manual review; static builds alone do not execute interaction/accessibility tests.

The first action batch contains 12 Button and 9 Link stories. Button recommends
four core choices (`primary`, `secondary`, `ghost`, `danger`); all seven variants
remain supported, with `tertiary`, `danger-tertiary`, and `danger-ghost` in the
compatibility story. Both families include Persian and Arabic examples through
real `Theme locale` scopes.

## Field/form batch

| Story file                                                   | Authored coverage                                                                                                                                                                                                                       |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`TextField.stories.tsx`](stories/TextField.stories.tsx)     | Convenience and compound composition, native refs/events/render callbacks, controlled/default values, sizes, read-only copying, validation, long content, and real locale scopes                                                        |
| [`TextArea.stories.tsx`](stories/TextArea.stories.tsx)       | Native multiline editing and rows, textarea refs, controlled/default values, read-only copying, rich recovery, long content, and locale scopes                                                                                          |
| [`SearchField.stories.tsx`](stories/SearchField.stories.tsx) | Grouped Input/ClearButton anatomy, query submission, clear/Escape focus, native FormData, sizes, values, recovery, and locale scopes                                                                                                    |
| [`NumberField.stories.tsx`](stories/NumberField.stories.tsx) | Grouped Input/Button anatomy, decrement/increment slots, bounds and steps, committed values, localized formatting, raw numeric FormData, sizes, and recovery                                                                            |
| [`Form.stories.tsx`](stories/Form.stories.tsx)               | Native first-invalid focus, persistent guidance, application-owned pending/failure/retry, duplicate-submission protection, returned `validationErrors`, long recovery, and localized required/pending/error wording                     |
| [`FieldStatus.stories.tsx`](stories/FieldStatus.stories.tsx) | Appearance-only warning/error/success across shared fields, inline icons, validation precedence, explicit compound status mounting, localized necessity/help, independent Tooltip/Popover actions, long content, and real locale scopes |

The callable field APIs remain shorthand over additive compound parts. `.Root`
retains RAC's original props and whole-tree children, including state render
functions; the [package guide](../../packages/react/README.md#additive-compound-namespaces)
maps the exported parts, native/RAC refs, and slots. Native Input slots remain
string-only; roots accept `null`. Existing raw replacement children and SearchField
`inputProps.className` complete overrides remain supported. Convenience Select and
ComboBox children still supply options; their `.Root`s own the whole RAC tree.

Frame defaults follow label → persistent guidance → control → recovery. The
library reserves a bounded one-line recovery minimum; `forms.css` applies **58px**
required-field Help minimums and **78px** at or below a `24rem` container, at a 16px
root. Long messages grow beyond those minimums instead of clipping; optional fields
are not given blanket invalid styling. The standard theme defaults remain
unchanged. Grouped, collection, and date compounds were added for shared anatomy
and API compatibility, not completed later-family Frame review. Form and raw RAC
exports keep upstream validation ownership.

At its acceptance, the status extension added eight stories to the preserved 54,
for **62 stories**.
Its 8 November bounded acceptance covered **132 passing story/theme/motion cases**. `status` is appearance
only; actual validation remains authoritative. Compound roots do not insert a
status message automatically: mount `.Status` explicitly in `.Help`. Frame's
bordered controls use attached feedback; checkbox/radio groups keep it detached.
Required wording wins over optional wording. Label help is a separate named button
with hover/focus Tooltip and click/keyboard dialog Popover, not a field action.
The [status API](../../packages/react/README.md#field-status-necessity-and-label-help)
documents supported locale strings and native/description ownership.

## Checkbox, Radio, and Switch batch

Each choice family adds **six stories / five authored plays**, for **18 stories /
15 plays**. The current static workbench indexes **80 stories / 178 theme/motion
cases**. The focused choice execution passes **46 cases / 132 filtered / 0 failures**;
it does not claim a new execution of the preserved action, field, and status cases.

| Story file                                             | Authored coverage                                                                                                                                                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Checkbox.stories.tsx`](stories/Checkbox.stories.tsx) | Independent and group choices; selected/mixed/read-only/disabled/invalid states; select-all derived from members; repeated native FormData; detached group recovery; custom label rendering and refs; long Persian/Arabic/German labels |
| [`Radio.stories.tsx`](stories/Radio.stories.tsx)       | One-of-many values; controlled/default groups; disabled skipping and arrow navigation; native validation/submission; detached group recovery; custom composition/refs; long content and real locale scopes                              |
| [`Switch.stories.tsx`](stories/Switch.stories.tsx)     | Immediate local preview changes; selected/read-only/disabled states; sm/md logical LTR/RTL geometry; Space versus Enter semantics; native input/FormData; custom label rendering and refs; long content and real locale scopes          |

The [public choice contract](../../packages/react/README.md#checkbox-radio-and-switch)
keeps RAC's value/input/label ownership. Ordinary Frame label targets have a 44px
minimum and grow with wrapping text; compact table selection retains its previous
16px mark and 18px target. Checkbox/Radio groups own validation and detached recovery.
Switch has no required, invalid, validation, or mixed-state API. Use Checkbox for
a preference committed by Save; these examples do not add persistence to the package.

Code, static Storybook, and both installed-package gates have passed. All **62
final PNGs** have zero recorded geometry/contrast failures or axe violations;
visual review and per-capture incomplete dispositions are being closed separately.
The dated choice evidence covers the exact executed scope. Select/Modal/Popover/Tooltip and settings/nested
editing are the next bounded batch; the documentation website and Figma remain later.

## Select and overlays batch

The fourth batch covers **Select (Dropdown)** and the three overlay primitives:
**Modal (Dialog)**, **Popover**, and **Tooltip**. Each family contributes **six stories
with authored play functions**, adding **24 stories / 20 plays**. The static workbench
now indexes **104 stories**.

| Story file                                           | Authored coverage                                                                                                                                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Select.stories.tsx`](stories/Select.stories.tsx)   | Convenience and compound `.Root`/`.Trigger`/`.Value`/`.Popover`/`.ListBox` composition; rich options with labels & descriptions; sections and disabled keys; controlled/uncontrolled state; Form FormData submission; narrow wrapping and RTL     |
| [`Modal.stories.tsx`](stories/Modal.stories.tsx)     | Sizes `xs`/`sm`/`md`/`lg`; accessible titles and reachable close dismissal; form submission inside modal; nested `Select` with inner-first Escape; independent `overlayClassName`/`overlayRef`/`modalStyle` targets; scrollable long content; RTL |
| [`Popover.stories.tsx`](stories/Popover.stories.tsx) | Placements (`bottom`, `top`, `start`, `end`); rich filter checkbox menu with Apply/Clear; focus containment and Escape dismissal; custom surface styles and ref forwarding; RTL reading direction                                                 |
| [`Tooltip.stories.tsx`](stories/Tooltip.stories.tsx) | Placements and directional arrows; icon-only action toolbar hints; hover vs keyboard focus-visible; immediate Escape dismissal; custom styling and element refs; multiline wrapping and Persian RTL scopes                                        |

The Select trigger inherits Frame's 44px ordinary control height (32/44/48px for `sm`/`md`/`lg`),
10px corners, chevron down rotation on open, and attached recovery band when invalid.
Overlays receive the portable Theme `appearanceClassName` and effective language across portals.
Modal uses Frame's 18px corners (`--hashti-overlay-radius`), an opaque surface, and 50% dark backdrop;
Popover uses 14px corners (`--hashti-popover-radius`) with `0 8px 24px` elevation; Tooltip uses 10px corners.

Run `bun test --timeout 60000 tests/browser/storybook.test.ts` after the static build
to execute the indexed stories in both Frame themes and require successful play
and a11y reporting. Coverage above describes the authored stories; dated rendered,
package, browser, and manual evidence is recorded separately from a successful
static build.

Development dependencies are pinned to Storybook/React-Vite/a11y **10.6.6** and
Vite **8.3.6**, checked against the npm registry and the
[React/Vite setup](https://storybook.js.org/docs/get-started/frameworks/react-vite).
React and React DOM reuse the workspace catalog; Vite deduplicates both.
The existing full build still produces the packages and documentation website.
