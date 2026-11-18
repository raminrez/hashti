import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, Icon, SearchField, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/SearchField",
  component: SearchField,
  args: {
    label: "Search reviews",
    description: "Search by review name or workspace identifier.",
    placeholder: "Search reviews",
    onChange: fn(),
    onSubmit: fn(),
    onClear: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "SearchField.Root retains RAC's props and original children contract. Compose Label, Description, Control, Input, ClearButton, Help, and ErrorMessage directly. RAC owns query editing, Enter submission, clear/Escape behavior, and focus. Input accepts native props and a ref; the existing shorthand inputProps.className remains a complete override. Filtering and remote requests belong to the application.",
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
        isRequired
        isInvalid
        errorMessage="Enter a review name or workspace identifier."
      />
      <SearchField
        label="Read-only review query"
        description="You can select and copy this query."
        defaultValue="WS-1042"
        isReadOnly
      />
      <SearchField
        label="Unavailable review query"
        description="Search is unavailable for this archive."
        defaultValue="Archived review"
        isDisabled
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const readonly = canvas.getByRole<HTMLInputElement>("searchbox", {
      name: "Read-only review query",
    });
    await expect(canvas.getByText("Enter a review name or workspace identifier.")).toBeVisible();
    await expect(
      canvas.getByRole("searchbox", { name: "Unavailable review query" }),
    ).toBeDisabled();
    await userEvent.click(readonly);
    await userEvent.keyboard("{Control>}a{/Control}");
    await expect((await userEvent.copy())?.getData("text/plain")).toBe("WS-1042");
    await userEvent.keyboard("Do not replace the query{Escape}");
    await expect(readonly).toHaveValue("WS-1042");
    await expect(readonly).toHaveFocus();
    await expect(
      within(readonly.closest<HTMLElement>(".hashti-field")!).getByRole("button"),
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
    for (const [name, minimum] of [
      ["Small review query", 32],
      ["Default review query", 44],
      ["Large review query", 48],
    ] as const) {
      const group = canvas
        .getByRole("searchbox", { name })
        .closest<HTMLElement>(".hashti-input-group")!;
      const clear = within(group).getByRole("button");
      await expect(group.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum);
      // Measure the clear target itself, not the enclosing control boundary.
      await expect(clear.getBoundingClientRect().width).toBeGreaterThanOrEqual(minimum - 2);
      await expect(clear.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum - 2);
    }
  },
};

function ValueExamples() {
  const [query, setQuery] = useState("Release");
  const [submitted, setSubmitted] = useState("");
  return (
    <div className="field-story-stack">
      <SearchField
        label="Controlled review search"
        description="Press Enter to submit the current query."
        value={query}
        onChange={setQuery}
        onSubmit={setSubmitted}
      />
      <output aria-label="Current review query">{query}</output>
      <output aria-label="Submitted review query">{submitted}</output>
      <SearchField
        label="Uncontrolled review search"
        description="RAC owns this query until submission."
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
    await userEvent.type(controlled, "November review{Enter}");
    await expect(canvas.getByRole("status", { name: "Current review query" })).toHaveTextContent(
      "November review",
    );
    await expect(canvas.getByRole("status", { name: "Submitted review query" })).toHaveTextContent(
      "November review",
    );
    await userEvent.type(uncontrolled, " checklist");
    await expect(uncontrolled).toHaveValue("Handoff checklist");
    await expect(controlled).toHaveValue("November review");
  },
};

function ComposedSearch() {
  const input = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState("");
  const [native, setNative] = useState("");
  const [clears, setClears] = useState(0);
  return (
    <Form
      aria-label="Composed review search"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setNative(String(new FormData(event.currentTarget).get("review-query")));
      }}
    >
      <p>
        Enter submits the query callback. The form reads its current native value without resetting
        the draft.
      </p>
      <SearchField.Root
        name="review-query"
        defaultValue="WS-1042"
        onSubmit={setSubmitted}
        onClear={() => setClears((count) => count + 1)}
      >
        <SearchField.Label>Release query</SearchField.Label>
        <SearchField.Description>
          Search by review name or workspace identifier.
        </SearchField.Description>
        <SearchField.Control>
          <Icon name="search" />
          <SearchField.Input ref={input} placeholder="Find a review" autoComplete="off" />
          <SearchField.ClearButton aria-label="Clear release query">
            <Icon name="close" />
          </SearchField.ClearButton>
        </SearchField.Control>
        <SearchField.Help>
          <SearchField.ErrorMessage />
        </SearchField.Help>
      </SearchField.Root>
      <Button type="submit">Read search value</Button>
      <Button variant="ghost" onClick={() => input.current?.focus()}>
        Focus release query
      </Button>
      <output aria-label="Search callback value">{submitted}</output>
      <output aria-label="Native search value">{native}</output>
      <output aria-label="Query clear count">{clears}</output>
    </Form>
  );
}

export const CompositionSubmissionAndClear: Story = {
  render: ComposedSearch,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox", { name: "Release query" });
    await userEvent.click(input);
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status", { name: "Search callback value" })).toHaveTextContent(
      "WS-1042",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Read search value" }));
    await expect(canvas.getByRole("status", { name: "Native search value" })).toHaveTextContent(
      "WS-1042",
    );
    await expect(input).toHaveValue("WS-1042");
    await userEvent.click(canvas.getByRole("button", { name: "Clear release query" }));
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Query clear count" })).toHaveTextContent("1");
    await userEvent.type(input, "Handoff{Escape}");
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Query clear count" })).toHaveTextContent("2");
    await userEvent.type(input, "November review");
    await userEvent.click(canvas.getByRole("button", { name: "Read search value" }));
    await expect(canvas.getByRole("status", { name: "Native search value" })).toHaveTextContent(
      "November review",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Focus release query" }));
    await expect(input).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <SearchField
        label="Search across the shared release and owner handoff reviews"
        description="Use a review name or the workspace identifier from your handoff notes. Keep the query while correcting the search requirements."
        defaultValue="A long release and owner handoff review query"
        isInvalid
        errorMessage="Add the workspace identifier if several reviews share this name. Your current search text stays here while you check the handoff notes."
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
          description={
            <>
              با نام مرور یا شناسهٔ فضای کاری، مثل <bdi dir="ltr">WS-1042</bdi>، جست‌وجو کنید.
            </>
          }
          placeholder="نام مرور را وارد کنید"
          defaultValue="مرور WS-1042"
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <SearchField
          label="البحث في المراجعات"
          description={
            <>
              ابحث باسم المراجعة أو معرّف مساحة العمل، مثل <bdi dir="ltr">WS-1042</bdi>.
            </>
          }
          placeholder="أدخل اسم المراجعة"
          defaultValue="مراجعة WS-1042"
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedSearch };
