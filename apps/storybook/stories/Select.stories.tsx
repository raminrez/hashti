import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Collection, Header } from "react-aria-components";
import {
  Autocomplete,
  Button,
  Form,
  Icon,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  SearchField,
  Select,
  Text,
  Theme,
  useTheme,
  type Key,
} from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Select",
  component: Select,
  // Multi-select chip remove targets are 16px and skipped by tab order.
  tags: ["a11y:gap"],
  args: {
    label: "Workspace role",
    description: "Select the permission profile assigned to this teammate.",
    placeholder: "Choose a role...",
    onSelectionChange: fn(),
    children: null as any,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The callable Select is shorthand built over additive compound parts: Select.Root, Select.Trigger, Select.Value, Select.Popover, and Select.ListBox, alongside shared fieldParts. Select.Root preserves RAC's underlying select contract; Trigger uses Button variant='ghost' with Chevron down; Popover carries the Theme bridge across portals. Frame defaults place label before guidance, control below, and recovery attached underneath.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

interface RoleItem {
  id: string;
  name: string;
  description: string;
}

const standardRoles: RoleItem[] = [
  { id: "admin", name: "Administrator", description: "Full access to settings and billing" },
  { id: "editor", name: "Editor", description: "Can create, edit, and publish content" },
  { id: "viewer", name: "Viewer", description: "Read-only access to existing workspaces" },
];

const reviewerRoles: RoleItem[] = [
  { id: "admin", name: "Administrator", description: "Full access to settings and billing" },
  { id: "editor", name: "Editor", description: "Can create, edit, and publish content" },
  { id: "viewer", name: "Viewer", description: "Read-only access to existing workspaces" },
  { id: "auditor", name: "Auditor", description: "Reviews activity without changing it" },
  { id: "billing", name: "Billing manager", description: "Manages invoices and payment methods" },
  { id: "support", name: "Support agent", description: "Reads accounts and replies to tickets" },
  { id: "analyst", name: "Data analyst", description: "Queries reports and exports datasets" },
  { id: "designer", name: "Designer", description: "Edits components and visual assets" },
  { id: "developer", name: "Developer", description: "Manages builds, keys, and deployments" },
  { id: "moderator", name: "Moderator", description: "Reviews flagged content and members" },
  { id: "owner", name: "Workspace owner", description: "Owns the workspace and its contracts" },
  { id: "guest", name: "Guest reviewer", description: "Temporary read access for reviews" },
  { id: "security", name: "Security lead", description: "Owns access policy and audit trails" },
  { id: "legal", name: "Legal counsel", description: "Reviews agreements and retention policy" },
  { id: "finance", name: "Finance approver", description: "Signs off budgets and purchases" },
  { id: "ops", name: "Operations lead", description: "Coordinates releases and incident response" },
  { id: "recruiter", name: "Recruiter", description: "Manages candidate pipelines" },
  { id: "trainer", name: "Trainer", description: "Publishes onboarding material" },
  { id: "writer", name: "Technical writer", description: "Maintains public documentation" },
  { id: "translator", name: "Translator", description: "Localises copy and messages" },
  { id: "researcher", name: "Researcher", description: "Runs studies with anonymised data" },
  { id: "marketer", name: "Marketer", description: "Manages campaigns and audiences" },
  { id: "seller", name: "Account executive", description: "Owns customer accounts and renewals" },
  { id: "partner", name: "Partner", description: "Limited shared access with agencies" },
  { id: "contractor", name: "Contractor", description: "Scoped access for a fixed engagement" },
  { id: "intern", name: "Intern", description: "Supervised access with strict limits" },
  { id: "architect", name: "Architect", description: "Designs systems and reviews diagrams" },
  {
    id: "sre",
    name: "Site reliability engineer",
    description: "Owns uptime and on-call rotations",
  },
  { id: "qa", name: "Quality engineer", description: "Runs test plans and release checks" },
  { id: "pm", name: "Product manager", description: "Prioritises roadmap and requirements" },
  { id: "producer", name: "Producer", description: "Coordinates schedules and deliverables" },
  { id: "curator", name: "Content curator", description: "Approves published collections" },
  { id: "librarian", name: "Asset librarian", description: "Keeps media and files organised" },
  { id: "observer", name: "Observer", description: "Watches sessions without participating" },
  { id: "reviewer", name: "Reviewer", description: "Approves changes before they ship" },
  { id: "maintainer", name: "Maintainer", description: "Triages issues and merges changes" },
];

interface ClusterItem {
  id: string;
  name: string;
  description: string;
}

interface ClusterSection {
  id: string;
  name: string;
  children: ClusterItem[];
}

const clusterSections: ClusterSection[] = [
  {
    id: "internal",
    name: "Internal clusters",
    children: [
      { id: "dev-1", name: "Development alpha", description: "Sandbox testing node" },
      { id: "stage-1", name: "Staging release", description: "Pre-production verification" },
    ],
  },
  {
    id: "protected",
    name: "Protected clusters",
    children: [
      { id: "prod-1", name: "Production primary", description: "Live traffic routing" },
      { id: "prod-dr", name: "Disaster recovery", description: "Failover standby only" },
    ],
  },
];

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <Select {...args} items={standardRoles}>
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            <Text slot="label">{item.name}</Text>
            <Text slot="description">{item.description}</Text>
          </ListBoxItem>
        )}
      </Select>
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
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>

      <div className="field-story-case">
        <h2>Selected value</h2>
        <Select
          label="Assigned profile"
          description="Current role for this member."
          defaultSelectedKey="editor"
          items={standardRoles}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>

      <div className="field-story-case">
        <h2>Invalid with recovery</h2>
        <Select
          label="Restricted environment"
          description="Select an authorized production cluster."
          placeholder="Choose environment..."
          isInvalid
          errorMessage="Select an authorized cluster to continue."
          items={[
            { id: "prod-us", name: "Production US-East" },
            { id: "prod-eu", name: "Production EU-Central" },
          ]}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>

      <div className="field-story-case">
        <h2>Disabled selection</h2>
        <Select
          label="Locked security policy"
          description="Role modifications are managed by directory sync."
          defaultSelectedKey="admin"
          isDisabled
          items={standardRoles}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Unselected profile/ });
    await expect(trigger).toBeVisible();
    await expect(canvas.getByText("Choose access profile...")).toBeVisible();

    await userEvent.click(trigger);
    const option = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="editor"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(option);

    await waitFor(async () => {
      await expect(within(trigger).getByText("Editor")).toBeVisible();
    });

    // Check invalid recovery error message presence
    await expect(canvas.getByText("Select an authorized cluster to continue.")).toBeVisible();

    // Verify disabled select button cannot be focused/opened
    const disabledTrigger = canvas.getByRole("button", { name: /Locked security policy/ });
    await expect(disabledTrigger).toBeDisabled();
  },
};

export const RichOptionsAndSections: Story = {
  render: () => {
    return (
      <div className="field-story-stack">
        <Select
          label="Deployment cluster"
          description="Choose a destination environment for this workflow."
          placeholder="Select cluster..."
          disabledKeys={["prod-dr"]}
          items={clusterSections}
        >
          {(section) => (
            <ListBoxSection id={section.id}>
              <Header className="hashti-select-section-header">{section.name}</Header>
              <Collection items={section.children}>
                {(item) => (
                  <ListBoxItem id={item.id} textValue={item.name}>
                    <Text slot="label">{item.name}</Text>
                    <Text slot="description">{item.description}</Text>
                  </ListBoxItem>
                )}
              </Collection>
            </ListBoxSection>
          )}
        </Select>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Deployment cluster/ });
    await userEvent.click(trigger);

    const lockedOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="prod-dr"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await expect(lockedOption).toHaveAttribute("aria-disabled", "true");

    const liveOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="prod-1"]');
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
  const [selected, setSelected] = useState<Key | null>("viewer");
  return (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Controlled selection</h2>
        <Select
          label="Managed workspace role"
          description="State is held and observed externally."
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key)}
          items={standardRoles}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
        <div className="overlay-row">
          <output aria-label="Observed selection">Selected: {String(selected ?? "none")}</output>
          <Button variant="ghost" size="sm" onPress={() => setSelected("admin")}>
            Reset to Admin
          </Button>
        </div>
      </div>

      <div className="field-story-case">
        <h2>Uncontrolled selection</h2>
        <Select
          label="Autonomous selection"
          description="Uses defaultSelectedKey without re-renders."
          defaultSelectedKey="editor"
          items={standardRoles}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: () => <ControlledSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Observed selection" });
    await expect(output).toHaveTextContent("Selected: viewer");

    const resetButton = canvas.getByRole("button", { name: "Reset to Admin" });
    await userEvent.click(resetButton);
    await expect(output).toHaveTextContent("Selected: admin");

    const trigger = canvas.getByRole("button", { name: /Managed workspace role/ });
    await userEvent.click(trigger);
    const viewerOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="viewer"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(viewerOption);

    await waitFor(async () => {
      await expect(output).toHaveTextContent("Selected: viewer");
    });
  },
};

