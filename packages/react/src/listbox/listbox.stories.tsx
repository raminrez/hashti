import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Listbox, ListboxItem, ListboxItemIndicator } from "./listbox";

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const toppings = ["basil", "olive", "mushroom"];

const meta = {
  title: "Components/Listbox",
  component: Listbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: "basil",
    multiple: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { table: { disable: true } },
    multiple: { control: "boolean", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Listbox {...args} aria-label="Toppings" style={{ maxInlineSize: 280 }}>
      {toppings.map((topping) => (
        <ListboxItem key={topping} value={topping}>
          {topping.charAt(0).toUpperCase() + topping.slice(1)}
          <ListboxItemIndicator>
            <Check />
          </ListboxItemIndicator>
        </ListboxItem>
      ))}
    </Listbox>
  ),
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["basil", "olive"] },
};

export const Disabled: Story = {
  args: { disabled: true },
};
