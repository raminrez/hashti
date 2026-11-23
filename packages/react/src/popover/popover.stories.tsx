import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "State" } },
    dismissible: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Popover
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Share this document</PopoverTitle>
          <PopoverDescription>
            Anyone with the link can view it.
          </PopoverDescription>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </Popover>
    );
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};
