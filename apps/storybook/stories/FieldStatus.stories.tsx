import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Button,
  CheckboxGroup,
  Input,
  NumberInput,
  RadioGroup,
  SearchField,
  TextArea,
  Theme,
  TimeInput,
  useTheme,
  type FieldStatus,
} from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/FieldStatus",
  component: TextArea,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Field status is appearance-only: warning, error, and success do not change validity, values, or native submission. An invalid field takes presentation precedence over any status. Labels inherit required state, and required wins over optional.",
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const presentations = [
  { type: "warning", title: "Warning", message: "Confirm this detail against your review notes." },
  { type: "error", title: "Error", message: "Review this draft detail before sharing." },
  { type: "success", title: "Success", message: "This draft detail is ready for review." },
] as const;

export const AttachedStatuses: Story = {
  render: () => (
    <div className="field-story-grid">
      {presentations.map(({ type, title, message }) => (
        <section className="field-story-case" key={type}>
          <h2>{title}</h2>
          <Input
            label={`${title} workspace`}
            description="The workspace name remains editable."
            defaultValue="Weekly review"
            status={{ type, message }}
          />
          <TextArea
            label={`${title} notes`}
            defaultValue="Keep the owner handoff checklist."
            rows={3}
            status={{ type, message }}
          />
          <NumberInput
            label={`${title} reviewers`}
            defaultValue={3}
            min={1}
            max={12}
            status={{ type, message }}
          />
          <SearchField
            label={`${title} review search`}
            defaultValue="WS-1042"
            status={{ type, message }}
          />
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const { type, title, message } of presentations) {
      for (const control of [
        canvas.getByRole("textbox", { name: `${title} workspace` }),
        canvas.getByRole("textbox", { name: `${title} notes` }),
        canvas.getByRole("textbox", { name: `${title} reviewers` }),
        canvas.getByRole("searchbox", { name: `${title} review search` }),
      ]) {
        const root = control.closest<HTMLElement>(".hashti-field")!;
        const status = root.querySelector<HTMLElement>(".hashti-field__status")!;
        await expect(root).toHaveAttribute("data-hashti-status", type);
        await expect(root).not.toHaveAttribute("data-invalid");
        await expect(status).toBeVisible();
        await expect(status).toHaveTextContent(message);
        await expect(status.parentElement).toHaveClass("hashti-field__help");
      }
    }
  },
};

export const DetachedGroupStatus: Story = {
  render: () => (
    <div className="field-story-grid">
      <CheckboxGroup
        name="updates"
        label="Review updates"
        description="Choose the updates you want to receive."
        defaultValue={["email"]}
        isOptional
        status={{ type: "warning", message: "Check the delivery preference with your team." }}
      >
        <CheckboxGroup.Checkbox value="email">Email updates</CheckboxGroup.Checkbox>
        <CheckboxGroup.Checkbox value="digest">Weekly digest</CheckboxGroup.Checkbox>
      </CheckboxGroup>
      <RadioGroup
        name="schedule"
        label="Review schedule"
        defaultValue="weekly"
        isOptional
        status={{
          type: "error",
          message: "Review this schedule; either option remains available.",
        }}
      >
        <RadioGroup.Radio value="weekly">Every week</RadioGroup.Radio>
        <RadioGroup.Radio value="handoff">At handoff</RadioGroup.Radio>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    for (const group of [
      canvas.getByRole("group", { name: "Review updates (optional)" }),
      canvas.getByRole("radiogroup", { name: "Review schedule (optional)" }),
    ]) {
      await expect(group.querySelector(".hashti-field__status")).toBeVisible();
      await expect(group).not.toHaveAttribute("data-invalid");
    }
    await userEvent.click(canvas.getByRole("checkbox", { name: "Weekly digest" }));
    await expect(canvas.getByRole("checkbox", { name: "Weekly digest" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "At handoff" }));
    await expect(canvas.getByRole("radio", { name: "At handoff" })).toBeChecked();
  },
};

export const RequiredOptionalAndTooltip: Story = {
  render: () => (
    <form
      aria-label="Field help controls"
      className="field-story-grid"
      onSubmit={(event) => event.preventDefault()}
    >
      <Input
        name="workspace"
        label="Workspace name"
        defaultValue="Weekly review"
        required
        labelTooltip="Use the name your team recognizes in the review schedule."
      />
      <TextArea
        name="notes"
        label="Handoff notes"
        description="Skip these notes if they are not needed."
        defaultValue="Keep the handoff checklist."
        isOptional
        rows={3}
      />
      <SearchField
        name="query"
        label="Review search"
        defaultValue="WS-1042"
        isOptional
        labelTooltip="Search by name or workspace identifier."
        status={{ type: "warning", message: "Search within the current workspace." }}
      />
      <NumberInput
        name="reviewers"
        label="Reviewers"
        defaultValue={3}
        min={1}
        max={12}
        isOptional
        labelTooltip="Count the people who can review this draft."
        status={{ type: "success", message: "Three reviewers are recorded in this draft." }}
      />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const workspace = canvas.getByRole("textbox", { name: "Workspace name (required)" });
    await expect(workspace).toBeRequired();
    await expect(
      canvas.getByRole("textbox", { name: "Handoff notes (optional)" }),
    ).not.toBeRequired();
    await expect(
      workspace.closest(".hashti-field")?.querySelectorAll(".hashti-field__necessity"),
    ).toHaveLength(1);
    await expect(
      canvas.getByRole("searchbox", { name: "Review search (optional)" }),
    ).toHaveValue("WS-1042");
    await expect(canvas.getByRole("textbox", { name: "Reviewers (optional)" })).toHaveValue("3");
  },
};

function ValidationExamples() {
  const [nativeSaved, setNativeSaved] = useState("");
  const [serverValue, setServerValue] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  return (
    <div className="field-story-grid">
      <form
        aria-label="Native validation precedence"
        className="field-story-case"
        onSubmit={(event) => {
          event.preventDefault();
          setNativeSaved(String(new FormData(event.currentTarget).get("delivery-email")));
        }}
      >
        <h2>Native validation</h2>
        <Input
          name="delivery-email"
          type="email"
          label="Delivery email"
          description="Use a complete email address for delivery."
          defaultValue="incomplete"
          required
          status={{ type: "success", message: "The imported draft was marked ready for review." }}
          errorMessage="Enter a complete delivery email."
        />
        <Button type="submit">Read delivery email</Button>
        <output aria-label="Validated delivery email">{nativeSaved}</output>
      </form>
      <section className="field-story-case">
        <h2>Field invalid state</h2>
        <Input
          label="Restricted workspace"
          defaultValue="Owner review"
          invalid
          status={{ type: "warning", message: "The imported workspace still needs review." }}
          errorMessage="Only an owner can choose this workspace."
        />
      </section>
      <form
        aria-label="Returned validation precedence"
        className="field-story-case"
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get("workspace"));
          setServerValue(value);
          setServerError(
            value === "Weekly review"
              ? "This workspace name is already used. Choose a different name."
              : null,
          );
        }}
      >
        <h2>Returned field error</h2>
        <Input
          name="workspace"
          label="Checked workspace"
          description="Local response example: Weekly review is already used."
          defaultValue="Weekly review"
          required
          invalid={serverError ? true : undefined}
          errorMessage={serverError ?? undefined}
          status={{ type: "warning", message: "The name awaits an availability check." }}
        />
        <Button type="submit">Check workspace name</Button>
        <output aria-label="Checked native value">{serverValue}</output>
      </form>
    </div>
  );
}

