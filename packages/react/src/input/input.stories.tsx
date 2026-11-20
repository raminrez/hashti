import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Input } from "./input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    placeholder: "Username",
    disabled: false,
    readOnly: false,
    onValueChange: fn(),
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "number", "tel"],
      table: { category: "Form" },
    },
    placeholder: { control: "text", table: { category: "Content" } },
    defaultValue: { control: "text", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => <Input {...args} aria-label="Username" />,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "hollisgrant.com" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "example.com/hollis" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Locked value" },
};
