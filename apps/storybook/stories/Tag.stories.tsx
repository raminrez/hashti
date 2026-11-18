import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Tag, Theme, useTheme } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Tag",
  component: Tag,
  parameters: {
    docs: {
      description: {
        component:
          "Tags are compact visual indicators used for categories, metadata, and status labels. Removable/selectable tag groups move to TokenInput.",
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StaticBadges: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.75rem" }}>Status badges (colors)</h4>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <Tag color="green">Healthy (green)</Tag>
          <Tag color="red">Incident (red)</Tag>
          <Tag color="blue">Running (blue)</Tag>
          <Tag color="purple">Queued (purple)</Tag>
          <Tag color="teal">Verified (teal)</Tag>
          <Tag color="magenta">Experimental (magenta)</Tag>
          <Tag color="cyan">Informational (cyan)</Tag>
          <Tag color="gray">Archived (gray)</Tag>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.75rem" }}>Size variants</h4>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Tag size="sm" color="blue">
            Small badge (sm)
          </Tag>
          <Tag size="md" color="blue">
            Medium badge (md - default)
          </Tag>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByText("Healthy (green)")).toBeVisible());
    await waitFor(() => expect(canvas.getByText("Incident (red)")).toBeVisible());
    await waitFor(() => expect(canvas.getByText("Small badge (sm)")).toBeVisible());
    await waitFor(() => expect(canvas.getByText("Medium badge (md - default)")).toBeVisible());
  },
};

function LocalizedTags() {
  const { theme } = useTheme();

  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Tag color="green">فعال</Tag>
          <Tag color="red">مسدود شده</Tag>
          <Tag color="teal">تایید شده</Tag>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedTags />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("فعال")).toBeVisible());
    await waitFor(() => expect(canvas.getByText("مسدود شده")).toBeVisible());
  },
};
