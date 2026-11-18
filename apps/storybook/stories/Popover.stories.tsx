import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button, Checkbox, Icon, Popover, Theme, useTheme } from "@hashti/react";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "Popover wraps @ui-sdk/react/popover: an anchored, non-modal surface for contextual content and pickers. Popover.Content takes side/align plus sideOffset/alignOffset and carries data-side/data-align for styling. The popover receives the portable Theme across portals.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-placement-canvas">
      <Popover>
        <Popover.Trigger render={<Button variant="secondary">Open playground popover</Button>} />
        <Popover.Content sideOffset={8}>
          <Popover.Title>Popover details</Popover.Title>
          <Popover.Description>
            Floating contextual information attached to the trigger anchor.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open playground popover" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(popover).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-popover")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Placements: Story = {
  render: () => (
    <div className="overlay-story-grid">
      {(["bottom", "top", "start", "end"] as const).map((side) => (
        <div key={side} className="overlay-story-case">
          <h2>Side: {side}</h2>
          <Popover>
            <Popover.Trigger
              render={<Button variant="secondary">{`Open ${side} popover`}</Button>}
            />
            <Popover.Content side={side} sideOffset={8}>
              <Popover.Title>{`Anchored: ${side}`}</Popover.Title>
              <Popover.Description>
                Positioned with <code>{`side="${side}"`}</code>.
              </Popover.Description>
            </Popover.Content>
          </Popover>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open bottom popover" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(popover).toBeVisible());
    expect(popover.getAttribute("data-side")).toBe("bottom");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-popover")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function FilterMenuExample() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["prod"]);
  const toggle = (key: string, next: boolean | "indeterminate") =>
    setActiveFilters((prev) =>
      next === true ? [...prev, key] : prev.filter((k) => k !== key),
    );

  return (
    <div className="overlay-story-stack">
      <Popover>
        <Popover.Trigger
          render={
            <Button variant="secondary">
              Filter deployments <Icon name="settings" />
            </Button>
          }
        />
        <Popover.Content side="bottom" align="start" sideOffset={8}>
          <Popover.Title>Deployment filters</Popover.Title>
          <div className="overlay-filter-list">
            <Checkbox
              checked={activeFilters.includes("prod")}
              onCheckedChange={(next) => toggle("prod", next)}
            >
              Production clusters
            </Checkbox>
            <Checkbox
              checked={activeFilters.includes("stage")}
              onCheckedChange={(next) => toggle("stage", next)}
            >
              Staging preview
            </Checkbox>
            <Checkbox
              checked={activeFilters.includes("canary")}
              onCheckedChange={(next) => toggle("canary", next)}
            >
              Canary rollout
            </Checkbox>
          </div>
          <div className="hashti-dialog-footer" style={{ marginTop: "1rem" }}>
            <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
              Clear
            </Button>
            <Popover.Close render={<Button variant="primary" size="sm">Apply filters</Button>} />
          </div>
        </Popover.Content>
      </Popover>
      <output aria-label="Active filters output">
        Filters: {activeFilters.length ? activeFilters.join(", ") : "none"}
      </output>
    </div>
  );
}

export const FilterMenu: Story = {
  render: () => <FilterMenuExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Filter deployments/ });
    const output = canvas.getByRole("status", { name: "Active filters output" });
    await expect(output).toHaveTextContent("Filters: prod");

    await userEvent.click(trigger);
    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });

    const stageCheckbox = within(popover).getByRole("checkbox", { name: "Staging preview" });
    await userEvent.click(stageCheckbox);

    const applyBtn = within(popover).getByRole("button", { name: "Apply filters" });
    await userEvent.click(applyBtn);

    await waitFor(() => expect(document.querySelector(".hashti-popover")).toBeNull());
    await expect(output).toHaveTextContent("Filters: prod, stage");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function LocalizedPopoverExamples() {
  const { theme } = useTheme();
  return (
    <div className="overlay-story-grid">
      <div className="overlay-story-case">
        <h2>Persian RTL popover</h2>
        <Theme theme={theme} lang="fa-IR" dir="rtl">
          <Popover>
            <Popover.Trigger render={<Button>فیلترهای پیشرفته سامانه</Button>} />
            <Popover.Content side="bottom" align="start">
              <Popover.Title>گزینه‌های دسترسی</Popover.Title>
              <Popover.Description>
                این پاپ‌اور در جهت راست‌به‌چپ با زبان فارسی نمایش داده می‌شود.
              </Popover.Description>
              <div className="overlay-filter-list">
                <Checkbox defaultChecked>خوشه اصلی تهران</Checkbox>
                <Checkbox>پشتیبان فرانکفورت</Checkbox>
              </div>
            </Popover.Content>
          </Popover>
        </Theme>
      </div>

      <div className="overlay-story-case">
        <h2>German expanded text</h2>
        <Popover>
          <Popover.Trigger
            render={<Button variant="secondary">Erweiterte Systeminformationen</Button>}
          />
          <Popover.Content side="bottom" align="end">
            <Popover.Title>Konfigurationsparameter</Popover.Title>
            <Popover.Description>
              Detaillierte Übersicht der aktiven Authentifizierungszertifikate und
              Verschlüsselungseinstellungen.
            </Popover.Description>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedPopoverExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "فیلترهای پیشرفته سامانه" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() =>
      expect(within(popover).getByRole("heading", { name: "گزینه‌های دسترسی" })).toBeVisible(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-popover")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
