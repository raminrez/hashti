import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    size: "md",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { category: "Appearance" },
    },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    return (
      <Avatar {...args}>
        <AvatarFallback>HG</AvatarFallback>
      </Avatar>
    );
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

export const WithImage: Story = {
  args: { size: "lg" },
  render: function Render(args) {
    return (
      <Avatar {...args}>
        <AvatarImage
          // Inline asset: the story must render its image offline, too.
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23365ccb'/%3E%3Ccircle cx='16' cy='12' r='6' fill='%23ffffff'/%3E%3Cpath d='M4 32a12 12 0 0 1 24 0Z' fill='%23ffffff'/%3E%3C/svg%3E"
          alt="shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};
