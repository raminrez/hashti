import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "./meter";

const meta = {
  title: "Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 68,
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
      <Meter {...args}>
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// data-tone is the stylesheet hook for a reading near its limit.
export const NearLimit: Story = {
  args: { value: 92 },
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Meter {...args} data-tone="warning">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
};

export const OverLimit: Story = {
  args: { value: 98 },
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Meter {...args} data-tone="danger">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
};

// A value of 3 between 1 and 5 fills half the track.
export const CustomRange: Story = {
  args: { value: 3, min: 1, max: 5 },
};
