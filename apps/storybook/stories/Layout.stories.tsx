import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stack, Grid, GridColumn, Button, Theme, useTheme } from "@hashti/react";
import "./layout.css";

const meta = {
  title: "Layout/GridAndStack",
  component: Grid,
  parameters: {
    docs: {
      description: {
        component:
          "Grid and Stack provide flexible responsive layout primitives based on standard spacing tokens and column grid breakpoints.",
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

function StackExample() {
  return (
    <div className="layout-story-stack">
      <div className="layout-card">
        <div>
          <h3 className="layout-card-title">Vertical and Horizontal Stacks</h3>
          <p className="layout-card-description">
            Configurable gap spacing tokens between layout items.
          </p>
        </div>
        <Stack gap={4}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            Horizontal Action Stack (gap=3)
          </div>
          <Stack orientation="horizontal" gap={3}>
            <Button variant="primary">Deploy Service</Button>
            <Button variant="secondary">Run Verification</Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}

export const StackLayout: Story = {
  render: () => <StackExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Vertical and Horizontal Stacks")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Deploy Service" })).toBeInTheDocument();
  },
};

function GridLayoutExample() {
  return (
    <div className="layout-story-stack">
      <div className="layout-card">
        <div>
          <h3 className="layout-card-title">Responsive Column Grid</h3>
          <p className="layout-card-description">
            Grid spanning across 4 mobile columns, 8 tablet columns, and 16 desktop columns.
          </p>
        </div>
        <Grid>
          <GridColumn sm={4} md={4} lg={8}>
            <div className="layout-grid-demo-col">Column Span: sm=4, md=4, lg=8</div>
          </GridColumn>
          <GridColumn sm={4} md={4} lg={8}>
            <div className="layout-grid-demo-col">Column Span: sm=4, md=4, lg=8</div>
          </GridColumn>
          <GridColumn sm={2} md={4} lg={4}>
            <div className="layout-grid-demo-col">Span: 4 cols</div>
          </GridColumn>
          <GridColumn sm={2} md={4} lg={4}>
            <div className="layout-grid-demo-col">Span: 4 cols</div>
          </GridColumn>
          <GridColumn sm={2} md={4} lg={4}>
            <div className="layout-grid-demo-col">Span: 4 cols</div>
          </GridColumn>
          <GridColumn sm={2} md={4} lg={4}>
            <div className="layout-grid-demo-col">Span: 4 cols</div>
          </GridColumn>
        </Grid>
      </div>
    </div>
  );
}

export const GridLayout: Story = {
  render: () => <GridLayoutExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Responsive Column Grid")).toBeInTheDocument();
    expect(canvas.getAllByText(/Column Span/)).toHaveLength(2);
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="layout-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="layout-card">
          <div>
            <h4 className="layout-card-title">سیستم شبکه و چیدمان ستونی (فارسی)</h4>
            <p className="layout-card-description">تطبیق خودکار چینش ستون‌ها در زبان راست‌به‌چپ</p>
          </div>
          <Grid>
            <GridColumn sm={4} md={4} lg={8}>
              <div className="layout-grid-demo-col">ستون داده‌های آماری</div>
            </GridColumn>
            <GridColumn sm={4} md={4} lg={8}>
              <div className="layout-grid-demo-col">ستون گزارش‌های تحلیلی</div>
            </GridColumn>
          </Grid>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ستون داده‌های آماری")).toBeInTheDocument();
  },
};
