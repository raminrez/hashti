import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge, Button, Icon, Theme } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "Badges provide floating numeric counts or status dot indicators on icons, buttons, or standalone counters.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <h4 className="content-card-title">Floating count badges</h4>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Badge count={5} variant="danger">
            <Button variant="secondary" iconOnly aria-label="Notifications">
              <Icon name="alert" />
            </Button>
          </Badge>

          <Badge count={120} max={99} variant="info">
            <Button variant="secondary" iconOnly aria-label="Messages">
              <Icon name="inbox" />
            </Button>
          </Badge>

          <Badge isDot variant="success" placement="bottom-right">
            <Button variant="secondary" iconOnly aria-label="System status">
              <Icon name="settings" />
            </Button>
          </Badge>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("5")).toBeInTheDocument();
    expect(canvas.getByText("99+")).toBeInTheDocument();
  },
};

export const KindsAndPlacements: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <h4 className="content-card-title">Status Variants</h4>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Badge count={3} variant="danger" />
          <Badge count={8} variant="warning" />
          <Badge count={14} variant="success" />
          <Badge count={42} variant="info" />
          <Badge count={99} variant="neutral" />
          <Badge isDot variant="danger" />
          <Badge isDot variant="success" />
        </div>
      </div>
      <div className="content-card">
        <h4 className="content-card-title">Corner Placements</h4>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <Badge count={5} placement="top-end">
            <Button variant="secondary" iconOnly aria-label="Top end">
              <Icon name="inbox" />
            </Button>
          </Badge>
          <Badge count={5} placement="top-start">
            <Button variant="secondary" iconOnly aria-label="Top start">
              <Icon name="inbox" />
            </Button>
          </Badge>
          <Badge count={5} placement="bottom-end">
            <Button variant="secondary" iconOnly aria-label="Bottom end">
              <Icon name="inbox" />
            </Button>
          </Badge>
          <Badge count={5} placement="bottom-start">
            <Button variant="secondary" iconOnly aria-label="Bottom start">
              <Icon name="inbox" />
            </Button>
          </Badge>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("42")).toBeInTheDocument();
    expect(canvas.getAllByText("5")).toHaveLength(4);
  },
};

export const RTL: Story = {
  render: () => (
    <Theme dir="rtl">
      <div dir="rtl" className="content-story-stack">
        <div className="content-card">
          <h4 className="content-card-title">نشان‌های شمارنده راست‌به‌چپ (RTL)</h4>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Badge count={12} variant="danger">
              <Button variant="secondary" iconOnly aria-label="پیام‌ها">
                <Icon name="inbox" />
              </Button>
            </Badge>
            <Badge count={150} max={99} variant="warning">
              <Button variant="secondary" iconOnly aria-label="هشدارها">
                <Icon name="alert" />
              </Button>
            </Badge>
          </div>
        </div>
      </div>
    </Theme>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("12")).toBeInTheDocument();
    expect(canvas.getByText("99+")).toBeInTheDocument();
  },
};
