import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Breadcrumb,
  Breadcrumbs,
  Button,
  Link,
  MenuItem,
  OverflowMenu,
  Theme,
  useTheme,
} from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          "Breadcrumbs shows a structured hierarchy back to parent pages, with slash separators and aria-current on the active page.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Breadcrumbs aria-label="Breadcrumb navigation">
        <Breadcrumb>
          <Link href="#home">Home</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#projects">Projects</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#cinder">Cinder</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link>Components</Link>
        </Breadcrumb>
      </Breadcrumbs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const homeLink = await canvas.findByRole("link", { name: "Home" });
    const currentItem = await canvas.findByText("Components");

    await waitFor(() => expect(homeLink).toBeVisible());
    expect(homeLink).toHaveAttribute("href", "#home");
    expect(currentItem).toHaveAttribute("aria-current", "page");
  },
};

export const States: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Standard items with href links</h4>
        <Breadcrumbs aria-label="Standard states">
          <Breadcrumb>
            <Link href="/docs">Documentation</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/docs/components">Components</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link>Navigation</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Single-level trail</h4>
        <Breadcrumbs aria-label="Root only">
          <Breadcrumb>
            <Link>Dashboard</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const docsLink = await canvas.findByRole("link", { name: "Documentation" });
    const navItem = await canvas.findByText("Navigation");
    const dashItem = await canvas.findByText("Dashboard");

    expect(docsLink).toHaveAttribute("href", "/docs");
    expect(navItem).toHaveAttribute("aria-current", "page");
    expect(dashItem).toHaveAttribute("aria-current", "page");
  },
};

export const Hierarchy: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Breadcrumbs aria-label="Cloud infrastructure hierarchy">
        <Breadcrumb>
          <Link href="#org">Acme Corp</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#production">Production US-East</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#k8s">Kubernetes Clusters</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#nodes">Worker Nodes</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link>node-pool-alpha-04</Link>
        </Breadcrumb>
      </Breadcrumbs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nodeItem = await canvas.findByText("node-pool-alpha-04");
    expect(nodeItem).toHaveAttribute("aria-current", "page");

    const k8sLink = await canvas.findByRole("link", { name: "Kubernetes Clusters" });
    expect(k8sLink).toHaveAttribute("href", "#k8s");
  },
};

export const CollapsibleOrOverflow: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <Breadcrumbs aria-label="Collapsed breadcrumbs">
        <Breadcrumb>
          <Link href="#root">Workspaces</Link>
        </Breadcrumb>
        <Breadcrumb>
          <OverflowMenu aria-label="Show intermediate path" size="sm">
            <MenuItem href="#engineering">Engineering Org</MenuItem>
            <MenuItem href="#frontend">Frontend Platform</MenuItem>
            <MenuItem href="#design-system">Design System</MenuItem>
          </OverflowMenu>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#cinder">Cinder</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link>Breadcrumbs</Link>
        </Breadcrumb>
      </Breadcrumbs>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const menuTrigger = await canvas.findByRole("button", { name: "Show intermediate path" });
    await waitFor(() => expect(menuTrigger).toBeVisible());

    await userEvent.click(menuTrigger);
    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    const engineeringItem = await within(popover).findByRole("menuitem", {
      name: "Engineering Org",
    });
    await waitFor(() => expect(engineeringItem).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(menuTrigger).toHaveFocus());
  },
};

function CustomBreadcrumbWithRef() {
  const breadcrumbRef = useRef<HTMLOListElement>(null);

  return (
    <div className="navigation-story-stack">
      <Breadcrumbs
        ref={breadcrumbRef}
        aria-label="Ref targeting example"
        className="custom-breadcrumbs-root"
      >
        <Breadcrumb>
          <Link href="#settings">Settings</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="#security">Security</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link>Audit Log</Link>
        </Breadcrumb>
      </Breadcrumbs>

      <Button
        size="sm"
        variant="secondary"
        onPress={() => {
          if (breadcrumbRef.current) {
            breadcrumbRef.current.style.outline = "2px solid var(--hashti-focus)";
          }
        }}
      >
        Outline breadcrumbs via ref
      </Button>
    </div>
  );
}

export const CustomStylingAndRefs: Story = {
  render: () => <CustomBreadcrumbWithRef />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const btn = await canvas.findByRole("button", { name: "Outline breadcrumbs via ref" });
    await userEvent.click(btn);

    const nav = await canvas.findByRole("list", { name: "Ref targeting example" });
    expect(nav).toHaveClass("custom-breadcrumbs-root");
  },
};

function LocalizedBreadcrumbs() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <Breadcrumbs aria-label="مسیر راهنما">
            <Breadcrumb>
              <Link href="#home">خانه</Link>
            </Breadcrumb>
            <Breadcrumb>
              <Link href="#settings">تنظیمات سامانه</Link>
            </Breadcrumb>
            <Breadcrumb>
              <Link href="#clusters">خوشه‌های پردازشی</Link>
            </Breadcrumb>
            <Breadcrumb>
              <Link>پیکربندی گره‌ها</Link>
            </Breadcrumb>
          </Breadcrumbs>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedBreadcrumbs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const homeLink = await canvas.findByRole("link", { name: "خانه" });
    const currentItem = await canvas.findByText("پیکربندی گره‌ها");

    await waitFor(() => expect(homeLink).toBeVisible());
    expect(currentItem).toHaveAttribute("aria-current", "page");
  },
};
