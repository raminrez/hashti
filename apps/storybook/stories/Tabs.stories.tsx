import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Icon,
  Tabs,
  TabsList,
  TabsPanel,
  Tab,
  Theme,
  useTheme,
} from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "Tabs organizes related sections of content in one place. Supports line and contained visual variants, horizontal and vertical orientations, automatic and manual keyboard activation, and full RTL layout.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Tabs defaultValue="overview">
        <TabsList aria-label="Project workspace">
          <Tab value="overview">Overview</Tab>
          <Tab value="deployments">Deployments</Tab>
          <Tab value="analytics">Analytics</Tab>
          <Tab value="settings">Settings</Tab>
        </TabsList>
        <TabsPanel value="overview">
          <div className="navigation-tab-content">
            <h3>Overview summary</h3>
            <p>Active project metrics, recent commits, and health status.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="deployments">
          <div className="navigation-tab-content">
            <h3>Deployments pipeline</h3>
            <p>All active cluster workloads running across regions.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="analytics">
          <div className="navigation-tab-content">
            <h3>Usage analytics</h3>
            <p>Request latency, throughput, and error rates over time.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="settings">
          <div className="navigation-tab-content">
            <h3>Project settings</h3>
            <p>Environment variables, branch protection, and access keys.</p>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const overviewTab = canvas.getByRole("tab", { name: "Overview" });
    const deploymentsTab = canvas.getByRole("tab", { name: "Deployments" });
    const settingsTab = canvas.getByRole("tab", { name: "Settings" });

    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("Overview summary")).toBeVisible());

    // Click to switch tab
    await userEvent.click(deploymentsTab);
    expect(deploymentsTab).toHaveAttribute("aria-selected", "true");
    expect(overviewTab).toHaveAttribute("aria-selected", "false");
    await waitFor(() => expect(canvas.getByText("Deployments pipeline")).toBeVisible());

    // Keyboard navigation (Arrow keys)
    await userEvent.keyboard("{ArrowRight}");
    const analyticsTab = canvas.getByRole("tab", { name: "Analytics" });
    expect(analyticsTab).toHaveAttribute("aria-selected", "true");

    await userEvent.click(settingsTab);
    expect(settingsTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("Project settings")).toBeVisible());
  },
};

export const Variants: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Line variant (default)</h4>
        <Tabs variant="line" defaultValue="day">
          <TabsList aria-label="Timeframe line">
            <Tab value="day">Day</Tab>
            <Tab value="week">Week</Tab>
            <Tab value="month">Month</Tab>
          </TabsList>
          <TabsPanel value="day">Past 24 hours activity</TabsPanel>
          <TabsPanel value="week">Past 7 days activity</TabsPanel>
          <TabsPanel value="month">Past 30 days activity</TabsPanel>
        </Tabs>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Contained / Segmented variant</h4>
        <Tabs variant="contained" defaultValue="week">
          <TabsList aria-label="Timeframe contained">
            <Tab value="day">Day</Tab>
            <Tab value="week">Week</Tab>
            <Tab value="month">Month</Tab>
          </TabsList>
          <TabsPanel value="day">Past 24 hours contained</TabsPanel>
          <TabsPanel value="week">Past 7 days contained</TabsPanel>
          <TabsPanel value="month">Past 30 days contained</TabsPanel>
        </Tabs>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const containedList = canvas.getByRole("tablist", { name: "Timeframe contained" });
    const contained = within(containedList);

    const weekContained = contained.getByRole("tab", { name: "Week", selected: true });
    await waitFor(() => expect(weekContained).toBeVisible());

    const monthContained = contained.getByRole("tab", { name: "Month", selected: false });
    await userEvent.click(monthContained);
    expect(monthContained).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("Past 30 days contained")).toBeVisible());
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <h4 style={{ margin: "0 0 0.5rem" }}>{size}</h4>
          <Tabs size={size} defaultValue="overview">
            <TabsList aria-label={`${size} tabs`}>
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="usage">Usage</Tab>
            </TabsList>
            <TabsPanel value="overview">Overview at {size}.</TabsPanel>
            <TabsPanel value="activity">Activity at {size}.</TabsPanel>
            <TabsPanel value="usage">Usage at {size}.</TabsPanel>
          </Tabs>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const size of ["sm", "md", "lg"]) {
      expect(canvas.getByRole("tablist", { name: `${size} tabs` })).toBeInTheDocument();
    }
  },
};

export const Orientation: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Tabs orientation="vertical" defaultValue="account">
        <TabsList aria-label="Vertical navigation">
          <Tab value="account">Account</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="billing">Billing</Tab>
        </TabsList>
        <TabsPanel value="account">
          <div className="navigation-tab-content">
            <h3>Account profile</h3>
            <p>Update your name, profile photo, and public details.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="security">
          <div className="navigation-tab-content">
            <h3>Security & Authentication</h3>
            <p>Manage multi-factor auth, recovery keys, and active sessions.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="notifications">
          <div className="navigation-tab-content">
            <h3>Notification preferences</h3>
            <p>Choose which alerts arrive by email, slack, or SMS.</p>
          </div>
        </TabsPanel>
        <TabsPanel value="billing">
          <div className="navigation-tab-content">
            <h3>Plan & Invoices</h3>
            <p>Current subscription tier and downloadable VAT receipts.</p>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const securityTab = canvas.getByRole("tab", { name: "Security" });
    await userEvent.click(securityTab);
    expect(securityTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("Security & Authentication")).toBeVisible());

    // In vertical orientation, ArrowDown moves to next tab
    await userEvent.keyboard("{ArrowDown}");
    const notificationsTab = canvas.getByRole("tab", { name: "Notifications" });
    expect(notificationsTab).toHaveAttribute("aria-selected", "true");
  },
};

