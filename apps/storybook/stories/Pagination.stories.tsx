import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Pagination,
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Theme,
  useTheme,
} from "@hashti/react";
import "./data.css";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  args: {
    totalItems: 100,
    page: 1,
    pageSize: 10,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        component:
          "Pagination divides large sets of data into discrete pages with accessible boundary controls, page size selector, and screen-reader status announcements.",
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 125;

  return (
    <div className="data-story-stack">
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <div>
            <h3 className="data-table-title">Activity Feed Pagination</h3>
            <p className="data-table-description">
              Navigate through historical audit and log entries.
            </p>
          </div>
          <span className="data-table-status-badge">Total: {totalItems}</span>
        </div>
        <div style={{ padding: "1.5rem", minHeight: "8rem" }}>
          <p style={{ margin: 0, color: "var(--hashti-text-primary)" }}>
            Viewing entries for page <strong>{page}</strong> (Page size: {pageSize})
          </p>
        </div>
        <Pagination
          totalItems={totalItems}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state: 1-10 of 125 items, 1 of 13 pages
    expect(canvas.getByText("1–10 of 125 items")).toBeInTheDocument();
    expect(canvas.getByText("1 of 13 pages")).toBeInTheDocument();

    const prevButton = canvas.getByRole("button", { name: "Previous page" });
    const nextButton = canvas.getByRole("button", { name: "Next page" });

    // Prev button is initially disabled on page 1
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    // Click next page
    await userEvent.click(nextButton);
    expect(canvas.getByText("11–20 of 125 items")).toBeInTheDocument();
    expect(canvas.getByText("2 of 13 pages")).toBeInTheDocument();
    expect(prevButton).toBeEnabled();

    // Click previous page back to 1
    await userEvent.click(prevButton);
    expect(canvas.getByText("1–10 of 125 items")).toBeInTheDocument();
    expect(canvas.getByText("1 of 13 pages")).toBeInTheDocument();
    expect(prevButton).toBeDisabled();

    // Change page size to 20
    const sizeSelect = canvas.getByRole("combobox", { name: "Items per page" });
    await userEvent.selectOptions(sizeSelect, "20");
    expect(canvas.getByText("1–20 of 125 items")).toBeInTheDocument();
    expect(canvas.getByText("1 of 7 pages")).toBeInTheDocument();
  },
};

function BoundariesAndDisabledExample() {
  const [p1, setP1] = useState(1);
  const [p2, setP2] = useState(5);
  const [p3, setP3] = useState(1);

  return (
    <div className="data-story-stack">
      {/* First Page Boundary */}
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <h4 className="data-table-title">First Page Boundary (Page 1 of 5)</h4>
        </div>
        <Pagination
          aria-label="First page boundary pagination"
          totalItems={50}
          page={p1}
          pageSize={10}
          onPageChange={setP1}
        />
      </div>

      {/* Last Page Boundary */}
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <h4 className="data-table-title">Last Page Boundary (Page 5 of 5)</h4>
        </div>
        <Pagination
          aria-label="Last page boundary pagination"
          totalItems={50}
          page={p2}
          pageSize={10}
          onPageChange={setP2}
        />
      </div>

      {/* Single Page (Only 1 page exists) */}
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <h4 className="data-table-title">Single Page Dataset (Page 1 of 1)</h4>
        </div>
        <Pagination
          aria-label="Single page dataset pagination"
          totalItems={8}
          page={p3}
          pageSize={10}
          onPageChange={setP3}
        />
      </div>
    </div>
  );
}

