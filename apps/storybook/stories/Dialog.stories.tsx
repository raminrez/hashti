import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button, Dialog, DialogClose, Icon, Theme, useTheme } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          "Dialog wraps @ui-sdk/react/dialog: a focused window over the page with focus trap, Escape and outside-press dismissal, and return focus to the trigger. The RAC-era Modal folded into it — Dialog.Backdrop is the scrim (backdrop: dim | blur | none on the root), Dialog.Content is the surface (size: xs | sm | md | lg). DialogTitle names the dialog; DialogClose parts dismiss it.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Dialog>
        <Dialog.Trigger render={<Button>Open dialog</Button>} />
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Title>Workspace settings</Dialog.Title>
          <Dialog.Description>
            Configure team permissions and shared notification preferences.
          </Dialog.Description>
          <div className="hashti-dialog-footer">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <DialogClose render={<Button variant="primary">Save changes</Button>} />
          </div>
          <DialogClose aria-label="Close dialog" render={<Button variant="ghost" iconOnly />}>
            <Icon name="close" />
          </DialogClose>
        </Dialog.Content>
      </Dialog>
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
    await waitFor(() => expect(document.querySelector(".hashti-dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Dialog.Content takes the size scale the deleted Modal owned: xs, sm, md (default), lg. The stylesheet caps the inline size per data-size.",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="overlay-story-case">
          <h2>Size {size.toUpperCase()}</h2>
          <Dialog>
            <Dialog.Trigger
              render={<Button variant="secondary">{`Open ${size} dialog`}</Button>}
            />
            <Dialog.Backdrop />
            <Dialog.Content size={size}>
              <Dialog.Title>{`Dialog size: ${size.toUpperCase()}`}</Dialog.Title>
              <Dialog.Description>
                The content carries <code>{`data-size="${size}"`}</code>.
              </Dialog.Description>
              <div className="hashti-dialog-footer">
                <DialogClose render={<Button variant="primary">Close</Button>} />
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open md dialog" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('.hashti-dialog[data-size="md"]');
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(document.querySelector(".hashti-dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Backdrops: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The root's backdrop prop styles Dialog.Backdrop: dim (the DESIGN scrim), blur (adds a 6px blur), or none (for surfaces that carry their own scrim).",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["dim", "blur", "none"] as const).map((backdrop) => (
        <div key={backdrop} className="overlay-story-case">
          <h2>{`Backdrop ${backdrop}`}</h2>
          <Dialog backdrop={backdrop}>
            <Dialog.Trigger
              render={<Button variant="secondary">{`Open ${backdrop} dialog`}</Button>}
            />
            <Dialog.Backdrop />
            <Dialog.Content size="sm">
              <Dialog.Title>{`Backdrop: ${backdrop}`}</Dialog.Title>
              <Dialog.Description>
                The backdrop carries <code>{`data-backdrop="${backdrop}"`}</code>.
              </Dialog.Description>
              <div className="hashti-dialog-footer">
                <DialogClose render={<Button variant="primary">Close</Button>} />
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open blur dialog" }));
    const backdrop = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-overlay");
      expect(el).not.toBeNull();
      return el!;
    });
    expect(backdrop.getAttribute("data-backdrop")).toBe("blur");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-dialog")).toBeNull());
  },
};

export const FocusAndDismissal: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Dialog>
        <Dialog.Trigger render={<Button>Review access request</Button>} />
        <Dialog.Backdrop />
        <Dialog.Content size="sm">
          <Dialog.Title>Access request</Dialog.Title>
          <Dialog.Description>Allow build access for the release pipeline?</Dialog.Description>
          <div className="hashti-dialog-footer">
            <DialogClose render={<Button variant="outline">Deny</Button>} />
            <DialogClose render={<Button variant="primary">Allow</Button>} />
          </div>
        </Dialog.Content>
      </Dialog>
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
    await waitFor(() => expect(document.querySelector(".hashti-dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function LocalizedDialog() {
  const { theme } = useTheme();
  const [confirmed, setConfirmed] = useState("");
  return (
    <div className="overlay-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <Dialog>
          <Dialog.Trigger render={<Button>بررسی درخواست دسترسی</Button>} />
          <Dialog.Backdrop />
          <Dialog.Content size="sm">
            <Dialog.Title>درخواست دسترسی</Dialog.Title>
            <Dialog.Description>
              آیا دسترسی ساخت برای خط انتشار تأیید می‌شود؟
            </Dialog.Description>
            <div className="hashti-dialog-footer">
              <DialogClose render={<Button variant="outline">رد درخواست</Button>} />
              <DialogClose
                action={() => setConfirmed("تأیید شد")}
                render={<Button variant="primary">تأیید دسترسی</Button>}
              />
            </div>
          </Dialog.Content>
        </Dialog>
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
    await waitFor(() => expect(document.querySelector(".hashti-dialog")).toBeNull());
    await expect(canvas.getByRole("status", { name: "نتیجه بررسی" })).toHaveTextContent("تأیید شد");
  },
};
