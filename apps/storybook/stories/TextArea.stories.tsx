import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, TextArea, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/TextArea",
  component: TextArea,
  args: {
    label: "Review notes",
    description: "Keep the handoff details with this draft.",
    rows: 4,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A multi-line text field built on ui-sdk Textarea inside the field anatomy. Values remain editable, selectable, and vertically resizable using native semantics.",
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <TextArea {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <TextArea
        label="Editable notes"
        description="Keep the next handoff clear."
        defaultValue="Check the release checklist."
        rows={3}
      />
      <TextArea
        label="Notes requiring correction"
        description="Explain what the next reviewer needs to do."
        invalid
        errorMessage="Add the next review task."
        rows={3}
      />
      <TextArea
        label="Read-only notes"
        description="You can select and copy these notes."
        defaultValue="Keep the handoff checklist."
        readOnly
        rows={3}
      />
      <TextArea
        label="Unavailable notes"
        description="These archived notes cannot be edited."
        defaultValue="The review is archived."
        disabled
        rows={3}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readonly = canvas.getByRole<HTMLTextAreaElement>("textbox", { name: "Read-only notes" });
    await expect(canvas.getByText("Add the next review task.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Unavailable notes" })).toBeDisabled();
    await expect(readonly).toHaveAttribute("readonly");
    await expect(readonly).toHaveValue("Keep the handoff checklist.");
  },
};

function DraftNotes() {
  const [notes, setNotes] = useState("Check the release checklist.");
  return (
    <div className="field-story-stack">
      <TextArea
        label="Controlled review notes"
        description="The application owns this draft."
        value={notes}
        onValueChange={setNotes}
      />
      <output aria-label="Review notes value">{notes}</output>
      <TextArea
        label="Uncontrolled review notes"
        description="ui-sdk owns this draft until submission."
        defaultValue="Keep the owner handoff."
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: DraftNotes,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("textbox", { name: "Controlled review notes" });
    const uncontrolled = canvas.getByRole("textbox", { name: "Uncontrolled review notes" });
    await userEvent.clear(controlled);
    await userEvent.type(controlled, "Review the draft.\nKeep the handoff notes.");
    await expect(canvas.getByRole("status", { name: "Review notes value" })).toHaveTextContent(
      "Review the draft. Keep the handoff notes.",
    );
    await userEvent.type(uncontrolled, " Add the checklist.");
    await expect(uncontrolled).toHaveValue("Keep the owner handoff. Add the checklist.");
  },
};

function FormNotes() {
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Composed review"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("notes")));
      }}
    >
      <TextArea
        name="notes"
        required
        rows={3}
        label="Handoff notes"
        description="Keep the next review task with this draft."
        errorMessage="Add the next review task."
      />
      <Button type="submit">Save notes</Button>
      <output aria-label="Saved notes">{saved}</output>
    </Form>
  );
}

export const InAForm: Story = {
  render: FormNotes,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const notes = canvas.getByRole("textbox", { name: "Handoff notes (required)" });
    await userEvent.type(notes, "Keep the owner handoff.");
    await userEvent.click(canvas.getByRole("button", { name: "Save notes" }));
    await expect(canvas.getByRole("status", { name: "Saved notes" })).toHaveTextContent(
      "Keep the owner handoff.",
    );
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <TextArea
        label="Notes for the shared release and owner handoff review"
        description="Keep the full context the next reviewer needs."
        defaultValue={
          "Keep the release checklist with the owner handoff.\n\nAsk the next reviewer to confirm the contact address before sharing the draft."
        }
        rows={6}
        invalid
        errorMessage="Add the next review task and the person responsible for it."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", {
        name: "Notes for the shared release and owner handoff review",
      }),
    ).toHaveValue(
      "Keep the release checklist with the owner handoff.\n\nAsk the next reviewer to confirm the contact address before sharing the draft.",
    );
  },
};

function LocalizedNotes() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <TextArea
          label="یادداشت‌های مرور"
          description="یادداشت‌های پروژه را نگه دارید."
          defaultValue="یادداشت‌های جلسه برای مرور هفتگی تیم تهران."
          rows={3}
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <TextArea
          label="ملاحظات المراجعة"
          description="احتفظ بملاحظات المشروع للمراجعة التالية."
          defaultValue="ملاحظات الاجتماع للمراجعة الأسبوعية لفريق القاهرة."
          rows={3}
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedNotes };
