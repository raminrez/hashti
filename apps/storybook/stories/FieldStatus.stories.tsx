import { useRef, useState } from "react";
import { CalendarDate, Time } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import {
  Button,
  CheckboxGroup,
  ComboBox,
  DateField,
  DatePicker,
  DateRangePicker,
  Form,
  Icon,
  Input,
  ListBoxItem,
  NumberField,
  RadioGroup,
  SearchField,
  Select,
  TextArea,
  TextField,
  Theme,
  TimeField,
  useTheme,
  type FieldStatus,
  type FormProps,
} from "@hashti/react";
import "./fields.css";

const readDraft = fn((values: FormData) => Object.fromEntries(values));
const submitHelpForm = fn();
const clearHelpSearch = fn();
const changeHelpNumber = fn();
const changeHelpAccess = fn();
const changeHelpDate = fn();

const meta = {
  title: "Fields/FieldStatus",
  component: TextField,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Field status is appearance-only: warning, error, and success do not change RAC validity, values, or native submission. Actual isInvalid and Form validationErrors take presentation precedence. Labels inherit required state, required wins optional, and label help is a separate named button. Compound roots explicitly place Status in Help; Control owns the grouped hook and inline icon.",
      },
    },
  },
  beforeEach: () => {
    readDraft.mockClear();
    submitHelpForm.mockClear();
    clearHelpSearch.mockClear();
    changeHelpNumber.mockClear();
    changeHelpAccess.mockClear();
    changeHelpDate.mockClear();
  },
} satisfies Meta<typeof TextField>;

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
          <TextField
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
          <NumberField
            label={`${title} reviewers`}
            defaultValue={3}
            minValue={1}
            maxValue={12}
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
        await expect(control).not.toHaveAttribute("aria-invalid", "true");
        await expect(control).toBeValid();
        await expect(status).toBeVisible();
        await expect(status).toHaveTextContent(message);
        await expect(status.parentElement).toHaveClass("hashti-field__help");
        await expect(control).toHaveAccessibleDescription(new RegExp(message));
        await expect(root.querySelectorAll(".hashti-field__status-icon")).toHaveLength(1);
        await expect(root.querySelector(".hashti-field__status-icon")).toHaveAttribute(
          "data-hashti-status",
          type,
        );
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
      <CheckboxGroup.Root
        name="owner-checks"
        defaultValue={["owner"]}
        isOptional
        status={{ type: "success" }}
      >
        <CheckboxGroup.Label>Owner checks</CheckboxGroup.Label>
        <CheckboxGroup.Description>
          The application recorded the owner review.
        </CheckboxGroup.Description>
        <CheckboxGroup.Checkbox value="owner">Owner confirmed</CheckboxGroup.Checkbox>
        <CheckboxGroup.Help>
          <CheckboxGroup.StatusIcon />
          <CheckboxGroup.Status />
          <CheckboxGroup.ErrorMessage />
        </CheckboxGroup.Help>
      </CheckboxGroup.Root>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    for (const group of [
      canvas.getByRole("group", { name: "Review updates (optional)" }),
      canvas.getByRole("radiogroup", { name: "Review schedule (optional)" }),
    ]) {
      await expect(group.querySelector(".hashti-field__status")).toBeVisible();
      await expect(group.querySelector(".hashti-field__status-icon")).not.toBeInTheDocument();
      await expect(group).not.toHaveAttribute("data-invalid");
    }
    for (const control of [...canvas.getAllByRole("checkbox"), ...canvas.getAllByRole("radio")]) {
      await expect(control).not.toHaveAttribute("aria-invalid", "true");
      await expect(control.closest("label")).not.toHaveAttribute("data-invalid");
    }
    await userEvent.click(canvas.getByRole("checkbox", { name: "Weekly digest" }));
    await expect(canvas.getByRole("checkbox", { name: "Weekly digest" })).toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: "At handoff" }));
    await expect(canvas.getByRole("radio", { name: "At handoff" })).toBeChecked();
    const owner = canvas.getByRole("group", { name: "Owner checks (optional)" });
    await expect(owner).toHaveAccessibleDescription(/owner review/);
    await expect(owner).toHaveAccessibleDescription(/Success/);
    await expect(owner.querySelector(".hashti-field__status-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(owner.querySelector(".hashti-field__status-icon")?.parentElement).toHaveClass(
      "hashti-field__help",
    );
  },
};

