import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, EmptyState, Icon } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/EmptyState",
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "EmptyState communicates zero-data scenarios, search misses, or empty folders with an illustration, descriptive title, and primary call to action.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <EmptyState
          icon={<Icon name="inbox" size={32} />}
          title="No projects found"
          description="You haven't created any workspaces yet. Create your first project to get started."
          actions={
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" size="sm">
                Import Repository
              </Button>
              <Button variant="primary" size="sm">
                Create Project
              </Button>
            </div>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No projects found")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Create Project" })).toBeInTheDocument();
  },
};

export const SearchMiss: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <EmptyState
          icon={<Icon name="search" size={32} />}
          title="No search results"
          description="We couldn't find any documents matching your query. Try searching for something else."
          actions={
            <Button variant="ghost" size="sm">
              Clear Query
            </Button>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No search results")).toBeInTheDocument();
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="content-story-stack">
      <div className="content-card">
        <EmptyState
          icon={<Icon name="inbox" size={32} />}
          title="هیچ پروژه‌ای یافت نشد"
          description="هنوز پروژه‌ای در این حساب ساخته نشده است. برای شروع، نخستین پروژه خود را اضافه کنید."
          actions={
            <Button variant="primary" size="sm">
              ایجاد پروژه جدید
            </Button>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("هیچ پروژه‌ای یافت نشد")).toBeInTheDocument();
  },
};
