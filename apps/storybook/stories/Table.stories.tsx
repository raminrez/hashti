import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  ColumnResizer,
  ResizableTableContainer,
  Checkbox,
  Theme,
  useTheme,
  type Selection,
  type SortDescriptor,
} from "@hashti/react";
import "./data.css";

interface ServiceRecord {
  id: string;
  name: string;
  cluster: string;
  status: "active" | "warning" | "inactive";
  statusText: string;
  replicas: string;
  deployed: string;
}

const servicesData: ServiceRecord[] = [
  {
    id: "svc-1",
    name: "auth-gateway",
    cluster: "us-east-prod",
    status: "active",
    statusText: "Operational",
    replicas: "6 / 6",
    deployed: "2 hours ago",
  },
  {
    id: "svc-2",
    name: "billing-worker",
    cluster: "eu-central-prod",
    status: "active",
    statusText: "Operational",
    replicas: "4 / 4",
    deployed: "1 day ago",
  },
  {
    id: "svc-3",
    name: "indexer-service",
    cluster: "us-west-stage",
    status: "warning",
    statusText: "Degraded",
    replicas: "2 / 5",
    deployed: "3 days ago",
  },
  {
    id: "svc-4",
    name: "telemetry-collector",
    cluster: "ap-south-prod",
    status: "inactive",
    statusText: "Suspended",
    replicas: "0 / 2",
    deployed: "1 week ago",
  },
];

const meta = {
  title: "Data/Table",
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          "Table organizes structured data into rows and columns with keyboard navigation, interactive sorting, selection modes, and column resizing.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["svc-1"]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedItems = [...servicesData].sort((a, b) => {
    const col = sortDescriptor.column as keyof ServiceRecord;
    const valA = a[col] ?? "";
    const valB = b[col] ?? "";
    const cmp = String(valA).localeCompare(String(valB));
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });

  return (
    <div className="data-story-stack">
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <div>
            <h3 className="data-table-title">Production Services</h3>
            <p className="data-table-description">
              Monitor microservices health, replication status, and active deployment targets.
            </p>
          </div>
          <span className="data-table-status-badge">
            {selectedKeys === "all" ? sortedItems.length : selectedKeys.size} selected
          </span>
        </div>
        <Table
          aria-label="Production Services"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <Column width={48}>
              <Checkbox slot="selection" aria-label="Select all rows" />
            </Column>
            <Column id="name" isRowHeader allowsSorting>
              Service
            </Column>
            <Column id="cluster" allowsSorting>
              Cluster
            </Column>
            <Column id="status">Status</Column>
            <Column id="replicas">Replicas</Column>
            <Column id="deployed">Last Deployed</Column>
          </TableHeader>
          <TableBody items={sortedItems}>
            {(item) => (
              <Row key={item.id} id={item.id}>
                <Cell>
                  <Checkbox slot="selection" aria-label={`Select ${item.name}`} />
                </Cell>
                <Cell>{item.name}</Cell>
                <Cell>{item.cluster}</Cell>
                <Cell>
                  <span className="data-table-status-badge">
                    <span className="data-table-status-dot" data-status={item.status} />
                    {item.statusText}
                  </span>
                </Cell>
                <Cell>{item.replicas}</Cell>
                <Cell>{item.deployed}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state: 1 selected
    expect(canvas.getByText("1 selected")).toBeInTheDocument();

    // Verify sort on cluster column
    const clusterHeader = canvas.getByRole("columnheader", { name: /Cluster/ });
    expect(clusterHeader).toBeInTheDocument();
    await userEvent.click(clusterHeader);
    expect(clusterHeader).toHaveAttribute("aria-sort", "ascending");

    await userEvent.click(clusterHeader);
    expect(clusterHeader).toHaveAttribute("aria-sort", "descending");

    // Click select all checkbox in table header
    const selectAllCheckbox = canvas.getByRole("checkbox", { name: "Select all rows" });
    await userEvent.click(selectAllCheckbox);
    expect(canvas.getByText("4 selected")).toBeInTheDocument();

    // Click row 2 checkbox to unselect
    const billingRow = canvas.getByRole("row", { name: /billing-worker/ });
    const billingCheckbox = within(billingRow).getByRole("checkbox");
    await userEvent.click(billingCheckbox);
    expect(canvas.getByText("3 selected")).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="data-story-stack">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="data-table-card">
          <div className="data-table-header-bar">
            <h4 className="data-table-title">Size: {size.toUpperCase()}</h4>
          </div>
          <Table aria-label={`Table size ${size}`} size={size}>
            <TableHeader>
              <Column id="svc" isRowHeader>
                Service
              </Column>
              <Column id="cls">Cluster</Column>
              <Column id="rep">Replicas</Column>
            </TableHeader>
            <TableBody>
              <Row id="ingress">
                <Cell>ingress-router</Cell>
                <Cell>edge-eu-1</Cell>
                <Cell>8 / 8</Cell>
              </Row>
              <Row id="cache">
                <Cell>cache-cluster</Cell>
                <Cell>edge-us-2</Cell>
                <Cell>3 / 3</Cell>
              </Row>
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("grid", { name: "Table size sm" })).toHaveAttribute("data-size", "sm");
    expect(canvas.getByRole("grid", { name: "Table size md" })).toHaveAttribute("data-size", "md");
    expect(canvas.getByRole("grid", { name: "Table size lg" })).toHaveAttribute("data-size", "lg");
    expect(canvas.getByRole("grid", { name: "Table size xl" })).toHaveAttribute("data-size", "xl");
  },
};

function SingleSelectionExample() {
  const [selectedKey, setSelectedKey] = useState<Selection>(new Set(["worker-prod"]));
  const selectedItem =
    selectedKey !== "all" && selectedKey.size > 0 ? Array.from(selectedKey)[0] : "None";

  return (
    <div className="data-story-stack">
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <div>
            <h3 className="data-table-title">Select Deployment Target</h3>
            <p className="data-table-description">Choose a single instance group to deploy.</p>
          </div>
          <span className="data-table-status-badge">Target: {String(selectedItem)}</span>
        </div>
        <Table
          aria-label="Deployment Target Instances"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selectedKey}
          onSelectionChange={setSelectedKey}
        >
          <TableHeader>
            <Column id="pool" isRowHeader>
              Instance Pool
            </Column>
            <Column id="zone">Zone</Column>
            <Column id="type">Machine Type</Column>
            <Column id="cap">Capacity</Column>
          </TableHeader>
          <TableBody>
            <Row id="worker-prod">
              <Cell>worker-prod</Cell>
              <Cell>us-central1-a</Cell>
              <Cell>e2-standard-4</Cell>
              <Cell>16 vCPU / 64 GB</Cell>
            </Row>
            <Row id="worker-stage">
              <Cell>worker-stage</Cell>
              <Cell>us-central1-b</Cell>
              <Cell>e2-medium</Cell>
              <Cell>2 vCPU / 4 GB</Cell>
            </Row>
            <Row id="worker-canary">
              <Cell>worker-canary</Cell>
              <Cell>us-central1-c</Cell>
              <Cell>e2-standard-2</Cell>
              <Cell>4 vCPU / 8 GB</Cell>
            </Row>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const SingleSelection: Story = {
  render: () => <SingleSelectionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Target: worker-prod")).toBeInTheDocument();

    const stageRow = await canvas.findByRole("row", { name: /worker-stage/ });
    await userEvent.click(stageRow);
    expect(canvas.getByText("Target: worker-stage")).toBeInTheDocument();
  },
};

export const ResizableColumns: Story = {
  render: () => (
    <div className="data-story-stack">
      <ResizableTableContainer>
        <Table aria-label="Resizable Container Table">
          <TableHeader>
            <Column id="col-name" isRowHeader defaultWidth={200}>
              Repository
              <ColumnResizer />
            </Column>
            <Column id="col-branch" defaultWidth={140}>
              Branch
              <ColumnResizer />
            </Column>
            <Column id="col-commit" defaultWidth={120}>
              Commit
              <ColumnResizer />
            </Column>
            <Column id="col-author">
              Author
              <ColumnResizer />
            </Column>
          </TableHeader>
          <TableBody>
            <Row id="repo-1">
              <Cell>cinder-design-system</Cell>
              <Cell>main</Cell>
              <Cell>a4f89d1</Cell>
              <Cell>Sarah Chen</Cell>
            </Row>
            <Row id="repo-2">
              <Cell>cloud-infra-core</Cell>
              <Cell>release-2.4</Cell>
              <Cell>7c3e120</Cell>
              <Cell>Alex Rivera</Cell>
            </Row>
            <Row id="repo-3">
              <Cell>analytics-pipeline</Cell>
              <Cell>feat/batch</Cell>
              <Cell>91b35ae</Cell>
              <Cell>Rami Nader</Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("grid", { name: "Resizable Container Table" });
    expect(table).toBeInTheDocument();

    const colHeaders = canvas.getAllByRole("columnheader");
    expect(colHeaders.length).toBe(4);
    expect(colHeaders[0]).toHaveTextContent("Repository");
  },
};

export const EmptyState: Story = {
  render: () => (
    <div className="data-story-stack">
      <div className="data-table-card">
        <Table aria-label="Filtered Search Results">
          <TableHeader>
            <Column id="empty-svc" isRowHeader>
              Service
            </Column>
            <Column id="empty-cls">Cluster</Column>
            <Column id="empty-stat">Status</Column>
          </TableHeader>
          <TableBody
            renderEmptyState={() => (
              <div className="data-table-empty">
                <h4>No matching services found</h4>
                <p>Try refining your search terms or clearing selected filter criteria.</p>
              </div>
            )}
          >
            {[]}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText("No matching services found")).toBeInTheDocument();
  },
};

function LongContentExample() {
  const { theme } = useTheme();

  return (
    <div className="data-story-stack">
      {/* Long content truncate */}
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <h4 className="data-table-title">Long Content Handling</h4>
        </div>
        <Table aria-label="Audit Log with Long Descriptions">
          <TableHeader>
            <Column id="evt-id" isRowHeader>
              Event ID
            </Column>
            <Column id="payload">Resource Payload</Column>
            <Column id="user">Initiator</Column>
          </TableHeader>
          <TableBody>
            <Row id="row-evt-1">
              <Cell>evt-98213749812739</Cell>
              <Cell>
                ConfigMap update containing cluster credentials, TLS secret rotation policies, and
                webhook admission controller specifications across multi-region deployment.
              </Cell>
              <Cell>automated-ci-bot@infra.internal</Cell>
            </Row>
            <Row id="row-evt-2">
              <Cell>evt-98213749812740</Cell>
              <Cell>
                Scale-down request for telemetry ingestion pods from 32 instances to 8 instances
                following completed off-peak batch analysis window.
              </Cell>
              <Cell>scheduler@infra.internal</Cell>
            </Row>
          </TableBody>
        </Table>
      </div>

      {/* RTL fa-IR */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="data-table-card">
          <div className="data-table-header-bar">
            <div>
              <h4 className="data-table-title">سرویس‌های پردازشی ابر</h4>
              <p className="data-table-description">
                مدیریت و نظارت بر کلاسترهای فعال و نمونه‌های پردازشی
              </p>
            </div>
          </div>
          <Table
            aria-label="سرویس‌های پردازشی ابر"
            selectionMode="multiple"
            defaultSelectedKeys={["svc-1"]}
          >
            <TableHeader>
              <Column id="select-all" width={48}>
                <Checkbox slot="selection" aria-label="انتخاب همه سطرها" />
              </Column>
              <Column id="fa-name" isRowHeader allowsSorting>
                نام سرویس
              </Column>
              <Column id="fa-region" allowsSorting>
                منطقه سرور
              </Column>
              <Column id="fa-status">وضعیت عملیاتی</Column>
              <Column id="fa-replicas">نمونه‌های فعال</Column>
            </TableHeader>
            <TableBody>
              <Row id="svc-1">
                <Cell>
                  <Checkbox slot="selection" aria-label="انتخاب درگاه احراز هویت" />
                </Cell>
                <Cell>درگاه احراز هویت</Cell>
                <Cell>تهران - مرکز داده ۱</Cell>
                <Cell>
                  <span className="data-table-status-badge">
                    <span className="data-table-status-dot" data-status="active" />
                    فعال
                  </span>
                </Cell>
                <Cell>۶ / ۶</Cell>
              </Row>
              <Row id="svc-2">
                <Cell>
                  <Checkbox slot="selection" aria-label="انتخاب موتور پرداخت" />
                </Cell>
                <Cell>موتور مالی و پرداخت</Cell>
                <Cell>اصفهان - مرکز داده ۲</Cell>
                <Cell>
                  <span className="data-table-status-badge">
                    <span className="data-table-status-dot" data-status="active" />
                    فعال
                  </span>
                </Cell>
                <Cell>۴ / ۴</Cell>
              </Row>
            </TableBody>
          </Table>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Long Content Handling")).toBeInTheDocument();
    expect(canvas.getByText("سرویس‌های پردازشی ابر")).toBeInTheDocument();
    expect(await canvas.findByRole("columnheader", { name: /نام سرویس/ })).toBeInTheDocument();

    const rtlSelectAll = await canvas.findByRole("checkbox", { name: "انتخاب همه سطرها" });
    expect(rtlSelectAll).toBeInTheDocument();
  },
};
