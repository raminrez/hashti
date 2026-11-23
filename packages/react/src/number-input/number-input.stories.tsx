import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "./number-input";

function Minus() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M3 8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Plus() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M8 3v10M3 8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/NumberInput",
  component: NumberInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: 1,
    min: 1,
    max: 99,
    step: 1,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "number", table: { category: "State" } },
    min: { control: "number", table: { category: "Validation" } },
    max: { control: "number", table: { category: "Validation" } },
    step: { control: "number", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <NumberInput {...args} aria-label="Quantity" style={{ inlineSize: 160 }}>
      <NumberInputGroup>
        <NumberInputDecrement aria-label="Decrease">
          <Minus />
        </NumberInputDecrement>
        <NumberInputControl />
        <NumberInputIncrement aria-label="Increase">
          <Plus />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  ),
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
