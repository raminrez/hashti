import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, TextField, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/TextField",
  component: TextField,
  args: {
    label: "Workspace name",
    description: "Use the name your team will recognize.",
    onChange: fn(),
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
          "The callable TextField is shorthand built from reusable compound parts. TextField.Root keeps RAC's original props and children contract; Label, Description, Input, TextArea, Control, Help, and ErrorMessage remain independently composable. RAC owns values, slots, validation, and focus. Frame defaults put persistent guidance before the control; custom children own their order.",
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <TextField {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <TextField
        label="Editable workspace"
        description="Choose a recognizable name."
        defaultValue="Weekly review"
      />
      <TextField
        label="Workspace requiring correction"
        description="Use a name the team can recognize."
        defaultValue=""
        isInvalid
        errorMessage="Enter a workspace name."
      />
      <TextField
        label="Read-only workspace"
        description="You can select and copy this name."
        defaultValue="Release handoff"
        isReadOnly
      />
      <TextField
        label="Unavailable workspace"
        description="Workspace owners can change this name."
        defaultValue="Archived review"
        isDisabled
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const readonly = canvas.getByRole<HTMLInputElement>("textbox", { name: "Read-only workspace" });
    await expect(canvas.getByText("Enter a workspace name.")).toBeVisible();
    await expect(canvas.getByText("Use a name the team can recognize.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Unavailable workspace" })).toBeDisabled();
    await userEvent.click(readonly);
    await userEvent.keyboard("{Control>}a{/Control}");
    await expect((await userEvent.copy())?.getData("text/plain")).toBe("Release handoff");
    await userEvent.keyboard("Do not replace the value");
    await expect(readonly).toHaveValue("Release handoff");
    await expect(readonly).toHaveFocus();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <TextField label="Small workspace name" size="sm" />
      <TextField label="Default workspace name" />
      <TextField label="Large workspace name" size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, minimum] of [
      ["Small workspace name", 32],
      ["Default workspace name", 44],
      ["Large workspace name", 48],
    ] as const) {
      await expect(
        canvas.getByRole("textbox", { name }).getBoundingClientRect().height,
      ).toBeGreaterThanOrEqual(minimum);
    }
  },
};

function ValueExamples() {
  const [name, setName] = useState("Weekly review");
  return (
    <div className="field-story-stack">
      <TextField
        label="Controlled name"
        description="The application owns this value."
        value={name}
        onChange={setName}
      />
      <output aria-label="Controlled name value">{name}</output>
      <TextField
        label="Uncontrolled name"
        description="RAC owns this draft until submission."
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

function ComposedEmail() {
  const input = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Composed contact"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("contact")));
      }}
    >
      <p>Customize the parts directly. This example stays local and retains the draft.</p>
      <TextField.Root
        name="contact"
        type="email"
        autoComplete="email"
        isRequired
        render={(props) => <div {...props} data-composed-root="true" />}
      >
        <TextField.Label>Contact email</TextField.Label>
        <TextField.Description>
          Use an address that can receive workspace updates.
        </TextField.Description>
        <TextField.Input
          ref={input}
          className={({ isFocused }) =>
            isFocused ? "field-story-custom-input focused-contact" : "field-story-custom-input"
          }
          render={(props) => <input {...props} data-composed-input="true" />}
        />
        <TextField.Help>
          <TextField.ErrorMessage>
            {({ validationDetails }) =>
              validationDetails.valueMissing
                ? "Enter a contact email."
                : "Enter a complete email address."
            }
          </TextField.ErrorMessage>
        </TextField.Help>
      </TextField.Root>
      <Button type="submit">Save contact</Button>
      <Button variant="ghost" onClick={() => input.current?.focus()}>
        Focus contact
      </Button>
      <output aria-label="Saved contact">{saved}</output>
    </Form>
  );
}

export const Composition: Story = {
  render: ComposedEmail,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Contact email (required)" });
    await expect(canvas.queryByText("Enter a contact email.")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Save contact" }));
    await expect(input).toHaveFocus();
    await expect(canvas.getByText("Enter a contact email.")).toBeVisible();
    await expect(input).toHaveAccessibleDescription(/Use an address.*Enter a contact email/);
    await expect(input).toHaveAttribute("data-composed-input", "true");
    await expect(input.parentElement).toHaveAttribute("data-composed-root", "true");
    await expect(input).toHaveClass("react-aria-Input", "focused-contact");
    await userEvent.type(input, "review@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Save contact" }));
    await expect(canvas.getByRole("status", { name: "Saved contact" })).toHaveTextContent(
      "review@example.com",
    );
    await expect(input).toHaveValue("review@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Focus contact" }));
    await expect(input).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <TextField
        label="Workspace name for the shared release and handoff review"
        description="Use the full name from your team's review schedule. Keep necessary instructions visible while the value is corrected."
        isInvalid
        errorMessage="Enter the workspace name your team uses for the release review. The other values in your draft will remain here while you make this correction."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>(".hashti-field")!;
    for (const part of root.querySelectorAll<HTMLElement>(
      ".hashti-field__label, .hashti-field__description, .hashti-field__error",
    )) {
      await expect(part).toBeVisible();
      await expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth + 1);
      await expect(part.scrollHeight).toBeLessThanOrEqual(part.clientHeight + 1);
    }
  },
};

function LocalizedFields() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <TextField
          label="نام فضای کاری"
          description={
            <>
              نام فضای کاری را برای پروژهٔ <bdi dir="ltr">WS-1042</bdi> وارد کنید.
            </>
          }
          isRequired
          isInvalid
          errorMessage="نامی بنویسید که تیم شما بشناسد."
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <TextField
          label="اسم مساحة العمل"
          description={
            <>
              أدخل اسم مساحة العمل للمشروع <bdi dir="ltr">WS-1042</bdi>.
            </>
          }
          isRequired
          isInvalid
          errorMessage="استخدم اسمًا يعرفه فريقك."
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = { render: LocalizedFields };
