import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "./collapsible";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    open: false,
    disabled: false,
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Collapsible
        {...args}
        onOpenChange={(open, details) => {
          args.onOpenChange?.(open, details);
          updateArgs({ open });
        }}
        style={{ maxWidth: 480 }}
      >
        <CollapsibleTrigger>What is the refund policy?</CollapsibleTrigger>
        <CollapsiblePanel>
          Full refunds within 30 days of delivery, no questions asked.
        </CollapsiblePanel>
      </Collapsible>
    );
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};
