import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Toggle, ToggleGroup, ToggleIcon } from "./toggle";

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M8 1.5l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.8l-4 2.1.8-4.5L1.5 6.2 6 5.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    pressed: false,
    onPressedChange: fn(),
  },
  argTypes: {
    pressed: { control: "boolean", table: { category: "State" } },
    defaultPressed: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    focusableWhenDisabled: { control: "boolean", table: { category: "State" } },
    value: { control: false, table: { category: "Group" } },
    controller: { table: { disable: true } },
    onPressedChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ pressed }, updateArgs] = useArgs<{ pressed: boolean }>();
    return (
      <Toggle
        {...args}
        aria-label="Star"
        pressed={pressed}
        onPressedChange={(next, details) => {
          args.onPressedChange?.(next, details);
          updateArgs({ pressed: next });
        }}
      >
        <ToggleIcon>
          <StarIcon />
        </ToggleIcon>
        Star
      </Toggle>
    );
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unpressed: Story = {};

export const Pressed: Story = {
  args: { pressed: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledPressed: Story = {
  args: { pressed: true, disabled: true },
};

export const GroupMultiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ToggleGroup multiple defaultValue={["bold"]} aria-label="Text formatting">
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline" disabled>
        Underline
      </Toggle>
    </ToggleGroup>
  ),
};

// One alignment always stays pressed: deselectable={false}.
export const GroupSingle: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ToggleGroup
      defaultValue={["center"]}
      deselectable={false}
      aria-label="Text alignment"
    >
      <Toggle value="start">Align start</Toggle>
      <Toggle value="center">Align center</Toggle>
      <Toggle value="end">Align end</Toggle>
    </ToggleGroup>
  ),
};
