"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Icon, Theme, Toggle, useTheme, type ToggleProps } from "@hashti/react";
import "./actions.css";

const meta = {
  title: "Actions/Toggle",
  component: Toggle,
  args: {
    children: "Pin message",
    onPressedChange: fn(),
  },
  argTypes: {
    size: { control: "select", options: [undefined, "sm", "md", "lg"] },
    disabled: { control: "boolean" },
    pressed: { control: "boolean" },
    defaultPressed: { control: "boolean" },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Toggle keeps a button pressed until it is pressed again, like pinning a message or starring a document. For a group of mutually exclusive options, use ContentSwitcher.",
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true },
  play: async ({ canvasElement, userEvent }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Pin message" });
    await expect(toggle).toHaveAttribute("data-pressed");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    await expect(toggle).not.toHaveAttribute("data-pressed");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="action-story-stack">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div className="action-story-row" key={size}>
          <code>{size}</code>
          <Toggle {...args} size={size} defaultPressed={size === "md"}>
            {size === "sm" ? "Compact" : size === "md" ? "Comfortable" : "Spacious"} density
          </Toggle>
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { exclude: ["size", "children"] } },
};

export const IconToggle: Story = {
  args: {
    "aria-label": "Star document",
    children: <Icon name="star" />,
  },
  parameters: { controls: { exclude: ["children"] } },
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Star document" });
    await expect(toggle).toHaveAccessibleName("Star document");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args, userEvent }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Pin message" });
    await expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};

export const Controlled: Story = {
  render: function ControlledExample(args: ToggleProps) {
    const [pinned, setPinned] = useState(false);
    return (
      <div className="action-story-stack">
        <Toggle {...args} pressed={pinned} onPressedChange={setPinned}>
          {pinned ? "Unpin message" : "Pin message"}
        </Toggle>
        <p role="status">{pinned ? "Message pinned." : "Message unpinned."}</p>
      </div>
    );
  },
  parameters: { controls: { exclude: ["pressed", "children", "onPressedChange"] } },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Pin message" });
    await userEvent.click(toggle);
    await expect(canvas.getByRole("status")).toHaveTextContent("Message pinned.");
    await expect(canvas.getByRole("button", { name: "Unpin message" })).toHaveAttribute(
      "data-pressed",
    );
  },
};

export const RightToLeft: Story = {
  render: function RtlExample(args: ToggleProps) {
    const { theme } = useTheme();
    return (
      <div className="action-story-stack action-story-narrow">
        <Theme theme={theme} lang="fa-IR" dir="rtl" className="action-story-stack">
          <Toggle {...args} defaultPressed>
            سنجاق کردن پیام
          </Toggle>
        </Theme>
        <Theme theme={theme} lang="ar" dir="rtl" className="action-story-stack">
          <Toggle {...args}>تثبيت الرسالة</Toggle>
        </Theme>
      </div>
    );
  },
  parameters: { controls: { exclude: ["children"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const persian = canvas.getByRole("button", { name: "سنجاق کردن پیام" });
    await expect(persian).toHaveAttribute("data-pressed");
    await expect(persian.closest("[dir='rtl']")).not.toBeNull();
  },
};
