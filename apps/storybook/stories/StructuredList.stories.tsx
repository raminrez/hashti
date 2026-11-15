import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StructuredList, StructuredListRow, List, Tag, Theme, useTheme } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Data/StructuredList",
  component: StructuredList,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          "StructuredList displays semantic key-value records, machine specifications, and system metadata in a clean tabular definition list.",
      },
    },
  },
} satisfies Meta<typeof StructuredList>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h3 className="content-card-title">Instance Specification</h3>
          <p className="content-card-description">
            Detailed hardware profile for virtual machine deployment.
          </p>
        </div>
        <StructuredList aria-label="Machine specifications">
          <StructuredListRow label="Instance Type" value="c3-standard-8" />
          <StructuredListRow label="vCPU Count" value="8 vCPUs (Intel Xeon Platinum)" />
          <StructuredListRow label="System Memory" value="32 GB DDR5 ECC" />
          <StructuredListRow label="Storage Capacity" value="256 GB NVMe Persistent Boot SSD" />
          <StructuredListRow label="Network Bandwidth" value="Up to 16 Gbps egress" />
        </StructuredList>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Instance Specification")).toBeInTheDocument();
    expect(canvas.getByText("Instance Type")).toBeInTheDocument();
    expect(canvas.getByText("c3-standard-8")).toBeInTheDocument();
    expect(canvas.getByText("System Memory")).toBeInTheDocument();
    expect(canvas.getByText("32 GB DDR5 ECC")).toBeInTheDocument();
  },
};

function WithStatusAndBadgesExample() {
  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Cluster Security & Deployment State</h4>
          <p className="content-card-description">
            Runtime audit status and cryptographic credentials.
          </p>
        </div>
        <StructuredList aria-label="Security status metadata">
          <StructuredListRow
            label="TLS Encryption"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>TLS 1.3 Strict</span>
                <Tag color="green" size="sm">
                  Active
                </Tag>
              </div>
            }
          />
          <StructuredListRow
            label="Mutual Auth (mTLS)"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>Service Mesh SPIFFE/SPIRE</span>
                <Tag color="blue" size="sm">
                  Enforced
                </Tag>
              </div>
            }
          />
          <StructuredListRow
            label="Firewall Rule"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>Ingress 443 only</span>
                <Tag color="teal" size="sm">
                  Shielded
                </Tag>
              </div>
            }
          />
          <StructuredListRow
            label="Vulnerability Scan"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>0 Critical / 0 High</span>
                <Tag color="green" size="sm">
                  Passed
                </Tag>
              </div>
            }
          />
        </StructuredList>
      </div>
    </div>
  );
}

export const WithStatusAndBadges: Story = {
  render: () => <WithStatusAndBadgesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cluster Security & Deployment State")).toBeInTheDocument();
    expect(canvas.getByText("TLS Encryption")).toBeInTheDocument();
    expect(canvas.getByText("TLS 1.3 Strict")).toBeInTheDocument();
    expect(canvas.getByText("Mutual Auth (mTLS)")).toBeInTheDocument();
    expect(canvas.getByText("Enforced")).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="content-story-stack">
      {/* Persian RTL List */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="content-card">
          <div>
            <h4 className="content-card-title">مشخصات سرویس مالی و پرداخت</h4>
            <p className="content-card-description">
              اطلاعات پیکربندی و سرورهای درگاه در محیط راست‌به‌چپ
            </p>
          </div>
          <StructuredList aria-label="مشخصات درگاه پرداخت">
            <StructuredListRow label="شناسه درگاه" value="pg-tehran-central-01" />
            <StructuredListRow
              label="پروتکل امنیتی"
              value={
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>رمزنگاری نامتقارن RSA 4096</span>
                  <Tag color="green" size="sm">
                    فعال
                  </Tag>
                </div>
              }
            />
            <StructuredListRow
              label="پشتیبان داده"
              value="کلاستر توزیع‌شده با پایگاه داده چند منطقه‌ای"
            />
            <StructuredListRow label="سقف تراکنش روزانه" value="۵,۰۰۰,۰۰۰,۰۰۰ ریال" />
          </StructuredList>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("مشخصات سرویس مالی و پرداخت")).toBeInTheDocument();
    expect(canvas.getByText("شناسه درگاه")).toBeInTheDocument();
    expect(canvas.getByText("pg-tehran-central-01")).toBeInTheDocument();
    expect(canvas.getByText("پروتکل امنیتی")).toBeInTheDocument();
  },
};

function ListsExample() {
  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h3 className="content-card-title">Ordered and Unordered Lists</h3>
          <p className="content-card-description">
            Clean typographic lists formatted with consistent line height and spacing tokens.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Deployment Steps (Ordered)
            </h4>
            <List ordered>
              <li>Pre-flight environment verification</li>
              <li>Provision VPC subnets and NAT gateways</li>
              <li>Compile and package application bundle</li>
              <li>Rolling deployment across availability zones</li>
            </List>
          </div>
          <div>
            <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Cluster Features (Unordered)
            </h4>
            <List>
              <li>Automatic autoscaling with predictive telemetry</li>
              <li>Zero-trust mutual TLS between worker pods</li>
              <li>Global multi-region failover replication</li>
              <li>Continuous compliance and audit logging</li>
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Lists: Story = {
  render: () => <ListsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Deployment Steps (Ordered)")).toBeInTheDocument();
    expect(canvas.getByText("Pre-flight environment verification")).toBeInTheDocument();
    expect(canvas.getByText("Cluster Features (Unordered)")).toBeInTheDocument();
  },
};
