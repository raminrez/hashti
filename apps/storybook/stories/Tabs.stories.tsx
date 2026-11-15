import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Icon,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Theme,
  useTheme,
  type Key,
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
      <Tabs defaultSelectedKey="overview">
        <TabList aria-label="Project workspace">
          <Tab id="overview">Overview</Tab>
          <Tab id="deployments">Deployments</Tab>
          <Tab id="analytics">Analytics</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>
        <TabPanel id="overview">
          <div className="navigation-tab-content">
            <h3>Overview summary</h3>
            <p>Active project metrics, recent commits, and health status.</p>
          </div>
        </TabPanel>
        <TabPanel id="deployments">
          <div className="navigation-tab-content">
            <h3>Deployments pipeline</h3>
            <p>All active cluster workloads running across regions.</p>
          </div>
        </TabPanel>
        <TabPanel id="analytics">
          <div className="navigation-tab-content">
            <h3>Usage analytics</h3>
            <p>Request latency, throughput, and error rates over time.</p>
          </div>
        </TabPanel>
        <TabPanel id="settings">
          <div className="navigation-tab-content">
            <h3>Project settings</h3>
            <p>Environment variables, branch protection, and access keys.</p>
          </div>
        </TabPanel>
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
        <Tabs variant="line" defaultSelectedKey="day">
          <TabList aria-label="Timeframe line">
            <Tab id="day">Day</Tab>
            <Tab id="week">Week</Tab>
            <Tab id="month">Month</Tab>
          </TabList>
          <TabPanel id="day">Past 24 hours activity</TabPanel>
          <TabPanel id="week">Past 7 days activity</TabPanel>
          <TabPanel id="month">Past 30 days activity</TabPanel>
        </Tabs>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Contained / Segmented variant</h4>
        <Tabs variant="contained" defaultSelectedKey="week">
          <TabList aria-label="Timeframe contained">
            <Tab id="day">Day</Tab>
            <Tab id="week">Week</Tab>
            <Tab id="month">Month</Tab>
          </TabList>
          <TabPanel id="day">Past 24 hours contained</TabPanel>
          <TabPanel id="week">Past 7 days contained</TabPanel>
          <TabPanel id="month">Past 30 days contained</TabPanel>
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

export const Orientation: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Tabs orientation="vertical" defaultSelectedKey="account">
        <TabList aria-label="Vertical navigation">
          <Tab id="account">Account</Tab>
          <Tab id="security">Security</Tab>
          <Tab id="notifications">Notifications</Tab>
          <Tab id="billing">Billing</Tab>
        </TabList>
        <TabPanel id="account">
          <div className="navigation-tab-content">
            <h3>Account profile</h3>
            <p>Update your name, profile photo, and public details.</p>
          </div>
        </TabPanel>
        <TabPanel id="security">
          <div className="navigation-tab-content">
            <h3>Security & Authentication</h3>
            <p>Manage multi-factor auth, recovery keys, and active sessions.</p>
          </div>
        </TabPanel>
        <TabPanel id="notifications">
          <div className="navigation-tab-content">
            <h3>Notification preferences</h3>
            <p>Choose which alerts arrive by email, slack, or SMS.</p>
          </div>
        </TabPanel>
        <TabPanel id="billing">
          <div className="navigation-tab-content">
            <h3>Plan & Invoices</h3>
            <p>Current subscription tier and downloadable VAT receipts.</p>
          </div>
        </TabPanel>
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
  const [selectedKey, setSelectedKey] = useState<Key>("build");

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>
          Controlled active key: <strong>{String(selectedKey)}</strong>
        </span>
        <Button size="sm" variant="secondary" onPress={() => setSelectedKey("deploy")}>
          Jump to Deploy
        </Button>
      </div>
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        keyboardActivation="manual"
      >
        <TabList aria-label="Pipeline stages">
          <Tab id="source">Source</Tab>
          <Tab id="build">Build</Tab>
          <Tab id="test">Test</Tab>
          <Tab id="deploy">Deploy</Tab>
        </TabList>
        <TabPanel id="source">Source code revision checkout</TabPanel>
        <TabPanel id="build">Compilation and Docker image packaging</TabPanel>
        <TabPanel id="test">Unit, integration, and E2E test runner</TabPanel>
        <TabPanel id="deploy">Cluster canary rollout and traffic switch</TabPanel>
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

    // Manual keyboard activation: ArrowRight moves focus without selecting until Enter/Space
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
      <Tabs defaultSelectedKey="active">
        <TabList aria-label="Feature status tabs">
          <Tab id="active">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="check" size={16} />
              Active
              <span className="navigation-tab-badge">12</span>
            </span>
          </Tab>
          <Tab id="pending">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="warning" size={16} />
              Pending review
              <span className="navigation-tab-badge">3</span>
            </span>
          </Tab>
          <Tab id="archived" isDisabled>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="folder" size={16} />
              Archived (Unavailable)
            </span>
          </Tab>
        </TabList>
        <TabPanel id="active">12 active production deployments online.</TabPanel>
        <TabPanel id="pending">3 pull requests waiting for sign-off.</TabPanel>
        <TabPanel id="archived">Archived items cannot be viewed in this role.</TabPanel>
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
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <Tabs defaultSelectedKey="dashboard">
            <TabList aria-label="ناوبری سامانه">
              <Tab id="dashboard">پیشخوان</Tab>
              <Tab id="reports">گزارش‌ها</Tab>
              <Tab id="users">کاربران</Tab>
              <Tab id="audit">ثبت وقایع</Tab>
            </TabList>
            <TabPanel id="dashboard">
              <div className="navigation-tab-content">
                <h3>نمای کلی پیشخوان</h3>
                <p>آمار لحظه‌ای درخواست‌ها و پردازش‌های فعال سیستم.</p>
              </div>
            </TabPanel>
            <TabPanel id="reports">
              <div className="navigation-tab-content">
                <h3>گزارش‌های عملکردی</h3>
                <p>خروجی آماری هفتگی و ماهیانه.</p>
              </div>
            </TabPanel>
            <TabPanel id="users">
              <div className="navigation-tab-content">
                <h3>فهرست کاربران</h3>
                <p>مدیریت سطوح دسترسی و حساب‌های کاربری.</p>
              </div>
            </TabPanel>
            <TabPanel id="audit">
              <div className="navigation-tab-content">
                <h3>تاریخچه رخدادها</h3>
                <p>لاگ‌های امنیتی و تغییرات اعمال‌شده در تنظیمات.</p>
              </div>
            </TabPanel>
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
