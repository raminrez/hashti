import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

function Bell() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
      <path
        d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4Zm-1.5 10a1.5 1.5 0 0 0 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    count: 3,
    kind: "danger",
    placement: "top-end",
    isDot: false,
  },
  argTypes: {
    kind: {
      control: "select",
      options: [
        "danger",
        "success",
        "warning",
        "info",
        "primary",
        "neutral",
        "secondary",
      ],
      table: { category: "Appearance" },
    },
    placement: {
      control: "select",
      options: ["top-end", "top-start", "bottom-end", "bottom-start"],
      table: { category: "Placement" },
    },
    isDot: { control: "boolean", table: { category: "Appearance" } },
    count: { control: "number", table: { category: "Content" } },
    maxCount: { control: "number", table: { category: "Content" } },
    content: { control: false, table: { category: "Content" } },
    children: { control: false, table: { category: "Content" } },
    className: { table: { disable: true } },
  },
  // children is the thing the badge marks; the panel cannot set a ReactNode.
  render: (args) => (
    <Badge {...args}>
      <Bell />
    </Badge>
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CountOnIcon: Story = {};

export const Overflow: Story = {
  args: { count: 150 },
};

export const Dot: Story = {
  args: { isDot: true },
};

export const Kinds: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(
        ["danger", "success", "warning", "info", "primary", "neutral"] as const
      ).map((kind) => (
        <Badge key={kind} kind={kind}>
          {kind}
        </Badge>
      ))}
    </div>
  ),
};

// No count/content: the children are the pill's own label.
export const Label: Story = {
  args: { kind: "neutral" },
  render: (args) => <Badge {...args}>Draft</Badge>,
};
