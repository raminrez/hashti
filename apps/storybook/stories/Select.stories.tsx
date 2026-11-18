import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Select, Theme, useTheme, type ListData } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Workspace role",
    description: "Determines what the member can see and change.",
    placeholder: "Choose a role...",
    onValueChange: () => {},
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Select picks one value (or several, with `multiple`) from a popup listbox. Built on `@ui-sdk/react/select` with Hashti's field anatomy: label, description, status and error recovery.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const standardRoles: ListData<string> = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const clusters: ListData<string> = [
  {
    type: "group",
    label: "Production",
    items: [
      { value: "prod-1", label: "Production primary" },
      { value: "prod-dr", label: "Production DR", disabled: true },
    ],
  },
  {
    type: "group",
    label: "Staging",
    items: [
      { value: "staging-1", label: "Staging EU" },
      { value: "staging-2", label: "Staging US" },
    ],
  },
];

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <Select {...args} items={standardRoles} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Unselected with placeholder</h2>
        <Select
          label="Unselected profile"
          description="A role must be assigned before inviting."
          placeholder="Choose access profile..."
          items={standardRoles}
        />
      </div>

      <div className="field-story-case">
        <h2>Selected value</h2>
        <Select
          label="Assigned profile"
          description="Current role for this member."
          defaultValue="editor"
          items={standardRoles}
        />
      </div>

      <div className="field-story-case">
        <h2>Error status with recovery</h2>
        <Select
          label="Restricted environment"
          description="Select an authorized production cluster."
          placeholder="Choose environment..."
          status={{ type: "error", message: "Select an authorized cluster to continue." }}
          items={[
            { value: "prod-us", label: "Production US-East" },
            { value: "prod-eu", label: "Production EU-Central" },
          ]}
        />
      </div>

      <div className="field-story-case">
        <h2>Disabled selection</h2>
        <Select
          label="Locked security policy"
          description="Role modifications are managed by directory sync."
          defaultValue="admin"
          disabled
          items={standardRoles}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", { name: /Unselected profile/ });
    await expect(trigger).toBeVisible();
    await expect(canvas.getByText("Choose access profile...")).toBeVisible();

    await userEvent.click(trigger);
    const option = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="editor"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(option);

    await waitFor(async () => {
      await expect(within(trigger).getByText("Editor")).toBeVisible();
    });

    // Status recovery message
    await expect(
      canvas.getByText("Select an authorized cluster to continue."),
    ).toBeInTheDocument();

    // Disabled select trigger cannot be opened
    const disabledTrigger = canvas.getByRole("combobox", { name: /Locked security policy/ });
    await expect(disabledTrigger).toHaveAttribute("data-disabled");
  },
};

export const GroupsAndDisabled: Story = {
  render: () => (
    <div className="field-story-stack">
      <Select
        label="Deployment cluster"
        description="Choose a destination environment for this workflow."
        placeholder="Select cluster..."
        items={clusters}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", { name: /Deployment cluster/ });
    await userEvent.click(trigger);

    const lockedOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="prod-dr"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await expect(lockedOption).toHaveAttribute("aria-disabled", "true");

    const liveOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="prod-1"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(liveOption);

    await waitFor(async () => {
      await expect(within(trigger).getByText("Production primary")).toBeVisible();
    });
  },
};

function ControlledSelectionExample() {
  const [selected, setSelected] = useState<string | null>("viewer");
  return (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Controlled selection</h2>
        <Select
          label="Managed workspace role"
          description="State is held and observed externally."
          value={selected}
          onValueChange={(value) => setSelected(value)}
          items={standardRoles}
        />
        <output aria-label="Controlled selection">{selected ?? "none"}</output>
      </div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Controlled selection" });
    await expect(output).toHaveTextContent("viewer");

    const trigger = canvas.getByRole("combobox", { name: /Managed workspace role/ });
    await userEvent.click(trigger);

    const editorOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="editor"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(editorOption);

    await waitFor(async () => {
      await expect(output).toHaveTextContent("editor");
    });
  },
};

function FormSelectionExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setSubmitted(JSON.stringify(Object.fromEntries(formData.entries())));
      }}
      style={{ display: "grid", gap: "1rem" }}
    >
      <Select
        label="Primary cluster"
        name="cluster"
        required
        placeholder="Select a cluster..."
        items={clusters}
      />
      <button type="submit" className="hashti-button" data-variant="primary">
        Save configuration
      </button>
      {submitted && (
        <output aria-label="Submitted form data" style={{ overflowWrap: "anywhere" }}>
          {submitted}
        </output>
      )}
    </form>
  );
}

export const FormSubmission: Story = {
  render: () => <FormSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole("button", { name: /Save configuration/ });

    const trigger = canvas.getByRole("combobox", { name: /Primary cluster/ });
    await userEvent.click(trigger);
    const stagingOpt = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="staging-1"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(stagingOpt);

    await userEvent.click(submitBtn);
    const output = await waitFor(() => {
      const el = canvas.getByRole("status", { name: "Submitted form data" });
      expect(el).toBeVisible();
      return el;
    });
    await expect(output).toHaveTextContent('"cluster":"staging-1"');
  },
};

function LocalizedSelectExamples() {
  const { theme } = useTheme();
  const persianRoles: ListData<string> = [
    { value: "admin", label: "مدیر" },
    { value: "editor", label: "ویرایشگر" },
    { value: "viewer", label: "بیننده" },
  ];
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl" className="field-story-case">
          <h2>Persian (RTL)</h2>
          <Select
            label="نقش کاربر"
            description="سطح دسترسی اعضای فضای کاری را تعیین می‌کند."
            placeholder="نقش را انتخاب کنید..."
            defaultValue="editor"
            items={persianRoles}
          />
        </div>
      </Theme>
    </div>
  );
}

export const Locales: Story = {
  render: () => <LocalizedSelectExamples />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const persianTrigger = canvas.getByRole("combobox", { name: /نقش کاربر/ });
    await expect(persianTrigger).toHaveTextContent("ویرایشگر");
    await userEvent.click(persianTrigger);
    const adminOpt = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="admin"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(adminOpt);
    await waitFor(async () => {
      await expect(persianTrigger).toHaveTextContent("مدیر");
    });
  },
};

const frameworks: ListData<string> = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

function MultipleSelectionExample() {
  const [selected, setSelected] = useState<string[]>(["react", "vue"]);
  return (
    <div className="field-story-stack">
      <Select
        label="Frameworks (chips)"
        description="Several options can be active at once."
        multiple
        multipleDisplay="chips"
        value={selected}
        onValueChange={(value) => setSelected(value)}
        items={frameworks}
      />
      <Select
        label="Frameworks (badge)"
        multiple
        multipleDisplay="badge"
        defaultValue={["react", "vue", "svelte"]}
        items={frameworks}
      />
      <Select
        label="Frameworks (text)"
        multiple
        multipleDisplay="text"
        defaultValue={["react", "vue"]}
        items={frameworks}
      />
      <output aria-label="Selected frameworks">{selected.join(", ")}</output>
    </div>
  );
}

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Selected frameworks" });
    await expect(output).toHaveTextContent("react, vue");

    // The chips display shows the current selection inside the trigger.
    const trigger = canvas.getByRole("combobox", { name: /Frameworks \(chips\)/ });
    await expect(within(trigger).getByText("React")).toBeVisible();

    await userEvent.click(trigger);
    const svelteOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="select-item"][data-value="svelte"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(svelteOption);

    await waitFor(async () => {
      await expect(output).toHaveTextContent("svelte");
    });
  },
};
