import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ToastProvider, useToast, Button, Theme, useTheme } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/Toast",
  component: ToastProvider,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          "ToastProvider and useToast display ephemeral floating notifications for asynchronous operational feedback.",
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastTriggerButtons() {
  const toast = useToast();

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button
        variant="primary"
        onClick={() =>
          toast.add({
            title: "Build succeeded",
            description: "Artifacts deployed to 8 edge regions.",
            status: "success",
          })
        }
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Cluster high memory warning",
            description: "Node worker-04 memory threshold at 87%.",
            status: "warning",
          })
        }
      >
        Trigger Warning Toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.add({
            title: "Service connection failed",
            description: "Timeout connecting to remote database.",
            status: "error",
          })
        }
      >
        Trigger Error Toast
      </Button>
    </div>
  );
}

function PlaygroundExample() {
  return (
    <ToastProvider>
      <div className="feedback-story-stack">
        <div className="feedback-card">
          <div>
            <h3 className="feedback-card-title">Toast Feedback Notifications</h3>
            <p className="feedback-card-description">
              Click the action triggers below to dispatch toast messages into the queue.
            </p>
          </div>
          <ToastTriggerButtons />
        </div>
      </div>
    </ToastProvider>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const successBtn = canvas.getByRole("button", { name: "Trigger Success Toast" });
    expect(successBtn).toBeInTheDocument();
    await userEvent.click(successBtn);

    const toastTitle = await within(document.body).findByText("Build succeeded");
    expect(toastTitle).toBeInTheDocument();
  },
};

function FaToastButtons() {
  const toast = useToast();

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button
        variant="primary"
        onClick={() =>
          toast.add({
            title: "بارگذاری با موفقیت انجام شد",
            description: "تمام داده‌ها در حافظه پایدار ثبت شدند.",
            status: "success",
          })
        }
      >
        ارسال اعلان موفقیت
      </Button>
    </div>
  );
}

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <Theme theme={theme} lang="fa-IR" dir="rtl">
      <ToastProvider>
        <div dir="rtl" className="feedback-story-stack">
          <div className="feedback-card">
            <div>
              <h4 className="feedback-card-title">اعلان‌های شناور فارسی</h4>
              <p className="feedback-card-description">
                نمایش پیام‌های عملیاتی در گوشه صفحه با چینش راست‌به‌چپ
              </p>
            </div>
            <FaToastButtons />
          </div>
        </div>
      </ToastProvider>
    </Theme>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "ارسال اعلان موفقیت" });
    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);

    const toastTitle = await within(document.body).findByText("بارگذاری با موفقیت انجام شد");
    expect(toastTitle).toBeInTheDocument();
  },
};

function VariantsExample() {
  const toast = useToast();

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Subtle toast notification",
            description: "Soft surface with muted borders.",
            status: "info",
            variant: "subtle",
          })
        }
      >
        Subtle Toast
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          toast.add({
            title: "Solid toast notification",
            description: "High-emphasis saturated fill.",
            status: "success",
            variant: "solid",
          })
        }
      >
        Solid Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Bordered toast notification",
            description: "Clean outlined card presentation.",
            status: "warning",
            variant: "bordered",
          })
        }
      >
        Bordered Toast
      </Button>
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <ToastProvider>
      <VariantsExample />
    </ToastProvider>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Solid Toast" });
    await userEvent.click(trigger);

    const body = within(document.body);
    expect(await body.findByText("Solid toast notification")).toBeInTheDocument();
  },
};
