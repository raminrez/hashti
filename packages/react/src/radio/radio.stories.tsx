import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Radio, RadioGroup, RadioIndicator } from "./radio";

const OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "overnight", label: "Overnight" },
];

const meta = {
  title: "Components/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: "standard",
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: OPTIONS.map((option) => option.value),
      table: { category: "Value" },
    },
    defaultValue: { control: false, table: { category: "Value" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    loop: { control: "boolean", table: { category: "State" } },
    name: { control: false, table: { category: "Form" } },
    form: { control: false, table: { category: "Form" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value: string | null }>();
    return (
      <RadioGroup
        {...args}
        value={value}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
      >
        {OPTIONS.map((option) => (
          <label key={option.value} className="hashti-choice">
            <Radio value={option.value}>
              <RadioIndicator />
            </Radio>
            {option.label}
          </label>
        ))}
      </RadioGroup>
    );
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const NothingSelected: Story = {
  args: { value: null },
};

export const GroupDisabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};

// One option unavailable while the rest of the group stays usable.
export const OptionDisabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup defaultValue="standard">
      {OPTIONS.map((option) => (
        <label key={option.value} className="hashti-choice">
          <Radio value={option.value} disabled={option.value === "overnight"}>
            <RadioIndicator />
          </Radio>
          {option.value === "overnight"
            ? "Overnight (unavailable)"
            : option.label}
        </label>
      ))}
    </RadioGroup>
  ),
};