function FormSelectionExample() {
  const [submitted, setSubmitted] = useState<string>("");
  return (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Form submission with Select</h2>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setSubmitted(`role=${formData.get("role")}&team=${formData.get("team")}`);
          }}
        >
          <Select
            isRequired
            name="role"
            label="Mandatory member role"
            description="A role is required before submitting."
            placeholder="Pick a role..."
            items={standardRoles}
          >
            {(item) => (
              <ListBoxItem id={item.id} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </Select>

          {/* Custom whole-tree compound composition */}
          <Select.Root name="team" size="md" isRequired>
            <Select.Label>Assigned development team</Select.Label>
            <Select.Description>Route reviews to this squad.</Select.Description>
            <Select.Trigger>
              <Select.Value />
              <Icon name="chevronDown" />
            </Select.Trigger>
            <Select.Help>
              <Select.ErrorMessage>Team selection is required.</Select.ErrorMessage>
            </Select.Help>
            <Select.Popover>
              <Select.ListBox>
                <ListBoxItem id="core" textValue="Core Platform">
                  Core Platform
                </ListBoxItem>
                <ListBoxItem id="infra" textValue="Cloud Infrastructure">
                  Cloud Infrastructure
                </ListBoxItem>
              </Select.ListBox>
            </Select.Popover>
          </Select.Root>

          <div className="overlay-row" style={{ marginTop: "1rem" }}>
            <Button type="submit">Submit assignment</Button>
          </div>
        </Form>
        <output aria-label="Submitted assignment" style={{ overflowWrap: "anywhere" }}>
          {submitted || "Awaiting form submission."}
        </output>
      </div>
    </div>
  );
}

export const CompositionAndFormData: Story = {
  render: () => <FormSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole("button", { name: "Submit assignment" });
    const output = canvas.getByRole("status", { name: "Submitted assignment" });

    // Submit while empty - required triggers validation
    await userEvent.click(submitBtn);

    // Pick role
    const roleTrigger = canvas.getByRole("button", { name: /Mandatory member role/ });
    await userEvent.click(roleTrigger);
    const editorOpt = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="editor"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(editorOpt);

    // Pick team via compound select
    const teamTrigger = canvas.getByRole("button", { name: /Assigned development team/ });
    await userEvent.click(teamTrigger);
    const coreOpt = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[role="option"][data-key="core"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(coreOpt);

    // Submit form
    await userEvent.click(submitBtn);
    await waitFor(async () => {
      await expect(output).toHaveTextContent("role=editor&team=core");
    });
  },
};

