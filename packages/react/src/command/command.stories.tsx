import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const meta = {
  title: "Components/Command",
  component: Command,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    defaultQuery: "",
    onAction: fn(),
  },
  argTypes: {
    defaultQuery: { control: "text", table: { category: "State" } },
    onQueryChange: { control: false, table: { category: "Events" } },
    onAction: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Command {...args} style={{ maxInlineSize: 448 }}>
      <CommandInput
        placeholder="Type a command or search…"
        aria-label="Command palette"
      />
      <CommandList>
        <CommandGroup>
          <CommandGroupLabel>File</CommandGroupLabel>
          <CommandItem value="new-file">New file</CommandItem>
          <CommandItem value="open">Open recent</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandGroupLabel>Edit</CommandGroupLabel>
          <CommandItem value="undo">Undo</CommandItem>
          <CommandItem value="redo" disabled>
            Redo
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandEmpty>No commands found.</CommandEmpty>
    </Command>
  ),
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// No item matches: exercises CommandEmpty through the filter, not a manual toggle.
export const Empty: Story = {
  args: { defaultQuery: "zzzz" },
};
