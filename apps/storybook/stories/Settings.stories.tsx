import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  Form,
  Icon,
  NumberInput,
  Select,
  Switch,
  TextArea,
  Input,
  Theme,
  useTheme,
} from "@hashti/react";
import "./settings.css";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Compositions/Settings",
  parameters: {
    docs: {
      description: {
        component:
          "Composite multi-control task flows using Hashti's Frame-styled components. Demonstrates settings layouts, form validation and draft recovery, dependent field controls (Switch enabling Checkbox), nested review modals, and RTL localization.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface WorkspaceSettingsData {
  name: string;
  email: string;
  reviewer: string;
  limit: number;
  digest: boolean;
  completed: boolean;
}

const initialSettings: WorkspaceSettingsData = {
  name: "Hashti Studio",
  email: "team@hashti.example",
  reviewer: "elena",
  limit: 8,
  digest: true,
  completed: false,
};

const reviewers = [
  { value: "elena", label: "Elena Rostova" },
  { value: "marcus", label: "Marcus Chen" },
  { value: "sophia", label: "Sophia Patel" },
];

function SettingsForm({
  initialData = initialSettings,
  failFirstAttempt = false,
}: {
  initialData?: WorkspaceSettingsData;
  failFirstAttempt?: boolean;
}) {
  const [settings, setSettings] = useState<WorkspaceSettingsData>(initialData);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [attempt, setAttempt] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveState("saving");
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    setTimeout(() => {
      if (failFirstAttempt && nextAttempt === 1) {
        setSaveState("error");
      } else {
        setSaveState("saved");
      }
    }, 150);
  };

  return (
    <div className="settings-story-container">
      <div className="settings-layout">
        <Form className="workspace-form" onSubmit={handleSubmit}>
          <fieldset disabled={saveState === "saving"}>
            <section className="settings-section">
              <div className="settings-section-copy">
                <h2>Workspace details</h2>
                <p>Use a name your team recognizes and an address that can receive replies.</p>
              </div>
              <div className="settings-fields">
                <Input
                  required
                  label="Workspace name"
                  name="workspaceName"
                  value={settings.name}
                  onValueChange={(name) => {
                    setSettings((s) => ({ ...s, name }));
                    setSaveState("idle");
                  }}
                  description="This name appears in review invitations."
                  errorMessage="Enter a workspace name."
                />
                <Input
                  required
                  type="email"
                  label="Reply-to email"
                  name="replyTo"
                  value={settings.email}
                  onValueChange={(email) => {
                    setSettings((s) => ({ ...s, email }));
                    setSaveState("idle");
                  }}
                  description="Replies to review summaries go to this address."
                  errorMessage="Enter a valid email address."
                />
                <Input
                  readOnly
                  label="Workspace ID"
                  value="hashti-studio-demo"
                  description="This identifier stays fixed when you rename the workspace."
                />
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-section-copy">
                <h2>Review defaults</h2>
                <p>
                  Set the starting reviewer and the maximum review limit each person can handle
                  daily.
                </p>
              </div>
              <div className="settings-fields settings-fields-pair">
                <Select
                  label="Default reviewer"
                  value={settings.reviewer}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setSettings((s) => ({ ...s, reviewer: value }));
                      setSaveState("idle");
                    }
                  }}
                  description="Applies to new review assignments."
                  items={reviewers}
                />
                <NumberInput
                  required
                  min={1}
                  max={24}
                  label="Daily review limit"
                  name="reviewLimit"
                  value={settings.limit}
                  onValueChange={(limit) => {
                    setSettings((s) => ({ ...s, limit: limit ?? s.limit }));
                    setSaveState("idle");
                  }}
                  description="Allow 1 to 24 reviews per person."
                  errorMessage="Enter a number from 1 to 24."
                />
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-section-copy">
                <h2>Review summary</h2>
                <p>Send one daily email with the checks that still need attention.</p>
              </div>
              <div className="settings-fields">
                <Switch
                  checked={settings.digest}
                  onCheckedChange={(digest) => {
                    setSettings((s) => ({
                      ...s,
                      digest,
                      completed: digest ? s.completed : false,
                    }));
                    setSaveState("idle");
                  }}
                >
                  Send a daily review summary
                </Switch>
                <Checkbox
                  checked={settings.completed}
                  onCheckedChange={(completed) => {
                    setSettings((s) => ({ ...s, completed: completed === true }));
                    setSaveState("idle");
                  }}
                  disabled={!settings.digest}
                >
                  Include reviews that are already ready
                </Checkbox>
              </div>
            </section>
          </fieldset>

          {saveState === "error" && (
            <div className="save-feedback" role="alert">
              <Icon name="error" />
              <div>
                <strong>Changes could not be saved.</strong>
                <p>
                  The review service was temporarily unavailable. Your entries remain in the form.
                  Try saving again.
                </p>
              </div>
            </div>
          )}

          <div className="settings-save" data-state={saveState}>
            <span role="status">
              {saveState === "saved" && <Icon name="check" />}
              {saveState === "saved"
                ? "Changes saved in this demo."
                : saveState === "saving"
                  ? "Saving your changes..."
                  : saveState === "error"
                    ? "Failed to save changes."
                    : "Ready to save."}
            </span>
            <Button type="submit" disabled={saveState === "saving"}>
              Save changes
            </Button>
          </div>
        </Form>

        <aside className="summary-preview" aria-labelledby="summary-preview-heading">
          <h2 id="summary-preview-heading">Live summary</h2>
          <dl>
            <div>
              <dt>Workspace</dt>
              <dd>{settings.name || "None"}</dd>
            </div>
            <div>
              <dt>Reply address</dt>
              <dd>{settings.email || "None"}</dd>
            </div>
            <div>
              <dt>Reviewer</dt>
              <dd>{reviewers.find((r) => r.value === settings.reviewer)?.label}</dd>
            </div>
            <div>
              <dt>Daily capacity</dt>
              <dd>{settings.limit} reviews</dd>
            </div>
            <div>
              <dt>Daily digest</dt>
              <dd>{settings.digest ? "Active" : "Disabled"}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export const WorkspaceSettings: Story = {
  render: () => <SettingsForm />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const nameInput = canvas.getByRole("textbox", { name: /Workspace name/ });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Hashti Production");
    expect(nameInput).toHaveValue("Hashti Production");

    const digestSwitch = canvas.getByRole("switch", { name: "Send a daily review summary" });
    const completedBox = canvas.getByRole("checkbox", {
      name: "Include reviews that are already ready",
    });
    expect(completedBox).not.toBeDisabled();

    // Turning off switch disables the completed checkbox
    await userEvent.click(digestSwitch);
    expect(completedBox).toBeDisabled();

    // Turn back on
    await userEvent.click(digestSwitch);
    expect(completedBox).not.toBeDisabled();

    // Submit form
    const saveButton = canvas.getByRole("button", { name: "Save changes" });
    await userEvent.click(saveButton);

    const statusText = await canvas.findByRole("status");
    await waitFor(() => {
      expect(statusText).toHaveTextContent("Changes saved in this demo.");
    });
  },
};

