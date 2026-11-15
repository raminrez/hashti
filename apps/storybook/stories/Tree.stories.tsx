import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Tree } from "@hashti/react";

const meta = {
  title: "Collections/Tree",
  component: Tree,
  parameters: {
    docs: {
      description: {
        component:
          "Tree presents hierarchical data with nested navigation, expandable indicators, selection modes, optional guideline connectors, and full keyboard support: arrows move and expand, Enter selects.",
      },
    },
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Tree
        aria-label="Project file explorer"
        selectionMode="single"
        defaultExpandedKeys={["src"]}
        defaultSelectedKeys={["src/index.ts"]}
      >
        <Tree.Item id="src" textValue="src">
          <Tree.Content>
            <Tree.Indicator />
            <span>src</span>
          </Tree.Content>
          <Tree.Item id="src/components" textValue="components">
            <Tree.Content>
              <Tree.Indicator />
              <span>components</span>
            </Tree.Content>
            <Tree.Item id="src/components/Button.tsx" textValue="Button.tsx">
              <Tree.Content>
                <span>Button.tsx</span>
              </Tree.Content>
            </Tree.Item>
            <Tree.Item id="src/components/Tree.tsx" textValue="Tree.tsx">
              <Tree.Content>
                <span>Tree.tsx</span>
              </Tree.Content>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="src/index.ts" textValue="index.ts">
            <Tree.Content>
              <span>index.ts</span>
            </Tree.Content>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="package.json" textValue="package.json">
          <Tree.Content>
            <span>package.json</span>
          </Tree.Content>
        </Tree.Item>
      </Tree>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole("treegrid", { name: "Project file explorer" });
    expect(tree).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("src")).toBeInTheDocument());
    expect(canvas.getByRole("row", { name: /index.ts/ })).toHaveAttribute("aria-selected", "true");
    expect(canvas.getByRole("row", { name: /src/ })).toHaveAttribute("aria-expanded", "true");
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Tree aria-label="Keyboard file explorer" selectionMode="single">
        <Tree.Item id="docs" textValue="docs">
          <Tree.Content>
            <Tree.Indicator />
            <span>docs</span>
          </Tree.Content>
          <Tree.Item id="docs/guide.md" textValue="guide.md">
            <Tree.Content>
              <span>guide.md</span>
            </Tree.Content>
          </Tree.Item>
          <Tree.Item id="docs/api.md" textValue="api.md">
            <Tree.Content>
              <span>api.md</span>
            </Tree.Content>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="readme.md" textValue="readme.md">
          <Tree.Content>
            <span>readme.md</span>
          </Tree.Content>
        </Tree.Item>
      </Tree>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("row", { name: /docs/ })).toBeInTheDocument());
    const docs = canvas.getByRole("row", { name: /docs/ });
    await userEvent.click(docs);
    await expect(docs).toHaveAttribute("aria-expanded", "false");

    // ArrowRight expands, ArrowLeft collapses, ArrowDown moves the focused row.
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(docs).toHaveAttribute("aria-expanded", "true"));
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => expect(docs).toHaveAttribute("aria-expanded", "false"));
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("row", { name: /readme.md/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  },
};

export const MultiSelectWithCheckboxes: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Tree
        aria-label="Department permissions"
        selectionMode="multiple"
        defaultExpandedKeys={["engineering"]}
        showGuideLines
      >
        <Tree.Item id="engineering" textValue="Engineering">
          <Tree.Content>
            <Tree.Indicator />
            <Tree.Checkbox aria-label="Select Engineering" />
            <span>Engineering</span>
          </Tree.Content>
          <Tree.Item id="eng-frontend" textValue="Frontend">
            <Tree.Content>
              <Tree.Checkbox aria-label="Select Frontend" />
              <span>Frontend</span>
            </Tree.Content>
          </Tree.Item>
          <Tree.Item id="eng-backend" textValue="Backend">
            <Tree.Content>
              <Tree.Checkbox aria-label="Select Backend" />
              <span>Backend</span>
            </Tree.Content>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="design" textValue="Design">
          <Tree.Content>
            <Tree.Indicator />
            <Tree.Checkbox aria-label="Select Design" />
            <span>Design</span>
          </Tree.Content>
          <Tree.Item id="design-system" textValue="Design Systems">
            <Tree.Content>
              <Tree.Checkbox aria-label="Select Design Systems" />
              <span>Design Systems</span>
            </Tree.Content>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole("treegrid", { name: "Department permissions" });
    expect(tree).toBeInTheDocument();
    await waitFor(() => expect(canvas.getAllByRole("row").length).toBeGreaterThanOrEqual(2));
  },
};
