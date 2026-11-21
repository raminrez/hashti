import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Input } from "../input";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    name: "email",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    name: { control: "text", table: { category: "Form" } },
    invalid: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Field {...args} style={{ maxWidth: 320 }}>
      <FieldLabel>Email</FieldLabel>
      <FieldDescription>We'll send you a confirmation link.</FieldDescription>
      <Input type="email" required placeholder="hollis@example.com" />
      <FieldError>Enter your email address.</FieldError>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
