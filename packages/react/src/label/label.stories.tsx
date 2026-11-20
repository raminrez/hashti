import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Email",
    htmlFor: "email",
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    htmlFor: { control: "text", table: { category: "Content" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: "grid", gap: 8, inlineSize: 280 }}>
      <Label {...args} />
      <input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
