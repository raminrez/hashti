import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./kbd";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    keys: ["command", "K"],
  },
  argTypes: {
    keys: { control: false, table: { category: "Content" } },
    children: { control: "text", table: { category: "Content" } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shortcut: Story = {};

export const WindowsCombo: Story = {
  args: { keys: ["ctrl", "shift", "P"] },
};

export const RawContent: Story = {
  args: { keys: undefined, children: "Esc" },
};

export const InSentence: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <span>
      Press <Kbd keys={["command", "K"]} /> to search, or{" "}
      <Kbd keys={["escape"]} /> to close.
    </span>
  ),
};