const workspaceHelp = "Use the name your team recognizes in the review schedule.";

export const RequiredOptionalAndTooltip: Story = {
  render: () => (
    <Form
      aria-label="Field help controls"
      className="field-story-grid"
      onSubmit={(event) => {
        event.preventDefault();
        submitHelpForm();
      }}
    >
      <TextField
        name="workspace"
        label="Workspace name"
        defaultValue="Weekly review"
        isRequired
        isOptional
        labelTooltip={workspaceHelp}
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
        labelTooltip="Search by name or workspace identifier. Opening help keeps the query."
        onClear={clearHelpSearch}
        status={{ type: "warning", message: "Search within the current workspace." }}
      />
      <NumberField
        name="reviewers"
        label="Reviewers"
        defaultValue={3}
        minValue={1}
        maxValue={12}
        isOptional
        labelTooltip="Count the people who can review this draft. Opening help does not change the count."
        onChange={changeHelpNumber}
        status={{ type: "success", message: "Three reviewers are recorded in this draft." }}
      />
      <Select
        name="access"
        label="Access"
        defaultValue="viewer"
        isOptional
        labelTooltip="Viewer can read the review; editor can change it. Opening help does not choose access."
        onChange={changeHelpAccess}
        status={{ type: "warning", message: "Confirm access before inviting a teammate." }}
      >
        <ListBoxItem id="viewer">Viewer</ListBoxItem>
        <ListBoxItem id="editor">Editor</ListBoxItem>
      </Select>
      <DatePicker
        name="review-date"
        label="Review date"
        defaultValue={new CalendarDate(2026, 11, 8)}
        isOptional
        labelTooltip="Choose the team's review day. Opening help does not open the calendar or edit the date."
        onChange={changeHelpDate}
        status={{ type: "success", message: "The review day is recorded in this draft." }}
      />
    </Form>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: "Field help controls" });
    const initialValues = Object.fromEntries(new FormData(form));
    const workspace = canvas.getByRole("textbox", { name: "Workspace name (required)" });
    const help = canvas.getByRole("button", { name: "About Workspace name" });
    await expect(workspace).toBeRequired();
    await expect(
      canvas.getByRole("textbox", { name: "Handoff notes (optional)" }),
    ).not.toBeRequired();
    await expect(
      workspace.closest(".hashti-field")?.querySelectorAll(".hashti-field__necessity"),
    ).toHaveLength(1);
    await expect(help.closest("label")).toBeNull();
    // RAC checks pointer modality at hover-start, before userEvent.hover emits pointermove.
    await userEvent.pointer({ target: canvasElement.ownerDocument.body });
    await userEvent.hover(help);
    await expect(await body.findByRole("tooltip", {}, { timeout: 3000 })).toHaveTextContent(
      workspaceHelp,
    );
    await userEvent.unhover(help);
    await waitFor(() => expect(body.queryByRole("tooltip")).not.toBeInTheDocument(), {
      timeout: 2000,
    });
    await userEvent.click(workspace);
    await expect(workspace).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(help).toHaveFocus();
    await expect(await body.findByRole("tooltip", {}, { timeout: 3000 })).toHaveTextContent(
      workspaceHelp,
    );

    for (const [label, activation] of [
      ["Workspace name", "Enter"],
      ["Workspace name", "Space"],
      ["Review search", "touch"],
      ["Reviewers", "click"],
      ["Access", "click"],
      ["Review date", "click"],
    ] as const) {
      const trigger = canvas.getByRole("button", { name: `About ${label}` });
      await expect(trigger.closest("label")).toBeNull();
      if (activation === "Enter") await userEvent.keyboard("{Enter}");
      else if (activation === "Space") await userEvent.keyboard(" ");
      else if (activation === "touch")
        await userEvent.pointer({ keys: "[TouchA]", target: trigger });
      else await userEvent.click(trigger);
      // Tooltip-only behavior: clicking help does not open a modal/popover dialog
      await expect(body.queryByRole("dialog", { name: `About ${label}` })).toBeNull();
      await expect(workspace).toBeVisible();
      await expect(trigger.closest(".hashti-field")).not.toHaveAttribute("data-open");
      await expect(Object.fromEntries(new FormData(form))).toEqual(initialValues);
    }
    await expect(submitHelpForm).not.toHaveBeenCalled();
    await expect(clearHelpSearch).not.toHaveBeenCalled();
    await expect(changeHelpNumber).not.toHaveBeenCalled();
    await expect(changeHelpAccess).not.toHaveBeenCalled();
    await expect(changeHelpDate).not.toHaveBeenCalled();
    await expect(canvas.getByRole("searchbox", { name: "Review search (optional)" })).toHaveValue(
      "WS-1042",
    );
    await expect(canvas.getByRole("textbox", { name: "Reviewers (optional)" })).toHaveValue("3");
    await userEvent.click(workspace);
  },
};

