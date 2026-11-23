import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  CommandSeparator,
  createCommandController,
  useAsyncOptions,
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

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

// Pages live in the consumer's state: the root reports the stack, the item
// opens a page, and Backspace (handled by the root) pops it.
function PagesDemo() {
  const [command] = React.useState(createCommandController);
  const [pages, setPages] = React.useState<string[]>([]);
  return (
    <Command
      controller={command}
      pages={pages}
      onPagesChange={setPages}
      onAction={(value) => {
        if (value === "back") command.pop();
      }}
      style={{ maxInlineSize: 448 }}
    >
      <CommandInput
        aria-label="Search commands"
        placeholder={
          pages.length ? "Search… (Backspace to go back)" : "What do you need?"
        }
      />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        <CommandPage>
          <CommandGroup>
            <CommandGroupLabel>Workspace</CommandGroupLabel>
            <CommandItem value="theme" page="theme">
              Change theme…
            </CommandItem>
          </CommandGroup>
        </CommandPage>
        <CommandPage value="theme">
          {themes.map((theme) => (
            <CommandItem key={theme.value} value={theme.value}>
              {theme.label}
            </CommandItem>
          ))}
        </CommandPage>
        {pages.length > 0 && <CommandItem value="back">Go back</CommandItem>}
      </CommandList>
    </Command>
  );
}

// Compound root driven by its own state: Controls would rewrite args it ignores.
export const Pages: Story = {
  render: () => <PagesDemo />,
  parameters: { controls: { disable: true } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Change theme…"));
    await expect(canvas.getByText("Light")).toBeTruthy();

    // Backspace pops the page stack; the root handles it while the input has focus.
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.keyboard("{Backspace}");
    await expect(canvas.getByText("Change theme…")).toBeTruthy();
  },
};

// Never resolves, so the story shows the loading state: three skeleton rows
// standing in for the results the query will return.
const holdLoading = () =>
  new Promise<{ value: string; label: string }[]>(() => {});

function AsyncSkeletonDemo() {
  const results = useAsyncOptions(holdLoading, { immediate: true });
  return (
    <Command
      filter={false}
      status={results.status}
      onQueryChange={results.setQuery}
      style={{ maxInlineSize: 448 }}
    >
      <CommandInput aria-label="Search issues" placeholder="Search issues…" />
      <CommandEmpty>
        {(state) =>
          state.loading ? null : `No issues match “${state.query}”.`
        }
      </CommandEmpty>
      <CommandList>
        {results.status === "loading" &&
          [0, 1, 2].map((row) => (
            <div key={row} className="hashti-command__skeleton-row" />
          ))}
        {results.items.map((item) => (
          <CommandItem key={item.value} value={item.value} label={item.label}>
            {item.label}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}

export const AsyncSkeleton: Story = {
  render: () => <AsyncSkeletonDemo />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll(
      ".hashti-command__skeleton-row",
    );
    await expect(rows.length).toBe(3);
  },
};
