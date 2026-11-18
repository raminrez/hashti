import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within, userEvent } from "storybook/test";
import { Command, Button, Icon, Kbd } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Command",
  component: Command,
  parameters: {
    docs: {
      description: {
        component:
          "Command is a keyboard-first command palette: a ui-sdk Command (search, grouped actions, shortcut badges) inside a Hashti Dialog.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface CommandItemData {
  value: string;
  title: string;
  description: string;
  icon: "file" | "settings" | "sparkle" | "trash" | "code";
  shortcutKeys?: string[];
  group: string;
}

const allCommands: CommandItemData[] = [
  {
    value: "new-file",
    title: "Create New Component",
    description: "Scaffold a new Hashti React component",
    icon: "file",
    shortcutKeys: ["mod", "n"],
    group: "Development",
  },
  {
    value: "ai-prompt",
    title: "Generate with AI Agent",
    description: "Launch prompt composer with tokens",
    icon: "sparkle",
    shortcutKeys: ["mod", "shift", "a"],
    group: "Development",
  },
  {
    value: "run-tests",
    title: "Run Unit Test Suite",
    description: "Execute bun test across test runner",
    icon: "code",
    shortcutKeys: ["mod", "t"],
    group: "Development",
  },
  {
    value: "preferences",
    title: "Workspace Preferences",
    description: "Adjust themes, density, and keybindings",
    icon: "settings",
    shortcutKeys: ["mod", ","],
    group: "System",
  },
  {
    value: "clear-cache",
    title: "Clear Token Build Cache",
    description: "Purge generated CSS and tokens",
    icon: "trash",
    group: "System",
  },
];

function PlaygroundExample() {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const groups = Array.from(new Set(allCommands.map((c) => c.group)));

  return (
    <div className="overlay-story-stack">
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button variant="primary" onClick={() => setOpen(true)}>
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

      <Command
        open={open}
        onOpenChange={setOpen}
        onAction={(value) => {
          const command = allCommands.find((c) => c.value === value);
          setSelectedAction(command?.title ?? value);
        }}
      >
        <Command.Input placeholder="Type a command or search..." />
        <Command.Empty title="No matching commands" description="Try another search." />
        <Command.List>
          {groups.map((group) => (
            <Command.Group key={group} heading={group}>
              {allCommands
                .filter((cmd) => cmd.group === group)
                .map((cmd) => (
                  <Command.Item
                    key={cmd.value}
                    value={cmd.value}
                    icon={<Icon name={cmd.icon} />}
                    shortcutKeys={cmd.shortcutKeys}
                    description={cmd.description}
                    keywords={[cmd.group]}
                  >
                    {cmd.title}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
        <Command.Footer />
      </Command>
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

    const input = within(dialog).getByRole("combobox");
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
  const [open, setOpen] = useState(false);

  return (
    <div className="overlay-story-stack">
      <Button onClick={() => setOpen(true)}>Open Empty Palette Demo</Button>

      <Command open={open} onOpenChange={setOpen} defaultQuery="xyz-nonexistent">
        <Command.Input />
        <Command.Empty title="No commands found" description="No tools or documents match your query." />
        <Command.List>
          <Command.Item value="placeholder">Placeholder command</Command.Item>
        </Command.List>
        <Command.Footer />
      </Command>
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
