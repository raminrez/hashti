import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { SearchField, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/SearchField",
  component: SearchField,
  args: {
    label: "Search reviews",
    description: "Search by review name or workspace identifier.",
    placeholder: "Search reviews",
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A thin wrapper over ui-sdk Input (type=\"search\") inside the field anatomy, adding the search icon and a clear button. The clear button appears while the query has text and empties it on press. Filtering and remote requests belong to the application.",
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <SearchField {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <SearchField
        label="Editable review query"
        description="Search by review name."
        defaultValue="Release"
      />
      <SearchField
        label="Review query requiring correction"
        description="Search by review name."
        required
        invalid
        errorMessage="Enter a review name or workspace identifier."
      />
      <SearchField
        label="Unavailable review query"
        description="Search is unavailable for this archive."
        defaultValue="Archived review"
        disabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Enter a review name or workspace identifier."),
    ).toBeVisible();
    await expect(
      canvas.getByRole("searchbox", { name: "Unavailable review query" }),
    ).toBeDisabled();

  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <SearchField label="Small review query" size="sm" defaultValue="Release" />
      <SearchField label="Default review query" defaultValue="Release" />
      <SearchField label="Large review query" size="lg" defaultValue="Release" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of [
      "Small review query",
      "Default review query",
      "Large review query",
    ]) {
      await expect(canvas.getByRole("searchbox", { name })).toBeVisible();
    }
  },
};

function ValueExamples() {
  const [query, setQuery] = useState("Release");
  return (
    <div className="field-story-stack">
      <SearchField
        label="Controlled review search"
        description="The application owns this query."
        value={query}
        onValueChange={setQuery}
      />
      <output aria-label="Current review query">{query}</output>
      <SearchField
        label="Uncontrolled review search"
        description="ui-sdk owns this query until submission."
        defaultValue="Handoff"
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("searchbox", { name: "Controlled review search" });
    const uncontrolled = canvas.getByRole("searchbox", { name: "Uncontrolled review search" });
    await userEvent.clear(controlled);
    await userEvent.type(controlled, "November review");
    await expect(canvas.getByRole("status", { name: "Current review query" })).toHaveTextContent(
      "November review",
    );
    await userEvent.type(uncontrolled, " checklist");
    await expect(uncontrolled).toHaveValue("Handoff checklist");
    await expect(controlled).toHaveValue("November review");
  },
};

export const ClearButton: Story = {
  render: () => (
    <div className="field-story-stack">
      <SearchField label="Review search" defaultValue="WS-1042" clearLabel="Clear review search" />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox", { name: "Review search" });
    const clear = await canvas.findByRole("button", { name: "Clear review search" });
    await userEvent.click(clear);
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <SearchField
        label="Search across the shared release and owner handoff reviews"
        description="Use a review name or the workspace identifier from your handoff notes."
        defaultValue="A long release and owner handoff review query"
        invalid
        errorMessage="Add the workspace identifier if several reviews share this name."
      />
    </div>
  ),
};

function LocalizedSearch() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <SearchField
          label="جست‌وجوی مرورها"
          description="با نام مرور یا شناسهٔ فضای کاری جست‌وجو کنید."
          placeholder="نام مرور را وارد کنید"
          defaultValue="مرور WS-1042"
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <SearchField
          label="البحث في المراجعات"
          description="ابحث باسم المراجعة أو معرّف مساحة العمل."
          placeholder="أدخل اسم المراجعة"
          defaultValue="مراجعة WS-1042"
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedSearch };
