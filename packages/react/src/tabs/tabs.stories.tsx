import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    value: "overview",
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: ["overview", "activity", "settings"],
      table: { category: "State" },
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    activation: {
      control: "inline-radio",
      options: ["automatic", "manual"],
      table: { category: "Behavior" },
    },
    loop: { control: "boolean", table: { category: "Behavior" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Tabs
        {...args}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
        style={
          args.orientation === "vertical"
            ? { display: "flex", gap: "1rem" }
            : undefined
        }
      >
        <TabsList>
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="settings">Settings</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="overview">The project at a glance.</TabsPanel>
        <TabsPanel value="activity">Recent changes and comments.</TabsPanel>
        <TabsPanel value="settings">
          Notifications, access and integrations.
        </TabsPanel>
      </Tabs>
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const DisabledTab: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="activity">Activity</TabsTab>
        <TabsTab value="settings" disabled>
          Settings
        </TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="overview">The project at a glance.</TabsPanel>
      <TabsPanel value="activity">Recent changes and comments.</TabsPanel>
      <TabsPanel value="settings">
        Notifications, access and integrations.
      </TabsPanel>
    </Tabs>
  ),
};