export const BoundariesAndDisabled: Story = {
  render: () => <BoundariesAndDisabledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const navs = canvas.getAllByRole("navigation");
    expect(navs.length).toBe(3);

    // Nav 1: first page boundary
    const nav1 = within(navs[0]!);
    expect(nav1.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(nav1.getByRole("button", { name: "Next page" })).toBeEnabled();

    // Nav 2: last page boundary
    const nav2 = within(navs[1]!);
    expect(nav2.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(nav2.getByRole("button", { name: "Next page" })).toBeDisabled();

    // Nav 3: single page dataset
    const nav3 = within(navs[2]!);
    expect(nav3.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(nav3.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};

const ingestionPods = Array.from({ length: 28 }, (_, i) => ({
  id: `pod-${i + 1}`,
  name: `ingestion-pod-worker-${String(i + 1).padStart(2, "0")}`,
  zone: i % 2 === 0 ? "us-east-1a" : "us-east-1b",
  memory: `${(((i + 1) * 128) % 1024) + 256} MiB`,
  uptime: `${(i % 12) + 1}d ${(i % 24) + 1}h`,
}));

function WithTableExample() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const startIndex = (page - 1) * pageSize;
  const pageRecords = ingestionPods.slice(startIndex, startIndex + pageSize);

  return (
    <div className="data-story-stack">
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <div>
            <h3 className="data-table-title">Cluster Ingestion Pods</h3>
            <p className="data-table-description">Paginated workload instance inventory.</p>
          </div>
          <span className="data-table-status-badge">Total Pods: {ingestionPods.length}</span>
        </div>
        <Table aria-label="Cluster Ingestion Pods Table">
          <TableHeader>
            <Column id="col-pod" isRowHeader>
              Pod Identifier
            </Column>
            <Column id="col-zone">Availability Zone</Column>
            <Column id="col-memory">Memory Usage</Column>
            <Column id="col-uptime">Uptime</Column>
          </TableHeader>
          <TableBody items={pageRecords} dependencies={[page, pageSize]}>
            {(pod) => (
              <Row key={pod.id} id={pod.id}>
                <Cell>{pod.name}</Cell>
                <Cell>{pod.zone}</Cell>
                <Cell>{pod.memory}</Cell>
                <Cell>{pod.uptime}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
        <Pagination
          totalItems={ingestionPods.length}
          page={page}
          pageSize={pageSize}
          pageSizes={[5, 10, 20]}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}

export const WithTable: Story = {
  render: () => <WithTableExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial page: shows worker-01
    expect(await canvas.findByText("ingestion-pod-worker-01")).toBeInTheDocument();
    expect(canvas.getByText("1–5 of 28 items")).toBeInTheDocument();

    // Click next page
    const nextBtn = canvas.getByRole("button", { name: "Next page" });
    await userEvent.click(nextBtn);

    // Page 2: shows worker-06
    expect(await canvas.findByText("ingestion-pod-worker-06")).toBeInTheDocument();
    expect(canvas.getByText("6–10 of 28 items")).toBeInTheDocument();
  },
};

function LongContentExample() {
  const { theme } = useTheme();
  const [p1, setP1] = useState(1);
  const [p2, setP2] = useState(3);

  return (
    <div className="data-story-stack">
      {/* Large count */}
      <div className="data-table-card">
        <div className="data-table-header-bar">
          <h4 className="data-table-title">Large Dataset Range (50,000 items)</h4>
        </div>
        <Pagination
          aria-label="Large volume pagination"
          totalItems={50000}
          page={p1}
          pageSize={100}
          pageSizes={[25, 50, 100, 250]}
          onPageChange={setP1}
        />
      </div>

      {/* RTL fa-IR */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="data-table-card">
          <div className="data-table-header-bar">
            <div>
              <h4 className="data-table-title">صفحه‌بندی گزارشات و تراکنش‌ها</h4>
              <p className="data-table-description">نمایش صفحات تراکنش‌ها در حالت راست‌به‌چپ</p>
            </div>
          </div>
          <Pagination
            aria-label="صفحه‌بندی تراکنش‌ها"
            totalItems={145}
            page={p2}
            pageSize={10}
            onPageChange={setP2}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Large Dataset Range (50,000 items)")).toBeInTheDocument();
    expect(canvas.getByText("1–100 of 50000 items")).toBeInTheDocument();

    const rtlNav = canvas.getByRole("navigation", { name: "صفحه‌بندی تراکنش‌ها" });
    expect(rtlNav).toBeInTheDocument();
    expect(within(rtlNav).getByText("21–30 of 145 items")).toBeInTheDocument();
  },
};
