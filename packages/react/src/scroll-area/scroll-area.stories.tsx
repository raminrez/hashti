import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "./scroll-area";

const frameStyle = {
  height: "12rem",
  maxInlineSize: 320,
  border: "1px solid var(--hashti-border-subtle-00)",
  borderRadius: "var(--hashti-popover-radius)",
} as const;

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { type: "hover" },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["auto", "always", "scroll", "hover"],
      table: { category: "Behavior" },
    },
    scrollHideDelay: { control: "number", table: { category: "Behavior" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <ScrollArea {...args} style={frameStyle}>
      <ScrollAreaViewport role="region" aria-label="Items">
        <ScrollAreaContent style={{ padding: "0.75rem" }}>
          {Array.from({ length: 30 }, (_, index) => (
            <div
              key={index}
              style={{ padding: "0.375rem 0", fontSize: "0.875rem" }}
            >
              Item {index + 1}
            </div>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlwaysVisible: Story = {
  args: { type: "always" },
};
