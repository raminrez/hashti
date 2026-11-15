import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Loading, InlineLoading, Skeleton, Theme, useTheme } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/Loading",
  component: Loading,
  parameters: {
    docs: {
      description: {
        component:
          "Loading, InlineLoading, and Skeleton components inform users of background asynchronous operations, state changes, and content layout placeholders. The spinner follows the surface: it is painted with `currentColor`, so it takes the surrounding text colour — secondary ink by default, on-colour ink inside a filled button or banner. There is deliberately no `tone` prop; set `color` on the parent instead.",
      },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">Asynchronous Loading Indicators</h3>
          <p className="feedback-card-description">
            Circular spinners and inline text loading cues.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Large Spinner
            </span>
            <Loading size="lg" label="Synchronizing cloud resources" />
          </div>

          <div>
            <span
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Small Spinner
            </span>
            <Loading size="sm" label="Fetching data" />
          </div>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}
        >
          <InlineLoading status="active">Deploying changes to worker nodes…</InlineLoading>
          <InlineLoading status="success">Deployment finished successfully</InlineLoading>
          <InlineLoading status="error">Build process encountered an error</InlineLoading>
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Synchronizing cloud resources")).toBeInTheDocument();
    expect(canvas.getByText("Deploying changes to worker nodes…")).toBeInTheDocument();
    expect(canvas.getByText("Deployment finished successfully")).toBeInTheDocument();
  },
};

function SpinnerFollowsInkExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Spinner Ink Follows the Surface</h4>
          <p className="feedback-card-description">
            The spinner is drawn with currentColor, so every surface gets the right contrast without
            a tone prop: secondary ink on a plain surface, on-colour ink on a filled banner.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "var(--hashti-text-primary)",
            }}
          >
            <Loading size="sm" label="Loading with primary ink" />
            <span>Primary surface ink</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--hashti-control-radius)",
              background: "var(--hashti-button-primary)",
              color: "var(--hashti-text-on-color)",
            }}
          >
            <Loading size="sm" label="Loading with on-colour ink" />
            <span>On-colour fill</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SpinnerFollowsInk: Story = {
  render: () => <SpinnerFollowsInkExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Spinner Ink Follows the Surface")).toBeInTheDocument();
    expect(canvas.getByText("On-colour fill")).toBeInTheDocument();
  },
};

function SkeletonLoadersExample() {
  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Content Placeholder Skeletons</h4>
          <p className="feedback-card-description">
            Low-fidelity layout mocks during initial resource fetching.
          </p>
        </div>

        {/* Card skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Skeleton height="1.5rem" width="40%" />
          <Skeleton lines={3} height="0.875rem" />
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <Skeleton height="2rem" width="6rem" />
            <Skeleton height="2rem" width="6rem" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const SkeletonLoaders: Story = {
  render: () => <SkeletonLoadersExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Content Placeholder Skeletons")).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="feedback-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="feedback-card">
          <div>
            <h4 className="feedback-card-title">نشانگرهای بارگذاری به زبان فارسی</h4>
            <p className="feedback-card-description">
              نمایش وضعیت عملیات‌های در حال اجرا در محیط راست‌به‌چپ
            </p>
          </div>

          <InlineLoading status="active">در حال دریافت اطلاعات از سرور مرکزی…</InlineLoading>
          <InlineLoading status="success">
            اطلاعات حساب کاربری با موفقیت به‌روزرسانی شد
          </InlineLoading>
          <InlineLoading status="error">خطا در بارگذاری داده‌ها</InlineLoading>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("نشانگرهای بارگذاری به زبان فارسی")).toBeInTheDocument();
    expect(canvas.getByText("در حال دریافت اطلاعات از سرور مرکزی…")).toBeInTheDocument();
  },
};