function ValidationExamples() {
  const [nativeSaved, setNativeSaved] = useState("");
  const [validationErrors, setValidationErrors] = useState<FormProps["validationErrors"]>({});
  const [serverReads, setServerReads] = useState(0);
  const [serverValue, setServerValue] = useState("");
  return (
    <div className="field-story-grid">
      <Form
        aria-label="Native validation precedence"
        className="field-story-case"
        validationBehavior="native"
        onSubmit={(event) => {
          event.preventDefault();
          setNativeSaved(String(new FormData(event.currentTarget).get("delivery-email")));
        }}
      >
        <h2>Native validation</h2>
        <TextField
          name="delivery-email"
          type="email"
          label="Delivery email"
          description="Use a complete email address for delivery."
          defaultValue="incomplete"
          isRequired
          status={{ type: "success", message: "The imported draft was marked ready for review." }}
          errorMessage="Enter a complete delivery email."
        />
        <Button type="submit">Read delivery email</Button>
        <output aria-label="Validated delivery email">{nativeSaved}</output>
      </Form>
      <section className="field-story-case">
        <h2>RAC invalid state</h2>
        <TextField
          label="Restricted workspace"
          defaultValue="Owner review"
          isInvalid
          status={{ type: "warning", message: "The imported workspace still needs review." }}
          errorMessage="Only an owner can choose this workspace."
        />
      </section>
      <Form
        aria-label="Returned validation precedence"
        className="field-story-case"
        validationBehavior="native"
        validationErrors={validationErrors}
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get("workspace"));
          setServerValue(value);
          setServerReads((count) => count + 1);
          setValidationErrors(
            value === "Weekly review"
              ? { workspace: "This workspace name is already used. Choose a different name." }
              : {},
          );
        }}
      >
        <h2>Returned field error</h2>
        <TextField
          name="workspace"
          label="Checked workspace"
          description="Local response example: Weekly review is already used. No request leaves this page."
          defaultValue="Weekly review"
          isRequired
          status={{ type: "warning", message: "The name awaits an availability check." }}
        />
        <Button type="submit">Check workspace name</Button>
        <output aria-label="Workspace check count">{serverReads}</output>
        <output aria-label="Checked native value">{serverValue}</output>
      </Form>
    </div>
  );
}

async function expectValidationWins(control: HTMLElement) {
  const root = control.closest<HTMLElement>(".hashti-field")!;
  await expect(root).toHaveAttribute("data-invalid");
  await expect(control).toHaveAttribute("aria-invalid", "true");
  await expect(root.querySelector(".hashti-field__status")).toBeNull();
  await expect(root.querySelector(".hashti-field__status-icon")).toHaveAttribute(
    "data-hashti-status",
    "error",
  );
}

