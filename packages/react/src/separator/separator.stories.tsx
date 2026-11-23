import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    orientation: "horizontal",
    decorative: false,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    decorative: { control: "boolean", table: { category: "Accessibility" } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const vertical = args.orientation === "vertical";
    return (
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "row" : "column",
          alignItems: vertical ? "stretch" : "flex-start",
          gap: 16,
          inlineSize: 320,
          blockSize: vertical ? 96 : undefined,
        }}
      >
        <p style={{ margin: 0 }}>Hollis Grant</p>
        <Separator {...args} />
        <p style={{ margin: 0 }}>Designs the billing and onboarding flows.</p>
      </div>
    );
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};
