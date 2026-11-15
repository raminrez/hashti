import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  ContentSwitcher,
  Icon,
  Theme,
  ToggleButton,
  useTheme,
  type Selection,
} from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/ContentSwitcher",
  component: ContentSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          "ContentSwitcher (segmented button group) lets users toggle between mutually exclusive views, display modes, or data slices.",
      },
    },
  },
} satisfies Meta<typeof ContentSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selected, setSelected] = useState<Selection>(new Set(["table"]));
  const selectedStr = Array.from(selected as Set<string>)[0] ?? "table";

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>
          Active view: <strong>{selectedStr}</strong>
        </span>
      </div>
      <ContentSwitcher
        aria-label="Dataset presentation modes"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <ToggleButton id="table">Table view</ToggleButton>
        <ToggleButton id="cards">Card grid</ToggleButton>
        <ToggleButton id="kanban">Kanban board</ToggleButton>
      </ContentSwitcher>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const tableRadio = canvas.getByRole("radio", { name: "Table view" });
    const cardsRadio = canvas.getByRole("radio", { name: "Card grid" });
    const kanbanRadio = canvas.getByRole("radio", { name: "Kanban board" });

    expect(tableRadio).toHaveAttribute("aria-checked", "true");
    expect(cardsRadio).toHaveAttribute("aria-checked", "false");

    await userEvent.click(cardsRadio);
    expect(cardsRadio).toHaveAttribute("aria-checked", "true");
    expect(tableRadio).toHaveAttribute("aria-checked", "false");
    await waitFor(() => expect(canvas.getByText("cards")).toBeVisible());

    await userEvent.click(kanbanRadio);
    expect(kanbanRadio).toHaveAttribute("aria-checked", "true");
    await waitFor(() => expect(canvas.getByText("kanban")).toBeVisible());
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Small (sm)</h4>
        <ContentSwitcher size="sm" defaultSelectedKeys={["day"]} aria-label="Small switcher">
          <ToggleButton id="day">Day</ToggleButton>
          <ToggleButton id="week">Week</ToggleButton>
          <ToggleButton id="month">Month</ToggleButton>
        </ContentSwitcher>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Medium (md - default)</h4>
        <ContentSwitcher size="md" defaultSelectedKeys={["list"]} aria-label="Medium switcher">
          <ToggleButton id="list">List view</ToggleButton>
          <ToggleButton id="detail">Detail view</ToggleButton>
          <ToggleButton id="split">Split view</ToggleButton>
        </ContentSwitcher>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Large (lg)</h4>
        <ContentSwitcher size="lg" defaultSelectedKeys={["overview"]} aria-label="Large switcher">
          <ToggleButton id="overview">Overview</ToggleButton>
          <ToggleButton id="metrics">Metrics</ToggleButton>
          <ToggleButton id="logs">Audit logs</ToggleButton>
        </ContentSwitcher>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const weekRadio = canvas.getByRole("radio", { name: "Week" });
    expect(weekRadio).toHaveAttribute("aria-checked", "false");

    await userEvent.click(weekRadio);
    expect(weekRadio).toHaveAttribute("aria-checked", "true");
  },
};

export const DisabledOptions: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <ContentSwitcher defaultSelectedKeys={["read"]} aria-label="Access levels">
        <ToggleButton id="read">Read only</ToggleButton>
        <ToggleButton id="write">Read / Write</ToggleButton>
        <ToggleButton id="admin" isDisabled>
          Administrator (Restricted)
        </ToggleButton>
      </ContentSwitcher>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const adminRadio = canvas.getByRole("radio", { name: /Administrator/ });
    const writeRadio = canvas.getByRole("radio", { name: "Read / Write" });

    expect(adminRadio).toBeDisabled();

    await userEvent.click(writeRadio);
    expect(writeRadio).toHaveAttribute("aria-checked", "true");
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <ContentSwitcher defaultSelectedKeys={["search"]} aria-label="Navigation modes">
        <ToggleButton
          id="search"
          style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}
        >
          <Icon name="search" />
          <span>Search</span>
        </ToggleButton>
        <ToggleButton
          id="settings"
          style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}
        >
          <Icon name="settings" />
          <span>Settings</span>
        </ToggleButton>
      </ContentSwitcher>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const searchRadio = canvas.getByRole("radio", { name: /Search/ });
    const settingsRadio = canvas.getByRole("radio", { name: /Settings/ });

    expect(searchRadio).toHaveAttribute("aria-checked", "true");

    await userEvent.click(settingsRadio);
    expect(settingsRadio).toHaveAttribute("aria-checked", "true");
  },
};

function LocalizedContentSwitcher() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <ContentSwitcher defaultSelectedKeys={["hourly"]} aria-label="دوره‌های گزارش‌گیری">
            <ToggleButton id="hourly">ساعتی</ToggleButton>
            <ToggleButton id="daily">روزانه</ToggleButton>
            <ToggleButton id="monthly">ماهانه</ToggleButton>
          </ContentSwitcher>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedContentSwitcher />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const hourlyRadio = canvas.getByRole("radio", { name: "ساعتی" });
    const dailyRadio = canvas.getByRole("radio", { name: "روزانه" });

    expect(hourlyRadio).toHaveAttribute("aria-checked", "true");

    await userEvent.click(dailyRadio);
    expect(dailyRadio).toHaveAttribute("aria-checked", "true");
  },
};