export const ValidationPrecedence: Story = {
  render: ValidationExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const native = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Delivery email (required)",
    });
    const checked = canvas.getByRole("textbox", { name: "Checked workspace (required)" });
    await expect(native.validity.typeMismatch).toBe(true);
    await expect(native).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("The imported draft was marked ready for review.")).toBeVisible();
    await expectValidationWins(canvas.getByRole("textbox", { name: "Restricted workspace" }));
    await expect(canvas.getByText("Only an owner can choose this workspace.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Read delivery email" }));
    await expect(await canvas.findByText("Enter a complete delivery email.")).toBeVisible();
    await expectValidationWins(native);
    await expect(native).toHaveFocus();
    await expect(
      canvas.getByRole("status", { name: "Validated delivery email" }),
    ).toBeEmptyDOMElement();
    await userEvent.clear(native);
    await userEvent.type(native, "review@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Read delivery email" }));
    await expect(
      canvas.getByRole("status", { name: "Validated delivery email" }),
    ).toHaveTextContent("review@example.com");
    await expect(canvas.getByText("The imported draft was marked ready for review.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Check workspace name" }));
    await expect(
      await canvas.findByText("This workspace name is already used. Choose a different name."),
    ).toBeVisible();
    await expectValidationWins(checked);
    await expect(checked).toHaveValue("Weekly review");
    await expect(canvas.getByRole("status", { name: "Workspace check count" })).toHaveTextContent(
      "1",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Check workspace name" }));
    await expect(checked).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Workspace check count" })).toHaveTextContent(
      "1",
    );
    await userEvent.clear(checked);
    await userEvent.type(checked, "Delivery review");
    await userEvent.tab();
    await waitFor(() =>
      expect(
        canvas.queryByText("This workspace name is already used. Choose a different name."),
      ).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText("The name awaits an availability check.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Check workspace name" }));
    await expect(canvas.getByRole("status", { name: "Workspace check count" })).toHaveTextContent(
      "2",
    );
    await expect(canvas.getByRole("status", { name: "Checked native value" })).toHaveTextContent(
      "Delivery review",
    );
    await expect(checked).not.toHaveAttribute("aria-invalid", "true");
  },
};

function AppearanceOnlyForm() {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<FieldStatus["type"]>("error");
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Appearance-only draft"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(JSON.stringify(readDraft(new FormData(event.currentTarget))));
      }}
    >
      <p>
        An error presentation is not a validation error. Read the valid native draft without
        resetting it.
      </p>
      <TextField
        ref={root}
        inputRef={input}
        name="contact"
        type="email"
        label="Contact email"
        defaultValue="review@example.com"
        isRequired
        status={{
          type,
          message:
            type === "error" ? "Review the imported contact before sharing." : "Contact reviewed.",
        }}
      />
      <TextArea
        name="notes"
        label="Draft notes"
        defaultValue="Keep the owner handoff."
        isOptional
        rows={3}
      />
      <NumberField
        name="reviewers"
        label="Draft reviewers"
        defaultValue={3}
        minValue={1}
        maxValue={12}
        status={{ type: "warning", message: "Confirm reviewer availability." }}
      />
      <SearchField
        name="query"
        label="Draft query"
        defaultValue="WS-1042"
        status={{ type: "success" }}
      />
      <Button type="submit">Read native draft</Button>
      <Button
        variant="secondary"
        onPress={() => setType((current) => (current === "error" ? "success" : "error"))}
      >
        Toggle contact presentation
      </Button>
      <Button
        variant="ghost"
        onPress={() => {
          if (root.current?.contains(input.current)) input.current?.focus();
        }}
      >
        Focus contact
      </Button>
      <output aria-label="Submitted native draft">{saved}</output>
    </Form>
  );
}

export const AppearanceOnlySubmission: Story = {
  render: AppearanceOnlyForm,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: "Appearance-only draft" });
    const input = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Contact email (required)",
    });
    const parent = input.parentElement;
    await expect(input.tagName).toBe("INPUT");
    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toHaveClass("react-aria-Input", "hashti-field__control");
    await expect(parent).toHaveClass("hashti-text-field");
    await expect(input).toBeRequired();
    await expect(input).toBeValid();
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Review the imported contact before sharing.")).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, "release.review@example.com");
    const values = {
      contact: "release.review@example.com",
      notes: "Keep the owner handoff.",
      reviewers: "3",
      query: "WS-1042",
    };
    await expect(Object.fromEntries(new FormData(form))).toEqual(values);
    await userEvent.click(canvas.getByRole("button", { name: "Read native draft" }));
    await expect(readDraft).toHaveBeenCalledTimes(1);
    const first = readDraft.mock.calls[0]?.[0];
    await expect(first).toBeInstanceOf(FormData);
    await expect(Object.fromEntries(first ?? [])).toEqual(values);
    await userEvent.click(canvas.getByRole("button", { name: "Toggle contact presentation" }));
    await expect(canvas.getByText("Contact reviewed.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Contact email (required)" })).toBe(input);
    await expect(input.parentElement).toBe(parent);
    await expect(input).toHaveValue(values.contact);
    await expect(input).toBeValid();
    await userEvent.click(canvas.getByRole("button", { name: "Focus contact" }));
    await expect(input).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Read native draft" }));
    await expect(readDraft).toHaveBeenCalledTimes(2);
    await expect(Object.fromEntries(readDraft.mock.calls[1]?.[0] ?? [])).toEqual(values);
    await expect(readDraft.mock.calls[1]?.[0]).not.toBe(first);
    await expect(canvas.getByRole("status", { name: "Submitted native draft" })).toHaveTextContent(
      JSON.stringify(values),
    );
    await expect(
      canvas.getByRole("searchbox", { name: "Draft query" }),
    ).toHaveAccessibleDescription("Success");
  },
};

