import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SideNav, Link, Icon, Theme, useTheme } from "@hashti/react";
import "./layout.css";

const meta = {
  title: "Navigation/SideNav",
  component: SideNav,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          "SideNav provides structured vertical hierarchical navigation for complex dashboards, suites, and documentation pages.",
      },
    },
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="layout-story-stack">
      <div className="layout-card">
        <div>
          <h3 className="layout-card-title">Vertical SideNav</h3>
          <p className="layout-card-description">
            Sidebar panel navigation with active indicator and icons.
          </p>
        </div>
        <div className="layout-shell-preview">
          <SideNav aria-label="Sidebar navigation">
            <Link href="#overview" aria-current="page">
              <Icon name="code" size={16} />
              <span>System Overview</span>
            </Link>
            <Link href="#nodes">
              <Icon name="folder" size={16} />
              <span>Kubernetes Nodes</span>
            </Link>
            <Link href="#storage">
              <Icon name="file" size={16} />
              <span>Persistent Volumes</span>
            </Link>
            <Link href="#security">
              <Icon name="settings" size={16} />
              <span>Certificates & Keys</span>
            </Link>
            <Link href="#audit">
              <Icon name="calendar" size={16} />
              <span>Audit Logging</span>
            </Link>
          </SideNav>
          <div className="layout-shell-content">
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Active Workspace View</h4>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
              Select an item from the side panel to inspect configuration telemetry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("System Overview")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /System Overview/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(canvas.getByRole("link", { name: /Kubernetes Nodes/ })).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="layout-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="layout-card">
          <div>
            <h4 className="layout-card-title">ناوبری ستونی (فارسی)</h4>
            <p className="layout-card-description">منوی عمودی داشبورد در محیط راست‌به‌چپ</p>
          </div>
          <div className="layout-shell-preview">
            <SideNav aria-label="منوی ناوبری جانبی سامانه">
              <Link href="#overview-fa" aria-current="page">
                <Icon name="code" size={16} />
                <span>نمای کلی سامانه</span>
              </Link>
              <Link href="#nodes-fa">
                <Icon name="folder" size={16} />
                <span>نودهای سرور</span>
              </Link>
              <Link href="#security-fa">
                <Icon name="file" size={16} />
                <span>گواهینامه‌های امنیتی</span>
              </Link>
              <Link href="#settings-fa">
                <Icon name="settings" size={16} />
                <span>پیکربندی شبکه</span>
              </Link>
            </SideNav>
            <div className="layout-shell-content">
              <div style={{ fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
                محتوای انتخاب شده در پنل اصلی نمایش داده می‌شود.
              </div>
            </div>
          </div>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("نمای کلی سامانه")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /نمای کلی سامانه/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
