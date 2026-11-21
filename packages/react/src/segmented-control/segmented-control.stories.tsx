import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "./segmented-control";

const views = ["day", "week", "month"] as const;

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: "day",
    orientation: "horizontal",
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: {
      control: "select",
      options: views,
      table: { category: "State" },
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <SegmentedControl
      {...args}
      aria-label="Calendar view"
      style={{ width: 320 }}
    >
      <SegmentedControlIndicator />
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WeekSelected: Story = {
  args: { defaultValue: "week" },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
