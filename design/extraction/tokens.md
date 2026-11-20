> **ARCHIVED 2026-11-20 — imported from ancestor repo (hashti-next); describes an implementation shape (packages/tokens, Storybook, docs/verification.md) that no longer exists here. Treat as historical record.**

# @hashti/tokens — extraction report

Sources (all read in full):

- `packages/tokens/src/frame.ts` (199 lines) — authored Frame palette + working scale
- `packages/tokens/src/relay.ts` (132 lines) — authored Relay palette
- `packages/tokens/src/baseline.ts` (633 lines) — frozen light/dark baseline
- `packages/tokens/src/foundations.ts` (707 lines) — globals, breakpoints, typeStyles
- `packages/tokens/src/tokens.css` (1657 lines) — generated CSS
- `packages/tokens/src/tokens.json` (2056 lines) — generated JSON
- `packages/tokens/src/index.ts` (35 lines) — exports
- `packages/tokens/README.md` (310 lines)

Git log, `--since=2026-11-05 -- packages/tokens`:

```
25575f6 Extract Hashti design system from Carbon
ed371f5 feat(frame): time motion on the Astryx ladder and rebuild the brandbook cards
cb36fc5 fix(docs): pass the mobile, touch, and 3G review
003e009 feat(docs): rebuild the home page from Hashti components
ab35029 fix(frame): align focus rings, radii, backdrops, and neutral tones with DESIGN.md
1f710c1 refactor: update component class names from "cinder" to "hashti" across unit tests
6ea1888 feat(hashti): purge duplications, add live component previews, show/hide code, and native brandbook
afc482d feat(hashti): rebrand entire repository from cinder to hashti (@hashti/react, @hashti/tokens)
5ec9cb6 feat(docs-astro): initialize Astro Fumadocs app and configure pipeline
371f83c feat(brand): expand Hashti brandbook with complete asset suite, multiPNGs, and guidelines
...
```

Counts: 313 baseline roles; Relay maps 318 entries each; Frame maps 343 entries each; 191 globals; 36 typeStyles.

---

## 1. Semantic tokens — Frame light / dark

Frame is the product default. `frame-light` is also the document default (un-themed roots resolve it). Every name below is a real theme-map key and therefore a `--hashti-<name>` CSS variable.

### 1.1 Core palette (measured + authored press/danger)

| Token                    | frame-light | frame-dark |
| ------------------------ | ----------- | ---------- |
| canvas (`background`)    | `#f5f6f8`   | `#18191d`  |
| surface                  | `#ffffff`   | `#22242a`  |
| raised                   | `#eef1f6`   | `#2c2f38`  |
| text                     | `#25272c`   | `#f1f2f6`  |
| muted                    | `#606674`   | `#b1b6c3`  |
| divider                  | `#dde1e8`   | `#3e424d`  |
| control border           | `#7f8795`   | `#7d8493`  |
| primary (neutral action) | `#272a32`   | `#f1f2f6`  |
| primaryHover             | `#434754`   | `#d2d7e4`  |
| primaryActive            | `#555b6b`   | `#b6bfd2`  |
| secondaryActive          | `#cbd2dc`   | `#515765`  |
| onPrimary                | `#ffffff`   | `#22242a`  |
| focus                    | `#365ccb`   | `#a9bdff`  |
| selected                 | `#e7edff`   | `#333f62`  |
| infoSurface              | `#edf2ff`   | `#2c354e`  |
| error                    | `#aa2735`   | `#ffacb3`  |
| errorSurface             | `#ffe8eb`   | `#452830`  |
| dangerHover              | `#91212d`   | `#ffb8be`  |
| dangerActive             | `#771b25`   | `#ffc5ca`  |
| warning                  | `#75500d`   | `#e7c383`  |
| warningSurface           | `#fff0ce`   | `#3e3321`  |
| success                  | `#246343`   | `#a4d9b8`  |
| successSurface           | `#e1f2e8`   | `#203a2b`  |
| aiStart                  | `#5b3fc4`   | `#c4b0ff`  |
| aiEnd                    | `#8b3fb0`   | `#e6b3e0`  |

### 1.2 Backgrounds / surfaces / layers

| Token                               | frame-light                        | frame-dark                             |
| ----------------------------------- | ---------------------------------- | -------------------------------------- |
| `background`                        | `#f5f6f8`                          | `#18191d`                              |
| `background-active`                 | `#dde1e8`                          | `#3e424d`                              |
| `background-brand`                  | `#272a32`                          | `#f1f2f6`                              |
| `background-hover`                  | `#eef1f6`                          | `#2c2f38`                              |
| `background-inverse`                | `#272a32`                          | `#f1f2f6`                              |
| `background-inverse-hover`          | `#474747` (baseline, not authored) | `#e8e8e8` (baseline)                   |
| `background-selected`               | `#e7edff`                          | `#333f62`                              |
| `background-selected-hover`         | `#e7edff`                          | `#333f62`                              |
| `layer-01`                          | `#ffffff`                          | `#22242a`                              |
| `layer-02`                          | `#eef1f6`                          | `#2c2f38`                              |
| `layer-03`                          | `#eef1f6`                          | `#2c2f38`                              |
| `layer-background-01`               | `#f5f6f8`                          | `#18191d`                              |
| `layer-background-02`               | `#ffffff`                          | `#22242a`                              |
| `layer-background-03`               | `#eef1f6`                          | `#2c2f38`                              |
| `layer-hover-01/02/03`              | `#eef1f6`                          | `#2c2f38`                              |
| `layer-active-01/02/03`             | `#eef1f6`                          | `#2c2f38`                              |
| `layer-accent-01/02/03`             | `#eef1f6`                          | `#2c2f38`                              |
| `layer-accent-hover-01/02/03`       | `#dde1e8`                          | `#3e424d`                              |
| `layer-accent-active-01/02/03`      | `#dde1e8`                          | `#3e424d`                              |
| `layer-selected-01/02/03`           | `#e7edff`                          | `#333f62`                              |
| `layer-selected-hover-01/02/03`     | `#e7edff`                          | `#333f62`                              |
| `layer-selected-inverse`            | `#272a32`                          | `#f1f2f6`                              |
| `layer-selected-disabled`           | `#eef1f6`                          | `#2c2f38`                              |
| `field-01/02/03`                    | `#ffffff`                          | `#22242a`                              |
| `field-hover-01/02/03`              | `#eef1f6`                          | `#2c2f38`                              |
| `content-switcher-background`       | `#e0e0e0` (baseline)               | `rgba(0, 0, 0, 0)` (baseline)          |
| `content-switcher-background-hover` | `#d1d1d1` (baseline)               | `rgba(141, 141, 141, 0.12)` (baseline) |
| `content-switcher-selected`         | `#ffffff` (baseline)               | `rgba(141, 141, 141, 0.24)` (baseline) |
| `highlight`                         | `#e7edff`                          | `#333f62`                              |

