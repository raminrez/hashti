import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../menu/menu";
import { Menubar } from "./menubar";

const meta = {
  title: "Components/Menubar",
  component: Menubar,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: { orientation: "horizontal", disabled: false },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Menubar {...args} aria-label="App menus">
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuSeparator />
          <MenuItem value="close">Close</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent>
          <MenuItem value="undo">Undo</MenuItem>
          <MenuItem value="redo">Redo</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuItem value="zoom-in">Zoom in</MenuItem>
          <MenuItem value="zoom-out">Zoom out</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  ),
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
