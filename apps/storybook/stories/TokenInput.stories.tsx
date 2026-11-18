import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Icon, Theme, TokenInput, useTheme, type TokenInputValue } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/TokenInput",
  component: TokenInput,
  parameters: {
    docs: {
      description: {
        component:
          "TokenInput is an editable prompt box with inline atomic tokens, built on `@ui-sdk/react/token-input` — for AI prompt construction, mention tagging, and structured search. The value is an array of text and tokens; Backspace next to a token removes it whole.",
      },
    },
  },
} satisfies Meta<typeof TokenInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const promptValue = (): TokenInputValue => [
  "Summarize the sprint risks in ",
  { type: "mention", value: "design-review", label: "@DesignReview" },
  " and contrast with ",
  { type: "mention", value: "release-notes", label: "@ReleaseNotes" },
  " ",
];

function PlaygroundExample() {
  const [value, setValue] = useState<TokenInputValue>(promptValue);
  return (
    <div className="field-story-stack">
      <TokenInput
        label="AI prompt with context tokens"
        description="Type text or reference workspace assets with @ tokens."
        placeholder="Ask the assistant about a workspace asset..."
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("@DesignReview")).toBeInTheDocument();
    await expect(canvas.getByText("@ReleaseNotes")).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenInput label="Small prompt" size="sm" defaultValue={promptValue()} />
      <TokenInput label="Default prompt" size="md" defaultValue={promptValue()} />
      <TokenInput label="Large prompt" size="lg" defaultValue={promptValue()} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ["Small prompt", "Default prompt", "Large prompt"]) {
      await expect(canvas.getByText(name)).toBeInTheDocument();
    }
  },
};

export const States: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenInput
        label="Invalid prompt"
        status={{ type: "error", message: "A prompt is required to continue." }}
        placeholder="Type a prompt..."
      />
      <TokenInput
        label="Read-only prompt"
        readOnly
        defaultValue={["Locked content "]}
      />
      <TokenInput label="Disabled prompt" disabled defaultValue={["Locked content "]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("A prompt is required to continue."),
    ).toBeInTheDocument();
  },
};

export const Multiline: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenInput
        label="System prompt"
        multiline
        placeholder="Type multiline instructions..."
        defaultValue={["Line one\nLine two ", { type: "mention", value: "ctx", label: "@Context" }]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("@Context")).toBeInTheDocument();
  },
};

export const CustomTokens: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenInput
        label="Context selector"
        defaultValue={[
          { type: "file", value: "routes", label: "routes.ts" },
          " explain ",
          { type: "skill", value: "review", label: "/review" },
        ]}
        renderToken={(token) => (
          <TokenInput.Token icon={<Icon name={token.type === "file" ? "file" : "sparkle"} />}>
            {token.label}
          </TokenInput.Token>
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("routes.ts")).toBeInTheDocument();
    await expect(canvas.getByText("/review")).toBeInTheDocument();
  },
};

function RightToLeftExample() {
  const { theme } = useTheme();
  return (
    <Theme theme={theme} lang="fa-IR" dir="rtl">
      <div dir="rtl" className="field-story-stack">
        <TokenInput
          label="دستور هوش مصنوعی"
          description="به دارایی‌های فضای کاری با @ اشاره کنید."
          placeholder="درباره یک دارایی بپرسید..."
          defaultValue={[
            "خلاصه ریسک‌های اسپرینت در ",
            { type: "mention", value: "design-review", label: "@بازبینی‌طراحی" },
            " ",
          ]}
        />
      </div>
    </Theme>
  );
}

export const RightToLeft: Story = {
  render: () => <RightToLeftExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("@بازبینی‌طراحی")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  render: () => (
    <div className="field-story-stack">
      <TokenInput label="Empty prompt" placeholder="Start typing..." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Empty prompt")).toBeInTheDocument();
  },
};
