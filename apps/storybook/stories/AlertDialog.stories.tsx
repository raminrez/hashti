import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { AlertDialog, Button, Theme } from "@hashti/react";
import "./overlays.css";

const onConfirm = fn();

const meta = {
  title: "Overlays/AlertDialog",
  component: AlertDialog,
  parameters: {
    docs: {
      description: {
        component:
          "AlertDialog wires @ui-sdk/react/alert-dialog: a modal confirmation that never closes on an outside press. `variant` (danger | warning | info) picks the icon and confirm-button treatment; the confirm Close carries value=\"confirm\" and runs its `action` before closing, keeping the dialog open while the action's promise settles.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function AlertDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="overlay-story-stack">
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete Cluster
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="danger"
        title="Delete production cluster?"
        description="This action cannot be undone. All active containers and associated volume storage will be permanently destroyed."
        confirmLabel="Yes, delete cluster"
        cancelLabel="Cancel"
        onConfirm={() => {
          onConfirm();
        }}
      />
    </div>
  );
}

export const Playground: Story = {
  render: () => <AlertDialogDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Delete Cluster" });
    await userEvent.click(trigger);

    const body = within(document.body);
    const dialog = await body.findByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(body.getByText("Delete production cluster?")).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(document.querySelector(".hashti-alert-dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "danger renders the alert icon and a danger confirm button; warning and info render a primary confirm button with their own icons.",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["danger", "warning", "info"] as const).map((variant) => (
        <div key={variant} className="overlay-story-case">
          <h2>{`Variant ${variant}`}</h2>
          <VariantDemo variant={variant} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open warning confirm" }));
    const body = within(document.body);
    const dialog = await body.findByRole("alertdialog");
    expect(
      dialog.querySelector(".hashti-alert-dialog-header")?.getAttribute("data-variant") ?? null,
    ).toBe("warning");
    await userEvent.click(body.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(document.querySelector(".hashti-alert-dialog")).toBeNull());
  },
};

function VariantDemo({ variant }: { variant: "danger" | "warning" | "info" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={variant === "danger" ? "danger" : "secondary"}
        onClick={() => setOpen(true)}
      >
        {`Open ${variant} confirm`}
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        variant={variant}
        title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} confirmation`}
        description="Confirm to continue, or cancel to keep the current state."
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function AlertDialogBackdropDemo({ backdrop }: { backdrop: "dim" | "blur" | "none" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overlay-story-case">
      <Button variant="danger" onClick={() => setOpen(true)}>
        {`Open ${backdrop} alert`}
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        backdrop={backdrop}
        variant="danger"
        title={`Backdrop: ${backdrop}`}
        description="AlertDialog forwards the same backdrop prop as Dialog."
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

export const Backdrops: Story = {
  parameters: {
    docs: {
      description: {
        story: "AlertDialog applies the same backdrop variants as Dialog (dim, blur, none).",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["dim", "blur", "none"] as const).map((backdrop) => (
        <AlertDialogBackdropDemo key={backdrop} backdrop={backdrop} />
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open blur alert" }));
    const body = within(document.body);
    expect(await body.findByRole("alertdialog")).toBeInTheDocument();
    expect(await body.findByText("Backdrop: blur")).toBeInTheDocument();
    const backdrop = document.querySelector<HTMLElement>(".hashti-overlay");
    expect(backdrop?.getAttribute("data-backdrop")).toBe("blur");
    await userEvent.click(body.getByRole("button", { name: "Cancel" }));
  },
};

function AlertDialogRtlDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Theme dir="rtl">
      <div dir="rtl" className="overlay-story-stack">
        <Button variant="danger" onClick={() => setOpen(true)}>
          حذف پایگاه داده
        </Button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="آیا از حذف پایگاه داده اطمینان دارید؟"
          description="این عملیات غیرقابل بازگشت است و تمامی داده‌های مربوط به آن برای همیشه پاک خواهند شد."
          confirmLabel="بله، حذف کن"
          cancelLabel="انصراف"
          onConfirm={() => setOpen(false)}
        />
      </div>
    </Theme>
  );
}

export const RTL: Story = {
  render: () => <AlertDialogRtlDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "حذف پایگاه داده" });
    await userEvent.click(trigger);

    const body = within(document.body);
    const dialog = await body.findByRole("alertdialog");
    expect(getComputedStyle(dialog).direction).toBe("rtl");

    await userEvent.click(body.getByRole("button", { name: "انصراف" }));
    await waitFor(() => expect(document.querySelector(".hashti-alert-dialog")).toBeNull());
  },
};
