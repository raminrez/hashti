import type { Meta, StoryObj } from "@storybook/react-vite";

import { Theme } from "./theme";

const meta = {
  title: "Components/Theme",
  component: Theme,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { theme: "light" },
  argTypes: {
    theme: {
      control: "inline-radio",
      options: ["light", "dark", "system"],
      table: { category: "Appearance" },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Theme {...args} style={{ padding: "1rem", maxInlineSize: 280 }}>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Content inside the themed subtree reads its tokens from here.
      </p>
    </Theme>
  ),
} satisfies Meta<typeof Theme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
  args: { theme: "dark" },
};
