import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Header, HeaderName, HeaderNav, Link, Button, Icon, Theme, useTheme } from "@hashti/react";
import "./layout.css";

const meta = {
  title: "Navigation/Header",
  component: Header,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Header provides top-level persistent application navigation, branding, and global utilities based on Hashti modern design patterns.",
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  return (
    <div className="layout-story-stack">
      <div className="layout-card">
        <div>
          <h3 className="layout-card-title">Application Header</h3>
          <p className="layout-card-description">
            Top-level navigation with logo branding, nav links, and global actions.
          </p>
        </div>
        <Header aria-label="Global application header">
          <HeaderName href="#home">
            <Icon name="code" size={20} />
            <span>Cinder Cloud</span>
          </HeaderName>
          <HeaderNav aria-label="Platform areas">
            <Link href="#dashboard" aria-current="page">
              Dashboard
            </Link>
            <Link href="#deployments">Deployments</Link>
            <Link href="#metrics">Metrics</Link>
            <Link href="#settings">Settings</Link>
          </HeaderNav>
          <div
            style={{
              marginInlineStart: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Button variant="ghost" size="md" iconOnly aria-label="Search resources">
              <Icon name="search" />
            </Button>
            <Button variant="ghost" size="md" iconOnly aria-label="Open notifications">
              <Icon name="info" />
            </Button>
          </div>
        </Header>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cinder Cloud")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    expect(canvas.getByRole("link", { name: "Deployments" })).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="layout-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="layout-card">
          <div>
            <h4 className="layout-card-title">سربرگ ناوبری چندزبانه (فارسی)</h4>
            <p className="layout-card-description">
              ساختار هدر و منوی سراسری سیستم با چینش راست‌به‌چپ
            </p>
          </div>
          <Header aria-label="سربرگ ناوبری سراسری سامانه">
            <HeaderName href="#home-fa">
              <Icon name="code" size={20} />
              <span>ابر سیندر</span>
            </HeaderName>
            <HeaderNav aria-label="بخش‌های اصلی پرتال">
              <Link href="#dashboard-fa" aria-current="page">
                پیشخوان
              </Link>
              <Link href="#clusters-fa">خوشه‌ها</Link>
              <Link href="#telemetry-fa">پایش و لاگ‌ها</Link>
              <Link href="#access-fa">مدیریت دسترسی</Link>
            </HeaderNav>
            <div
              style={{
                marginInlineStart: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Button variant="ghost" size="md" iconOnly aria-label="جستجوی سرویس‌ها">
                <Icon name="search" />
              </Button>
            </div>
          </Header>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ابر سیندر")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "پیشخوان" })).toHaveAttribute("aria-current", "page");
  },
};
