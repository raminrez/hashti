import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta = {
  title: "Components/HoverCard",
  component: HoverCard,
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
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <HoverCard
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <HoverCardTrigger href="#profile">Hollis Vance</HoverCardTrigger>
        <HoverCardContent>
          <div style={{ display: "grid", gap: 4 }}>
            <strong style={{ fontSize: "0.875rem" }}>Hollis Vance</strong>
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Design systems lead
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};
