"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ContentSwitcher, Icon, Theme, ToggleButton, useTheme } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/ContentSwitcher",
  component: ContentSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          "ContentSwitcher (segmented button group) lets users toggle between mutually exclusive views, display modes, or data slices. One option always stays pressed.",
      },
    },
  },
} satisfies Meta<typeof ContentSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selected, setSelected] = useState(["table"]);

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>
          Active view: <strong>{selected[0] ?? "none"}</strong>
        </span>
      </div>
      <ContentSwitcher
        aria-label="Dataset presentation modes"
        value={selected}
        onValueChange={(value) => setSelected(value)}
      >
        <ToggleButton value="table">Table view</ToggleButton>
        <ToggleButton value="cards">Card grid</ToggleButton>
        <ToggleButton value="kanban">Kanban board</ToggleButton>
      </ContentSwitcher>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const tableToggle = canvas.getByRole("button", { name: "Table view" });
    const cardsToggle = canvas.getByRole("button", { name: "Card grid" });
    const kanbanToggle = canvas.getByRole("button", { name: "Kanban board" });

    expect(tableToggle).toHaveAttribute("aria-pressed", "true");
    expect(cardsToggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(cardsToggle);
    expect(cardsToggle).toHaveAttribute("aria-pressed", "true");
    expect(tableToggle).toHaveAttribute("aria-pressed", "false");
    expect(canvas.getByText("cards")).toBeVisible();

    await userEvent.click(kanbanToggle);
    expect(kanbanToggle).toHaveAttribute("aria-pressed", "true");
    expect(canvas.getByText("kanban")).toBeVisible();

    // One option always stays pressed: pressing the pressed toggle keeps it.
    await userEvent.click(kanbanToggle);
    expect(kanbanToggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Small (sm)</h4>
        <ContentSwitcher size="sm" defaultValue={["day"]} aria-label="Small switcher">
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ContentSwitcher>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Medium (md - default)</h4>
        <ContentSwitcher size="md" defaultValue={["list"]} aria-label="Medium switcher">
          <ToggleButton value="list">List view</ToggleButton>
          <ToggleButton value="detail">Detail view</ToggleButton>
          <ToggleButton value="split">Split view</ToggleButton>
        </ContentSwitcher>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Large (lg)</h4>
        <ContentSwitcher size="lg" defaultValue={["overview"]} aria-label="Large switcher">
          <ToggleButton value="overview">Overview</ToggleButton>
          <ToggleButton value="metrics">Metrics</ToggleButton>
          <ToggleButton value="logs">Audit logs</ToggleButton>
        </ContentSwitcher>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const weekToggle = canvas.getByRole("button", { name: "Week" });
    expect(weekToggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(weekToggle);
    expect(weekToggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const DisabledOptions: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <ContentSwitcher defaultValue={["read"]} aria-label="Access levels">
        <ToggleButton value="read">Read only</ToggleButton>
        <ToggleButton value="write">Read / Write</ToggleButton>
        <ToggleButton value="admin" disabled>
          Administrator (Restricted)
        </ToggleButton>
      </ContentSwitcher>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const adminToggle = canvas.getByRole("button", { name: /Administrator/ });
    const writeToggle = canvas.getByRole("button", { name: "Read / Write" });

    // In a group, a disabled toggle stays reachable and reports aria-disabled.
    expect(adminToggle).toHaveAttribute("aria-disabled", "true");
    expect(adminToggle).toHaveAttribute("data-disabled");

    await userEvent.click(writeToggle);
    expect(writeToggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <ContentSwitcher defaultValue={["search"]} aria-label="Navigation modes">
        <ToggleButton value="search">
          <Icon name="search" />
          <span>Search</span>
        </ToggleButton>
        <ToggleButton value="settings">
          <Icon name="settings" />
          <span>Settings</span>
        </ToggleButton>
      </ContentSwitcher>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const searchToggle = canvas.getByRole("button", { name: /Search/ });
    const settingsToggle = canvas.getByRole("button", { name: /Settings/ });

    expect(searchToggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(settingsToggle);
    expect(settingsToggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <ContentSwitcher defaultValue={["table"]} aria-label="Dataset presentation modes">
      <ToggleButton value="table">Table view</ToggleButton>
      <ToggleButton value="cards">Card grid</ToggleButton>
      <ToggleButton value="kanban">Kanban board</ToggleButton>
    </ContentSwitcher>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const tableToggle = canvas.getByRole("button", { name: "Table view" });
    const cardsToggle = canvas.getByRole("button", { name: "Card grid" });

    await userEvent.tab();
    expect(tableToggle).toHaveFocus();
    // Arrow keys move focus without pressing; Enter or Space presses.
    await userEvent.keyboard("{ArrowRight}");
    expect(cardsToggle).toHaveFocus();
    expect(cardsToggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard("{Enter}");
    expect(cardsToggle).toHaveAttribute("aria-pressed", "true");
  },
};

function LocalizedContentSwitcher() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <ContentSwitcher defaultValue={["hourly"]} aria-label="دوره‌های گزارش‌گیری">
            <ToggleButton value="hourly">ساعتی</ToggleButton>
            <ToggleButton value="daily">روزانه</ToggleButton>
            <ToggleButton value="monthly">ماهانه</ToggleButton>
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

    const hourlyToggle = canvas.getByRole("button", { name: "ساعتی" });
    const dailyToggle = canvas.getByRole("button", { name: "روزانه" });

    expect(hourlyToggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(dailyToggle);
    expect(dailyToggle).toHaveAttribute("aria-pressed", "true");
  },
};
