import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { InlineNotification, Button, Theme, useTheme } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/InlineNotification",
  component: InlineNotification,
  args: {
    title: "Notification title",
  },
  parameters: {
    docs: {
      description: {
        component:
          "InlineNotification communicates essential task status, system messages, warnings, and error conditions directly within page context.",
      },
    },
  },
} satisfies Meta<typeof InlineNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">System Status Feedback</h3>
          <p className="feedback-card-description">
            Operational alerts and user task completion feedback.
          </p>
        </div>
        {!dismissed ? (
          <InlineNotification
            kind="success"
            title="Cluster provisioned successfully"
            onDismiss={() => setDismissed(true)}
          >
            All 16 worker nodes are ready and accepting incoming traffic on port 443.
          </InlineNotification>
        ) : (
          <Button variant="secondary" size="sm" onPress={() => setDismissed(false)}>
            Reopen notification
          </Button>
        )}
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cluster provisioned successfully")).toBeInTheDocument();

    const dismissBtn = canvas.getByRole("button", { name: "Dismiss notification" });
    expect(dismissBtn).toBeInTheDocument();
    await userEvent.click(dismissBtn);

    expect(canvas.queryByText("Cluster provisioned successfully")).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Reopen notification" })).toBeInTheDocument();
  },
};

function AllKindsExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Notification Severity Variants</h4>
          <p className="feedback-card-description">
            Information, warning, error, and success states.
          </p>
        </div>

        <InlineNotification kind="info" title="Scheduled Maintenance Window">
          Telemetry cluster will experience intermittent connectivity between 02:00 and 04:00 UTC.
        </InlineNotification>

        <InlineNotification kind="success" title="Backup Created">
          Database snapshot snapshot-2026-11-09-01 completed and stored in multi-region cold
          storage.
        </InlineNotification>

        <InlineNotification kind="warning" title="Memory Utilization Threshold Exceeded">
          Service ingress-router is running at 88% memory capacity. Consider adding additional
          replicas.
        </InlineNotification>

        <InlineNotification kind="error" title="Certificate Expiration Imminent">
          TLS wildcard certificate expires in 3 days. Automated renewal webhook failed with status
          503.
        </InlineNotification>
      </div>
    </div>
  );
}

export const AllKinds: Story = {
  render: () => <AllKindsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Scheduled Maintenance Window")).toBeInTheDocument();
    expect(canvas.getByText("Backup Created")).toBeInTheDocument();
    expect(canvas.getByText("Memory Utilization Threshold Exceeded")).toBeInTheDocument();
    expect(canvas.getByText("Certificate Expiration Imminent")).toBeInTheDocument();
  },
};

function WithActionExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Notification with In-Context Action</h4>
          <p className="feedback-card-description">Prompting user resolution or immediate undo.</p>
        </div>

        <InlineNotification
          kind="warning"
          title="API Rate Limit Approaching"
          action={
            <div style={{ marginTop: "0.5rem" }}>
              <Button variant="tertiary" size="sm">
                Upgrade Quota
              </Button>
            </div>
          }
        >
          Your current tier is at 94% of allowed monthly request volume.
        </InlineNotification>
      </div>
    </div>
  );
}

export const WithAction: Story = {
  render: () => <WithActionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("API Rate Limit Approaching")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Upgrade Quota" })).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="feedback-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="feedback-card">
          <div>
            <h4 className="feedback-card-title">اعلان‌های وضعیت سیستم (فارسی)</h4>
            <p className="feedback-card-description">
              نمایش انواع پیام‌های سیستمی در قالب راست‌به‌چپ
            </p>
          </div>

          <InlineNotification kind="success" title="تراکنش با موفقیت ثبت شد">
            رسید پرداخت به شماره پیگیری ۹۸۴۱۷۲۸ صادر گردید.
          </InlineNotification>

          <InlineNotification kind="error" title="خطا در اتصال به پایگاه داده">
            زمان پاسخ‌دهی سرور بیش از حد مجاز بوده است. لطفاً ارتباط شبکه را بررسی نمایید.
          </InlineNotification>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("اعلان‌های وضعیت سیستم (فارسی)")).toBeInTheDocument();
    expect(canvas.getByText("تراکنش با موفقیت ثبت شد")).toBeInTheDocument();
    expect(canvas.getByText("خطا در اتصال به پایگاه داده")).toBeInTheDocument();
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Subtle</h4>
        <InlineNotification variant="subtle" kind="info" title="Subtle notification">
          Standard operational message with muted background.
        </InlineNotification>
      </div>
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Solid</h4>
        <InlineNotification variant="solid" kind="success" title="Solid notification">
          High-emphasis status with saturated solid background.
        </InlineNotification>
      </div>
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Bordered</h4>
        <InlineNotification variant="bordered" kind="warning" title="Bordered notification">
          Clean card with semantic colored border outline.
        </InlineNotification>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Subtle notification")).toBeInTheDocument();
    expect(canvas.getByText("Solid notification")).toBeInTheDocument();
    expect(canvas.getByText("Bordered notification")).toBeInTheDocument();
  },
};