function CompoundExamples() {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="field-story-grid">
      <section className="field-story-case">
        <TextField.Root
          ref={root}
          name="composed-contact"
          type="email"
          defaultValue="review@example.com"
          isRequired
          isOptional
          status={{ type: "warning", message: "Confirm the recipient before sharing." }}
          render={(props) => <div {...props} data-composed-root="true" />}
        >
          {({ isRequired }) => (
            <>
              <TextField.Label labelTooltip="This address receives the review link.">
                Composed contact
              </TextField.Label>
              <TextField.Description>
                {isRequired
                  ? "Use a reachable address for this review."
                  : "Add an address for a copy."}
              </TextField.Description>
              <TextField.Control>
                <Input
                  ref={input}
                  className={({ isFocused }) =>
                    isFocused ? "react-aria-Input focused-contact" : "react-aria-Input"
                  }
                  render={(props) => <input {...props} data-composed-input="true" />}
                />
              </TextField.Control>
              <TextField.Help>
                <TextField.ErrorMessage />
                <TextField.Status />
              </TextField.Help>
            </>
          )}
        </TextField.Root>
        <Button
          variant="ghost"
          onPress={() => {
            if (root.current?.contains(input.current)) input.current?.focus();
          }}
        >
          Focus composed contact
        </Button>
      </section>
      <NumberField.Root
        defaultValue={3}
        minValue={1}
        maxValue={12}
        isOptional
        status={{ type: "error", message: "Check reviewer availability." }}
      >
        <NumberField.Label>Composed reviewers</NumberField.Label>
        <NumberField.Control>
          <NumberField.Input />
          <NumberField.Button slot="decrement" aria-label="Fewer reviewers">
            <Icon name="minus" />
          </NumberField.Button>
          <NumberField.Button slot="increment" aria-label="More reviewers">
            <Icon name="plus" />
          </NumberField.Button>
        </NumberField.Control>
        <NumberField.Help>
          <NumberField.ErrorMessage />
          <NumberField.Status />
        </NumberField.Help>
      </NumberField.Root>
      <ComboBox.Root
        defaultValue="weekly"
        isOptional
        status={{ type: "success", message: "The review type is recorded." }}
      >
        <ComboBox.Label>Review type</ComboBox.Label>
        <ComboBox.Control>
          <ComboBox.Input />
          <ComboBox.Trigger aria-label="Choose review type">
            <Icon name="chevronDown" />
          </ComboBox.Trigger>
        </ComboBox.Control>
        <ComboBox.Help>
          <ComboBox.ErrorMessage />
          <ComboBox.Status />
        </ComboBox.Help>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ListBoxItem id="weekly">Weekly review</ListBoxItem>
            <ListBoxItem id="handoff">Release handoff</ListBoxItem>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <DateField
        label="Review day"
        defaultValue={new CalendarDate(2026, 11, 8)}
        isOptional
        status={{ type: "warning", message: "Confirm against the team schedule." }}
      />
      <TimeField
        label="Review time"
        defaultValue={new Time(9, 30)}
        hourCycle={24}
        isOptional
        status={{ type: "success", message: "The review time is recorded." }}
      />
      <DateRangePicker
        label="Handoff window"
        defaultValue={{ start: new CalendarDate(2026, 11, 8), end: new CalendarDate(2026, 11, 12) }}
        isOptional
        status={{ type: "error", message: "Confirm both dates with the handoff owner." }}
      />
    </div>
  );
}

