import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, Icon, TableBatchActions } from "@hashti/react";
import "./data.css";

const meta = {
  title: "Data/TableBatchActions",
  component: TableBatchActions,
  parameters: {
    docs: {
      description: {
        component:
          "TableBatchActions slides an action bar into view above a data table when multiple rows are selected.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function TableBatchActionsDemo() {
  const [selectedCount, setSelectedCount] = useState(3);

  return (
    <div className="data-story-stack">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <Button variant="secondary" size="sm" onPress={() => setSelectedCount((c) => c + 1)}>
          Select Another Row
        </Button>
        <Button variant="ghost" size="sm" onPress={() => setSelectedCount(0)}>
          Clear Selection
        </Button>
      </div>

      <TableBatchActions totalSelected={selectedCount} onCancel={() => setSelectedCount(0)}>
        <Button variant="ghost" size="sm">
          <Icon name="download" />
          Export
        </Button>
        <Button variant="danger" size="sm">
          <Icon name="trash" />
          Delete
        </Button>
      </TableBatchActions>
    </div>
  );
}

export const Playground: Story = {
  render: () => <TableBatchActionsDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("3 items selected")).toBeInTheDocument();

    const cancelBtn = canvas.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelBtn);
    expect(canvas.queryByText("3 items selected")).not.toBeInTheDocument();
  },
};

function TableBatchActionsRtlDemo() {
  const [selectedCount, setSelectedCount] = useState(4);
  return (
    <div dir="rtl" className="data-story-stack">
      <TableBatchActions
        totalSelected={selectedCount}
        cancelLabel="لغو انتخاب"
        selectedLabel={(c) => `${c} مورد انتخاب شده است`}
        onCancel={() => setSelectedCount(0)}
      >
        <Button variant="ghost" size="sm">
          خروجی
        </Button>
        <Button variant="danger" size="sm">
          حذف موارد
        </Button>
      </TableBatchActions>
    </div>
  );
}

export const RTL: Story = {
  render: () => <TableBatchActionsRtlDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("4 مورد انتخاب شده است")).toBeInTheDocument();
  },
};
