import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Switch, SwitchThumb } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    checked: false,
    size: "md",
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: "boolean", table: { category: "State" } },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    defaultChecked: { control: false, table: { category: "State" } },
    onCheckedChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs<{ checked: boolean }>();
    return (
      <label className="hashti-choice">
        Email notifications
        <Switch
          {...args}
          checked={checked}
          onCheckedChange={(next, details) => {
            args.onCheckedChange?.(next, details);
            updateArgs({ checked: next });
          }}
        >
          <SwitchThumb />
        </Switch>
      </label>
    );
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

export const Small: Story = {
  args: { checked: true, size: "sm" },
};
