import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
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
    modal: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Dialog
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <DialogTrigger>Open project details</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>
            Review the details before continuing.
          </DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};
