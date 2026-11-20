import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "./progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 65,
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100 },
      table: { category: "Value" },
    },
    min: { control: "number", table: { category: "Value" } },
    max: { control: "number", table: { category: "Value" } },
    format: { control: false, table: { category: "Value" } },
    getValueLabel: { control: false, table: { category: "Accessibility" } },
    locale: { control: false, table: { category: "Value" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Progress {...args}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

// A null value: the task is under way, how far is unknown.
export const Indeterminate: Story = {
  args: { value: null },
};

export const Complete: Story = {
  args: { value: 100 },
};
