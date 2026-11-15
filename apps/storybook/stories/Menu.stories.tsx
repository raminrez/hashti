import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Keyboard,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  OverflowMenu,
  Popover,
  SectionHeader,
  Separator,
  SubmenuTrigger,
  Theme,
  useTheme,
  type Selection,
} from "@hashti/react";
import "./navigation.css";
import "./overlays.css";

const meta = {
  title: "Overlays/Menu",
  component: Menu,
  parameters: {
    docs: {
      description: {
        component:
          "Menu displays a list of actionable choices or selectable options in a lightweight popover. Supports menu triggers, section groupings, single/multi selection, nested submenus, keyboard shortcuts, and the standalone OverflowMenu helper.",
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [lastAction, setLastAction] = useState<string>("None");
  return (
    <div className="navigation-story-stack">
      <div className="navigation-menu-card">
        <div>
          <strong>Repository actions</strong>
          <p style={{ margin: 0, color: "var(--hashti-text-secondary)" }}>
            Selected action: {lastAction}
          </p>
        </div>
        <MenuTrigger>
          <Button variant="secondary">Actions</Button>
          <Popover>
            <Menu onAction={(key) => setLastAction(String(key))}>
              <MenuItem id="view">View details</MenuItem>
              <MenuItem id="duplicate">Duplicate repository</MenuItem>
              <MenuItem id="archive">Archive repository</MenuItem>
              <Separator />
              <MenuItem id="delete" data-danger>
                Delete repository
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const viewItem = await within(popover).findByRole("menuitem", { name: "View details" });
    const deleteItem = within(popover).getByRole("menuitem", {
      name: "Delete repository",
    });

    await waitFor(() => expect(viewItem).toBeVisible());
    await waitFor(() => expect(deleteItem).toBeVisible());

    // Activate item
    await userEvent.click(viewItem);
    await waitFor(() => expect(canvas.getByText("Selected action: view")).toBeVisible());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function SectionsAndSeparatorsExample() {
  const [action, setAction] = useState<string>("None");
  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>Action: {action}</span>
        <MenuTrigger>
          <Button>File menu</Button>
          <Popover>
            <Menu onAction={(k) => setAction(String(k))} disabledKeys={["paste"]}>
              <MenuSection>
                <SectionHeader>Edit options</SectionHeader>
                <MenuItem id="cut">
                  Cut <Keyboard>⌘X</Keyboard>
                </MenuItem>
                <MenuItem id="copy">
                  Copy <Keyboard>⌘C</Keyboard>
                </MenuItem>
                <MenuItem id="paste">
                  Paste <Keyboard>⌘V</Keyboard>
                </MenuItem>
              </MenuSection>
              <Separator />
              <MenuSection>
                <SectionHeader>Export formats</SectionHeader>
                <MenuItem id="pdf">Download PDF</MenuItem>
                <MenuItem id="csv">Export CSV</MenuItem>
              </MenuSection>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </div>
  );
}

export const SectionsAndSeparators: Story = {
  render: () => <SectionsAndSeparatorsExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "File menu" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const copyItem = await within(popover).findByRole("menuitem", { name: /Copy/ });
    const pasteItem = within(popover).getByRole("menuitem", { name: /Paste/ });

    await waitFor(() => expect(copyItem).toBeVisible());
    expect(within(popover).getByText("Edit options")).toBeInTheDocument();
    expect(within(popover).getByText("Export formats")).toBeInTheDocument();
    expect(pasteItem).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(copyItem);
    await waitFor(() => expect(canvas.getByText("Action: copy")).toBeVisible());
  },
};

function SelectionMenuExample() {
  const [selectedSort, setSelectedSort] = useState<Selection>(new Set(["date"]));
  const [selectedColumns, setSelectedColumns] = useState<Selection>(
    new Set(["status", "reviewer"]),
  );

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <MenuTrigger>
          <Button variant="secondary">Sort options (Single)</Button>
          <Popover>
            <Menu
              selectionMode="single"
              selectedKeys={selectedSort}
              onSelectionChange={setSelectedSort}
            >
              <MenuItem id="name">Sort by name</MenuItem>
              <MenuItem id="date">Sort by date</MenuItem>
              <MenuItem id="priority">Sort by priority</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>

        <MenuTrigger>
          <Button variant="secondary">Visible columns (Multiple)</Button>
          <Popover>
            <Menu
              selectionMode="multiple"
              selectedKeys={selectedColumns}
              onSelectionChange={setSelectedColumns}
            >
              <MenuItem id="status">Status column</MenuItem>
              <MenuItem id="reviewer">Reviewer column</MenuItem>
              <MenuItem id="branch">Branch column</MenuItem>
              <MenuItem id="created">Created date</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </div>
  );
}

export const SelectionModes: Story = {
  render: () => <SelectionMenuExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const sortTrigger = canvas.getByRole("button", { name: "Sort options (Single)" });
    await userEvent.click(sortTrigger);

    // The last popover in the DOM is the freshly opened one; earlier ones may still be exiting.
    const openPopover = () =>
      waitFor(() => {
        const popovers = Array.from(document.querySelectorAll<HTMLElement>(".hashti-popover"));
        const el = popovers[popovers.length - 1];
        expect(el).not.toBeUndefined();
        return el!;
      });

    const popover1 = await openPopover();
    const dateOption = await within(popover1).findByRole("menuitemradio", {
      name: "Sort by date",
    });
    expect(dateOption).toHaveAttribute("aria-checked", "true");

    const priorityOption = within(popover1).getByRole("menuitemradio", {
      name: "Sort by priority",
    });
    await userEvent.click(priorityOption);

    // Verify change on reopening
    await waitFor(() => expect(document.querySelectorAll(".hashti-popover")).toHaveLength(0));
    await userEvent.click(sortTrigger);
    const popover2 = await openPopover();
    const newPriorityOption = await within(popover2).findByRole("menuitemradio", {
      name: "Sort by priority",
    });
    expect(newPriorityOption).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelectorAll(".hashti-popover")).toHaveLength(0));

    // Test multiple selection
    const colTrigger = canvas.getByRole("button", { name: "Visible columns (Multiple)" });
    await userEvent.click(colTrigger);

    const popover3 = await openPopover();
    const statusCheck = await within(popover3).findByRole("menuitemcheckbox", {
      name: "Status column",
    });
    expect(statusCheck).toHaveAttribute("aria-checked", "true");

    const branchCheck = within(popover3).getByRole("menuitemcheckbox", {
      name: "Branch column",
    });
    expect(branchCheck).toHaveAttribute("aria-checked", "false");

    await userEvent.click(branchCheck);
    await userEvent.keyboard("{Escape}");
  },
};

export const KeyboardAndSubmenus: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <MenuTrigger>
        <Button>Nested menus</Button>
        <Popover>
          <Menu>
            <MenuItem id="quick">Quick search</MenuItem>
            <SubmenuTrigger>
              <MenuItem id="more">More tools</MenuItem>
              <Popover>
                <Menu>
                  <MenuItem id="profiler">Memory profiler</MenuItem>
                  <MenuItem id="network">Network inspector</MenuItem>
                  <MenuItem id="lighthouse">Lighthouse audit</MenuItem>
                </Menu>
              </Popover>
            </SubmenuTrigger>
            <MenuItem id="settings">Preferences</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "Nested menus" });
    await userEvent.click(trigger);

    const popover1 = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const moreItem = await within(popover1).findByRole("menuitem", { name: /More tools/ });
    await waitFor(() => expect(moreItem).toBeVisible());

    // Expand submenu via keyboard
    moreItem.focus();
    await userEvent.keyboard("{ArrowRight}");

    const subpopover = await waitFor(() => {
      const popovers = Array.from(document.querySelectorAll<HTMLElement>(".hashti-popover"));
      expect(popovers.length).toBeGreaterThan(1);
      return popovers[popovers.length - 1]!;
    });
    const profilerItem = await within(subpopover).findByRole("menuitem", {
      name: "Memory profiler",
    });
    await waitFor(() => expect(profilerItem).toBeVisible());

    // Close submenu
    await userEvent.keyboard("{ArrowLeft}");
    expect(moreItem).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};

function OverflowMenuExample() {
  const [action, setAction] = useState<string>("None");
  return (
    <div className="navigation-story-stack">
      <div className="navigation-menu-card">
        <div>
          <strong>Compute instance #04</strong>
          <p style={{ margin: 0, color: "var(--hashti-text-secondary)" }}>
            Current state: Running (Last action: {action})
          </p>
        </div>
        <OverflowMenu aria-label="Instance actions" onAction={(k) => setAction(String(k))}>
          <MenuItem id="restart">Restart instance</MenuItem>
          <MenuItem id="snapshot">Create snapshot</MenuItem>
          <Separator />
          <MenuItem id="terminate" data-danger>
            Terminate instance
          </MenuItem>
        </OverflowMenu>
      </div>
    </div>
  );
}

export const OverflowMenuStory: Story = {
  name: "OverflowMenu",
  render: () => <OverflowMenuExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "Instance actions" });
    await waitFor(() => expect(trigger).toBeVisible());

    await userEvent.click(trigger);
    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const restartItem = await within(popover).findByRole("menuitem", {
      name: "Restart instance",
    });
    await waitFor(() => expect(restartItem).toBeVisible());

    await userEvent.click(restartItem);
    await waitFor(() => expect(canvas.getByText(/Last action: restart/)).toBeVisible());
  },
};

function LocalizedMenu() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <MenuTrigger>
            <Button>گزینه‌های حساب</Button>
            <Popover>
              <Menu>
                <MenuItem id="profile">نمایه کاربر</MenuItem>
                <MenuItem id="settings">تنظیمات امنیت</MenuItem>
                <Separator />
                <MenuItem id="logout" data-danger>
                  خروج از حساب
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedMenu />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "گزینه‌های حساب" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const profileItem = await within(popover).findByRole("menuitem", { name: "نمایه کاربر" });
    await waitFor(() => expect(profileItem).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};
