import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    disabled: false,
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "Behavior" } },
    delay: { control: "number", table: { category: "Behavior" } },
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Tooltip
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <TooltipTrigger>Share</TooltipTrigger>
        <TooltipContent>Anyone with the link can view</TooltipContent>
      </Tooltip>
    );
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
