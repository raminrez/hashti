import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TimeInput } from "./time-input";

const meta = {
  title: "Components/TimeInput",
  component: TimeInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: "14:30",
    disabled: false,
    readOnly: false,
    required: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "text", table: { category: "State" } },
    hourCycle: {
      control: "inline-radio",
      options: [12, 24],
      table: { category: "Behavior" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => <TimeInput {...args} aria-label="Reminder time" />,
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { defaultValue: undefined },
};

export const TwelveHour: Story = {
  args: { hourCycle: 12 },
};

export const Disabled: Story = {
  args: { disabled: true },
};
