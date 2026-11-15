import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Icon,
  Modal,
  Theme,
  useTheme,
} from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  args: { role: "dialog" },
  argTypes: {
    role: { control: "select", options: ["dialog", "alertdialog"] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Dialog wraps RAC Dialog and supplies heading semantics, the close slot, and the 18px overlay surface. It always renders inside Modal: Modal owns the backdrop, portal, focus trap and Escape order, Dialog owns the reading column. A Heading with slot="title" names the dialog; a Button with slot="close" and a meaningful aria-label is the reachable dismissal.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button>Open dialog</Button>
        <Modal isDismissable>
          <Dialog {...args}>
            {({ close }) => (
              <>
                <Heading slot="title">Workspace settings</Heading>
                <Button
                  slot="close"
                  variant="ghost"
                  size="md"
                  iconOnly
                  aria-label="Close dialog"
                  onPress={close}
                >
                  <Icon name="close" />
                </Button>
                <p>Configure team permissions and shared notification preferences.</p>
                <div className="hashti-dialog-footer">
                  <Button variant="tertiary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={close}>
                    Save changes
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "Workspace settings" }),
    );
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByRole("button", { name: "Close dialog" })).toBeVisible();

    await userEvent.click(within(dialog).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(document.querySelector(".hashti-modal")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Anatomy: Story = {
  render: () => (
    <div className="overlay-story-grid">
      <div className="overlay-story-case">
        <h2>Title, context, actions</h2>
        <DialogTrigger>
          <Button variant="secondary">Full anatomy</Button>
          <Modal size="sm" isDismissable>
            <Dialog>
              {({ close }) => (
                <>
                  <Heading slot="title">Delete environment</Heading>
                  <Button
                    slot="close"
                    variant="ghost"
                    size="md"
                    iconOnly
                    aria-label="Close delete dialog"
                    onPress={close}
                  >
                    <Icon name="close" />
                  </Button>
                  <p>Staging loses its data, logs, and deploy history. Production is untouched.</p>
                  <div className="hashti-dialog-footer">
                    <Button variant="tertiary" onPress={close}>
                      Keep environment
                    </Button>
                    <Button variant="danger" onPress={close}>
                      Delete staging
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      </div>

      <div className="overlay-story-case">
        <h2>Labelled by aria-label</h2>
        <DialogTrigger>
          <Button variant="secondary">No visible title</Button>
          <Modal size="xs" isDismissable>
            <Dialog aria-label="Keyboard shortcuts">
              {({ close }) => (
                <>
                  <p>Press Escape to dismiss. Tab stays inside until the dialog closes.</p>
                  <div className="hashti-dialog-footer">
                    <Button variant="primary" onPress={close}>
                      Got it
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "No visible title" }));
    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "Keyboard shortcuts" }),
    );
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-modal")).toBeNull());
  },
};

export const FocusAndDismissal: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button>Review access request</Button>
        <Modal size="sm" isDismissable>
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Access request</Heading>
                <Button
                  slot="close"
                  variant="ghost"
                  size="md"
                  iconOnly
                  aria-label="Close access request"
                  onPress={close}
                >
                  <Icon name="close" />
                </Button>
                <p>Allow build access for the release pipeline?</p>
                <div className="hashti-dialog-footer">
                  <Button variant="tertiary" onPress={close}>
                    Deny
                  </Button>
                  <Button variant="primary" onPress={close}>
                    Allow
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Review access request" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "Access request" }),
    );
    // Focus enters the dialog and stays inside it.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-modal")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function LocalizedDialog() {
  const { theme } = useTheme();
  const [confirmed, setConfirmed] = useState("");
  return (
    <div className="overlay-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <DialogTrigger>
          <Button>بررسی درخواست دسترسی</Button>
          <Modal size="sm" isDismissable>
            <Dialog>
              {({ close }) => (
                <>
                  <Heading slot="title">درخواست دسترسی</Heading>
                  <Button
                    slot="close"
                    variant="ghost"
                    size="md"
                    iconOnly
                    aria-label="بستن پنجره"
                    onPress={close}
                  >
                    <Icon name="close" />
                  </Button>
                  <p>آیا دسترسی ساخت برای خط انتشار تأیید می‌شود؟</p>
                  <div className="hashti-dialog-footer">
                    <Button variant="tertiary" onPress={close}>
                      رد درخواست
                    </Button>
                    <Button
                      variant="primary"
                      onPress={() => {
                        setConfirmed("تأیید شد");
                        close();
                      }}
                    >
                      تأیید دسترسی
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
        <output aria-label="نتیجه بررسی">{confirmed || "در انتظار بررسی."}</output>
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: () => <LocalizedDialog />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "بررسی درخواست دسترسی" });
    await userEvent.click(trigger);
    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "درخواست دسترسی" }),
    );
    await expect(getComputedStyle(dialog).direction).toBe("rtl");
    await userEvent.click(within(dialog).getByRole("button", { name: "تأیید دسترسی" }));
    await waitFor(() => expect(document.querySelector(".hashti-modal")).toBeNull());
    await expect(canvas.getByRole("status", { name: "نتیجه بررسی" })).toHaveTextContent("تأیید شد");
  },
};
