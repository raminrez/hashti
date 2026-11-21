import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path
        d="m2.5 6.5 2.5 2.5 4.5-6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "State" } },
    onOpenChange: { control: false, table: { category: "Events" } },
    onAction: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Menu
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem value="rename">Rename</MenuItem>
          <MenuItem value="duplicate">Duplicate</MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem value="status-bar" defaultChecked>
            <MenuItemIndicator keepMounted>
              <CheckGlyph />
            </MenuItemIndicator>
            Status bar
          </MenuCheckboxItem>
          <MenuCheckboxItem value="minimap">
            <MenuItemIndicator keepMounted>
              <CheckGlyph />
            </MenuItemIndicator>
            Minimap
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuRadioGroup name="density" defaultValue="comfortable">
            <MenuGroupLabel>Density</MenuGroupLabel>
            {["Compact", "Comfortable"].map((option) => (
              <MenuRadioItem key={option} value={option.toLowerCase()}>
                <MenuItemIndicator />
                {option}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};