export const CompoundParts: Story = {
  render: CompoundExamples,
  parameters: {
    docs: {
      description: {
        story:
          "TextField.Control contains the public raw RAC Input, not TextField.Input, so the control hook and automatic icon occur once. Root render children and native refs remain intact. Number and ComboBox use their grouped parts; date/time defaults retain their original segmented DateInput targets.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("textbox", { name: "Composed contact (required)" });
    const root = input.closest<HTMLElement>(".hashti-field")!;
    await expect(root).toHaveAttribute("data-composed-root", "true");
    await expect(input).toHaveAttribute("data-composed-input", "true");
    await expect(input).not.toHaveClass("hashti-field__control");
    await expect(input.parentElement).toHaveClass("hashti-field__control", "hashti-input-group");
    await expect(root.querySelectorAll(".hashti-field__control")).toHaveLength(1);
    await expect(root.querySelectorAll(".hashti-field__status-icon")).toHaveLength(1);
    await expect(root.querySelector(".hashti-field__status")?.parentElement).toHaveClass(
      "hashti-field__help",
    );
    await expect(input).toBeRequired();
    await expect(input).toHaveAccessibleDescription(/reachable address/);
    await expect(input).toHaveAccessibleDescription(/Confirm the recipient/);
    await userEvent.click(canvas.getByRole("button", { name: "Focus composed contact" }));
    await expect(input).toHaveFocus();
    await expect(input).toHaveClass("react-aria-Input", "focused-contact");
    await userEvent.clear(input);
    await userEvent.type(input, "handoff@example.com");
    await expect(input).toHaveValue("handoff@example.com");
    const number = canvas.getByRole("textbox", { name: "Composed reviewers (optional)" });
    await userEvent.click(
      within(number.closest<HTMLElement>(".hashti-field")!).getByRole("button", {
        name: /^More reviewers/,
      }),
    );
    await expect(number).toHaveValue("4");
    await expect(number).not.toHaveAttribute("aria-invalid", "true");
    const combo = canvas.getByRole("combobox", { name: "Review type (optional)" });
    await userEvent.click(canvas.getByRole("button", { name: /^Choose review type/ }));
    await userEvent.click(await body.findByRole("option", { name: "Release handoff" }));
    await expect(combo).toHaveValue("Release handoff");
    for (const message of ["Confirm against the team schedule.", "The review time is recorded."]) {
      const dateRoot = canvas.getByText(message).closest<HTMLElement>(".hashti-field")!;
      const dateInput = dateRoot.querySelector(".react-aria-DateInput")!;
      await expect(dateInput.tagName).toBe("DIV");
      await expect(dateInput).toHaveClass("hashti-field__control");
      await expect(dateInput.parentElement).toBe(dateRoot);
      await expect(dateRoot.querySelectorAll(".hashti-field__status-icon")).toHaveLength(1);
    }
  },
};

const longLabel = "Workspace name for the shared release review and owner handoff";
const longHelp =
  "This name appears in the shared review list and in the owner's handoff notes. Use the name from the team's schedule rather than an internal code. You can read this complete help, close it, and return to the same draft without re-entering the workspace name.";

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <TextField
        label={longLabel}
        labelTooltip={longHelp}
        description="Keep the full workspace name from the team's schedule. These instructions remain visible while the draft is edited."
        defaultValue="Shared release and owner handoff review"
        isRequired
        status={{
          type: "warning",
          message: (
            <>
              Confirm the handoff contact at{" "}
              <bdi dir="ltr">workspace-release-review-owner-handoff@example.com</bdi> before sharing
              this draft. The full message must wrap in this narrow container.
            </>
          ),
        }}
      />
      <TextArea
        label="Notes for the release reviewer and the next workspace owner"
        description="Keep the checklist in the draft while checking the handoff requirements."
        defaultValue="Keep the complete owner handoff checklist."
        rows={3}
        isOptional
        status={{
          type: "error",
          message:
            "Review the handoff notes with the workspace owner. This presentation does not discard the notes or make the native textarea invalid; the message grows to keep every sentence readable.",
        }}
      />
      <NumberField
        label="Number of reviewers available for the release and owner handoff"
        defaultValue={3}
        minValue={1}
        maxValue={12}
        status={{
          type: "success",
          message:
            "The reviewer count has been recorded for this draft. Check the schedule before inviting more people; this long confirmation remains visible without clipping the control or hiding its actions.",
        }}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    for (const part of canvasElement.querySelectorAll<HTMLElement>(
      ".hashti-field__label, .hashti-field__description, .hashti-field__status:not(.hashti-visually-hidden)",
    )) {
      await expect(part).toBeVisible();
      await expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth + 1);
      await expect(part.scrollHeight).toBeLessThanOrEqual(part.clientHeight + 1);
    }
    const input = canvas.getByRole("textbox", { name: `${longLabel} (required)` });
    const help = canvas.getByRole("button", { name: `About ${longLabel}` });
    // labelTooltip renders a hover/focus tooltip only; it never opens a dialog.
    // RAC checks pointer modality at hover-start, before userEvent.hover emits pointermove.
    await userEvent.pointer({ target: canvasElement.ownerDocument.body });
    await userEvent.hover(help);
    const tooltip = await body.findByRole("tooltip", {}, { timeout: 3000 });
    await expect(tooltip).toHaveTextContent(longHelp);
    const text = within(tooltip).getByText(longHelp);
    await waitFor(() => expect(text).toBeVisible());
    await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
    await userEvent.unhover(help);
    await waitFor(() => expect(body.queryByRole("tooltip")).not.toBeInTheDocument(), {
      timeout: 2000,
    });
    await expect(input).toHaveValue("Shared release and owner handoff review");
    await expect(canvas.getByRole("textbox", { name: `${longLabel} (required)` })).toBe(input);
    await userEvent.click(input);
  },
};

