import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { DateInput } from "./date-input";

const meta = {
  title: "Components/DateInput",
  component: DateInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: "2026-10-16",
    disabled: false,
    readOnly: false,
    required: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "text", table: { category: "State" } },
    granularity: {
      control: "inline-radio",
      options: ["day", "hour", "minute", "second"],
      table: { category: "Behavior" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => <DateInput {...args} aria-label="Delivery date" />,
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { defaultValue: undefined },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};