Higher surfaces saturate deliberately: `layer-01/02/03` = surface/raised/raised; `layer-background-01/02/03` = canvas/surface/raised. Fields stay surface at every level.

### 1.3 Text / icon

| Token                    | frame-light                        | frame-dark           |
| ------------------------ | ---------------------------------- | -------------------- |
| `text-primary`           | `#25272c`                          | `#f1f2f6`            |
| `text-secondary`         | `#606674`                          | `#b1b6c3`            |
| `text-helper`            | `#606674`                          | `#b1b6c3`            |
| `text-placeholder`       | `#606674`                          | `#b1b6c3`            |
| `text-disabled`          | `#7f8795`                          | `#7d8493`            |
| `text-on-color`          | `#ffffff`                          | `#22242a`            |
| `text-on-color-disabled` | `#7f8795`                          | `#7d8493`            |
| `text-inverse`           | `#ffffff`                          | `#22242a`            |
| `text-error`             | `#aa2735`                          | `#ffacb3`            |
| `icon-primary`           | `#25272c`                          | `#f1f2f6`            |
| `icon-secondary`         | `#606674`                          | `#b1b6c3`            |
| `icon-disabled`          | `#7f8795`                          | `#7d8493`            |
| `icon-interactive`       | `#0f62fe` (baseline, not authored) | `#ffffff` (baseline) |
| `icon-inverse`           | `#ffffff`                          | `#22242a`            |
| `icon-on-color`          | `#ffffff`                          | `#22242a`            |
| `icon-on-color-disabled` | `#7f8795`                          | `#7d8493`            |
| `toggle-off`             | `#606674`                          | `#b1b6c3`            |

### 1.4 Borders

| Token                             | frame-light          | frame-dark           |
| --------------------------------- | -------------------- | -------------------- |
| `border-interactive`              | `#365ccb`            | `#a9bdff`            |
| `border-inverse`                  | `#25272c`            | `#f1f2f6`            |
| `border-disabled`                 | `#dde1e8`            | `#3e424d`            |
| `border-strong-01/02/03`          | `#7f8795`            | `#7d8493`            |
| `border-subtle-00/01/02`          | `#dde1e8`            | `#3e424d`            |
| `border-subtle-03`                | `#c6c6c6` (baseline) | `#6f6f6f` (baseline) |
| `border-subtle-selected-01/02/03` | `#365ccb`            | `#a9bdff`            |
| `border-tile-01/02/03`            | `#dde1e8`            | `#3e424d`            |

### 1.5 Buttons

| Token                     | frame-light | frame-dark |
| ------------------------- | ----------- | ---------- |
| `button-primary`          | `#272a32`   | `#f1f2f6`  |
| `button-primary-hover`    | `#434754`   | `#d2d7e4`  |
| `button-primary-active`   | `#555b6b`   | `#b6bfd2`  |
| `button-secondary`        | `#eef1f6`   | `#2c2f38`  |
| `button-secondary-hover`  | `#dde1e8`   | `#3e424d`  |
| `button-secondary-active` | `#cbd2dc`   | `#515765`  |
| `button-tertiary`         | `#7f8795`   | `#7d8493`  |
| `button-tertiary-hover`   | `#eef1f6`   | `#2c2f38`  |
| `button-tertiary-active`  | `#dde1e8`   | `#3e424d`  |
| `button-danger-primary`   | `#aa2735`   | `#ffacb3`  |
| `button-danger-secondary` | `#aa2735`   | `#ffacb3`  |
| `button-danger-hover`     | `#91212d`   | `#ffb8be`  |
| `button-danger-active`    | `#771b25`   | `#ffc5ca`  |
| `button-disabled`         | `#eef1f6`   | `#2c2f38`  |
| `button-separator`        | `#ffffff`   | `#22242a`  |

### 1.6 Focus / links / selection

| Token                  | frame-light | frame-dark |
| ---------------------- | ----------- | ---------- |
| `focus`                | `#365ccb`   | `#a9bdff`  |
| `focus-inset`          | `#ffffff`   | `#22242a`  |
| `focus-inverse`        | `#a9bdff`   | `#365ccb`  |
| `interactive`          | `#365ccb`   | `#a9bdff`  |
| `link-primary`         | `#365ccb`   | `#a9bdff`  |
| `link-primary-hover`   | `#365ccb`   | `#a9bdff`  |
| `link-secondary`       | `#365ccb`   | `#a9bdff`  |
| `link-visited`         | `#365ccb`   | `#a9bdff`  |
| `link-inverse`         | `#a9bdff`   | `#365ccb`  |
| `link-inverse-hover`   | `#a9bdff`   | `#365ccb`  |
| `link-inverse-active`  | `#a9bdff`   | `#365ccb`  |
| `link-inverse-visited` | `#a9bdff`   | `#365ccb`  |

### 1.7 Status pairs + inverse + notification surfaces

| Token                                                         | frame-light                 | frame-dark |
| ------------------------------------------------------------- | --------------------------- | ---------- |
| `support-error`                                               | `#aa2735`                   | `#ffacb3`  |
| `support-error-inverse`                                       | `#ffacb3`                   | `#aa2735`  |
| `support-warning`                                             | `#75500d`                   | `#e7c383`  |
| `support-warning-inverse`                                     | `#e7c383`                   | `#75500d`  |
| `support-success`                                             | `#246343`                   | `#a4d9b8`  |
| `support-success-inverse`                                     | `#a4d9b8`                   | `#246343`  |
| `support-info`                                                | `#365ccb`                   | `#a9bdff`  |
| `support-info-inverse`                                        | `#a9bdff`                   | `#365ccb`  |
| `notification-background-error`                               | `#ffe8eb`                   | `#452830`  |
| `notification-background-warning`                             | `#fff0ce`                   | `#3e3321`  |
| `notification-background-success`                             | `#e1f2e8`                   | `#203a2b`  |
| `notification-background-info`                                | `#edf2ff`                   | `#2c354e`  |
| `notification-action-hover`                                   | `#eef1f6`                   | `#2c2f38`  |
| `notification-action-tertiary-inverse`                        | `#ffffff`                   | `#0f62fe`  |
| `notification-action-tertiary-inverse-hover`                  | `#f4f4f4`                   | `#0050e6`  |
| `notification-action-tertiary-inverse-active`                 | `#c6c6c6`                   | `#002d9c`  |
| `notification-action-tertiary-inverse-text`                   | `#161616`                   | `#ffffff`  |
| `notification-action-tertiary-inverse-text-on-color-disabled` | `rgba(255, 255, 255, 0.25)` | `#8d8d8d`  |
| `support-caution-major`                                       | `#ff832b`                   | `#ff832b`  |
| `support-caution-minor`                                       | `#f1c21b`                   | `#f1c21b`  |
| `support-caution-undefined`                                   | `#8a3ffc`                   | `#a56eff`  |

