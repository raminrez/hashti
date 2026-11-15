import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { AILabel, TextField } from "@hashti/react";
import "./content.css";

const handleRevert = fn();

const meta = {
  title: "Content/AILabel",
  component: AILabel,
  parameters: {
    docs: {
      description: {
        component:
          "AILabel indicates AI-generated content or provenance, supporting informative badge and one-click undo revert action.",
      },
    },
  },
} satisfies Meta<typeof AILabel>;

export default meta;
type Story = StoryObj<typeof meta>;

function AILabelDemo() {
  const [reverted, setReverted] = useState(false);
  const [val, setVal] = useState("Generated description: Cinder design system components");

  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span>Summary Note</span>
          <AILabel
            label="AI Generated"
            revertActive={reverted}
            revertLabel="Revert description"
            onRevert={() => {
              setVal("Generated description: Cinder design system components");
              setReverted(false);
              handleRevert();
            }}
          />
        </div>
        <TextField
          aria-label="Summary note input"
          value={val}
          onChange={(newVal) => {
            setVal(newVal);
            setReverted(true);
          }}
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <AILabelDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("AI Generated")).toBeInTheDocument();

    const input = canvas.getByRole("textbox", { name: "Summary note input" });
    await userEvent.type(input, " extra text");

    const revertButton = await canvas.findByRole("button", { name: "Revert description" });
    expect(revertButton).toBeInTheDocument();
    await userEvent.click(revertButton);

    expect(canvas.getByRole("status")).toBeInTheDocument();
  },
};

export const Informative: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <AILabel label="AI Explained" />
          <AILabel label="Copilot Assist" />
          <AILabel />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("AI Explained")).toBeInTheDocument();
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="content-story-stack">
      <div className="content-card">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <AILabel label="تولید شده توسط هوش مصنوعی" />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("تولید شده توسط هوش مصنوعی")).toBeInTheDocument();
  },
};
