import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProgressCircle } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    docs: {
      description: {
        component:
          "ProgressCircle visualizes progress in a circular radial track with determinate and indeterminate loading modes, multiple sizes, and status colors.",
      },
    },
  },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="feedback-story-stack">
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <ProgressCircle aria-label="Upload progress (small)" size="sm" value={65} showValueLabel />
        <ProgressCircle aria-label="Task progress (medium)" size="md" value={75} showValueLabel />
        <ProgressCircle aria-label="Storage quota (large)" size="lg" value={90} showValueLabel />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bars = canvas.getAllByRole("progressbar");
    expect(bars.length).toBe(3);
    expect(canvas.getByText("65%")).toBeInTheDocument();
    expect(canvas.getByText("75%")).toBeInTheDocument();
    expect(canvas.getByText("90%")).toBeInTheDocument();
  },
};

export const StatusesAndIndeterminate: Story = {
  render: () => (
    <div className="feedback-story-stack">
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <ProgressCircle aria-label="Processing job" isIndeterminate size="md" />
        <ProgressCircle aria-label="Completed job" status="success" value={100} size="md" />
        <ProgressCircle aria-label="Warning threshold" status="warning" value={85} size="md" />
        <ProgressCircle aria-label="Failed upload" status="error" value={45} size="md" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("progressbar").length).toBe(4);
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="feedback-story-stack">
      <ProgressCircle aria-label="پیشرفت بارگذاری" value={60} showValueLabel size="md" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("progressbar")).toBeInTheDocument();
  },
};