Inverse status roles use the opposite Frame palette's color (per README); notification backgrounds pair with same-theme foregrounds, info foreground = focus blue.

`status-*` (rainbow set, baseline; unchanged by Frame):

| Token                             | frame-light | frame-dark |
| --------------------------------- | ----------- | ---------- |
| `status-blue`                     | `#0043ce`   | `#4589ff`  |
| `status-gray`                     | `#6f6f6f`   | `#8d8d8d`  |
| `status-green`                    | `#24a148`   | `#42be65`  |
| `status-orange`                   | `#ff832b`   | `#ff832b`  |
| `status-orange-outline`           | `#ba4e00`   | `#ff832b`  |
| `status-purple`                   | `#8a3ffc`   | `#a56eff`  |
| `status-red`                      | `#da1e28`   | `#fa4d56`  |
| `status-yellow`                   | `#f1c21b`   | `#f1c21b`  |
| `status-yellow-outline`           | `#8e6a00`   | `#f1c21b`  |
| `status-accessibility-background` | `#ffffff`   | `#161616`  |

### 1.8 AI / transparency

| Token                                        | frame-light                 | frame-dark                  |
| -------------------------------------------- | --------------------------- | --------------------------- |
| `ai-gradient-start`                          | `#5b3fc4`                   | `#c4b0ff`                   |
| `ai-gradient-end`                            | `#8b3fb0`                   | `#e6b3e0`                   |
| `ai-aura-start`                              | `rgba(69, 137, 255, 0.1)`   | `rgba(69, 137, 255, 0.1)`   |
| `ai-aura-start-sm`                           | `rgba(69, 137, 255, 0.16)`  | `rgba(69, 137, 255, 0.16)`  |
| `ai-aura-end`                                | `rgba(255, 255, 255, 0)`    | `rgba(0, 0, 0, 0)`          |
| `ai-aura-hover-start`                        | `rgba(69, 137, 255, 0.32)`  | `rgba(69, 137, 255, 0.4)`   |
| `ai-aura-hover-end`                          | `rgba(255, 255, 255, 0)`    | `rgba(0, 0, 0, 0)`          |
| `ai-aura-hover-background`                   | `#edf5ff`                   | `#333333`                   |
| `ai-border-start`                            | `rgba(166, 200, 255, 0.64)` | `rgba(166, 200, 255, 0.36)` |
| `ai-border-end`                              | `#78a9ff`                   | `#4589ff`                   |
| `ai-border-strong`                           | `#4589ff`                   | `#78a9ff`                   |
| `ai-inner-shadow`                            | `rgba(69, 137, 255, 0.1)`   | `rgba(69, 137, 255, 0.16)`  |
| `ai-drop-shadow`                             | `rgba(15, 98, 254, 0.1)`    | `rgba(0, 0, 0, 0.28)`       |
| `ai-overlay`                                 | `rgba(0, 17, 65, 0.5)`      | `rgba(0, 0, 0, 0.5)`        |
| `ai-popover-background`                      | `#ffffff`                   | `#161616`                   |
| `ai-popover-caret-bottom`                    | `#78a9ff`                   | `#4589ff`                   |
| `ai-popover-caret-bottom-background`         | `#eaf1ff`                   | `#202d45`                   |
| `ai-popover-caret-bottom-background-actions` | `#e9effa`                   | `#1e283a`                   |
| `ai-popover-caret-center`                    | `#a0c3ff`                   | `#4870b5`                   |
| `ai-popover-shadow-outer-01`                 | `rgba(0, 67, 206, 0.06)`    | `rgba(0, 0, 0, 0.12)`       |
| `ai-popover-shadow-outer-02`                 | `rgba(0, 0, 0, 0.04)`       | `rgba(0, 0, 0, 0.08)`       |
| `ai-skeleton-background`                     | `#d0e2ff`                   | `rgba(120, 169, 255, 0.5)`  |
| `ai-skeleton-element-background`             | `#4589ff`                   | `rgba(120, 169, 255, 0.3)`  |
| `overlay`                                    | `rgb(18 22 32 / 50%)`       | `rgb(18 22 32 / 50%)`       |
| `shadow`                                     | `rgb(0 0 0 / 14%)`          | `rgb(0 0 0 / 14%)`          |
| `skeleton-background`                        | `#e8e8e8`                   | `#292929`                   |
| `skeleton-element`                           | `#c6c6c6`                   | `#393939`                   |

### 1.9 Tag family (baseline, 10 hues)

Light — background / border / color / hover:

| Hue       | bg        | border    | color     | hover     |
| --------- | --------- | --------- | --------- | --------- |
| blue      | `#d0e2ff` | `#78a9ff` | `#0043ce` | `#b8d3ff` |
| cool-gray | `#dde1e6` | `#a2a9b0` | `#121619` | `#cdd3da` |
| cyan      | `#bae6ff` | `#33b1ff` | `#00539a` | `#99daff` |
| gray      | `#e0e0e0` | `#a8a8a8` | `#161616` | `#d1d1d1` |
| green     | `#a7f0ba` | `#42be65` | `#0e6027` | `#74e792` |
| magenta   | `#ffd6e8` | `#ff7eb6` | `#9f1853` | `#ffbdda` |
| purple    | `#e8daff` | `#be95ff` | `#6929c4` | `#dcc7ff` |
| red       | `#ffd7d9` | `#ff8389` | `#a2191f` | `#ffc2c5` |
| teal      | `#9ef0f0` | `#08bdba` | `#005d5d` | `#57e5e5` |
| warm-gray | `#e5e0df` | `#ada8a8` | `#171414` | `#d8d0cf` |

Dark — background / border / color / hover:

| Hue       | bg        | border    | color     | hover     |
| --------- | --------- | --------- | --------- | --------- |
| blue      | `#0043ce` | `#4589ff` | `#d0e2ff` | `#0053ff` |
| cool-gray | `#4d5358` | `#878d96` | `#f2f4f8` | `#5d646a` |
| cyan      | `#00539a` | `#1192e8` | `#bae6ff` | `#0066bd` |
| gray      | `#525252` | `#8d8d8d` | `#f4f4f4` | `#636363` |
| green     | `#0e6027` | `#24a148` | `#a7f0ba` | `#11742f` |
| magenta   | `#9f1853` | `#ee5396` | `#ffd6e8` | `#bf1d63` |
| purple    | `#6929c4` | `#a56eff` | `#e8daff` | `#7c3dd6` |
| red       | `#a2191f` | `#fa4d56` | `#ffd7d9` | `#c21e25` |
| teal      | `#005d5d` | `#009d9a` | `#9ef0f0` | `#007070` |
| warm-gray | `#565151` | `#8f8b8b` | `#f7f3f2` | `#696363` |

### 1.10 Chat family (baseline)

| Token                       | frame-light                 | frame-dark                  |
| --------------------------- | --------------------------- | --------------------------- |
| `chat-avatar-agent`         | `#393939`                   | `#c6c6c6`                   |
| `chat-avatar-bot`           | `#6f6f6f`                   | `#8d8d8d`                   |
| `chat-avatar-user`          | `#0f62fe`                   | `#4589ff`                   |
| `chat-bubble-agent`         | `#ffffff`                   | `#262626`                   |
| `chat-bubble-agent-text`    | `#161616`                   | `#f4f4f4`                   |
| `chat-bubble-border`        | `#e0e0e0`                   | `#525252`                   |
| `chat-bubble-user`          | `#e0e0e0`                   | `#393939`                   |
| `chat-bubble-user-text`     | `#161616`                   | `#f4f4f4`                   |
| `chat-button`               | `#0f62fe`                   | `#78a9ff`                   |
| `chat-button-hover`         | `rgba(141, 141, 141, 0.12)` | `rgba(141, 141, 141, 0.16)` |
| `chat-button-active`        | `rgba(141, 141, 141, 0.5)`  | `rgba(141, 141, 141, 0.4)`  |
| `chat-button-selected`      | `rgba(141, 141, 141, 0.2)`  | `rgba(141, 141, 141, 0.24)` |
| `chat-button-text-hover`    | `#0043ce`                   | `#a6c8ff`                   |
| `chat-button-text-selected` | `#525252`                   | `#c6c6c6`                   |
| `chat-header-background`    | `#ffffff`                   | `#262626`                   |
| `chat-header-text`          | `#161616`                   | `#f4f4f4`                   |
| `chat-prompt-background`    | `#ffffff`                   | `#161616`                   |
| `chat-prompt-border-start`  | `#f4f4f4`                   | `#262626`                   |
| `chat-prompt-border-end`    | `rgba(244, 244, 244, 0)`    | `rgba(38, 38, 38, 0)`       |
| `chat-prompt-text`          | `#161616`                   | `#f4f4f4`                   |
| `chat-shell-background`     | `#ffffff`                   | `#262626`                   |

### 1.11 Syntax family (baseline, 88 tokens; identical name→value across all four themes except light/dark split)

Light, grouped by value:

- `#697077` — `syntax-angle-bracket`
- `#007d79` — `syntax-annotation`, `syntax-class-name`, `syntax-namespace`, `syntax-self`, `syntax-tag`, `syntax-tag-name`, `syntax-type`, `syntax-type-name`, `syntax-type-operator`
- `#343a3f` — `syntax-arithmetic-operator`, `syntax-bitwise-operator`, `syntax-brace`, `syntax-bracket`, `syntax-compare-operator`, `syntax-content-separator`, `syntax-deref-operator`, `syntax-escape`, `syntax-logic-operator`, `syntax-operator`, `syntax-paren`, `syntax-punctuation`, `syntax-separator`, `syntax-square-bracket`, `syntax-update-operator`, `syntax-url`
- `#161616` — `syntax-atom`, `syntax-attribute-value`, `syntax-bool`, `syntax-character`, `syntax-color`, `syntax-content`, `syntax-doc-string`, `syntax-emphasis`, `syntax-list`, `syntax-literal`, `syntax-macro-name`, `syntax-monospace`, `syntax-null`, `syntax-processing-instruction`, `syntax-string`, `syntax-strong`, `syntax-strikethrough`
- `#00539a` — `syntax-attribute`, `syntax-attribute-name`, `syntax-definition`, `syntax-definition-keyword`, `syntax-definition-operator`, `syntax-heading`, `syntax-heading-1`…`syntax-heading-6`, `syntax-property-name`
- `#198038` — `syntax-block-comment`, `syntax-comment`, `syntax-doc-comment`, `syntax-document-meta`, `syntax-float`, `syntax-integer`, `syntax-line-comment`, `syntax-meta`, `syntax-number`, `syntax-quote`, `syntax-unit`
- `#0f62fe` — `syntax-constant`, `syntax-keyword`, `syntax-label-name`, `syntax-link`, `syntax-local`, `syntax-modifier`, `syntax-name`, `syntax-operator-keyword`, `syntax-special`, `syntax-standard`, `syntax-variable`, `syntax-variable-name`
- `#6929c4` — `syntax-control-keyword`, `syntax-control-operator`, `syntax-module-keyword`, `syntax-regexp`
- `#ffd7d9` — `syntax-deleted`
- `#a7f0ba` — `syntax-inserted`
- `#da1e28` — `syntax-invalid`
- `#8e6a00` — `syntax-function`
- `#8a3ffc` — `syntax-special-string`

Dark, grouped by value:

- `#8d8d8d` — `syntax-angle-bracket`
- `#08bdba` — `syntax-annotation`
- `#e0e0e0` — `syntax-arithmetic-operator`, `syntax-bitwise-operator`, `syntax-brace`, `syntax-bracket`, `syntax-compare-operator`, `syntax-content-separator`, `syntax-deref-operator`, `syntax-escape`, `syntax-logic-operator`, `syntax-operator`, `syntax-paren`, `syntax-punctuation`, `syntax-separator`, `syntax-square-bracket`, `syntax-update-operator`, `syntax-url`
- `#f4f4f4` — `syntax-atom`, `syntax-attribute-value`, `syntax-bool`, `syntax-character`, `syntax-color`, `syntax-content`, `syntax-doc-string`, `syntax-emphasis`, `syntax-list`, `syntax-literal`, `syntax-macro-name`, `syntax-monospace`, `syntax-null`, `syntax-processing-instruction`, `syntax-string`, `syntax-strong`, `syntax-strikethrough`
- `#33b1ff` — `syntax-attribute`, `syntax-attribute-name`, `syntax-definition`, `syntax-definition-keyword`, `syntax-definition-operator`, `syntax-heading`, `syntax-heading-1`…`syntax-heading-6`, `syntax-property-name`
- `#42be65` — `syntax-block-comment`, `syntax-comment`, `syntax-doc-comment`, `syntax-document-meta`, `syntax-line-comment`, `syntax-meta`, `syntax-quote`
- `#6fdc8c` — `syntax-float`, `syntax-integer`, `syntax-number`, `syntax-unit`
- `#4589ff` — `syntax-constant`, `syntax-keyword`, `syntax-link`, `syntax-modifier`, `syntax-operator-keyword`, `syntax-special`, `syntax-standard`
- `#be95ff` — `syntax-control-keyword`, `syntax-control-operator`, `syntax-module-keyword`, `syntax-regexp`, `syntax-special-string`
- `#a6c8ff` — `syntax-label-name`, `syntax-local`, `syntax-name`, `syntax-variable`, `syntax-variable-name`
- `#3ddbd9` — `syntax-class-name`, `syntax-namespace`, `syntax-self`, `syntax-tag`, `syntax-tag-name`, `syntax-type`, `syntax-type-name`, `syntax-type-operator`
- `#a2191f` — `syntax-deleted`
- `#198038` — `syntax-inserted`
- `#fa4d56` — `syntax-invalid`
- `#f1c21b` — `syntax-function`

### 1.12 Geometry in theme maps

| Token            | frame-light / frame-dark | relay-light / relay-dark |
| ---------------- | ------------------------ | ------------------------ |
| `control-radius` | `0.625rem` (10px)        | `0.5rem` (8px)           |
| `group-radius`   | `0.875rem` (14px)        | not defined              |
| `popover-radius` | `1.125rem` (18px)        | `0.75rem` (12px)         |
| `overlay-radius` | `1.125rem` (18px)        | `1.25rem` (20px)         |
| `focus-width`    | `2px`                    | `2px`                    |
| `focus-offset`   | `2px`                    | `2px`                    |

---

## 2. Relay deltas (second shipped theme)

Relay = frozen Carbon-pattern baseline + authored palette. Values below are the authored ones (`relay.ts`); everything else equals `baseline.ts`.

| Role                                          | relay-light                       | relay-dark                        |
| --------------------------------------------- | --------------------------------- | --------------------------------- |
| `background`                                  | `#f5f5f5`                         | `#151515`                         |
| `background-hover`                            | `#eeeeee`                         | `#303030`                         |
| `background-active`                           | `#e5e5e5`                         | `#3d3d3d`                         |
| `background-selected` / `-hover`              | `#e5e5e5`                         | `#3d3d3d`                         |
| `background-inverse`                          | `#171717`                         | `#f4f4f4`                         |
| `text-primary`                                | `#171717`                         | `#f4f4f4`                         |
| `text-secondary` / `-helper` / `-placeholder` | `#606060`                         | `#b9b9b9`                         |
| `text-disabled`                               | `#818181`                         | `#898989`                         |
| `text-on-color` / `-inverse`                  | `#ffffff`                         | `#151515`                         |
| `border-disabled`                             | `#dfdfdf`                         | `#444444`                         |
| `border-inverse`                              | `#171717`                         | `#f4f4f4`                         |
| `border-strong-01/02/03`                      | `#848484`                         | `#818181`                         |
| `border-subtle-00/01/02`                      | `#dfdfdf`                         | `#444444`                         |
| `border-subtle-03`                            | `#c6c6c6`                         | `#6f6f6f`                         |
| `border-subtle-selected-*`                    | `#848484`                         | `#818181`                         |
| `border-tile-*`                               | `#dfdfdf`                         | `#444444`                         |
| `focus` / `interactive` / `link-primary`      | `#3346a8`                         | `#b3beff`                         |
| `focus-inset`                                 | `#ffffff`                         | `#242424`                         |
| `focus-inverse`                               | `#ffffff`                         | `#151515`                         |
| `border-interactive`                          | `#0f62fe`                         | `#4589ff`                         |
| `link-secondary`                              | `#0043ce`                         | `#a6c8ff`                         |
| `link-inverse`                                | `#78a9ff`                         | `#0f62fe`                         |
| `button-primary`                              | `#171717`                         | `#f4f4f4`                         |
| `button-primary-hover`                        | `#383838`                         | `#d7d7d7`                         |
| `button-primary-active`                       | `#525252`                         | `#b9b9b9`                         |
| `button-secondary`                            | `#eeeeee`                         | `#303030`                         |
| `button-secondary-hover`                      | `#e5e5e5`                         | `#3d3d3d`                         |
| `button-secondary-active`                     | `#dfdfdf`                         | `#444444`                         |
| `button-tertiary`                             | `#848484`                         | `#818181`                         |
| `button-danger-primary`                       | `#b42332`                         | `#ff9ca3`                         |
| `button-danger-hover`                         | `#941d2a`                         | `#ffbcc1`                         |
| `button-danger-active`                        | `#761723`                         | `#fa747e`                         |
| `button-disabled`                             | `#eeeeee`                         | `#303030`                         |
| `support-error` / `text-error`                | `#b42332`                         | `#ff9ca3`                         |
| `notification-background-error`               | `#fff0f2`                         | `#3d2327`                         |
| `layer-01/02/03`                              | `#ffffff` / `#eeeeee` / `#e5e5e5` | `#242424` / `#303030` / `#3d3d3d` |
| `field-01/02/03`                              | `#ffffff`                         | `#242424`                         |
| `field-hover-*`                               | `#eeeeee`                         | `#303030`                         |
| `highlight`                                   | `#e5e5e5`                         | `#3d3d3d`                         |
| `overlay`                                     | `rgb(0 0 0 / 48%)`                | `rgb(0 0 0 / 48%)`                |
| `shadow`                                      | `rgb(0 0 0 / 16%)`                | `rgb(0 0 0 / 16%)`                |
| `content-switcher-background`                 | `#ffffff`                         | `#242424`                         |
| `content-switcher-background-hover`           | `#eeeeee`                         | `#303030`                         |
| `toggle-off`                                  | `#606060`                         | `#b9b9b9`                         |

