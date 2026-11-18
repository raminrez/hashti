import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, userEvent, within } from "storybook/test";
import { Accordion, Button, Theme, useTheme } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          "Accordion is a stack of items that each open a section of content, replacing the old Disclosure and DisclosureGroup. One item is open at a time unless `multiple` is set.",
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Accordion defaultValue={["security"]}>
        <Accordion.Item value="security">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>Advanced Security Policies</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p style={{ margin: 0 }}>
              Strict Mutual TLS (mTLS) enforcement requires valid client certificates on every
              request. Revocation lists are cached locally and refreshed every 15 minutes.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Advanced Security Policies/ });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panelContent = canvas.getByText(/Strict Mutual TLS \(mTLS\) enforcement/);
    expect(panelContent).toBeInTheDocument();

    // Toggle collapse
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Toggle back to expanded
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const Variants: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Default Variant (Divided)</h4>
        <Accordion variant="default">
          <Accordion.Item value="routing">
            <Accordion.Header>
              <Accordion.Trigger>
                <span>Network Routing Rules</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              Manage BGP route reflectors and private subnet advertisements.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Card Variant</h4>
        <Accordion variant="card" defaultValue={["audit"]}>
          <Accordion.Item value="audit">
            <Accordion.Header>
              <Accordion.Trigger>
                <span>Audit Trail & Event Ingestion</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              Forward structured JSON events to CloudWatch, Datadog, or S3 bucket destinations.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Flush Variant</h4>
        <Accordion variant="flush">
          <Accordion.Item value="telemetry">
            <Accordion.Header>
              <Accordion.Trigger>
                <span>Telemetry & Tracing</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>OpenTelemetry collector endpoints sampling at 10% rate.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardTrigger = canvas.getByRole("button", { name: /Audit Trail & Event Ingestion/ });
    expect(cardTrigger).toHaveAttribute("aria-expanded", "true");

    const flushTrigger = canvas.getByRole("button", { name: /Telemetry & Tracing/ });
    expect(flushTrigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(flushTrigger);
    expect(flushTrigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <h4 style={{ margin: "0 0 0.5rem" }}>{size}</h4>
          <Accordion size={size} aria-label={`${size} accordions`}>
            <Accordion.Item value="summary">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>Summary overview</span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>Metrics aggregated across 12 pods.</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="logs">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>Log aggregation</span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>Streaming audit logs enabled.</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getAllByRole("button", { name: "Summary overview" })[0]!;
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(canvas.getAllByText("Metrics aggregated across 12 pods.")[0]!).toBeVisible(),
    );
  },
};

export const GroupedMultiple: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Accordion multiple defaultValue={["item-1"]} variant="card" aria-label="FAQ sections">
        <Accordion.Item value="item-1">
          <Accordion.Header headingLevel={4}>
            <Accordion.Trigger>
              <span>How do billing cycles work?</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Billing cycles renew on the first calendar day of every month with pro-rated
            adjustments.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Header headingLevel={4}>
            <Accordion.Trigger>
              <span>Can I migrate across clusters with zero downtime?</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Yes, blue-green deployment pipelines coordinate live DNS routing switchovers seamlessly.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const q1 = canvas.getByRole("button", { name: /How do billing cycles work\?/ });
    const q2 = canvas.getByRole("button", {
      name: /Can I migrate across clusters with zero downtime\?/,
    });

    expect(q1).toHaveAttribute("aria-expanded", "true");
    expect(q2).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(q2);
    expect(q2).toHaveAttribute("aria-expanded", "true");
    // multiple keeps q1 expanded
    expect(q1).toHaveAttribute("aria-expanded", "true");
  },
};

export const GroupedSingleExpansion: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Accordion aria-label="System configuration sections">
        <Accordion.Item value="network">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>Network settings</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Configure DNS records, VPC peering, and subnet route tables for inbound traffic.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="security">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>Security &amp; Compliance</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Manage TLS certificates, Web Application Firewall (WAF) rules, and IP allowlists.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const network = canvas.getByRole("button", { name: "Network settings" });
    const security = canvas.getByRole("button", { name: "Security & Compliance" });

    expect(network).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(network);
    expect(network).toHaveAttribute("aria-expanded", "true");
    expect(
      canvas.getByText(/Configure DNS records, VPC peering, and subnet route tables/),
    ).toBeVisible();

    await userEvent.click(security);
    expect(security).toHaveAttribute("aria-expanded", "true");
    expect(network).toHaveAttribute("aria-expanded", "false");
  },
};

function ControlledGroupExample() {
  const [value, setValue] = useState<string[]>(["general"]);

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setValue(["general", "advanced"])}
        >
          Expand all
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setValue([])}>
          Collapse all
        </Button>
      </div>

      <Accordion
        multiple
        value={value}
        onValueChange={(next) => setValue(next)}
        aria-label="Controlled accordions"
      >
        <Accordion.Item value="general">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>General preferences</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Theme mode, default editor font, and autosave intervals.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="advanced">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>Advanced debugging</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            Kernel flags, heap tracing thresholds, and raw socket access.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="locked" disabled>
          <Accordion.Header>
            <Accordion.Trigger>
              <span>Organization policy (Locked)</span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Managed by enterprise administrator.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export const GroupedDisabledAndControlled: Story = {
  render: () => <ControlledGroupExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const expandAll = canvas.getByRole("button", { name: "Expand all" });
    const collapseAll = canvas.getByRole("button", { name: "Collapse all" });
    const general = canvas.getByRole("button", { name: "General preferences" });
    const advanced = canvas.getByRole("button", { name: "Advanced debugging" });
    const locked = canvas.getByRole("button", { name: "Organization policy (Locked)" });

    expect(locked).toHaveAttribute("aria-disabled", "true");
    expect(general).toHaveAttribute("aria-expanded", "true");
    expect(advanced).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(expandAll);
    expect(general).toHaveAttribute("aria-expanded", "true");
    expect(advanced).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(collapseAll);
    expect(general).toHaveAttribute("aria-expanded", "false");
    expect(advanced).toHaveAttribute("aria-expanded", "false");
  },
};

function LocalizedGroup() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <Accordion aria-label="راهنمای تنظیمات سامانه">
            <Accordion.Item value="fa-1">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>تنظیمات پایگاه داده</span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                پیکربندی خوشه‌های توزیع‌شده با رونوشت‌های همگام و ذخیره‌سازی داده‌های ساختاریافته.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="fa-2">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>احراز هویت و دسترسی</span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                پشتیبانی از ورود یکپارچه سازمانی با پروتکل‌های OAuth 2.0 و SAML.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </Theme>
    </div>
  );
}

export const GroupedLongContentAndLocales: Story = {
  render: () => <LocalizedGroup />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const db = canvas.getByRole("button", { name: "تنظیمات پایگاه داده" });
    await waitFor(() => expect(db).toBeVisible());
    await userEvent.click(db);
    expect(db).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(canvas.getByText(/پیکربندی خوشه‌های توزیع‌شده/)).toBeVisible());
  },
};
