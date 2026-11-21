import { expect, fireEvent, waitFor } from "storybook/test";
import { CompletionDemo } from "../../apps/docs/src/components/inline-completion-demo";

// Fixed tall text: 40 lines wrap well past the textarea's 5rem minimum, so
// the textarea really scrolls and the ghost's scroll offsets can be compared.
const TYPED = `${Array.from(
  { length: 40 },
  (_, i) => `${i + 1}. The quick brown fox jumps over the lazy dog.`,
).join("\n")}\nTe`;

const SUGGESTION = `${TYPED}al — the ghost keeps going past the fold so its own
content overflows the control too, and every line it shows below the fold has
somewhere to scroll to.`;

const meta = {
  title: "Setup/InlineCompletionScroll",
  parameters: { layout: "centered" },
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <CompletionDemo
        multiline
        initialValue={TYPED}
        suggestions={[SUGGESTION]}
      />
    </div>
  ),
};

export default meta;

export const SyncsWithTextarea = {
  // Regression: the ghost copied the textarea's scrollTop but the demo's
  // suggestions never overflowed, so the copy was unverified. A flex ghost
  // also laid the typed part and the suggestion side by side instead of
  // flowing them as one paragraph. Both are checked here.
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector("textarea");
    const ghost = canvasElement.querySelector(
      ".hashti-inline-completion__ghost",
    );
    await expect(textarea).not.toBeNull();
    await expect(ghost).not.toBeNull();
    if (!textarea || !ghost) return;

    const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight);
    const textareaPadding =
      Number.parseFloat(getComputedStyle(textarea).paddingTop) +
      Number.parseFloat(getComputedStyle(textarea).paddingBottom);

    // Same box, so the text wraps at the same width.
    await expect(ghost.clientWidth).toBe(textarea.clientWidth);

    // The hidden typed part of the ghost must occupy the same number of lines
    // as the textarea's own text, otherwise every scroll offset shows a
    // different line in the ghost than after the caret.
    const typed = ghost.querySelector(".hashti-inline-completion__typed");
    await expect(typed).not.toBeNull();
    if (!typed) return;
    const ghostLines = typed.getBoundingClientRect().height / lineHeight;
    const textareaLines =
      (textarea.scrollHeight - textareaPadding) / lineHeight;
    await expect(Math.abs(ghostLines - textareaLines)).toBeLessThan(1.5);

    await expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight);

    textarea.scrollTop = 240;
    await fireEvent.scroll(textarea);
    await waitFor(() => expect(ghost.scrollTop).toBe(240));

    textarea.scrollTop = 0;
    await fireEvent.scroll(textarea);
    await waitFor(() => expect(ghost.scrollTop).toBe(0));
  },
};
