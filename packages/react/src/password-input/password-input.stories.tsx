import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "./password-input";

function Eye() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

const meta = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: "correct horse battery staple",
    disabled: false,
  },
  argTypes: {
    defaultValue: { control: "text", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <PasswordInput {...args} style={{ inlineSize: 280 }}>
      <PasswordInputControl
        aria-label="Password"
        placeholder="Enter your password"
      />
      <PasswordInputToggle aria-label="Show password">
        <Eye />
      </PasswordInputToggle>
    </PasswordInput>
  ),
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

// The toggle is the component's only interaction: it flips the field's type.
export const ToggleVisibility: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Password");
    await expect(input).toHaveProperty("type", "password");

    await userEvent.click(
      canvas.getByRole("button", { name: /show password/i }),
    );

    await expect(input).toHaveProperty("type", "text");
  },
};
