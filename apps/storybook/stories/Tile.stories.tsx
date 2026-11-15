import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  Theme,
  useTheme,
} from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/Tile",
  component: Tile,
  args: {
    children: "Sample tile content",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Tiles are flexible containers for grouping related content, metrics, actions, or selectable choices across dashboards and interactive workflows.",
      },
    },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="content-story-stack">
      <div className="content-tile-grid">
        {/* Base Tile */}
        <Tile>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--hashti-text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            Base Tile
          </span>
          <h4 style={{ margin: "0.5rem 0 0.25rem", color: "var(--hashti-text-primary)" }}>
            Cluster Health
          </h4>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
            99.98% operational uptime across 12 pods.
          </p>
        </Tile>

        {/* Clickable Tile */}
        <ClickableTile href="#metrics">
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--hashti-interactive)",
              letterSpacing: "0.05em",
            }}
          >
            Clickable Tile →
          </span>
          <h4 style={{ margin: "0.5rem 0 0.25rem", color: "var(--hashti-text-primary)" }}>
            View Telemetry
          </h4>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
            Analyze p99 latency and ingress distribution.
          </p>
        </ClickableTile>

        {/* Selectable Tile */}
        <SelectableTile
          id="tile-storage"
          name="addon"
          selected={selected}
          onChange={setSelected}
          title="Enable SSD Persistent Storage"
        >
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--hashti-text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            Selectable Choice
          </span>
          <h4 style={{ margin: "0.5rem 0 0.25rem", color: "var(--hashti-text-primary)" }}>
            SSD Storage Pool
          </h4>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
            Provision high-IOPS NVMe drive tier.
          </p>
        </SelectableTile>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cluster Health")).toBeInTheDocument();

    const linkTile = canvas.getByRole("link", { name: /View Telemetry/i });
    expect(linkTile).toBeInTheDocument();
    expect(linkTile).toHaveAttribute("href", "#metrics");

    const checkbox = canvas.getByRole("checkbox", { name: /SSD Storage Pool/ });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  },
};

function ExpandableExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Expandable Tile Container</h4>
          <p className="content-card-description">
            Progressive disclosure for high-density summary views and technical logs.
          </p>
        </div>
        <ExpandableTile
          expanded={isExpanded}
          onToggle={setIsExpanded}
          tileAboveTheFoldContent={
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--hashti-text-secondary)",
                  textTransform: "uppercase",
                }}
              >
                Audit Record #9482
              </span>
              <h4 style={{ margin: "0.25rem 0 0", color: "var(--hashti-text-primary)" }}>
                Deployment Pipeline Executed
              </h4>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.875rem",
                  color: "var(--hashti-text-secondary)",
                }}
              >
                Triggered by commit a4f89d1 on branch main.
              </p>
            </div>
          }
          tileBelowTheFoldContent={
            <div
              style={{
                paddingTop: "0.75rem",
                borderTop: "1px dashed var(--hashti-border-subtle)",
                fontSize: "0.875rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              <p style={{ margin: "0 0 0.5rem" }}>
                <strong>Target Cluster:</strong> edge-prod-us-east-1
              </p>
              <p style={{ margin: "0 0 0.5rem" }}>
                <strong>Artifact Size:</strong> 42.8 MB
              </p>
              <p style={{ margin: 0 }}>
                <strong>Verification:</strong> 14/14 automated smoke tests passed.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}

export const Expandable: Story = {
  render: () => <ExpandableExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Deployment Pipeline Executed")).toBeInTheDocument();

    const expandBtn = canvas.getByRole("button", { name: /show more/i });
    expect(expandBtn).toBeInTheDocument();
    await userEvent.click(expandBtn);

    expect(await canvas.findByText(/Verification:/i)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: /show less/i })).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();
  const [faSelected, setFaSelected] = useState(true);

  return (
    <div className="content-story-stack">
      {/* Persian RTL Tile */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="content-story-stack">
          <div className="content-tile-grid">
            <Tile>
              <span style={{ fontSize: "0.75rem", color: "var(--hashti-text-secondary)" }}>
                کارت اطلاعات پایه
              </span>
              <h4 style={{ margin: "0.5rem 0 0.25rem", color: "var(--hashti-text-primary)" }}>
                وضعیت سرورهای ابری
              </h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
                تمام سرویس‌های منطقه تهران با پایداری ۱۰۰٪ فعال هستند.
              </p>
            </Tile>

            <SelectableTile
              id="fa-tile-backup"
              selected={faSelected}
              onChange={setFaSelected}
              title="پشتیبان‌گیری خودکار روزانه"
            >
              <span style={{ fontSize: "0.75rem", color: "var(--hashti-text-secondary)" }}>
                گزینه انتخابی
              </span>
              <h4 style={{ margin: "0.5rem 0 0.25rem", color: "var(--hashti-text-primary)" }}>
                پشتیبان‌گیری ابری
              </h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--hashti-text-secondary)" }}>
                تهیه نسخه پشتیبان به‌صورت خودکار هر شب ساعت ۱۲.
              </p>
            </SelectableTile>
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
    expect(canvas.getByText("وضعیت سرورهای ابری")).toBeInTheDocument();
    expect(canvas.getByText("پشتیبان‌گیری ابری")).toBeInTheDocument();

    const faCheckbox = canvas.getByRole("checkbox", { name: /پشتیبان‌گیری ابری/ });
    expect(faCheckbox).toBeChecked();
    await userEvent.click(faCheckbox);
    expect(faCheckbox).not.toBeChecked();
  },
};