function LocalizedSelectExamples() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <div className="field-story-case field-story-narrow">
        <h2>Narrow container with long option labels</h2>
        <Select
          label="Long enterprise service profile"
          description="Labels wrap cleanly inside bounded containers without overflow."
          defaultSelectedKey="dedicated-cluster"
          items={[
            {
              id: "dedicated-cluster",
              name: "Dedicated high-availability multi-region cluster with automated snapshot replication",
            },
            {
              id: "shared-node",
              name: "Shared standard single-tenant compute instance with standard monitoring",
            },
          ]}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>

      <div className="field-story-case">
        <h2>Persian RTL with Latin identifier</h2>
        <Theme theme={theme} locale="fa-IR">
          <Select
            label="نقش کاربری در سامانه"
            description="سطح دسترسی خود را برای اتصال به اطلس مشخص نمایید."
            defaultSelectedKey="admin"
            items={[
              { id: "admin", name: "مدیر ارشد سامانه (atlas-prod-01)" },
              { id: "editor", name: "ویرایشگر محتوا و گردش‌کار" },
              { id: "viewer", name: "ناظر گزارش‌های حسابرسی" },
            ]}
          >
            {(item) => (
              <ListBoxItem id={item.id} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </Select>
        </Theme>
      </div>

      <div className="field-story-case">
        <h2>Arabic RTL</h2>
        <Theme theme={theme} locale="ar-AE">
          <Select
            label="الصلاحية المخصصة للمستخدم"
            description="حدد مستوى الأذونات الخاصة ببيئة العمل."
            defaultSelectedKey="dev"
            items={[
              { id: "dev", name: "مطور برمجيات البنية التحتية" },
              { id: "lead", name: "مدير الفريق التقني" },
            ]}
          >
            {(item) => (
              <ListBoxItem id={item.id} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </Select>
        </Theme>
      </div>

      <div className="field-story-case">
        <h2>German expanding labels</h2>
        <Select
          label="Berechtigungsstufe für Systemverwaltung"
          description="Wählen Sie die entsprechende Zugriffsrichtlinie برای dieses Teammitglied."
          defaultSelectedKey="hauptadministrator"
          items={[
            {
              id: "hauptadministrator",
              name: "Hauptsystemadministrator mit uneingeschränkten Rechten",
            },
            {
              id: "sicherheitsbeauftragter",
              name: "Sicherheitsbeauftragter für Zugriffskontrolle",
            },
          ]}
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.name}>
              {item.name}
            </ListBoxItem>
          )}
        </Select>
      </div>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedSelectExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const persianTrigger = canvas.getByRole("button", { name: /نقش کاربری در سامانه/ });
    await expect(persianTrigger).toBeVisible();

    await userEvent.click(persianTrigger);
    const editorOpt = await waitFor(() =>
      within(document.body).getByRole("option", { name: /ویرایشگر محتوا/ }),
    );
    await userEvent.click(editorOpt);

    await waitFor(async () => {
      await expect(within(persianTrigger).getByText("ویرایشگر محتوا و گردش‌کار")).toBeVisible();
    });
  },
};

