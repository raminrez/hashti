"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Icon, SegmentedControl, Theme, useTheme } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component:
          "SegmentedControl (formerly ContentSwitcher) lets users toggle between mutually exclusive views, display modes, or data slices. Exactly one option is checked at a time, with an indicator that slides to it.",
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selected, setSelected] = useState<string | null>("table");

  return (
    <div className="navigation-story-stack">
      <div className="navigation-story-row">
        <span>
          Active view: <strong>{selected ?? "none"}</strong>
        </span>
      </div>
      <SegmentedControl
        aria-label="Dataset presentation modes"
        value={selected}
        onValueChange={(value) => setSelected(value)}
      >
        <SegmentedControl.Item value="table">Table view</SegmentedControl.Item>
        <SegmentedControl.Item value="cards">Card grid</SegmentedControl.Item>
        <SegmentedControl.Item value="kanban">Kanban board</SegmentedControl.Item>
      </SegmentedControl>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const tableItem = canvas.getByRole("radio", { name: "Table view" });
    const cardsItem = canvas.getByRole("radio", { name: "Card grid" });
    const kanbanItem = canvas.getByRole("radio", { name: "Kanban board" });

    expect(tableItem).toHaveAttribute("aria-checked", "true");
    expect(cardsItem).toHaveAttribute("aria-checked", "false");

    await userEvent.click(cardsItem);
    expect(cardsItem).toHaveAttribute("aria-checked", "true");
    expect(tableItem).toHaveAttribute("aria-checked", "false");
    expect(canvas.getByText("cards")).toBeVisible();

    await userEvent.click(kanbanItem);
    expect(kanbanItem).toHaveAttribute("aria-checked", "true");
    expect(canvas.getByText("kanban")).toBeVisible();

    // One option always stays checked: pressing the checked item keeps it.
    await userEvent.click(kanbanItem);
    expect(kanbanItem).toHaveAttribute("aria-checked", "true");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Small (sm)</h4>
        <SegmentedControl size="sm" defaultValue="day" aria-label="Small switcher">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Medium (md - default)</h4>
        <SegmentedControl size="md" defaultValue="list" aria-label="Medium switcher">
          <SegmentedControl.Item value="list">List view</SegmentedControl.Item>
          <SegmentedControl.Item value="detail">Detail view</SegmentedControl.Item>
          <SegmentedControl.Item value="split">Split view</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Large (lg)</h4>
        <SegmentedControl size="lg" defaultValue="overview" aria-label="Large switcher">
          <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
          <SegmentedControl.Item value="metrics">Metrics</SegmentedControl.Item>
          <SegmentedControl.Item value="logs">Audit logs</SegmentedControl.Item>
        </SegmentedControl>
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const weekItem = canvas.getByRole("radio", { name: "Week" });
    expect(weekItem).toHaveAttribute("aria-checked", "false");
    expect(weekItem).toHaveAttribute("data-size", "sm");

    await userEvent.click(weekItem);
    expect(weekItem).toHaveAttribute("aria-checked", "true");
  },
};

export const DisabledOptions: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <SegmentedControl defaultValue="read" aria-label="Access levels">
        <SegmentedControl.Item value="read">Read only</SegmentedControl.Item>
        <SegmentedControl.Item value="write">Read / Write</SegmentedControl.Item>
        <SegmentedControl.Item value="admin" disabled>
          Administrator (Restricted)
        </SegmentedControl.Item>
      </SegmentedControl>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const adminItem = canvas.getByRole("radio", { name: /Administrator/ });
    const writeItem = canvas.getByRole("radio", { name: "Read / Write" });

    expect(adminItem).toHaveAttribute("data-disabled");

    await userEvent.click(writeItem);
    expect(writeItem).toHaveAttribute("aria-checked", "true");
    expect(adminItem).toHaveAttribute("aria-checked", "false");
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <SegmentedControl defaultValue="search" aria-label="Navigation modes">
        <SegmentedControl.Item value="search">
          <Icon name="search" />
          <span>Search</span>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="settings">
          <Icon name="settings" />
          <span>Settings</span>
        </SegmentedControl.Item>
      </SegmentedControl>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const searchItem = canvas.getByRole("radio", { name: /Search/ });
    const settingsItem = canvas.getByRole("radio", { name: /Settings/ });

    expect(searchItem).toHaveAttribute("aria-checked", "true");

    await userEvent.click(settingsItem);
    expect(settingsItem).toHaveAttribute("aria-checked", "true");
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <SegmentedControl defaultValue="table" aria-label="Dataset presentation modes">
      <SegmentedControl.Item value="table">Table view</SegmentedControl.Item>
      <SegmentedControl.Item value="cards">Card grid</SegmentedControl.Item>
      <SegmentedControl.Item value="kanban">Kanban board</SegmentedControl.Item>
    </SegmentedControl>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const tableItem = canvas.getByRole("radio", { name: "Table view" });
    const cardsItem = canvas.getByRole("radio", { name: "Card grid" });

    await userEvent.tab();
    expect(tableItem).toHaveFocus();
    // A segmented control is a radio group: arrow keys move and check.
    await userEvent.keyboard("{ArrowRight}");
    expect(cardsItem).toHaveFocus();
    expect(cardsItem).toHaveAttribute("aria-checked", "true");
    expect(tableItem).toHaveAttribute("aria-checked", "false");
  },
};

function LocalizedSegmentedControl() {
  const { theme } = useTheme();
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <SegmentedControl defaultValue="hourly" aria-label="دوره‌های گزارش‌گیری">
            <SegmentedControl.Item value="hourly">ساعتی</SegmentedControl.Item>
            <SegmentedControl.Item value="daily">روزانه</SegmentedControl.Item>
            <SegmentedControl.Item value="monthly">ماهانه</SegmentedControl.Item>
          </SegmentedControl>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedSegmentedControl />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const hourlyItem = canvas.getByRole("radio", { name: "ساعتی" });
    const dailyItem = canvas.getByRole("radio", { name: "روزانه" });

    expect(hourlyItem).toHaveAttribute("aria-checked", "true");

    await userEvent.click(dailyItem);
    expect(dailyItem).toHaveAttribute("aria-checked", "true");
  },
};