const localeExamples = [
  {
    locale: "fa-IR",
    direction: "rtl",
    heading: "فارسی",
    label: "نام فضای کاری",
    required: "الزامی",
    optional: "اختیاری",
    about: "دربارهٔ نام فضای کاری",
    close: "بستن راهنمای فیلد",
    defaultValue: "مرور هفتگی",
    tooltip: "نامی بنویسید که تیم شما بشناسد. این نام در فهرست مرورها نمایش داده می‌شود.",
    description: (
      <>
        نام فضای کاری را برای پروژهٔ <bdi dir="ltr">WS-1042</bdi> وارد کنید.
      </>
    ),
    type: "warning",
    message: (
      <>
        نام پروژهٔ <bdi dir="ltr">WS-1042</bdi> را با برنامهٔ تیم بررسی کنید.
      </>
    ),
    numberLabel: "تعداد مرورکننده‌ها",
    numberType: "success",
    numberStatus: "تأیید",
  },
  {
    locale: "ar",
    direction: "rtl",
    heading: "العربية",
    label: "اسم مساحة العمل",
    required: "مطلوب",
    optional: "اختياري",
    about: "حول اسم مساحة العمل",
    close: "إغلاق مساعدة الحقل",
    defaultValue: "المراجعة الأسبوعية",
    tooltip: "استخدم اسمًا يعرفه فريقك. يظهر هذا الاسم في قائمة المراجعات.",
    description: (
      <>
        أدخل اسم مساحة العمل للمشروع <bdi dir="ltr">WS-1042</bdi>.
      </>
    ),
    type: "error",
    message: (
      <>
        راجع اسم المشروع <bdi dir="ltr">WS-1042</bdi> قبل المشاركة.
      </>
    ),
    numberLabel: "عدد المراجعين",
    numberType: "warning",
    numberStatus: "تحذير",
  },
  {
    locale: "de-DE",
    direction: "ltr",
    heading: "Deutsch",
    label: "Arbeitsbereich",
    required: "erforderlich",
    optional: "optional",
    about: "Informationen zu Arbeitsbereich",
    close: "Feldhilfe schließen",
    defaultValue: "Wochenrückblick",
    tooltip:
      "Wählen Sie einen Namen, den Ihr Team wiedererkennt. Der Name erscheint in der Übersicht.",
    description: (
      <>
        Geben Sie den Arbeitsbereich für <bdi dir="ltr">WS-1042</bdi> ein.
      </>
    ),
    type: "success",
    message: (
      <>
        Der Entwurf für <bdi dir="ltr">WS-1042</bdi> ist bereit zur Prüfung.
      </>
    ),
    numberLabel: "Prüfende",
    numberType: "success",
    numberStatus: "Bestätigt",
  },
  {
    locale: "fr-FR",
    direction: "ltr",
    heading: "Français · repli anglais",
    label: "Nom du projet",
    required: "required",
    optional: "optional",
    about: "About Nom du projet",
    close: "Close field help",
    defaultValue: "Revue hebdomadaire",
    tooltip: "Utilisez le nom que votre équipe reconnaît dans la liste des revues.",
    description: (
      <>
        Saisissez le nom du projet <bdi dir="ltr">WS-1042</bdi>.
      </>
    ),
    type: "warning",
    message: (
      <>
        Vérifiez le nom du projet <bdi dir="ltr">WS-1042</bdi> avant le partage.
      </>
    ),
    numberLabel: "Personnes chargées de la revue",
    numberType: "error",
    numberStatus: "Error",
  },
] as const;

