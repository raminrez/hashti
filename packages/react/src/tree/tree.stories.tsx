import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "./tree";

type Node = { value: string; label: string; children?: Node[] };

const FILES: Node[] = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "src/components",
        label: "components",
        children: [
          { value: "src/components/button.tsx", label: "button.tsx" },
          { value: "src/components/card.tsx", label: "card.tsx" },
        ],
      },
      { value: "src/index.ts", label: "index.ts" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "README.md", label: "README.md" },
];

function Items({ items }: { items: Node[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {item.children && <TreeItemIndicator />}
        {item.label}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ));
}

const meta = {
  title: "Components/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    mode: "single",
    activation: "automatic",
    expandOnPress: true,
    onValueChange: fn(),
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multiple", "none"],
      table: { category: "Selection" },
    },
    activation: {
      control: "select",
      options: ["automatic", "manual"],
      table: { category: "Selection" },
    },
    expandOnPress: { control: "boolean", table: { category: "Selection" } },
    disabled: { control: "boolean", table: { category: "State" } },
    focusableWhenDisabled: { control: "boolean", table: { category: "State" } },
    keepMounted: { control: "boolean", table: { category: "State" } },
    items: { table: { disable: true } },
    paths: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    expanded: { table: { disable: true } },
    defaultExpanded: { table: { disable: true } },
    checked: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
    checkStrategy: { table: { disable: true } },
    current: { table: { disable: true } },
    onValueChange: { control: false, table: { category: "Events" } },
    onExpandedChange: { control: false, table: { category: "Events" } },
    onCheckedChange: { control: false, table: { category: "Events" } },
    onAction: { control: false, table: { category: "Events" } },
    loadChildren: { table: { disable: true } },
    controller: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Tree
      aria-label="Project files"
      defaultExpanded={["src"]}
      defaultValue="src/index.ts"
      {...args}
    >
      <Items items={FILES} />
    </Tree>
  ),
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const AllCollapsed: Story = {
  args: { defaultValue: null },
  render: (args) => (
    <Tree aria-label="Project files" {...args}>
      <Items items={FILES} />
    </Tree>
  ),
};

export const ManualActivation: Story = {
  args: { activation: "manual" },
};

export const MultipleSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tree
      aria-label="Project files"
      mode="multiple"
      defaultValue={["src/components/button.tsx", "README.md"]}
      defaultExpanded={["src", "src/components"]}
      expandOnPress={false}
    >
      <Items items={FILES} />
    </Tree>
  ),
};
