import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProgressBar, Meter, Theme, useTheme } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component:
          "ProgressBar and Meter visualize quantifiable data, disk quotas, upload metrics, and asynchronous background operations.",
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">Storage Pool Capacity</h3>
          <p className="feedback-card-description">
            Physical SSD volume utilization across the region.
          </p>
        </div>
        <ProgressBar
          label="Cluster Disk Space"
          value={74}
          valueLabel="74% (3.7 TB / 5.0 TB)"
          helperText="Threshold warning triggers at 85% capacity."
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cluster Disk Space")).toBeInTheDocument();
    expect(canvas.getByText("74% (3.7 TB / 5.0 TB)")).toBeInTheDocument();

    const progress = canvas.getByRole("progressbar", { name: "Cluster Disk Space" });
    expect(progress).toHaveAttribute("aria-valuenow", "74");
  },
};

function StatusVariantsExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Progress Status Variants</h4>
          <p className="feedback-card-description">Active, Success, and Error state indications.</p>
        </div>

        <ProgressBar
          label="Active Job Execution"
          value={45}
          valueLabel="45% complete"
          status="active"
        />

        <ProgressBar
          label="Integrity Verification Completed"
          value={100}
          valueLabel="100% verified"
          status="success"
        />

        <ProgressBar
          label="Cluster Approaching Capacity"
          value={88}
          valueLabel="88% (4.4 TB / 5.0 TB)"
          status="warning"
          helperText="Warning threshold exceeded: auto-scaling recommended."
        />

        <ProgressBar
          label="Container Image Push Failed"
          value={68}
          valueLabel="Failed at layer 7"
          status="error"
          helperText="Connection timed out while writing layer sha256:7b91."
        />
      </div>
    </div>
  );
}

export const StatusVariants: Story = {
  render: () => <StatusVariantsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Active Job Execution")).toBeInTheDocument();
    expect(canvas.getByText("Integrity Verification Completed")).toBeInTheDocument();
    expect(canvas.getByText("Container Image Push Failed")).toBeInTheDocument();
  },
};

function IndeterminateExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Indeterminate Background Processing</h4>
          <p className="feedback-card-description">
            Used when operation duration cannot be predetermined.
          </p>
        </div>
        <ProgressBar
          isIndeterminate
          label="Provisioning virtual cluster instances"
          helperText="Allocating cloud IP addresses and mounting block volumes…"
        />
      </div>
    </div>
  );
}

export const Indeterminate: Story = {
  render: () => <IndeterminateExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Provisioning virtual cluster instances")).toBeInTheDocument();
    const progress = canvas.getByRole("progressbar", {
      name: /Provisioning virtual cluster instances/,
    });
    expect(progress).not.toHaveAttribute("aria-valuenow");
  },
};

function MeterExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Resource Meters</h4>
          <p className="feedback-card-description">Visualizing bounded operational metrics.</p>
        </div>

        <Meter
          label="CPU Core Utilization"
          value={32}
          minValue={0}
          maxValue={64}
          valueLabel="32 of 64 Cores"
        />

        <Meter
          label="RAM Allocation"
          value={18}
          minValue={0}
          maxValue={32}
          valueLabel="18 GB / 32 GB"
        />
      </div>
    </div>
  );
}

export const MeterDisplay: Story = {
  render: () => <MeterExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("CPU Core Utilization")).toBeInTheDocument();
    expect(canvas.getByText("32 of 64 Cores")).toBeInTheDocument();

    const meter = canvas.getByRole("meter", { name: "CPU Core Utilization" });
    expect(meter).toHaveAttribute("aria-valuenow", "32");
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="feedback-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="feedback-card">
          <div>
            <h4 className="feedback-card-title">نمایش پیشرفت و ظرفیت منابع (فارسی)</h4>
            <p className="feedback-card-description">
              نوار پیشرفت و اندازه‌گیری در محیط راست‌به‌چپ
            </p>
          </div>

          <ProgressBar
            label="میزان فضای دیسک مصرفی"
            value={60}
            valueLabel="۶۰ گیگابایت از ۱۰۰ گیگابایت"
            helperText="ظرفیت باقی‌مانده برای ۴ ماه آینده کافی است."
          />

          <Meter
            label="تعداد درخواست‌های همزمان"
            value={750}
            minValue={0}
            maxValue={1000}
            valueLabel="۷۵۰ از ۱۰۰۰ اتصال"
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("نمایش پیشرفت و ظرفیت منابع (فارسی)")).toBeInTheDocument();
    expect(canvas.getByText("میزان فضای دیسک مصرفی")).toBeInTheDocument();
    expect(canvas.getByText("۶۰ گیگابایت از ۱۰۰ گیگابایت")).toBeInTheDocument();
  },
};
