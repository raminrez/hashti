import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, userEvent, within } from "storybook/test";
import { Button, Disclosure, DisclosureGroup, Theme, useTheme, type Key } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Disclosure",
  component: Disclosure,
  parameters: {
    docs: {
      description: {
        component:
          "Disclosure provides a standalone collapsible region (or grouped collapsible sections) for progressive disclosure of complex settings, analytics breakdowns, and card details.",
      },
    },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Disclosure defaultExpanded>
        <Disclosure.Trigger headingLevel={3}>
          <span>Advanced Security Policies</span>
          <Disclosure.Indicator />
        </Disclosure.Trigger>
        <Disclosure.Panel>
          <p style={{ margin: 0 }}>
            Strict Mutual TLS (mTLS) enforcement requires valid client certificates on every
            request. Revocation lists are cached locally and refreshed every 15 minutes.
          </p>
        </Disclosure.Panel>
      </Disclosure>
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
        <Disclosure variant="default">
          <Disclosure.Trigger>
            <span>Network Routing Rules</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Manage BGP route reflectors and private subnet advertisements.
          </Disclosure.Panel>
        </Disclosure>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Card Variant</h4>
        <Disclosure variant="card" defaultExpanded>
          <Disclosure.Trigger>
            <span>Audit Trail & Event Ingestion</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Forward structured JSON events to CloudWatch, Datadog, or S3 bucket destinations.
          </Disclosure.Panel>
        </Disclosure>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Flush Variant</h4>
        <Disclosure variant="flush">
          <Disclosure.Trigger>
            <span>Telemetry & Tracing</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            OpenTelemetry collector endpoints sampling at 10% rate.
          </Disclosure.Panel>
        </Disclosure>
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
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Small (sm)</h4>
        <Disclosure size="sm">
          <Disclosure.Trigger>
            <span>Compact Information</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>Summary for tight sidebars and tool palettes.</Disclosure.Panel>
        </Disclosure>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Medium (md - default)</h4>
        <Disclosure size="md">
          <Disclosure.Trigger>
            <span>Standard Information</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>General application disclosure area.</Disclosure.Panel>
        </Disclosure>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Large (lg)</h4>
        <Disclosure size="lg">
          <Disclosure.Trigger>
            <span>Large Information</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>Prominent landing page or checkout disclosure.</Disclosure.Panel>
        </Disclosure>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smTrigger = canvas.getByRole("button", { name: /Compact Information/ });
    const mdTrigger = canvas.getByRole("button", { name: /Standard Information/ });
    const lgTrigger = canvas.getByRole("button", { name: /Large Information/ });

    expect(smTrigger).toBeInTheDocument();
    expect(mdTrigger).toBeInTheDocument();
    expect(lgTrigger).toBeInTheDocument();
  },
};

export const Grouped: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <DisclosureGroup
        defaultExpandedKeys={["item-1"]}
        allowsMultipleExpanded
        variant="card"
        aria-label="FAQ sections"
      >
        <Disclosure id="item-1">
          <Disclosure.Trigger headingLevel={4}>
            <span>How do billing cycles work?</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Billing cycles renew on the first calendar day of every month with pro-rated
            adjustments.
          </Disclosure.Panel>
        </Disclosure>

        <Disclosure id="item-2">
          <Disclosure.Trigger headingLevel={4}>
            <span>Can I migrate across clusters with zero downtime?</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Yes, blue-green deployment pipelines coordinate live DNS routing switchovers seamlessly.
          </Disclosure.Panel>
        </Disclosure>
      </DisclosureGroup>
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
    // allowsMultipleExpanded keeps q1 expanded
    expect(q1).toHaveAttribute("aria-expanded", "true");
  },
};

export const GroupedSingleExpansion: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <DisclosureGroup aria-label="System configuration sections">
        <Disclosure id="network">
          <Disclosure.Trigger headingLevel={3}>
            <span>Network settings</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Configure DNS records, VPC peering, and subnet route tables for inbound traffic.
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure id="security">
          <Disclosure.Trigger headingLevel={3}>
            <span>Security &amp; Compliance</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Manage TLS certificates, Web Application Firewall (WAF) rules, and IP allowlists.
          </Disclosure.Panel>
        </Disclosure>
      </DisclosureGroup>
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

export const GroupedSizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <h4 style={{ margin: "0 0 0.5rem" }}>{size}</h4>
          <DisclosureGroup size={size} aria-label={`${size} disclosures`}>
            <Disclosure id="one">
              <Disclosure.Trigger>
                <span>Summary overview</span>
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Panel>Metrics aggregated across 12 pods.</Disclosure.Panel>
            </Disclosure>
            <Disclosure id="two">
              <Disclosure.Trigger>
                <span>Log aggregation</span>
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Panel>Streaming audit logs enabled.</Disclosure.Panel>
            </Disclosure>
          </DisclosureGroup>
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

function ControlledGroupExample() {
  const [expandedKeys, setExpandedKeys] = useState<Iterable<Key>>(() => ["general"]);

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <Button
          size="sm"
          variant="secondary"
          onPress={() => setExpandedKeys(["general", "advanced"])}
        >
          Expand all
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setExpandedKeys([])}>
          Collapse all
        </Button>
      </div>

      <DisclosureGroup
        allowsMultipleExpanded
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        aria-label="Controlled disclosures"
      >
        <Disclosure id="general">
          <Disclosure.Trigger headingLevel={3}>
            <span>General preferences</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Theme mode, default editor font, and autosave intervals.
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure id="advanced">
          <Disclosure.Trigger headingLevel={3}>
            <span>Advanced debugging</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Kernel flags, heap tracing thresholds, and raw socket access.
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure id="locked" isDisabled>
          <Disclosure.Trigger headingLevel={3}>
            <span>Organization policy (Locked)</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>Managed by enterprise administrator.</Disclosure.Panel>
        </Disclosure>
      </DisclosureGroup>
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

    expect(locked).toBeDisabled();
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
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <DisclosureGroup aria-label="راهنمای تنظیمات سامانه">
            <Disclosure id="fa-1">
              <Disclosure.Trigger headingLevel={3}>
                <span>تنظیمات پایگاه داده</span>
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                پیکربندی خوشه‌های توزیع‌شده با رونوشت‌های همگام و ذخیره‌سازی داده‌های ساختاریافته.
              </Disclosure.Panel>
            </Disclosure>
            <Disclosure id="fa-2">
              <Disclosure.Trigger headingLevel={3}>
                <span>احراز هویت و دسترسی</span>
                <Disclosure.Indicator />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                پشتیبانی از ورود یکپارچه سازمانی با پروتکل‌های OAuth 2.0 و SAML.
              </Disclosure.Panel>
            </Disclosure>
          </DisclosureGroup>
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
