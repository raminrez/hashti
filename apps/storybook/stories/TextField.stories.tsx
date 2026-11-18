import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, Input, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Input",
  component: Input,
  args: {
    label: "Workspace name",
    description: "Use the name your team will recognize.",
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
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
          "A single-line text field built on ui-sdk Input inside the field anatomy: label, guidance, control, recovery, and status. Frame defaults put persistent guidance before the control.",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <Input {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <Input
        label="Editable workspace"
        description="Choose a recognizable name."
        defaultValue="Weekly review"
      />
      <Input
        label="Workspace requiring correction"
        description="Use a name the team can recognize."
        defaultValue=""
        invalid
        errorMessage="Enter a workspace name."
      />
      <Input
        label="Read-only workspace"
        description="You can select and copy this name."
        defaultValue="Release handoff"
        readOnly
      />
      <Input
        label="Unavailable workspace"
        description="Workspace owners can change this name."
        defaultValue="Archived review"
        disabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Enter a workspace name.")).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: "Unavailable workspace" }),
    ).toBeDisabled();
    const readonly = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Read-only workspace",
    });
    await expect(readonly).toHaveAttribute("readonly");
    await expect(readonly).toHaveValue("Release handoff");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <Input label="Small workspace name" size="sm" />
      <Input label="Default workspace name" />
      <Input label="Large workspace name" size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of [
      "Small workspace name",
      "Default workspace name",
      "Large workspace name",
    ]) {
      await expect(canvas.getByRole("textbox", { name })).toBeVisible();
    }
  },
};

function ValueExamples() {
  const [name, setName] = useState("Weekly review");
  return (
    <div className="field-story-stack">
      <Input
        label="Controlled name"
        description="The application owns this value."
        value={name}
        onValueChange={setName}
      />
      <output aria-label="Controlled name value">{name}</output>
      <Input
        label="Uncontrolled name"
        description="ui-sdk owns this draft until submission."
        defaultValue="Release review"
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("textbox", { name: "Controlled name" });
    const uncontrolled = canvas.getByRole("textbox", { name: "Uncontrolled name" });
    await userEvent.clear(controlled);
    await userEvent.type(controlled, "Delivery review");
    await expect(canvas.getByRole("status", { name: "Controlled name value" })).toHaveTextContent(
      "Delivery review",
    );
    await userEvent.clear(uncontrolled);
    await userEvent.type(uncontrolled, "November handoff");
    await expect(uncontrolled).toHaveValue("November handoff");
    await expect(controlled).toHaveValue("Delivery review");
  },
};

function FormExample() {
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Contact form"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("contact")));
      }}
    >
      <Input
        name="contact"
        type="email"
        autoComplete="email"
        required
        label="Contact email"
        description="Use an address that can receive workspace updates."
        errorMessage="Enter a contact email."
      />
      <Button type="submit">Save contact</Button>
      <output aria-label="Saved contact">{saved}</output>
    </Form>
  );
}

export const InAForm: Story = {
  render: FormExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Contact email (required)" });
    await userEvent.type(input, "review@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Save contact" }));
    await expect(canvas.getByRole("status", { name: "Saved contact" })).toHaveTextContent(
      "review@example.com",
    );
  },
};

function LocalizedFields() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <Input
          label="نام فضای کاری"
          description="نام فضای کاری را وارد کنید."
          required
          invalid
          errorMessage="نامی بنویسید که تیم شما بشناسد."
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <Input
          label="اسم مساحة العمل"
          description="أدخل اسم مساحة العمل."
          required
          invalid
          errorMessage="استخدم اسمًا يعرفه فريقك."
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedFields };
