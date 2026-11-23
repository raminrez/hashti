import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "./otp-input";

const meta = {
  title: "Components/OTPInput",
  component: OTPInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    maxLength: 6,
    disabled: false,
  },
  argTypes: {
    maxLength: { control: "number", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <OTPInput {...args} aria-label="Verification code">
      <OTPInputGroup>
        {[0, 1, 2].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
      <OTPInputSeparator>–</OTPInputSeparator>
      <OTPInputGroup>
        {[3, 4, 5].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  ),
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
