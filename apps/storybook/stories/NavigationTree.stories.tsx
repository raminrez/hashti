import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { NavigationTree } from "@hashti/react";

const meta = {
  title: "Collections/NavigationTree",
  component: NavigationTree,
  parameters: {
    docs: {
      description: {
        component:
          "NavigationTree provides nested, hierarchical links for site structure and documentation with route active-state tracking (current item and its ancestors), expandable sections, and accessible keyboard navigation.",
      },
    },
  },
} satisfies Meta<typeof NavigationTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <NavigationTree
        aria-label="Docs Navigation"
        selectedRoute="/docs/components/navigation-tree"
        defaultExpandedKeys={["collections"]}
      >
        <NavigationTree.Section>
          <NavigationTree.Header>Getting Started</NavigationTree.Header>
          <NavigationTree.Item id="intro" href="/docs/intro" textValue="Introduction">
            <NavigationTree.Content>Introduction</NavigationTree.Content>
          </NavigationTree.Item>
          <NavigationTree.Item id="quickstart" href="/docs/quickstart" textValue="Quick Start">
            <NavigationTree.Content>Quick Start</NavigationTree.Content>
          </NavigationTree.Item>
        </NavigationTree.Section>
        <NavigationTree.Section>
          <NavigationTree.Header>Components</NavigationTree.Header>
          <NavigationTree.Item id="collections" textValue="Collections">
            <NavigationTree.Content>
              <NavigationTree.Indicator />
              <span>Collections</span>
            </NavigationTree.Content>
            <NavigationTree.Item id="listbox" href="/docs/components/listbox" textValue="ListBox">
              <NavigationTree.Content>ListBox</NavigationTree.Content>
            </NavigationTree.Item>
            <NavigationTree.Item
              id="navigation-tree"
              href="/docs/components/navigation-tree"
              textValue="NavigationTree"
            >
              <NavigationTree.Content>NavigationTree</NavigationTree.Content>
            </NavigationTree.Item>
          </NavigationTree.Item>
          <NavigationTree.Item id="fields" textValue="Fields">
            <NavigationTree.Content>
              <NavigationTree.Indicator />
              <span>Fields</span>
            </NavigationTree.Content>
            <NavigationTree.Item id="select" href="/docs/components/select" textValue="Select">
              <NavigationTree.Content>Select</NavigationTree.Content>
            </NavigationTree.Item>
          </NavigationTree.Item>
        </NavigationTree.Section>
      </NavigationTree>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("treegrid", { name: "Docs Navigation" });
    expect(nav).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("Getting Started")).toBeInTheDocument());

    // The current route and its ancestor are both marked by React Aria.
    const current = canvas.getByRole("row", { name: /NavigationTree/ });
    await expect(current).toHaveAttribute("data-current", "true");
    const ancestor = canvas.getByRole("row", { name: /Collections/ });
    await expect(ancestor).toHaveAttribute("data-current-ancestor", "true");
    await expect(ancestor).toHaveAttribute("aria-expanded", "true");
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <NavigationTree
        aria-label="Settings navigation"
        selectedRoute="/settings/profile"
        defaultExpandedKeys={["account"]}
      >
        <NavigationTree.Item id="settings" href="/settings" textValue="Settings">
          <NavigationTree.Content>Settings</NavigationTree.Content>
        </NavigationTree.Item>
        <NavigationTree.Item id="account" textValue="Account">
          <NavigationTree.Content>
            <NavigationTree.Indicator />
            <span>Account</span>
          </NavigationTree.Content>
          <NavigationTree.Item id="profile" href="/settings/profile" textValue="Profile">
            <NavigationTree.Content>Profile</NavigationTree.Content>
          </NavigationTree.Item>
          <NavigationTree.Item id="security" href="/settings/security" textValue="Security">
            <NavigationTree.Content>Security</NavigationTree.Content>
          </NavigationTree.Item>
        </NavigationTree.Item>
      </NavigationTree>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("row", { name: /Account/ })).toBeInTheDocument());
    const account = canvas.getByRole("row", { name: /Account/ });
    const profile = canvas.getByText("Profile").closest("[role='row']");
    expect(profile).toHaveAttribute("data-current", "true");
    await userEvent.click(account);
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(account).toHaveAttribute("aria-expanded", "true"));
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => expect(account).toHaveAttribute("aria-expanded", "false"));
  },
};