Relay keeps baseline families (`tag-*`, `status-*`, `syntax-*`, `chat-*`, `ai-*`) untouched; Relay has no `ai-gradient-start/end`, no `group-radius`.

---

## 3. Typography

### 3.1 Font stacks

| Token                               | Frame                                                                                          | Relay / global                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `font-sans`                         | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`          | `"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif`     |
| `font-mono`                         | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`       | `"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace` |
| `code-01/02-font-family`            | `'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace` | same                                                       |
| `fluid-quotation-01/02-font-family` | `'IBM Plex Serif', 'Georgia', Times, serif`                                                    | same                                                       |

No fonts are bundled; consumers supply them.

### 3.2 Frame working roles (theme-scoped, 23 scalars + `size-md` + `font-sans`)

| Role                              | fontSize           | lineHeight                          | weight                              | letterSpacing |
| --------------------------------- | ------------------ | ----------------------------------- | ----------------------------------- | ------------- |
| `body-01`                         | `0.875rem` (14px)  | `1.5` (21px)                        | `400`                               | `0`           |
| `body-02`                         | `1rem` (16px)      | `1.5` (24px)                        | `400`                               | `0`           |
| `body-compact-01` (button action) | `0.875rem` (14px)  | `1.4285714285714286` = 20/14 (20px) | `500`                               | `0`           |
| `label-01` (field label)          | `0.875rem` (14px)  | `1.4285714285714286` = 20/14 (20px) | `600`                               | `0`           |
| `helper-text-01` (help/recovery)  | `0.8125rem` (13px) | `1.25rem` (length, 20px)            | inherited (no `-font-weight` token) | `0`           |
| `heading-03` (dialog title)       | `1.125rem` (18px)  | `1.4` (25.2px)                      | `600`                               | `0`           |

