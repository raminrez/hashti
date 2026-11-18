import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Meter } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Feedback/Meter",
  component: Meter,
  parameters: {
    docs: {
      description: {
        component:
          "Meter visualizes a static quantity within a known range with semantic thresholds (low, high, optimum) automatically deriving success, warning, and error tones.",
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { value: 85 },
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Compute Cluster CPU Utilization</h4>
        <p className="feedback-card-description">
          Demonstrates threshold-driven tone derivation (optimum=20, low=60, high=80).
        </p>
        <Meter
          label="CPU Load"
          value={85}
          min={0}
          max={100}
          low={60}
          high={80}
          optimum={20}
          helperText="High load threshold exceeded (>= 80%)."
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter", { name: "CPU Load" });
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute("aria-valuenow", "85");
    expect(meter).toHaveAttribute("data-tone", "error");
    expect(canvas.getByText("High load threshold exceeded (>= 80%).")).toBeInTheDocument();
  },
};

export const ThresholdTones: Story = {
  args: { value: 30 },
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Optimum Lower (e.g. Memory / CPU)</h4>
        <Meter
          label="Normal Load (Success)"
          value={30}
          low={60}
          high={80}
          optimum={20}
          helperText="Optimal performance under 60%."
        />
        <Meter
          label="Elevated Load (Warning)"
          value={70}
          low={60}
          high={80}
          optimum={20}
          helperText="Approaching threshold capacity."
        />
        <Meter
          label="Critical Load (Error)"
          value={90}
          low={60}
          high={80}
          optimum={20}
          helperText="Resource saturation detected."
        />
      </div>

      <div className="feedback-card">
        <h4 className="feedback-card-title">Optimum Higher (e.g. Battery / Health Score)</h4>
        <Meter
          label="High Battery (Success)"
          value={92}
          low={25}
          high={75}
          optimum={90}
          helperText="Fully charged."
        />
        <Meter
          label="Medium Battery (Warning)"
          value={50}
          low={25}
          high={75}
          optimum={90}
          helperText="Moderate battery remaining."
        />
        <Meter
          label="Low Battery (Error)"
          value={15}
          low={25}
          high={75}
          optimum={90}
          helperText="Connect power adapter."
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const normal = canvas.getByRole("meter", { name: "Normal Load (Success)" });
    const elevated = canvas.getByRole("meter", { name: "Elevated Load (Warning)" });
    const critical = canvas.getByRole("meter", { name: "Critical Load (Error)" });

    expect(normal).toHaveAttribute("data-tone", "success");
    expect(elevated).toHaveAttribute("data-tone", "warning");
    expect(critical).toHaveAttribute("data-tone", "error");
  },
};

export const Sizes: Story = {
  args: { value: 60 },
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Track Thickness Sizes</h4>
        <Meter size="sm" label="Small Meter (sm - 4px)" value={60} />
        <Meter size="md" label="Medium Meter (md - 8px)" value={60} />
        <Meter size="lg" label="Large Meter (lg - 12px)" value={60} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sm = canvas.getByRole("meter", { name: "Small Meter (sm - 4px)" });
    const md = canvas.getByRole("meter", { name: "Medium Meter (md - 8px)" });
    const lg = canvas.getByRole("meter", { name: "Large Meter (lg - 12px)" });

    expect(sm).toHaveAttribute("data-size", "sm");
    expect(md).toHaveAttribute("data-size", "md");
    expect(lg).toHaveAttribute("data-size", "lg");
  },
};

export const MultiSegment: Story = {
  args: { value: 85 },
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Storage Breakdown (Multi-Segment)</h4>
        <p className="feedback-card-description">
          Visualizes composite disk usage: OS (30GB), Apps (40GB), Cache (15GB).
        </p>
        <Meter
          label="SSD Capacity (100 GB)"
          value={85}
          min={0}
          max={100}
          segments={[
            { value: 30, color: "var(--hashti-interactive, #0f62fe)", label: "System OS" },
            { value: 40, color: "var(--hashti-support-info, #0043ce)", label: "Applications" },
            { value: 15, color: "var(--hashti-support-warning, #f1c21b)", label: "User Cache" },
          ]}
          helperText="15 GB free of 100 GB."
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter", { name: "SSD Capacity (100 GB)" });
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute("aria-valuenow", "85");
  },
};

export const CircularVariant: Story = {
  args: { value: 42 },
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Circular Meter Gauges</h4>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Meter
            variant="circular"
            size="sm"
            label="RAM"
            value={42}
            tone="success"
            helperText="42%"
          />
          <Meter
            variant="circular"
            size="md"
            label="Disk"
            value={78}
            low={60}
            high={75}
            optimum={20}
            helperText="78%"
          />
          <Meter
            variant="circular"
            size="lg"
            label="GPU"
            value={94}
            low={60}
            high={85}
            optimum={20}
            helperText="94%"
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ram = canvas.getByRole("meter", { name: "RAM" });
    const disk = canvas.getByRole("meter", { name: "Disk" });
    const gpu = canvas.getByRole("meter", { name: "GPU" });

    expect(ram).toHaveAttribute("data-variant", "circular");
    expect(disk).toHaveAttribute("data-variant", "circular");
    expect(gpu).toHaveAttribute("data-variant", "circular");
  },
};