function ControlledTabsExample() {
  const [value, setValue] = useState<string | null>("build");

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>
          Controlled active value: <strong>{String(value)}</strong>
        </span>
        <Button size="sm" variant="secondary" onClick={() => setValue("deploy")}>
          Jump to Deploy
        </Button>
      </div>
      <Tabs value={value} onValueChange={(next) => setValue(next)} activation="manual">
        <TabsList aria-label="Pipeline stages">
          <Tab value="source">Source</Tab>
          <Tab value="build">Build</Tab>
          <Tab value="test">Test</Tab>
          <Tab value="deploy">Deploy</Tab>
        </TabsList>
        <TabsPanel value="source">Source code revision checkout</TabsPanel>
        <TabsPanel value="build">Compilation and Docker image packaging</TabsPanel>
        <TabsPanel value="test">Unit, integration, and E2E test runner</TabsPanel>
        <TabsPanel value="deploy">Cluster canary rollout and traffic switch</TabsPanel>
      </Tabs>
    </div>
  );
}

export const ControlledAndManual: Story = {
  render: () => <ControlledTabsExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const buildTab = canvas.getByRole("tab", { name: "Build" });
    expect(buildTab).toHaveAttribute("aria-selected", "true");

    const jumpButton = canvas.getByRole("button", { name: "Jump to Deploy" });
    await userEvent.click(jumpButton);

    const deployTab = canvas.getByRole("tab", { name: "Deploy" });
    expect(deployTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() =>
      expect(canvas.getByText("Cluster canary rollout and traffic switch")).toBeVisible(),
    );

    // Manual keyboard activation: ArrowLeft moves focus without selecting until Enter/Space
    deployTab.focus();
    await userEvent.keyboard("{ArrowLeft}");
    const testTab = canvas.getByRole("tab", { name: "Test" });
    expect(testTab).toHaveFocus();
    expect(deployTab).toHaveAttribute("aria-selected", "true"); // Still selected

    await userEvent.keyboard("{Enter}");
    expect(testTab).toHaveAttribute("aria-selected", "true");
  },
};

export const DisabledAndIcons: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Tabs defaultValue="active">
        <TabsList aria-label="Feature status tabs">
          <Tab value="active">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="check" size={16} />
              Active
              <span className="navigation-tab-badge">12</span>
            </span>
          </Tab>
          <Tab value="pending">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="warning" size={16} />
              Pending review
              <span className="navigation-tab-badge">3</span>
            </span>
          </Tab>
          <Tab value="archived" disabled>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="folder" size={16} />
              Archived (Unavailable)
            </span>
          </Tab>
        </TabsList>
        <TabsPanel value="active">12 active production deployments online.</TabsPanel>
        <TabsPanel value="pending">3 pull requests waiting for sign-off.</TabsPanel>
        <TabsPanel value="archived">Archived items cannot be viewed in this role.</TabsPanel>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const pendingTab = canvas.getByRole("tab", { name: /Pending review/ });
    const archivedTab = canvas.getByRole("tab", { name: /Archived/ });

    expect(archivedTab).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(pendingTab);
    expect(pendingTab).toHaveAttribute("aria-selected", "true");

    // Attempting to click disabled tab does nothing
    await userEvent.click(archivedTab);
    expect(pendingTab).toHaveAttribute("aria-selected", "true");
  },
};

function LocalizedTabs() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <Tabs defaultValue="dashboard">
            <TabsList aria-label="ناوبری سامانه">
              <Tab value="dashboard">پیشخوان</Tab>
              <Tab value="reports">گزارش‌ها</Tab>
              <Tab value="users">کاربران</Tab>
              <Tab value="audit">ثبت وقایع</Tab>
            </TabsList>
            <TabsPanel value="dashboard">
              <div className="navigation-tab-content">
                <h3>نمای کلی پیشخوان</h3>
                <p>آمار لحظه‌ای درخواست‌ها و پردازش‌های فعال سیستم.</p>
              </div>
            </TabsPanel>
            <TabsPanel value="reports">
              <div className="navigation-tab-content">
                <h3>گزارش‌های عملکردی</h3>
                <p>خروجی آماری هفتگی و ماهیانه.</p>
              </div>
            </TabsPanel>
            <TabsPanel value="users">
              <div className="navigation-tab-content">
                <h3>فهرست کاربران</h3>
                <p>مدیریت سطوح دسترسی و حساب‌های کاربری.</p>
              </div>
            </TabsPanel>
            <TabsPanel value="audit">
              <div className="navigation-tab-content">
                <h3>تاریخچه رخدادها</h3>
                <p>لاگ‌های امنیتی و تغییرات اعمال‌شده در تنظیمات.</p>
              </div>
            </TabsPanel>
          </Tabs>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedTabs />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const dashboardTab = canvas.getByRole("tab", { name: "پیشخوان" });
    const reportsTab = canvas.getByRole("tab", { name: "گزارش‌ها" });

    expect(dashboardTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("نمای کلی پیشخوان")).toBeVisible());

    await userEvent.click(reportsTab);
    expect(reportsTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("گزارش‌های عملکردی")).toBeVisible());
  },
};