function LocalizedExamples() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      {localeExamples.map((copy) => (
        <Theme theme={theme} locale={copy.locale} key={copy.locale}>
          <section className="field-story-case">
            <h2>{copy.heading}</h2>
            <TextField
              label={copy.label}
              labelTooltip={copy.tooltip}
              description={copy.description}
              defaultValue={copy.defaultValue}
              isRequired
              isOptional
              status={{ type: copy.type, message: copy.message }}
            />
            <NumberField
              label={copy.numberLabel}
              defaultValue={3}
              minValue={1}
              maxValue={12}
              isOptional
              status={{ type: copy.numberType }}
            />
          </section>
        </Theme>
      ))}
    </div>
  );
}

export const LocalizedContent: Story = {
  render: LocalizedExamples,
  parameters: {
    docs: {
      description: {
        story:
          "Real Theme locale scopes provide built-in necessity, icon-only status, and help-control strings. Messages and application content are caller-localized; Latin identifiers use bdi. French demonstrates the English fallback for unsupported built-in locales. Detached help retains the active Frame theme and locale.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    for (const copy of localeExamples) {
      const input = canvas.getByRole("textbox", { name: `${copy.label} (${copy.required})` });
      const root = input.closest<HTMLElement>(".hashti-field")!;
      const theme = input.closest<HTMLElement>("[data-hashti-theme]")!;
      await expect(theme).toHaveAttribute("lang", copy.locale);
      await expect(theme).toHaveAttribute("dir", copy.direction);
      await expect(getComputedStyle(input).direction).toBe(copy.direction);
      await expect(input).toBeRequired();
      await expect(root.querySelectorAll(".hashti-field__necessity")).toHaveLength(1);
      await expect(input).not.toHaveAttribute("aria-invalid", "true");
      for (const identifier of within(root).getAllByText("WS-1042")) {
        await expect(identifier.tagName).toBe("BDI");
        await expect(identifier).toHaveAttribute("dir", "ltr");
      }
      const number = canvas.getByRole("textbox", {
        name: `${copy.numberLabel} (${copy.optional})`,
      });
      await expect(number).not.toBeRequired();
      await expect(number).toHaveValue(new Intl.NumberFormat(copy.locale).format(3));
      await expect(number).toHaveAccessibleDescription(copy.numberStatus);
      await expect(number).not.toHaveAttribute("aria-invalid", "true");
      const help = canvas.getByRole("button", { name: copy.about });
      // labelTooltip renders a hover/focus tooltip only; it never opens a dialog.
      await userEvent.pointer({ target: canvasElement.ownerDocument.body });
      await userEvent.hover(help);
      const tooltip = await body.findByRole("tooltip", {}, { timeout: 3000 });
      const overlay = tooltip.closest<HTMLElement>("[data-hashti-theme]")!;
      await expect(tooltip).toHaveTextContent(copy.tooltip);
      await expect(overlay).toHaveAttribute("lang", copy.locale);
      await expect(overlay).toHaveAttribute("dir", copy.direction);
      await expect(overlay).toHaveAttribute(
        "data-hashti-theme",
        theme.getAttribute("data-hashti-theme")!,
      );
      await userEvent.unhover(help);
      await waitFor(() => expect(body.queryByRole("tooltip")).not.toBeInTheDocument(), {
        timeout: 2000,
      });
      await expect(input).toHaveValue(copy.defaultValue);
      await userEvent.click(input);
    }
  },
};
