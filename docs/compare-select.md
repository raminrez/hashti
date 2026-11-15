# Select: hashti vs ui-sdk

Measured 14 November 2026 against `apps/playground/?compare`, both controls configured with the same
three regions and the selected value `europe`. Driven with a keyboard only in Chrome through
Playwright (`channel: "chrome"`); the harness was a throwaway script, not committed.

| Behaviour | hashti `Select` (React Aria 1.22.1) | ui-sdk `Select` (0.1.0-beta.1) |
| --- | --- | --- |
| Trigger element | `button`, no `role` | `button`, `role="combobox"` |
| Closed state | `aria-haspopup="listbox"`, `aria-expanded="false"` | same |
| Accessible name | `aria-labelledby` → label + value parts | `aria-labelledby` → label |
| Open with Enter | listbox opens, focus moves to the selected option | same |
| Options | 3 `role="option"`, `aria-selected` on the chosen one | same |
| Arrow Down | focus moves to the next option | same |
| End | focus moves to the last option | same |
| Enter on an option | closes, value updates, focus returns to the trigger | same |
| Escape | closes, focus returns to the trigger, listbox removed from the DOM | closes, focus returns to the trigger, listbox stays in the DOM (`[role=listbox]` count 1) |
| `aria-controls` | set while open, points at the listbox | same |
| `aria-activedescendant` | not used; focus moves to the option instead | same |

What differs, and whether it matters:

- **Role pattern.** hashti follows the button + `aria-haspopup="listbox"` pattern; ui-sdk declares
  `role="combobox"`. Both are valid WAI-ARIA patterns; nothing in the keyboard or announced state
  differs.
- **Escape leaves a hidden listbox in the DOM** for ui-sdk, which is how its web component adapter
  keeps markup present. Screen readers read `expanded=false`, so nothing is announced wrongly, but
  DOM-based tests that count listboxes must expect the difference.
- **`aria-selected` disappears with the options** in hashti because the listbox unmounts; ui-sdk keeps
  the options and their selection state.

Conclusion for [ADR 0001](../../docs/adr/0001-ui-sdk-and-hashti-agent-bridge.md): keyboard and
announced behaviour are at parity, so neither library blocks the other in the playground, and the
playground is safe to merge as an evaluation app. Styling remains the real difference — ui-sdk ships
nothing, hashti ships Frame.

Not measured: touch and pointer dismissal, scroll of a long list, virtualised options, disabled
options, multi-select.