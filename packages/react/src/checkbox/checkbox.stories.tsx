import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import { Checkbox, CheckboxIndicator } from "./checkbox";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 6.5 4.5 9 10 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    checked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: {
      control: "select",
      options: [false, true, "indeterminate"],
      table: { category: "State" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    onCheckedChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <label className="hashti-choice">
        <Checkbox
          {...args}
          onCheckedChange={(next, details) => {
            args.onCheckedChange?.(next, details);
            updateArgs({ checked: next });
          }}
        >
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Email me product updates
      </label>
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { checked: "indeterminate" },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};