Frame-only headline step (DESIGN.md's 30px headline; not in `foundations`):

| Role       | fontSize          | lineHeight   | weight | letterSpacing |
| ---------- | ----------------- | ------------ | ------ | ------------- |
| `headline` | `1.875rem` (30px) | `1.2` (36px) | `600`  | `-0.03em`     |

`helper-text-01-line-height` is deliberately a length so it also reserves the help region's minimum block size. The 25 foundations Frame owns: those 23 type scalars + `font-sans` + `size-md`.

### 3.3 Frozen `foundations` / Relay values for the same names (differ from Frame)

| Role              | fontSize   | lineHeight | weight    | letterSpacing |
| ----------------- | ---------- | ---------- | --------- | ------------- |
| `body-01`         | `0.875rem` | `1.42857`  | `400`     | `0.16px`      |
| `body-02`         | `1rem`     | `1.5`      | `400`     | `0`           |
| `body-compact-01` | `0.875rem` | `1.28572`  | `400`     | `0.16px`      |
| `label-01`        | `0.75rem`  | `1.33333`  | `400`     | `0.32px`      |
| `helper-text-01`  | `0.75rem`  | `1.33333`  | inherited | `0.32px`      |
| `heading-03`      | `1.25rem`  | `1.4`      | `400`     | `0`           |

### 3.4 Full 36-role type scale (base values, `typeStyles` / `foundations`)

| Role                 | size     | lineHeight | weight | letterSpacing |
| -------------------- | -------- | ---------- | ------ | ------------- |
| `body-01`            | 0.875rem | 1.42857    | 400    | 0.16px        |
| `body-02`            | 1rem     | 1.5        | 400    | 0             |
| `body-compact-01`    | 0.875rem | 1.28572    | 400    | 0.16px        |
| `body-compact-02`    | 1rem     | 1.375      | 400    | 0             |
| `code-01`            | 0.75rem  | 1.33333    | 400    | 0.32px        |
| `code-02`            | 0.875rem | 1.42857    | 400    | 0.32px        |
| `display-01`         | 2.625rem | 1.19       | 300    | 0             |
| `display-02`         | 2.625rem | 1.19       | 600    | 0             |
| `display-03`         | 2.625rem | 1.19       | 300    | 0             |
| `display-04`         | 2.625rem | 1.19       | 300    | 0             |
| `fluid-display-01`   | 2.625rem | 1.19       | 300    | 0             |
| `fluid-display-02`   | 2.625rem | 1.19       | 600    | 0             |
| `fluid-display-03`   | 2.625rem | 1.19       | 300    | 0             |
| `fluid-display-04`   | 2.625rem | 1.19       | 300    | 0             |
| `fluid-heading-03`   | 1.25rem  | 1.4        | 400    | 0             |
| `fluid-heading-04`   | 1.75rem  | 1.28572    | 400    | 0             |
| `fluid-heading-05`   | 2rem     | 1.25       | 400    | 0             |
| `fluid-heading-06`   | 2rem     | 1.25       | 600    | 0             |
| `fluid-paragraph-01` | 1.5rem   | 1.334      | 300    | 0             |
| `fluid-quotation-01` | 1.25rem  | 1.3        | 400    | 0             |
| `fluid-quotation-02` | 2rem     | 1.25       | 300    | 0             |
| `heading-01`         | 0.875rem | 1.42857    | 600    | 0.16px        |
| `heading-02`         | 1rem     | 1.5        | 600    | 0             |
| `heading-03`         | 1.25rem  | 1.4        | 400    | 0             |
| `heading-04`         | 1.75rem  | 1.28572    | 400    | 0             |
| `heading-05`         | 2rem     | 1.25       | 400    | 0             |
| `heading-06`         | 2.625rem | 1.199      | 300    | 0             |
| `heading-07`         | 3.375rem | 1.199      | 300    | 0             |
| `heading-compact-01` | 0.875rem | 1.28572    | 600    | 0.16px        |
| `heading-compact-02` | 1rem     | 1.375      | 600    | 0             |
| `helper-text-01`     | 0.75rem  | 1.33333    | —      | 0.32px        |
| `helper-text-02`     | 0.875rem | 1.28572    | —      | 0.16px        |
| `label-01`           | 0.75rem  | 1.33333    | 400    | 0.32px        |
| `label-02`           | 0.875rem | 1.28572    | 400    | 0.16px        |
| `legal-01`           | 0.75rem  | 1.33333    | 400    | 0.32px        |
| `legal-02`           | 0.875rem | 1.28572    | 400    | 0.16px        |

Breakpoint overrides exist only in `typeStyles` (not in CSS variables). Highlights: `display-03` → md 3.375rem/1.18, lg 3.75rem/1.16/−0.64px, xlg 4.75rem/1.13, max 5.25rem/1.11/−0.96px; `display-04` → md 4.25rem/1.15, lg 5.75rem/1.11, xlg 7.625rem/1.07, max 9.75rem/1.05; `fluid-heading-05` → md 2.25rem/1.22, lg 2.625rem/1.19, xlg 3rem/1.17, max 3.75rem; `fluid-paragraph-01` → lg 1.75rem/1.28572, max 2rem/1.25. Overrides are sparse and must be applied cumulatively. CSS keeps base values only.

Breakpoints: sm 20rem/4 col/margin 0; md 42rem/8/1rem; lg 66rem/16/1rem; xlg 82rem/16/1rem; max 99rem/16/1.5rem.

---

## 4. Radius, spacing, size

### 4.1 Radius

| Token               | Value      |
| ------------------- | ---------- |
| `border-radius-00`  | `0px`      |
| `border-radius-02`  | `0.125rem` |
| `border-radius-04`  | `0.25rem`  |
| `border-radius-08`  | `0.5rem`   |
| `border-radius-16`  | `1rem`     |
| `border-radius-24`  | `1.5rem`   |
| `border-radius-max` | `999999px` |

Semantic radii: Frame `control-radius` 0.625rem / `group-radius` 0.875rem / `popover-radius` 1.125rem / `overlay-radius` 1.125rem; Relay 0.5 / (none) / 0.75 / 1.25rem.

### 4.2 Spacing

| Token        | Value      |
| ------------ | ---------- |
| `spacing-01` | `0.125rem` |
| `spacing-02` | `0.25rem`  |
| `spacing-03` | `0.5rem`   |
| `spacing-04` | `0.75rem`  |
| `spacing-05` | `1rem`     |
| `spacing-06` | `1.5rem`   |
| `spacing-07` | `2rem`     |
| `spacing-08` | `2.5rem`   |
| `spacing-09` | `3rem`     |
| `spacing-10` | `4rem`     |
| `spacing-11` | `5rem`     |
| `spacing-12` | `6rem`     |
| `spacing-13` | `10rem`    |

### 4.3 Size (control heights)

| Token               | Frozen foundation                          | Frame theme      | Notes                                                          |
| ------------------- | ------------------------------------------ | ---------------- | -------------------------------------------------------------- |
| `size-xs`           | `1.5rem` (24px)                            | —                |                                                                |
| `size-sm`           | `2rem` (32px)                              | —                | Frame `sm` button                                              |
| `size-md`           | `2.5rem` (40px)                            | `2.75rem` (44px) | ordinary control minimum; explicit `md` and omitted Frame size |
| `size-lg`           | `3rem` (48px)                              | —                | Frame `lg` button                                              |
| `size-xl`           | `4rem` (64px)                              | —                |                                                                |
| `size-2xl`          | `5rem` (80px)                              | —                |                                                                |
| `container-01`…`05` | `1.5rem`, `2rem`, `2.5rem`, `3rem`, `4rem` | —                | container widths                                               |

Minimums can grow with content/text scaling. Omitted Button size behaviour lives in the React Frame recipe, not in tokens.

---

## 5. Shadow and motion

Shadow is a color token, not a shadow stack: `shadow` = `rgb(0 0 0 / 14%)` (Frame, both themes), `rgb(0 0 0 / 16%)` (Relay, both). Components compose their own stacks, e.g. `0 1px 3px`, `0 8px 24px`, `0 16px 48px var(--hashti-shadow)` in `packages/react/src/frame.css`; Relay uses `0 8px 24px` and `0 16px 48px`.

Backdrop: `overlay` = `rgb(18 22 32 / 50%)` (Frame both), `rgb(0 0 0 / 48%)` (Relay both). `ai-overlay` = `rgba(0, 17, 65, 0.5)` light / `rgba(0, 0, 0, 0.5)` dark.

Durations:

| Token                  | Value   |
| ---------------------- | ------- |
| `duration-fast-01`     | `130ms` |
| `duration-fast-02`     | `175ms` |
| `duration-moderate-01` | `230ms` |
| `duration-moderate-02` | `310ms` |
| `duration-slow-01`     | `410ms` |
| `duration-slow-02`     | `730ms` |

Easings:

| Token                      | Value                             |
| -------------------------- | --------------------------------- |
| `ease-standard-productive` | `cubic-bezier(0.2, 0, 0.38, 0.9)` |
| `ease-standard-expressive` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| `ease-entrance-productive` | `cubic-bezier(0, 0, 0.38, 0.9)`   |
| `ease-entrance-expressive` | `cubic-bezier(0, 0, 0.3, 1)`      |
| `ease-exit-productive`     | `cubic-bezier(0.2, 0, 1, 0.9)`    |
| `ease-exit-expressive`     | `cubic-bezier(0.4, 0.14, 1, 1)`   |

Pressed scale: **not a token** anywhere in `packages/tokens`. It exists only as component CSS literals in `packages/react/src/frame.css`: buttons/filter tags `scale(0.97)`, `sm` `0.98`, `lg` `0.96`; checkbox/radio control `0.9`; calendar cell `0.94`. No elevation tokens.

---

## 6. Frame theme → public CSS variable mapping

Naming convention:

- Every semantic/foundation token becomes a CSS custom property `--hashti-<token-name>` in `@layer hashti.tokens`. Example: `text-primary` → `--hashti-text-primary`; `control-radius` → `--hashti-control-radius`.
- JS helper: `token("text-primary")` → `"var(--hashti-text-primary)"`; it is a live reference, whereas `themes["frame-light"]["text-primary"]` is a fixed value.
- Themes are selected by `data-hashti-theme="frame-light" | "frame-dark" | "relay-light" | "relay-dark"` on any root; nested roots override. `:root`/`[data-hashti-theme="frame-light"]` share one block, so Frame light is the document default.
- Layers: `data-hashti-layer="0|1|2"`. Contextual aliases select suffix `01/02/03` for levels 0/1/2; `border-subtle` uses `00/01/02` instead; `layer-background` = containing surface. `nextLayer()` maps 0→1, 1→2, 2→2.
- Private legacy machinery is `--hashti-internal-legacy-*` (not in JSON, not via `token()`), generated on `:root`/`body` outside Frame to let document-level overrides survive.

Frame palette → token map (README table, verified against `frame.ts`):

| Frame role          | Light                 | Dark                  | Public tokens                                                                                                                                                                                                                                              |
| ------------------- | --------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canvas              | `#f5f6f8`             | `#18191d`             | `background`, `layer-background-01`                                                                                                                                                                                                                        |
| Surface             | `#ffffff`             | `#22242a`             | `layer-01`, `layer-background-02`, `field-01/02/03`, `focus-inset`                                                                                                                                                                                         |
| Raised              | `#eef1f6`             | `#2c2f38`             | `layer-02/03`, `layer-background-03`, all `layer-hover-*`, `layer-active-*`, `layer-accent-*`, `field-hover-*`, `background-hover`, `button-secondary`, `button-tertiary-hover`, `button-disabled`, `layer-selected-disabled`, `notification-action-hover` |
| Text                | `#25272c`             | `#f1f2f6`             | `text-primary`, `icon-primary`, `border-inverse`                                                                                                                                                                                                           |
| Muted               | `#606674`             | `#b1b6c3`             | `text-secondary`, `text-helper`, `text-placeholder`, `icon-secondary`, `toggle-off`                                                                                                                                                                        |
| Divider             | `#dde1e8`             | `#3e424d`             | `border-subtle-00/01/02`, `border-tile-01/02/03`, `border-disabled`, all `layer-accent-hover/active-*`, `button-secondary-hover`, `button-tertiary-active`, `background-active`                                                                            |
| Control border      | `#7f8795`             | `#7d8493`             | `border-strong-01/02/03`, `button-tertiary`, `text-disabled`, `icon-disabled`, `text-on-color-disabled`, `icon-on-color-disabled`                                                                                                                          |
| Neutral action      | `#272a32`             | `#f1f2f6`             | `button-primary`, `background-brand`, `background-inverse`, `layer-selected-inverse`                                                                                                                                                                       |
| Action hover        | `#434754`             | `#d2d7e4`             | `button-primary-hover`                                                                                                                                                                                                                                     |
| Action press        | `#555b6b`             | `#b6bfd2`             | `button-primary-active`                                                                                                                                                                                                                                    |
| Secondary press     | `#cbd2dc`             | `#515765`             | `button-secondary-active`                                                                                                                                                                                                                                  |
| On action           | `#ffffff`             | `#22242a`             | `text-on-color`, `icon-on-color`, `text-inverse`, `icon-inverse`, `button-separator`                                                                                                                                                                       |
| Focus blue          | `#365ccb`             | `#a9bdff`             | `focus`, `interactive`, `border-interactive`, `border-subtle-selected-01/02/03`, `link-primary`, `link-primary-hover`, `link-secondary`, `link-visited`, `support-info`                                                                                    |
| Selected surface    | `#e7edff`             | `#333f62`             | `background-selected`, `background-selected-hover`, `layer-selected-01/02/03`, `layer-selected-hover-*`, `highlight`                                                                                                                                       |
| Information surface | `#edf2ff`             | `#2c354e`             | `notification-background-info`                                                                                                                                                                                                                             |
| Error               | `#aa2735`             | `#ffacb3`             | `text-error`, `support-error`, `button-danger-primary`, `button-danger-secondary`                                                                                                                                                                          |
| Error surface       | `#ffe8eb`             | `#452830`             | `notification-background-error`                                                                                                                                                                                                                            |
| Warning             | `#75500d`             | `#e7c383`             | `support-warning`                                                                                                                                                                                                                                          |
| Warning surface     | `#fff0ce`             | `#3e3321`             | `notification-background-warning`                                                                                                                                                                                                                          |
| Success             | `#246343`             | `#a4d9b8`             | `support-success`                                                                                                                                                                                                                                          |
| Success surface     | `#e1f2e8`             | `#203a2b`             | `notification-background-success`                                                                                                                                                                                                                          |
| AI gradient         | `#5b3fc4` → `#8b3fb0` | `#c4b0ff` → `#e6b3e0` | `ai-gradient-start` → `ai-gradient-end`                                                                                                                                                                                                                    |

Inverse roles (`focus-inverse`, `link-inverse*`, `support-*-inverse`) use the opposite Frame palette's same color — hence light `focus-inverse` = `#a9bdff`.

Generated blocks in `tokens.css`, in order: `:root` foundations (lines 5–197), legacy aliases (198–226), `relay-light` (227–547), `relay-dark` (548–868), `:root, [data-hashti-theme="frame-light"]` (869–1223), `frame-dark` (1224–1657). Both `tokens.css` and `tokens.json` are generated — edit `src/*.ts` and run `bun run build:tokens`.

---

## 7. Discrepancies / risks

1. **README radius table is stale.** README lists Frame `popover-radius` as `0.875rem` (14px), but `frame.ts`, `tokens.json` and `tokens.css` all say `1.125rem` (18px); `0.875rem` is now `group-radius`, a Frame-only token Relay lacks. Trust the code, not the README table.
2. **Baseline leaks inside Frame.** Frame doesn't author: `background-inverse-hover` (`#474747` light / `#e8e8e8` dark), `border-subtle-03` (`#c6c6c6` / `#6f6f6f`), `icon-interactive` (`#0f62fe` / `#ffffff`), `content-switcher-*`, `status-*`, `tag-*`, `chat-*`, `syntax-*`, `skeleton-*`, `notification-action-tertiary-inverse*`, `support-caution-*`. `icon-interactive` and the blue `content-switcher`/tag values are visibly off-palette for Frame.
3. **`layer-02` and `layer-03` are identical** (`raised`) in both Frame themes, so a third layer adds no visual step; `layer-background` is the only ladder that ascends canvas→surface→raised.
4. **Pressed scale is not tokenized**, so a consumer reading only `@hashti/tokens` cannot reproduce press feedback; it must copy literals from `frame.css`.
5. **Type CSS is base-only.** Breakpoint/fluid values exist solely in `typeStyles` (JS); `--hashti-fluid-*-font-size` stays at the base size. Frame's media-query behaviour is likewise not in tokens.
6. `helper-text-01-line-height` in Frame is a `length` (`1.25rem`) where every other role uses a unitless ratio; code that multiplies line-height factors will misbehave on this one role.
7. Frame's `button-danger-secondary` equals `button-danger-primary` (both `#aa2735` / `#ffacb3`); Relay's differ (light: same; dark: `#ff9ca3` vs `#ff9ca3`).
8. `darkBaseline.shadow` is `rgba(0, 0, 0, 0.8)` and `darkBaseline.overlay` is `rgba(0, 0, 0, 0.6)` — a theme that forgets to author them (Relay/Frame both do author them) inherits far heavier shadow/backdrop values.

---

Report generated read-only from the sources above; no repository files were modified.
