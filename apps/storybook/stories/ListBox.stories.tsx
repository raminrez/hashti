import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { DropIndicator, useListData } from "react-aria-components";
import { isTextDropItem, useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { ListBox } from "@hashti/react";

const meta = {
  title: "Collections/ListBox",
  component: ListBox,
  parameters: {
    docs: {
      description: {
        component:
          "ListBox displays a list of options and allows a user to select one or more items with keyboard navigation, section grouping, and drag reordering. Drag works from the option itself, with mouse, touch, keyboard (Enter, then arrows) and screen readers.",
      },
    },
  },
} satisfies Meta<typeof ListBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ListBox aria-label="Favorite animals" selectionMode="single" variant="bordered">
        <ListBox.Item id="cat" textValue="Cat">
          Cat
        </ListBox.Item>
        <ListBox.Item id="dog" textValue="Dog">
          Dog
        </ListBox.Item>
        <ListBox.Item id="rabbit" textValue="Rabbit">
          Rabbit
        </ListBox.Item>
        <ListBox.Item id="fox" textValue="Fox">
          Fox
        </ListBox.Item>
      </ListBox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Favorite animals" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(4));
  },
};

export const GroupedWithSections: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ListBox aria-label="Select framework" selectionMode="single" variant="bordered">
        <ListBox.Section>
          <ListBox.Header>Frontend</ListBox.Header>
          <ListBox.Item id="react" textValue="React">
            React
          </ListBox.Item>
          <ListBox.Item id="vue" textValue="Vue">
            Vue
          </ListBox.Item>
          <ListBox.Item id="svelte" textValue="Svelte">
            Svelte
          </ListBox.Item>
        </ListBox.Section>
        <ListBox.Section>
          <ListBox.Header>Backend</ListBox.Header>
          <ListBox.Item id="node" textValue="Node.js">
            Node.js
          </ListBox.Item>
          <ListBox.Item id="bun" textValue="Bun">
            Bun
          </ListBox.Item>
          <ListBox.Item id="go" textValue="Go">
            Go
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Select framework" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("Frontend")).toBeInTheDocument());
    expect(canvas.getByText("Backend")).toBeInTheDocument();
  },
};

export const Reorderable: Story = {
  render: () => <ReorderableExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Prioritized backlog" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(4));

    // The accessible path: Enter starts a keyboard drag, arrows choose the target, Enter drops.
    await userEvent.click(canvas.getAllByRole("option")[0]!);
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getAllByRole("option").map((option) => option.textContent)).toEqual([
        "Medium Priority Item",
        "High Priority Item",
        "Low Priority Item",
        "Write release notes",
      ]),
    );
  },
};

// The option is the drag affordance: React Aria starts a keyboard drag from it, so no
// second focusable drag button is nested inside the option.
function ReorderableExample() {
  const list = useListData({
    initialItems: [
      { id: "item-1", name: "High Priority Item" },
      { id: "item-2", name: "Medium Priority Item" },
      { id: "item-3", name: "Low Priority Item" },
      { id: "item-4", name: "Write release notes" },
    ],
  });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys, items: typeof list.items) =>
      items.map((item) => ({ "text/plain": item.name })),
    getDropOperation: () => "move",
    onReorder(event) {
      if (event.target.dropPosition === "before") {
        list.moveBefore(event.target.key, event.keys);
      } else if (event.target.dropPosition === "after") {
        list.moveAfter(event.target.key, event.keys);
      }
    },
    renderDropIndicator: (target) => <DropIndicator target={target} />,
  });
  return (
    <div style={{ maxWidth: 360 }}>
      <ListBox
        aria-label="Prioritized backlog"
        selectionMode="multiple"
        variant="bordered"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(item) => (
          <ListBox.Item id={item.id} textValue={item.name}>
            {item.name}
          </ListBox.Item>
        )}
      </ListBox>
    </div>
  );
}

export const DragBetweenLists: Story = {
  render: () => <DragBetweenListsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getAllByRole("listbox")).toHaveLength(2));
    const [backlog, active] = canvas.getAllByRole("listbox");
    await waitFor(() => expect(within(backlog!).getAllByRole("option")).toHaveLength(3));
    await waitFor(() => expect(within(active!).getAllByRole("option")).toHaveLength(2));
  },
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

function DragBetweenListsExample() {
  const backlog = useListData<TeamMember>({
    initialItems: [
      { id: "m-1", name: "Ada Lovelace", role: "Engineer" },
      { id: "m-2", name: "Grace Hopper", role: "Engineer" },
      { id: "m-3", name: "Katherine Johnson", role: "Analyst" },
    ],
  });
  const active = useListData<TeamMember>({
    initialItems: [
      { id: "m-4", name: "Alan Turing", role: "Engineer" },
      { id: "m-5", name: "Margaret Hamilton", role: "Lead" },
    ],
  });

  const { dragAndDropHooks: sourceHooks } = useDragAndDrop({
    getItems: (keys, items: TeamMember[]) =>
      items.map((item) => ({
        "text/plain": item.name,
        "team/member": JSON.stringify(item),
      })),
    getDropOperation: () => "move",
    onDragEnd(event) {
      // A move that left this list must not leave a copy behind.
      if (event.dropOperation === "move" && !event.isInternal) {
        backlog.remove(...event.keys);
      }
    },
  });

  const { dragAndDropHooks: targetHooks } = useDragAndDrop({
    acceptedDragTypes: ["team/member"],
    getDropOperation: () => "move",
    async onInsert(event) {
      const items = await Promise.all(
        event.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText("team/member")) as TeamMember),
      );
      if (event.target.dropPosition === "before") {
        active.insertBefore(event.target.key, ...items);
      } else if (event.target.dropPosition === "after") {
        active.insertAfter(event.target.key, ...items);
      }
    },
    async onRootDrop(event) {
      const items = await Promise.all(
        event.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText("team/member")) as TeamMember),
      );
      active.append(...items);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} />,
  });

  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ minWidth: 220 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>Backlog ({backlog.items.length})</h3>
        <ListBox
          aria-label="Backlog"
          selectionMode="multiple"
          variant="bordered"
          items={backlog.items}
          dragAndDropHooks={sourceHooks}
        >
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.name}>
              {item.name}
            </ListBox.Item>
          )}
        </ListBox>
      </div>
      <div style={{ minWidth: 220 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>Active ({active.items.length})</h3>
        <ListBox
          aria-label="Active"
          selectionMode="multiple"
          variant="bordered"
          items={active.items}
          dragAndDropHooks={targetHooks}
        >
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.name}>
              {item.name}
            </ListBox.Item>
          )}
        </ListBox>
      </div>
    </div>
  );
}

export const InfiniteScrollingLoadMore: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ListBox aria-label="Infinite server logs" variant="bordered">
        <ListBox.Item id="log-1" textValue="Log 1">
          Server initialized on port 3000
        </ListBox.Item>
        <ListBox.Item id="log-2" textValue="Log 2">
          Connected to database pool
        </ListBox.Item>
        <ListBox.Item id="log-3" textValue="Log 3">
          Loaded environment configuration
        </ListBox.Item>
        <ListBox.LoadMore id="load-more-logs" isLoading={true} label="Loading more logs…" />
      </ListBox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Infinite server logs" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("Loading more logs…")).toBeInTheDocument());
  },
};
