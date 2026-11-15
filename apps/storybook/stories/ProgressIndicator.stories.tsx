import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ProgressIndicator, Theme, useTheme, type ProgressStep } from "@hashti/react";
import "./content.css";

const defaultSteps: ProgressStep[] = [
  {
    id: "step-1",
    label: "Cluster Spec",
    description: "Select compute tier and region",
    status: "complete",
  },
  {
    id: "step-2",
    label: "Networking",
    description: "Configure VPC and subnet ingress",
    status: "current",
  },
  {
    id: "step-3",
    label: "Security & Keys",
    description: "Upload SSH keys and TLS certs",
    status: "incomplete",
  },
  {
    id: "step-4",
    label: "Review & Deploy",
    description: "Verify plan and launch instances",
    status: "incomplete",
  },
];

const meta = {
  title: "Navigation/ProgressIndicator",
  component: ProgressIndicator,
  args: {
    steps: defaultSteps,
  },
  parameters: {
    docs: {
      description: {
        component:
          "ProgressIndicator guides users through multi-step workflows, wizards, and linear provisioning processes with clear completion markers and accessibility status announcements.",
      },
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h3 className="content-card-title">Provisioning Pipeline Flow</h3>
          <p className="content-card-description">
            Current provisioning workflow status across infrastructure checkpoints.
          </p>
        </div>
        <ProgressIndicator aria-label="Infrastructure provisioning pipeline" steps={defaultSteps} />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("list", { name: "Infrastructure provisioning pipeline" });
    expect(nav).toBeInTheDocument();

    const currentStep = canvas.getByRole("listitem", { current: "step" });
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveTextContent("Networking");
    expect(currentStep).toHaveTextContent("Configure VPC and subnet ingress");
  },
};

function InteractiveStepsExample() {
  const [currentStepId, setCurrentStepId] = useState("step-2");

  const steps: ProgressStep[] = [
    {
      id: "step-1",
      label: "Account Setup",
      description: "Organization credentials verified",
      status: currentStepId === "step-1" ? "current" : "complete",
    },
    {
      id: "step-2",
      label: "Domain Mapping",
      description: "DNS records validation",
      status:
        currentStepId === "step-2"
          ? "current"
          : currentStepId === "step-3"
            ? "complete"
            : "incomplete",
    },
    {
      id: "step-3",
      label: "SSL Certificate",
      description: "Automated ACME challenge",
      status: currentStepId === "step-3" ? "current" : "incomplete",
    },
  ];

  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 className="content-card-title">Interactive Wizard Steps</h4>
            <p className="content-card-description">
              Click any step to jump directly to that configuration section.
            </p>
          </div>
          <span
            style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--hashti-interactive)" }}
          >
            Active: {steps.find((s) => s.id === currentStepId)?.label}
          </span>
        </div>
        <ProgressIndicator
          aria-label="Interactive wizard navigation"
          steps={steps}
          onStepChange={setCurrentStepId}
        />
      </div>
    </div>
  );
}

export const InteractiveSteps: Story = {
  render: () => <InteractiveStepsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Active: Domain Mapping")).toBeInTheDocument();

    const sslButton = canvas.getByRole("button", { name: "SSL Certificate" });
    expect(sslButton).toBeInTheDocument();
    await userEvent.click(sslButton);

    expect(canvas.getByText("Active: SSL Certificate")).toBeInTheDocument();
    const activeStep = canvas.getByRole("listitem", { current: "step" });
    expect(activeStep).toHaveTextContent("SSL Certificate");
  },
};

function VerticalOrientationExample() {
  const verticalSteps: ProgressStep[] = [
    {
      id: "v-1",
      label: "Source Code Ingestion",
      description: "Fetched 1,482 files from main branch repository",
      status: "complete",
    },
    {
      id: "v-2",
      label: "Security & Secret Audit",
      description: "Scanned for leaked API tokens and private keys",
      status: "complete",
    },
    {
      id: "v-3",
      label: "Container Build",
      description: "Generating lightweight OCI image layer",
      status: "current",
    },
    {
      id: "v-4",
      label: "Cluster Rollout",
      description: "Rolling restart across 8 production nodes",
      status: "incomplete",
    },
  ];

  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Vertical Build Pipeline</h4>
          <p className="content-card-description">
            Hierarchical timeline view of sequential automated tasks.
          </p>
        </div>
        <ProgressIndicator
          aria-label="Vertical build pipeline"
          orientation="vertical"
          steps={verticalSteps}
        />
      </div>
    </div>
  );
}

export const VerticalOrientation: Story = {
  render: () => <VerticalOrientationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("list", { name: "Vertical build pipeline" });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("data-orientation", "vertical");

    const currentItem = canvas.getByRole("listitem", { current: "step" });
    expect(currentItem).toHaveTextContent("Container Build");
    expect(currentItem).toHaveTextContent("Generating lightweight OCI image layer");
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  const persianSteps: ProgressStep[] = [
    {
      id: "fa-1",
      label: "ثبت اطلاعات شرکت",
      description: "تکمیل مشخصات حقوقی و کد اقتصادی",
      status: "complete",
    },
    {
      id: "fa-2",
      label: "احراز هویت مدیران",
      description: "بررسی مدارک هویتی و ثبت امضای دیجیتال",
      status: "current",
    },
    {
      id: "fa-3",
      label: "صدور مجوز دسترسی",
      description: "تخصیص نقش‌ها و کلیدهای امنیتی سرور",
      status: "incomplete",
    },
    {
      id: "fa-4",
      label: "راه‌اندازی نهایی",
      description: "فعال‌سازی سرویس در کلاستر ابری",
      status: "incomplete",
    },
  ];

  return (
    <div className="content-story-stack">
      {/* Persian RTL Progress */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="content-card">
          <div>
            <h4 className="content-card-title">مراحل ثبت و راه‌اندازی حساب سازمانی</h4>
            <p className="content-card-description">
              پیگیری پیشرفت مراحل احراز هویت در محیط راست‌به‌چپ
            </p>
          </div>
          <ProgressIndicator aria-label="مراحل ثبت‌نام سازمانی" steps={persianSteps} />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("مراحل ثبت و راه‌اندازی حساب سازمانی")).toBeInTheDocument();

    const currentStep = canvas.getByRole("listitem", { current: "step" });
    expect(currentStep).toHaveTextContent("احراز هویت مدیران");
    expect(currentStep).toHaveTextContent("بررسی مدارک هویتی و ثبت امضای دیجیتال");
  },
};
