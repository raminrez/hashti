import { useRef, useState } from "react";
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
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    rows: { control: "number" },
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
          "TextArea.Root is RAC's TextField root with Cinder textarea appearance. TextArea.Input is the native RAC TextArea with its original props, events, render callback, and ref. The default convenience API and compound composition use the same shared Label, Description, Help, and ErrorMessage parts. Values remain editable, selectable, and vertically resizable using native semantics.",
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
        isInvalid
        errorMessage="Add the next review task."
        rows={3}
      />
      <TextArea
        label="Read-only notes"
        description="You can select and copy these notes."
        defaultValue="Keep the handoff checklist."
        isReadOnly
        rows={3}
      />
      <TextArea
        label="Unavailable notes"
        description="These archived notes cannot be edited."
        defaultValue="The review is archived."
        isDisabled
        rows={3}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const readonly = canvas.getByRole<HTMLTextAreaElement>("textbox", { name: "Read-only notes" });
    await expect(canvas.getByText("Explain what the next reviewer needs to do.")).toBeVisible();
    await expect(canvas.getByText("Add the next review task.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Unavailable notes" })).toBeDisabled();
    await userEvent.click(readonly);
    await userEvent.keyboard("{Control>}a{/Control}");
    // No clipboard permission in the test browser; assert the selection instead of the copy.
    await expect(readonly.selectionStart).toBe(0);
    await expect(readonly.selectionEnd).toBe("Keep the handoff checklist.".length);
    await userEvent.keyboard("Do not replace the notes");
    await expect(readonly).toHaveValue("Keep the handoff checklist.");
    await expect(readonly).toHaveFocus();
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
        onChange={setNotes}
      />
      <output aria-label="Review notes value">{notes}</output>
      <TextArea
        label="Uncontrolled review notes"
        description="RAC owns this draft until submission."
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
    await expect(controlled).toHaveValue("Review the draft.\nKeep the handoff notes.");
    await userEvent.type(uncontrolled, " Add the checklist.");
    await expect(uncontrolled).toHaveValue("Keep the owner handoff. Add the checklist.");
  },
};

function ComposedNotes() {
  const input = useRef<HTMLTextAreaElement>(null);
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
      <p>Native textarea props go on Input. Rich recovery stays in RAC's ErrorMessage.</p>
      <TextArea.Root name="notes" isRequired>
        <TextArea.Label>Handoff notes</TextArea.Label>
        <TextArea.Description>Keep the next review task with this draft.</TextArea.Description>
        <TextArea.Input
          ref={input}
          rows={3}
          className="field-story-custom-input"
          render={(props) => <textarea {...props} data-composed-textarea="true" />}
        />
        <TextArea.Help>
          <TextArea.ErrorMessage elementType="div" className="field-story-rich-error">
            <ul>
              <li>Add the next review task.</li>
              <li>Keep useful handoff details with the task.</li>
            </ul>
          </TextArea.ErrorMessage>
        </TextArea.Help>
      </TextArea.Root>
      <Button type="submit">Save notes</Button>
      <Button variant="ghost" onPress={() => input.current?.focus()}>
        Focus notes
      </Button>
      <output aria-label="Saved notes">{saved}</output>
    </Form>
  );
}

export const Composition: Story = {
  render: ComposedNotes,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const notes = canvas.getByRole("textbox", { name: "Handoff notes (required)" });
    await expect(canvas.queryByText("Add the next review task.")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Save notes" }));
    await expect(notes).toHaveFocus();
    const error = canvas.getByText("Add the next review task.").closest(".hashti-field__error")!;
    await expect(error.tagName).toBe("DIV");
    await expect(error).toBeVisible();
    await expect(notes).toHaveAccessibleDescription(
      /Keep the next review task.*Add the next review task/,
    );
    await expect(notes).toHaveAttribute("data-composed-textarea", "true");
    await userEvent.type(notes, "Keep the owner handoff.");
    await userEvent.click(canvas.getByRole("button", { name: "Save notes" }));
    await expect(canvas.getByRole("status", { name: "Saved notes" })).toHaveTextContent(
      "Keep the owner handoff.",
    );
    await expect(canvas.queryByText("Add the next review task.")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Focus notes" }));
    await expect(notes).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <TextArea
        label="Notes for the shared release and owner handoff review"
        description="Keep the full context the next reviewer needs. Longer instructions and recovery text must stay readable in a narrow container."
        defaultValue={
          "Keep the release checklist with the owner handoff.\n\nAsk the next reviewer to confirm the contact address before sharing the draft."
        }
        rows={6}
        isInvalid
        errorMessage="Add the next review task and the person responsible for it. Keep useful handoff details in the notes so the next reviewer does not need to reconstruct the discussion."
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
      <Theme theme={theme} locale="fa-IR">
        <TextArea
          label="یادداشت‌های مرور"
          description={
            <>
              یادداشت‌های پروژهٔ <bdi dir="ltr">WS-1042</bdi> را برای مرور بعدی نگه دارید.
            </>
          }
          defaultValue="یادداشت‌های جلسه برای مرور هفتگی تیم تهران."
          rows={3}
        />
      </Theme>
      <Theme theme={theme} locale="ar">
        <TextArea
          label="ملاحظات المراجعة"
          description={
            <>
              احتفظ بملاحظات المشروع <bdi dir="ltr">WS-1042</bdi> للمراجعة التالية.
            </>
          }
          defaultValue="ملاحظات الاجتماع للمراجعة الأسبوعية لفريق القاهرة."
          rows={3}
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedNotes };
