import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Icon, Theme, TokenField, TokenFieldValue, useTheme } from "@hashti/react";
import "./fields.css";

// TokenFieldValue's own segment union: text segments plus hashti's TokenSegment.
type TokenFieldSegmentList = ConstructorParameters<typeof TokenFieldValue>[0];

const meta = {
  title: "Fields/TokenField",
  component: TokenField,
  parameters: {
    docs: {
      description: {
        component:
          "TokenField is an editable prompt box with inline structured tokens, built for AI prompt construction, mention tagging, and structured search. The value is a TokenFieldValue: text segments stay editable, token segments are atomic — Backspace next to a token removes the whole token. TokenField.Root keeps RAC's props and children contract; Label, Description, Input, Token, Help, and ErrorMessage stay independently composable. The token close button only fires its callback — removing the segment from the value stays caller-side state.",
      },
    },
  },
} satisfies Meta<typeof TokenField>;

export default meta;
type Story = StoryObj<typeof meta>;

const promptValue = () =>
  new TokenFieldValue([
    { type: "text", text: "Summarize the sprint risks in " },
    { type: "token", text: "@DesignReview", value: { id: "design-review" } },
    { type: "text", text: " and contrast with " },
    { type: "token", text: "@ReleaseNotes", value: { id: "release-notes" } },
    { type: "text", text: " " },
  ]);

// Removing a token is story-side state: TokenFieldValue has no segment-removal API, so filter
// the segment list and rebuild the value. Keep one empty text segment when nothing is left —
// RAC renders the placeholder from an empty input, not from a missing one.
const removeTokenById = (value: TokenFieldValue, id: string): TokenFieldValue => {
  const segments = value.segments.filter((s) => s.type !== "token" || s.value?.id !== id);
  return new TokenFieldValue(
    segments.some((s) => s.type === "text" && s.text.length > 0)
      ? segments
      : [{ type: "text", text: "" }],
  );
};

const tokenCount = (value: TokenFieldValue) =>
  value.segments.filter((s) => s.type === "token").length;

function PlaygroundExample() {
  const [value, setValue] = useState(promptValue);
  return (
    <div className="field-story-stack">
      <TokenField
        label="AI prompt with context tokens"
        description="Type text or reference workspace assets with @ tokens."
        placeholder="Ask the assistant about a workspace asset..."
        value={value}
        onChange={setValue}
      />
      <output aria-label="Serialized prompt value">{value.toString()}</output>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "AI prompt with context tokens" });
    await expect(canvas.getByText("@DesignReview")).toBeInTheDocument();
    await expect(canvas.getByText("@ReleaseNotes")).toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.keyboard(" Highlight the largest open risk.");
    await expect(canvas.getByRole("status", { name: "Serialized prompt value" })).toHaveTextContent(
      "Highlight the largest open risk.",
    );
  },
};

function ControlledAndUncontrolledExample() {
  const [value, setValue] = useState(promptValue);
  return (
    <div className="field-story-stack">
      <TokenField
        label="Controlled prompt"
        description="The application owns this value; the serialization below mirrors every keystroke."
        value={value}
        onChange={setValue}
      />
      <output aria-label="Controlled prompt value">{value.toString()}</output>
      <TokenField
        label="Uncontrolled prompt"
        description="RAC owns this draft. Press Backspace at the end to remove the @ReleaseNotes token."
        defaultValue={promptValue()}
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ControlledAndUncontrolledExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("textbox", { name: "Controlled prompt" });
    const uncontrolled = canvas.getByRole("textbox", { name: "Uncontrolled prompt" });
    const output = canvas.getByRole("status", { name: "Controlled prompt value" });

    await userEvent.click(controlled);
    await userEvent.keyboard("Add a recommendation.");
    await expect(output).toHaveTextContent("Add a recommendation.");

    await userEvent.click(uncontrolled);
    await userEvent.keyboard(" Draft v2.");
    // Uncontrolled: typing lands in the field and the controlled mirror stays untouched.
    await expect(uncontrolled).toHaveTextContent("Draft v2.");
    await expect(output).not.toHaveTextContent("Draft v2.");
    // Both fields keep their own tokens.
    await expect(
      within(canvas.getByRole("textbox", { name: "Controlled prompt" })).getByText("@ReleaseNotes"),
    ).toBeInTheDocument();
    await expect(within(uncontrolled).getByText("@ReleaseNotes")).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenField label="Small prompt" size="sm" defaultValue={promptValue()} />
      <TokenField label="Default prompt" size="md" defaultValue={promptValue()} />
      <TokenField label="Large prompt" size="lg" defaultValue={promptValue()} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, minimum] of [
      ["Small prompt", 32],
      ["Default prompt", 44],
      ["Large prompt", 48],
    ] as const) {
      const input = canvas.getByRole("textbox", { name });
      await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum);
    }
  },
};

function StatesExample() {
  // The error slot reserves one helper line whether or not a message renders,
  // so a validation error never shifts the fields after it. The play function
  // verifies the reservation on the trailing anchor.
  const errorSlot = { minBlockSize: "1rem", display: "block" } as const;
  return (
    <div className="field-story-stack">
      <div className="field-story-grid">
        <TokenField.Root defaultValue={promptValue()} data-invalid="true">
          <TokenField.Label isRequired>Required prompt</TokenField.Label>
          <TokenField.Description>
            The assistant needs at least one context token.
          </TokenField.Description>
          <TokenField.Input />
          <span style={errorSlot} />
        </TokenField.Root>
        <TokenField.Root defaultValue={promptValue()} data-invalid="true">
          <TokenField.Label isRequired>Prompt requiring correction</TokenField.Label>
          <TokenField.Description>
            The assistant needs at least one context token.
          </TokenField.Description>
          <TokenField.Input />
          <span style={errorSlot}>
            <TokenField.ErrorMessage>Add at least one @ context token.</TokenField.ErrorMessage>
          </span>
        </TokenField.Root>
        <TokenField
          label="Read-only prompt"
          description="The saved prompt can be reviewed but not changed."
          defaultValue={promptValue()}
          isReadOnly
        />
        <TokenField
          label="Unavailable prompt"
          description="The archived workspace prompt cannot be changed."
          defaultValue={promptValue()}
          isDisabled
        />
      </div>
      <output aria-label="Layout anchor">The grid above never moves when the error renders.</output>
    </div>
  );
}

export const States: Story = {
  render: StatesExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const invalidInput = canvas.getByRole("textbox", {
      name: /Prompt requiring correction/,
    });
    const error = canvas.getByText("Add at least one @ context token.");
    await expect(error).toBeVisible();
    // RAC's TokenField exposes invalid state on the field root, not on the
    // contentEditable textbox.
    await expect(invalidInput.closest("[data-invalid]")).toHaveAttribute("data-invalid", "true");
    // The required marker renders on both required labels.
    await expect(canvas.getAllByText("(required)").length).toBe(2);
    // The reserved slot keeps the error text inside the field's own footprint:
    // a late validation error grows into reserved space instead of pushing the
    // grid down.
    const invalidField = invalidInput.closest<HTMLElement>(".hashti-token-field")!;
    const errorRect = error.getBoundingClientRect();
    const invalidRect = invalidField.getBoundingClientRect();
    await expect(errorRect.bottom).toBeLessThanOrEqual(invalidRect.bottom + 1);

    const readonly = canvas.getByRole("textbox", { name: "Read-only prompt" });
    await expect(readonly).toHaveAttribute("aria-readonly", "true");
    await userEvent.click(readonly);
    await userEvent.keyboard("This must not land");
    await expect(readonly).toHaveTextContent("Summarize the sprint risks");
    await expect(readonly).not.toHaveTextContent("This must not land");

    const disabled = canvas.getByRole("textbox", { name: "Unavailable prompt" });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await expect(disabled).toHaveAttribute("contenteditable", "false");
  },
};

function MultilineExample() {
  const [value, setValue] = useState(
    () =>
      new TokenFieldValue([
        { type: "text", text: "You are a senior design systems engineer.\nReview " },
        { type: "token", text: "@packages/react", value: { id: "pkg" } },
        { type: "text", text: "\nList every a11y regression you find." },
      ]),
  );
  return (
    <div className="field-story-stack">
      <TokenField
        label="Multi-line agent directive"
        description="Enter inserts a newline; a pasted multi-line system prompt keeps its line breaks."
        multiline
        value={value}
        onChange={setValue}
      />
      <output aria-label="Directive value">{value.toString()}</output>
    </div>
  );
}

export const Multiline: Story = {
  render: MultilineExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Multi-line agent directive" });
    await expect(input).toHaveAttribute("aria-multiline", "true");
    const initialHeight = input.getBoundingClientRect().height;

    await userEvent.click(input);
    await userEvent.keyboard("{End}{Enter}Then propose the smallest fix for each.");
    const grownHeight = input.getBoundingClientRect().height;
    await expect(grownHeight).toBeGreaterThan(initialHeight);
    await expect(canvas.getByRole("status", { name: "Directive value" })).toHaveTextContent(
      "Then propose the smallest fix",
    );

    // Paste at the caret keeps newline breaks.
    await userEvent.paste("\nThen compare the result with the previous release.");
    const output = canvas.getByRole("status", { name: "Directive value" });
    await expect(output.textContent ?? "").toContain(
      "Then propose the smallest fix for each.\nThen compare",
    );
  },
};

function RemovalExample() {
  const [value, setValue] = useState(promptValue);
  return (
    <div className="field-story-stack">
      <TokenField
        label="Prompt with removable context"
        description="Remove a token with its close button, or press Backspace next to one."
        value={value}
        onChange={setValue}
      >
        {(segment) => (
          <TokenField.Token
            icon={<Icon name="file" />}
            onRemove={() =>
              segment.value?.id != null &&
              setValue((v) => removeTokenById(v, String(segment.value.id)))
            }
          >
            {segment.text}
          </TokenField.Token>
        )}
      </TokenField>
      <output aria-label="Remaining token count">{String(tokenCount(value))}</output>
    </div>
  );
}

export const TokenRemoval: Story = {
  render: RemovalExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const count = canvas.getByRole("status", { name: "Remaining token count" });
    await expect(count).toHaveTextContent("2");

    // Pointer removal through the token's close control.
    const input = canvas.getByRole("textbox", { name: "Prompt with removable context" });
    const removeButtons = canvas.getAllByRole("button", { name: "Remove token" });
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]!);
    await expect(count).toHaveTextContent("1");
    await expect(canvas.queryByText("@DesignReview")).not.toBeInTheDocument();

    // Keyboard removal: End places the caret at the end of the field; the first
    // Backspace deletes the trailing space, the second removes the adjacent
    // token atomically. Focus stays in the token input after both.
    await userEvent.click(input);
    await userEvent.keyboard("{End}{Backspace}{Backspace}");
    await expect(count).toHaveTextContent("0");
    await expect(input).toHaveFocus();
  },
};

function CompoundExample() {
  const [segments, setSegments] = useState<TokenFieldSegmentList>([
    { type: "token", text: "model: gemini-1.5-pro", value: { id: "model", icon: "sparkle" } },
    { type: "text", text: " " },
    { type: "token", text: "temperature: 0.7", value: { id: "temp", icon: "settings" } },
    { type: "text", text: " " },
  ]);
  const value = new TokenFieldValue(segments);
  return (
    <div className="field-story-stack">
      <TokenField.Root value={value} aria-label="Configured model and hyperparameters">
        <TokenField.Label>Configured model and hyperparameters</TokenField.Label>
        <TokenField.Description>
          Remove a token with its close button; the count below tracks the change.
        </TokenField.Description>
        <TokenField.Input>
          {(segment) => (
            <TokenField.Token
              icon={<Icon name={((segment.value as any)?.icon ?? "sparkle") as never} />}
              onRemove={() =>
                setSegments((prev) =>
                  prev.filter(
                    (s) =>
                      s.type !== "token" ||
                      (s.value as { id?: string })?.id !== (segment.value as { id?: string })?.id,
                  ),
                )
              }
            >
              {segment.text}
            </TokenField.Token>
          )}
        </TokenField.Input>
        <TokenField.Help>
          <TokenField.ErrorMessage />
        </TokenField.Help>
      </TokenField.Root>
      <output aria-label="Active token count">
        {String(segments.filter((s) => s.type === "token").length)}
      </output>
    </div>
  );
}

export const CompoundAnatomy: Story = {
  render: CompoundExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("model: gemini-1.5-pro")).toBeInTheDocument();
    await expect(canvas.getByText("temperature: 0.7")).toBeInTheDocument();
    const removeButtons = canvas.getAllByRole("button", { name: "Remove token" });
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]!);
    await expect(canvas.getByRole("status", { name: "Active token count" })).toHaveTextContent("1");
  },
};

function RightToLeftExample() {
  const { theme } = useTheme();
  const [value, setValue] = useState(
    () =>
      new TokenFieldValue([
        { type: "text", text: "خلاصهٔ ریسک‌های اسپرینت را از " },
        { type: "token", text: "@بررسی-طراحی", value: { id: "design" } },
        { type: "text", text: " استخراج و با " },
        { type: "token", text: "@یادداشت-انتشار", value: { id: "release" } },
        { type: "text", text: " مقایسه کن " },
      ]),
  );
  return (
    <Theme theme={theme} locale="fa-IR">
      <div dir="rtl" className="field-story-stack">
        <TokenField
          label="دستور دستیار با نشانه‌های زمینه"
          description="با نشانه‌های @ به دارایی‌های فضای کاری ارجاع دهید."
          placeholder="دستور خود را بنویسید..."
          value={value}
          onChange={setValue}
        />
        <output aria-label="مقدار سریال‌شده">{value.toString()}</output>
      </div>
    </Theme>
  );
}

export const RightToLeft: Story = {
  render: RightToLeftExample,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "دستور دستیار با نشانه‌های زمینه" });
    await expect(canvas.getByText("@بررسی-طراحی")).toBeInTheDocument();
    await expect(canvas.getByText("@یادداشت-انتشار")).toBeInTheDocument();
    // dir lives on the wrapper; RAC does not forward dir to the textbox.
    await expect(input.closest("[dir]")).toHaveAttribute("dir", "rtl");
    await expect(canvas.getByRole("status", { name: "مقدار سریال‌شده" })).toHaveTextContent(
      "مقایسه کن",
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <TokenField
        label="New assistant prompt"
        description="No tokens yet — type to begin, reference assets with @."
        placeholder="Describe the task for the assistant..."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "New assistant prompt" });
    await expect(input).toHaveTextContent("");
    await expect(input).toHaveAttribute(
      "data-placeholder",
      "Describe the task for the assistant...",
    );
  },
};
