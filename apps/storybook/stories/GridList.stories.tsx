import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { DropIndicator, useListData } from "react-aria-components";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { GridList, Tag, Text, type Key } from "@hashti/react";

const meta = {
  title: "Collections/GridList",
  component: GridList,
  parameters: {
    docs: {
      description: {
        component:
          "GridList displays an interactive collection of rows or tiles with arrow key navigation, single or multiple selection, sections, a grid layout, row actions and drag reordering.",
      },
    },
  },
} satisfies Meta<typeof GridList>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Team {
  id: string;
  name: string;
  members: number;
  color: "blue" | "gray" | "purple" | "green";
}

const teams: Team[] = [
  { id: "design", name: "Design Systems", members: 8, color: "blue" },
  { id: "engineering", name: "Frontend Engineering", members: 12, color: "gray" },
  { id: "product", name: "Product Management", members: 4, color: "purple" },
  { id: "research", name: "User Research", members: 3, color: "green" },
];

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <GridList aria-label="Development teams" selectionMode="single" items={teams}>
        {(team) => (
          <GridList.Item id={team.id} textValue={team.name}>
            <Text>{team.name}</Text>
            <Text slot="description">{team.members} members</Text>
          </GridList.Item>
        )}
      </GridList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("grid", { name: "Development teams" })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(teams.length));
    expect(canvas.getByText("Design Systems")).toBeInTheDocument();
  },
};

export const Sections: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <GridList aria-label="Release checklist" selectionMode="multiple">
        <GridList.Section id="blocking" title="Blocking">
          <GridList.Item id="contrast" textValue="Audit contrast">
            <GridList.Checkbox aria-label="Audit contrast" />
            <span>Audit secondary button contrast</span>
            <Tag color="red">High</Tag>
          </GridList.Item>
          <GridList.Item id="redirect" textValue="Fix login redirect">
            <GridList.Checkbox aria-label="Fix login redirect" />
            <span>Fix login redirect loop</span>
            <Tag color="red">High</Tag>
          </GridList.Item>
        </GridList.Section>
        <GridList.Section id="follow-up" title="Follow-up">
          <GridList.Item id="deps" textValue="Update dependencies">
            <GridList.Checkbox aria-label="Update dependencies" />
            <span>Update dependencies to RAC 1.22</span>
            <Tag color="blue">Medium</Tag>
          </GridList.Item>
        </GridList.Section>
      </GridList>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Blocking")).toBeInTheDocument());
    expect(canvas.getByText("Follow-up")).toBeInTheDocument();
    const first = canvas.getByRole("row", { name: "Audit contrast" });
    await userEvent.click(first);
    await waitFor(() => expect(first).toHaveAttribute("aria-selected", "true"));
  },
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <GridList
        aria-label="Photo library"
        layout="grid"
        selectionMode="multiple"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <GridList.Item key={index} id={`photo-${index}`} textValue={`Photo ${index + 1}`}>
            <div
              aria-hidden="true"
              style={{
                height: 72,
                borderRadius: 8,
                background: `linear-gradient(135deg, var(--hashti-layer-selected), var(--hashti-layer-accent-01, var(--hashti-layer-hover)))`,
              }}
            />
            <Text>Photo {index + 1}</Text>
          </GridList.Item>
        ))}
      </GridList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole("grid", { name: "Photo library" });
    expect(grid).toHaveAttribute("data-layout", "grid");
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(6));
    const columns = getComputedStyle(grid).gridTemplateColumns;
    expect(columns.split(" ")).toHaveLength(3);
  },
};

export const DragAndDrop: Story = {
  render: () => <DragAndDropExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(3));
    const rows = canvas.getAllByRole("row");
    expect(rows.map((row) => row.textContent)).toEqual(["Design", "Build", "Ship"]);

    // Enter starts a keyboard drag from the row's drag affordance, arrows pick a target.
    const handle = within(rows[0]!).getByRole("button", { name: "Reorder Design" });
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getAllByRole("row").map((row) => row.textContent)).toEqual([
        "Build",
        "Design",
        "Ship",
      ]),
    );
  },
};

function DragAndDropExample() {
  const list = useListData({
    initialItems: [
      { id: "design", name: "Design" },
      { id: "build", name: "Build" },
      { id: "ship", name: "Ship" },
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
    <div style={{ maxWidth: 480 }}>
      <GridList
        aria-label="Release steps"
        selectionMode="multiple"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(item) => (
          <GridList.Item id={item.id} textValue={item.name}>
            <GridList.DragHandle aria-label={`Reorder ${item.name}`} />
            <span style={{ flex: 1 }}>{item.name}</span>
          </GridList.Item>
        )}
      </GridList>
    </div>
  );
}

export const Actions: Story = {
  render: () => <ActionsExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Last action" });
    await waitFor(() =>
      expect(canvas.getByRole("row", { name: /Design Systems/ })).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByRole("row", { name: /Design Systems/ }));
    await waitFor(() => expect(output).toHaveTextContent("Opened design"));
  },
};

function ActionsExample() {
  const [action, setAction] = useState("None");
  return (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
      <GridList
        aria-label="Teams with actions"
        selectionMode="single"
        onAction={(key: Key) => setAction(String(key))}
        items={teams}
      >
        {(team) => (
          <GridList.Item id={team.id} textValue={team.name}>
            <span style={{ flex: 1 }}>{team.name}</span>
            <Tag color={team.color}>{team.members}</Tag>
          </GridList.Item>
        )}
      </GridList>
      <output aria-label="Last action">Opened {action}</output>
    </div>
  );
}

export const EmptyState: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <GridList
        aria-label="Empty task queue"
        renderEmptyState={() => <GridList.EmptyState>No pending tasks found.</GridList.EmptyState>}
      >
        {[]}
      </GridList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("No pending tasks found.")).toBeInTheDocument());
  },
};