function MultipleSelectionExample() {
  const [selected, setSelected] = useState<Key[]>(["admin"]);
  const [limit, setLimit] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const items = reviewerRoles.slice(0, limit);

  const loadMore = () => {
    if (isLoading || limit >= reviewerRoles.length) return;
    setIsLoading(true);
    // Stand-in for the network call a real long list would make.
    setTimeout(() => {
      setLimit((current) => Math.min(current + 8, reviewerRoles.length));
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="field-story-stack">
      <Select.Root
        selectionMode="multiple"
        value={selected}
        onChange={(keys) => setSelected([...keys])}
      >
        <Select.Label>Reviewer roles</Select.Label>
        <Select.Description>
          Search the list, scroll for more, and remove a role with its chip or with Backspace.
        </Select.Description>
        <Select.Trigger>
          <Select.Value>
            {({ selectedItems, state, defaultChildren }: any) => {
              const list = (selectedItems as RoleItem[]).filter(Boolean);
              if (!list.length) return defaultChildren;
              return (
                <span className="hashti-select-chips-wrapper">
                  {list.map((item) => (
                    <span
                      key={item.id}
                      className="hashti-tag hashti-select-chip"
                      data-size="sm"
                      role="presentation"
                    >
                      <span>{item.name}</span>
                      <span
                        aria-hidden="true"
                        className="hashti-select-chip-remove"
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          const keys = new Set(state.selectionManager.selectedKeys);
                          keys.delete(item.id);
                          state.selectionManager.setSelectedKeys(keys);
                        }}
                      >
                        <Icon name="close" size={16} />
                      </span>
                    </span>
                  ))}
                </span>
              );
            }}
          </Select.Value>
          <Icon name="chevronDown" />
        </Select.Trigger>
        <Select.Popover>
          <Autocomplete>
            <SearchField
              aria-label="Search roles"
              placeholder="Search roles..."
              style={{ margin: 4 }}
            />
            <Select.ListBox renderEmptyState={() => "No roles match that search."}>
              {items.map((item) => (
                <ListBoxItem id={item.id} key={item.id} textValue={item.name} value={item}>
                  <Text slot="label">{item.name}</Text>
                  <Text slot="description">{item.description}</Text>
                </ListBoxItem>
              ))}
              <ListBox.LoadMore id="load-more" isLoading={isLoading} label="Loading more roles…" />
            </Select.ListBox>
            <div style={{ padding: 4 }}>
              <Button
                variant="ghost"
                size="sm"
                onPress={loadMore}
                isDisabled={isLoading || limit >= reviewerRoles.length}
              >
                Load more roles
              </Button>
            </div>
          </Autocomplete>
        </Select.Popover>
      </Select.Root>
      <output aria-label="Selected roles">{selected.join(", ") || "none"}</output>
    </div>
  );
}

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Selected roles" });
    const trigger = canvas.getByRole("button", { name: /Reviewer roles/ });

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(document.querySelectorAll(".hashti-select__listbox [role='option']")).toHaveLength(8),
    );

    // The wrapped collection filters on the option's textValue.
    const search = within(document.body).getByPlaceholderText("Search roles...");
    await userEvent.type(search, "audit");
    await waitFor(() =>
      expect(document.querySelectorAll(".hashti-select__listbox [role='option']")).toHaveLength(1),
    );
    await userEvent.clear(search);

    // The load-more path appends the next page and shows the loading row.
    await userEvent.click(within(document.body).getByRole("button", { name: "Load more roles" }));
    await waitFor(() =>
      expect(within(document.body).getByText("Loading more roles…")).toBeInTheDocument(),
    );
    await waitFor(
      () =>
        expect(document.querySelectorAll(".hashti-select__listbox [role='option']")).toHaveLength(
          16,
        ),
      { timeout: 3000 },
    );

    const editor = within(document.body).getByRole("option", { name: /Editor/ });
    await userEvent.click(editor);
    await userEvent.keyboard("{Escape}");
    await waitFor(async () => await expect(output).toHaveTextContent("admin, editor"));

    const chips = trigger.querySelectorAll<HTMLElement>(".hashti-select-chip");
    await expect(chips).toHaveLength(2);
    // The chip remove affordance is pointer-only by construction; the pointer path works.
    await userEvent.click(chips[1]!.querySelector<HTMLElement>(".hashti-select-chip-remove")!);
    await waitFor(async () => await expect(output).toHaveTextContent("admin"));

    // And Backspace, the keyboard path, drops the last remaining chip.
    await trigger.focus();
    await userEvent.keyboard("{Backspace}");
    await waitFor(async () => await expect(output).toHaveTextContent("none"));
  },
};