export const SaveAndRetry: Story = {
  render: () => <SettingsForm failFirstAttempt />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const saveButton = canvas.getByRole("button", { name: "Save changes" });
    await userEvent.click(saveButton);

    const errorAlert = await canvas.findByRole("alert");
    await waitFor(() => expect(errorAlert).toBeVisible());
    expect(errorAlert).toHaveTextContent("Changes could not be saved.");

    // Entries are preserved
    const nameInput = canvas.getByRole("textbox", { name: /Workspace name/ });
    expect(nameInput).toHaveValue("Hashti Studio");

    // Retry save
    await userEvent.click(saveButton);
    const statusText = await canvas.findByRole("status");
    await waitFor(() => {
      expect(statusText).toHaveTextContent("Changes saved in this demo.");
    });
    expect(canvas.queryByRole("alert")).toBeNull();
  },
};

function NestedReviewDialogExample() {
  const [reviewNote, setReviewNote] = useState("Draft verification pending approval.");
  const [status, setStatus] = useState("approved");

  return (
    <div className="overlay-story-stack">
      <Dialog>
        <Dialog.Trigger render={<Button>Open review task</Button>} />
        <Dialog.Backdrop />
        <Dialog.Content size="md">
          <Dialog.Title>Review submission CDR-101</Dialog.Title>
          <DialogClose
            aria-label="Close task dialog"
            render={<Button variant="ghost" size="md" iconOnly />}
          >
            <Icon name="close" />
          </DialogClose>
          <p>Complete the review checklist before marking approved.</p>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            style={{ display: "grid", gap: "1rem" }}
          >
            <Select
              label="Decision"
              value={status}
              onValueChange={(value) => setStatus(value as string)}
              items={[
                { value: "approved", label: "Approved" },
                { value: "changes_requested", label: "Changes requested" },
                { value: "rejected", label: "Rejected" },
              ]}
            />

            <TextArea
              label="Review notes"
              value={reviewNote}
              onValueChange={setReviewNote}
              rows={3}
            />

            <div className="hashti-dialog-footer">
              <Dialog>
                <Dialog.Trigger render={<Button variant="outline">Discard changes</Button>} />
                <Dialog.Backdrop />
                <Dialog.Content size="xs">
                  <Dialog.Title>Discard changes?</Dialog.Title>
                  <Dialog.Description>
                    All unsaved modifications to this review will be lost.
                  </Dialog.Description>
                  <div className="hashti-dialog-footer">
                    <DialogClose render={<Button variant="ghost">Keep editing</Button>} />
                    <DialogClose
                      render={<Button variant="danger">Discard</Button>}
                      action={() => setReviewNote("")}
                    />
                  </div>
                </Dialog.Content>
              </Dialog>
              <Button type="submit">Submit decision</Button>
            </div>
          </Form>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export const NestedReviewDialog: Story = {
  render: () => <NestedReviewDialogExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open review task" });
    await userEvent.click(trigger);

    const taskModal = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('.hashti-dialog[data-size="md"]');
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(taskModal).toBeVisible());

    // Click Discard changes to open nested dialog
    const discardTrigger = within(taskModal).getByRole("button", { name: "Discard changes" });
    await userEvent.click(discardTrigger);

    const confirmModal = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('.hashti-dialog[data-size="xs"]');
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(confirmModal).toBeVisible());

    // Press Escape to dismiss nested modal first
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector('.hashti-dialog[data-size="xs"]')).toBeNull();
    });

    // Parent task modal is still open
    await waitFor(() => expect(taskModal).toBeVisible());

    // Close main modal
    const closeBtn = within(taskModal).getByRole("button", { name: "Close task dialog" });
    await userEvent.click(closeBtn);
    await waitFor(() => {
      expect(document.querySelector('.hashti-dialog[data-size="md"]')).toBeNull();
    });
    expect(trigger).toHaveFocus();
  },
};

function LocalizedSettings() {
  const { theme } = useTheme();
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <SettingsForm
            initialData={{
              name: "کارگاه استودیو",
              email: "contact@hashti.ir",
              reviewer: "elena",
              limit: 5,
              digest: true,
              completed: true,
            }}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedSettings />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { name: "Workspace details" });
    await waitFor(() => expect(heading).toBeVisible());

    const nameInput = canvas.getByRole("textbox", { name: /Workspace name/ });
    expect(nameInput).toHaveValue("کارگاه استودیو");
  },
};
