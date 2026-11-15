import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within, userEvent } from "storybook/test";
import { CommandPalette, Button, Icon, Kbd } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  parameters: {
    docs: {
      description: {
        component:
          "CommandPalette provides a keyboard-first command menu dialog with quick search, grouped action lists, OS-aware shortcut badges, and footer navigation help.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface CommandItemData {
  id: string;
  title: string;
  description: string;
  icon: "file" | "settings" | "sparkle" | "trash" | "code";
  shortcut?: string[];
  group: string;
}

const allCommands: CommandItemData[] = [
  {
    id: "new-file",
    title: "Create New Component",
    description: "Scaffold a new Hashti React component",
    icon: "file",
    shortcut: ["mod", "n"],
    group: "Development",
  },
  {
    id: "ai-prompt",
    title: "Generate with AI Agent",
    description: "Launch prompt composer with tokens",
    icon: "sparkle",
    shortcut: ["mod", "shift", "a"],
    group: "Development",
  },
  {
    id: "run-tests",
    title: "Run Unit Test Suite",
    description: "Execute bun test across test runner",
    icon: "code",
    shortcut: ["mod", "t"],
    group: "Development",
  },
  {
    id: "preferences",
    title: "Workspace Preferences",
    description: "Adjust themes, density, and keybindings",
    icon: "settings",
    shortcut: ["mod", ","],
    group: "System",
  },
  {
    id: "clear-cache",
    title: "Clear Token Build Cache",
    description: "Purge generated CSS and tokens",
    icon: "trash",
    group: "System",
  },
];

function PlaygroundExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const filteredCommands = allCommands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.group.toLowerCase().includes(query.toLowerCase()),
  );

  const groups = Array.from(new Set(filteredCommands.map((c) => c.group)));

  return (
    <div className="overlay-story-stack">
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button variant="primary" onPress={() => setIsOpen(true)}>
          Open Command Palette
        </Button>
        <span style={{ fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
          or press <Kbd keys={["mod", "k"]} /> anywhere
        </span>
      </div>

      <output
        data-testid="selected-action-output"
        style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--hashti-text-primary)" }}
      >
        {selectedAction ? `Selected action: ${selectedAction}` : "No command executed yet."}
      </output>

      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        query={query}
        onQueryChange={setQuery}
        enableShortcut
      >
        <CommandPalette.Dialog aria-label="Quick Commands">
          <CommandPalette.Input placeholder="Type a command or search..." />
          <CommandPalette.List
            emptyContent={
              <CommandPalette.Empty
                title="No matching commands"
                description={`No results found for "${query}"`}
              />
            }
          >
            {groups.map((group) => (
              <CommandPalette.Group key={group} heading={group}>
                {filteredCommands
                  .filter((cmd) => cmd.group === group)
                  .map((cmd) => (
                    <CommandPalette.Item
                      key={cmd.id}
                      id={cmd.id}
                      icon={<Icon name={cmd.icon} />}
                      shortcut={cmd.shortcut}
                      description={cmd.description}
                      onAction={() => {
                        setSelectedAction(cmd.title);
                      }}
                    >
                      {cmd.title}
                    </CommandPalette.Item>
                  ))}
              </CommandPalette.Group>
            ))}
          </CommandPalette.List>
          <CommandPalette.Footer />
        </CommandPalette.Dialog>
      </CommandPalette>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Command Palette" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-command-palette-modal");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(dialog).toBeVisible());

    const input = within(dialog).getByRole("searchbox", { name: "Search commands" });
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "Component");
    const item = await within(dialog).findByText("Create New Component");
    expect(item).toBeInTheDocument();

    await userEvent.click(item);
    expect(canvas.getByTestId("selected-action-output")).toHaveTextContent(
      "Selected action: Create New Component",
    );
  },
};

function EmptyStateExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("xyz-nonexistent");

  return (
    <div className="overlay-story-stack">
      <Button onPress={() => setIsOpen(true)}>Open Empty Palette Demo</Button>

      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        query={query}
        onQueryChange={setQuery}
      >
        <CommandPalette.Dialog aria-label="Empty State Commands">
          <CommandPalette.Input />
          <CommandPalette.List
            emptyContent={
              <CommandPalette.Empty
                title="No commands found"
                description="No tools or documents match your query."
              />
            }
          />
          <CommandPalette.Footer />
        </CommandPalette.Dialog>
      </CommandPalette>
    </div>
  );
}

export const FilteredEmptyState: Story = {
  render: () => <EmptyStateExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Empty Palette Demo" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-command-palette-modal");
      expect(el).not.toBeNull();
      return el!;
    });

    expect(within(dialog).getByText("No commands found")).toBeInTheDocument();
  },
};
