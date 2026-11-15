import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { FilterTag, Tag, TagGroup, Theme, useTheme, type Selection } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Navigation/Tag",
  component: TagGroup,
  tags: ["a11y:gap"],
  parameters: {
    docs: {
      description: {
        component:
          "Tags are compact visual indicators used for categories, metadata, status labels, and multi-selection filters.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function PlaygroundExample() {
  const [selected, setSelected] = useState<Selection>(new Set(["react", "typescript"]));
  return (
    <div className="navigation-story-stack">
      <TagGroup
        label="Technology stack filters"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <FilterTag id="react">React 19</FilterTag>
        <FilterTag id="typescript">TypeScript 5.8</FilterTag>
        <FilterTag id="bun">Bun Runtime</FilterTag>
        <FilterTag id="playwright">Playwright</FilterTag>
      </TagGroup>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const reactTag = await canvas.findByRole("row", { name: "React 19" });
    const bunTag = await canvas.findByRole("row", { name: "Bun Runtime" });

    expect(reactTag).toHaveAttribute("aria-selected", "true");
    expect(bunTag).toHaveAttribute("aria-selected", "false");

    await userEvent.click(bunTag);
    expect(bunTag).toHaveAttribute("aria-selected", "true");
  },
};

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

function RemovableTagsExample() {
  const [tags, setTags] = useState([
    { id: "us-east", name: "Region: US-East" },
    { id: "k8s-v130", name: "Version: 1.30.2" },
    { id: "env-prod", name: "Env: Production" },
    { id: "tier-premium", name: "Tier: Enterprise" },
  ]);

  const handleRemove = (keys: Set<unknown>) => {
    setTags((prev) => prev.filter((t) => !keys.has(t.id)));
  };

  return (
    <div className="navigation-story-stack">
      <TagGroup label="Active search criteria (removable)" items={tags} onRemove={handleRemove}>
        {(item) => <FilterTag id={item.id}>{item.name}</FilterTag>}
      </TagGroup>
    </div>
  );
}

export const RemovableTags: Story = {
  render: () => <RemovableTagsExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const regionTag = await canvas.findByRole("row", { name: /Region: US-East/ });
    await waitFor(() => expect(regionTag).toBeVisible());

    const removeBtn = within(regionTag).getByRole("button", { name: /Remove/ });
    await userEvent.click(removeBtn);

    expect(canvas.queryByRole("row", { name: /Region: US-East/ })).toBeNull();
  },
};

function LocalizedTags() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<Selection>(new Set(["devops"]));

  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <TagGroup
            label="فیلترهای دسته‌بندی مهارت‌ها"
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
          >
            <FilterTag id="devops">زیرساخت ابری و دوآپس</FilterTag>
            <FilterTag id="frontend">توسعه رابط کاربری</FilterTag>
            <FilterTag id="security">امنیت و رمزنگاری</FilterTag>
            <FilterTag id="database">پایگاه‌های داده توزیع‌شده</FilterTag>
          </TagGroup>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Tag color="green">فعال</Tag>
            <Tag color="red">مسدود شده</Tag>
            <Tag color="teal">تایید شده</Tag>
          </div>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedTags />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const devopsTag = await canvas.findByRole("row", { name: "زیرساخت ابری و دوآپس" });
    const secTag = await canvas.findByRole("row", { name: "امنیت و رمزنگاری" });

    expect(devopsTag).toHaveAttribute("aria-selected", "true");
    expect(secTag).toHaveAttribute("aria-selected", "false");

    await userEvent.click(secTag);
    expect(secTag).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(canvas.getByText("فعال")).toBeVisible());
  },
};