export const ValidationPrecedence: Story = {
  render: ValidationExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const native = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Delivery email (required)",
    });
    // An invalid field shows its error and takes precedence over a status.
    const restricted = canvas.getByRole("textbox", { name: "Restricted workspace" });
    await expect(restricted.closest(".hashti-field")).toHaveAttribute("data-invalid");
    await expect(restricted).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Only an owner can choose this workspace.")).toBeVisible();

    // Native validation: the browser blocks an incomplete email until corrected.
    await userEvent.click(canvas.getByRole("button", { name: "Read delivery email" }));
    await userEvent.clear(native);
    await userEvent.type(native, "review@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Read delivery email" }));
    await expect(
      canvas.getByRole("status", { name: "Validated delivery email" }),
    ).toHaveTextContent("review@example.com");

    // A returned server error marks the field invalid.
    const checked = canvas.getByRole("textbox", { name: "Checked workspace (required)" });
    await userEvent.click(canvas.getByRole("button", { name: "Check workspace name" }));
    await expect(
      await canvas.findByText("This workspace name is already used. Choose a different name."),
    ).toBeVisible();
    await expect(checked.closest(".hashti-field")).toHaveAttribute("data-invalid");
  },
};

const longLabel = "Workspace name for the shared release review and owner handoff";

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <Input
        label={longLabel}
        description="Use the full name from your team's review schedule. Keep necessary instructions visible while the value is corrected."
        invalid
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

const locales = [
  { lang: "fa-IR", dir: "rtl", label: "نام فضای کاری", description: "نام را وارد کنید." },
  { lang: "ar", dir: "rtl", label: "اسم مساحة العمل", description: "أدخل الاسم." },
  { lang: "en", dir: "ltr", label: "Workspace name", description: "Enter the name." },
] as const;

function LocalizedFields() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      {locales.map(({ lang, dir, label, description }) => (
        <Theme key={lang} theme={theme} lang={lang} dir={dir as "ltr" | "rtl"}>
          <Input
            label={label}
            description={description}
            required
            invalid
            errorMessage={description}
            status={{ type: "warning", message: description }}
          />
        </Theme>
      ))}
    </div>
  );
}

export const LocalizedContent: Story = {
  render: LocalizedFields,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: /نام فضای کاری/ })).toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: /اسم مساحة العمل/ })).toBeInTheDocument();
  },
};

function CompoundExamples() {
  return (
    <div className="field-story-grid">
      <NumberInput
        defaultValue={3}
        min={1}
        max={12}
        isOptional
        status={{ type: "error", message: "Check reviewer availability." }}
        label="Composed reviewers"
      />
      <TimeInput
        label="Review time"
        defaultValue="09:30"
        hourCycle={24}
        isOptional
        status={{ type: "success", message: "The review time is recorded." }}
      />
    </div>
  );
}

export const CompoundParts: Story = {
  render: CompoundExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const number = canvas.getByRole("textbox", { name: "Composed reviewers (optional)" });
    await userEvent.click(canvas.getByRole("button", { name: "Increase" }));
    await expect(number).toHaveValue("4");
    await expect(canvas.getByRole("group", { name: "Review time (optional)" })).toBeInTheDocument();
  },
};

export const StatusTypes: Story = {
  render: () => (
    <div className="field-story-stack">
      {(["warning", "error", "success"] as FieldStatus["type"][]).map((type) => (
        <Input
          key={type}
          label={`${type} field`}
          defaultValue="value"
          status={{ type, message: `${type} message` }}
        />
      ))}
    </div>
  ),
};
