import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: "",
    placeholder: "Write a message...",
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "text", table: { category: "Value" } },
    placeholder: { control: "text", table: { category: "Content" } },
    autoResize: { control: "boolean", table: { category: "Appearance" } },
    submitShortcut: {
      control: "inline-radio",
      options: ["enter", "mod+enter"],
      table: { category: "Keyboard" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    onValueChange: { control: false, table: { category: "Events" } },
    onSubmit: { control: false, table: { category: "Events" } },
    defaultValue: { control: false, table: { category: "Value" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value: string }>();
    return (
      <Textarea
        {...args}
        value={value}
        style={{ inlineSize: 320 }}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
      />
    );
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { value: "The delivery arrived a day early. Great service." },
};

export const ReadOnly: Story = {
  args: { value: "Order #1042 was refunded on 12 June.", readOnly: true },
};

export const Disabled: Story = {
  args: { value: "Locked while the order is processing.", disabled: true },
};

// The error border comes from aria-invalid, the same hook a Field sets.
export const Invalid: Story = {
  args: { value: "No email address" },
  render: function RenderInvalid(args) {
    const [{ value }, updateArgs] = useArgs<{ value: string }>();
    return (
      <Textarea
        {...args}
        aria-invalid="true"
        value={value}
        style={{ inlineSize: 320 }}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
      />
    );
  },
};
