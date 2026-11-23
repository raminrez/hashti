import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "documentation",
    href: "#docs",
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    href: { control: "text", table: { category: "Content" } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Inline among text, the shape the component is designed for.
export const InParagraph: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ maxInlineSize: 480 }}>
      Read the <Link href="#docs">documentation</Link> or visit the{" "}
      <Link href="#repo">repository</Link>.
    </p>
  ),
};
