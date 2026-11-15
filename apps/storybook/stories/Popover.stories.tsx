import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Heading,
  Icon,
  Popover,
  Theme,
  useTheme,
} from "@hashti/react";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    offset: 8,
    placement: "bottom",
  },
  argTypes: {
    offset: { control: "number" },
    placement: {
      control: "select",
      options: ["bottom", "top", "left", "right", "start", "end"],
    },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Popover wraps RAC Popover, creating an anchored temporary surface for non-modal popups, menus, and selection pickers. Popover receives the portable Theme appearanceClassName and effective language across portals. Frame applies a 14px border-radius (var(--hashti-popover-radius)), a 1px subtle border, and a 0 8px 24px shadow without ambient backdrop darkening.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="overlay-placement-canvas">
      <DialogTrigger>
        <Button variant="secondary">Open playground popover</Button>
        <Popover {...args}>
          <Dialog>
            <Heading slot="title">Popover details</Heading>
            <p>Floating contextual information attached to the trigger anchor.</p>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  ),
};

export const Placements: Story = {
  render: () => {
    return (
      <div className="overlay-story-grid">
        {(["bottom", "top", "start", "end"] as const).map((placement) => (
          <div key={placement} className="overlay-story-case">
            <h2>Placement: {placement}</h2>
            <DialogTrigger>
              <Button variant="secondary">{`Open ${placement} popover`}</Button>
              <Popover placement={placement} offset={8}>
                <Dialog>
                  <Heading slot="title">{`Anchored: ${placement}`}</Heading>
                  <p>
                    Positioned with <code>placement="{placement}"</code>.
                  </p>
                </Dialog>
              </Popover>
            </DialogTrigger>
          </div>
        ))}
      </div>
    );
  },
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
    await waitFor(() =>
      expect(within(popover).getByRole("heading", { name: "Anchored: bottom" })).toBeVisible(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector(".hashti-popover")).toBeNull();
    });
    await expect(trigger).toHaveFocus();
  },
};

function FilterMenuExample() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["prod"]);
  return (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button variant="secondary">
          Filter deployments <Icon name="settings" />
        </Button>
        <Popover placement="bottom start" offset={8}>
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Deployment filters</Heading>
                <div className="overlay-filter-list">
                  <Checkbox
                    isSelected={activeFilters.includes("prod")}
                    onChange={(selected) =>
                      setActiveFilters((prev) =>
                        selected ? [...prev, "prod"] : prev.filter((k) => k !== "prod"),
                      )
                    }
                  >
                    Production clusters
                  </Checkbox>
                  <Checkbox
                    isSelected={activeFilters.includes("stage")}
                    onChange={(selected) =>
                      setActiveFilters((prev) =>
                        selected ? [...prev, "stage"] : prev.filter((k) => k !== "stage"),
                      )
                    }
                  >
                    Staging preview
                  </Checkbox>
                  <Checkbox
                    isSelected={activeFilters.includes("canary")}
                    onChange={(selected) =>
                      setActiveFilters((prev) =>
                        selected ? [...prev, "canary"] : prev.filter((k) => k !== "canary"),
                      )
                    }
                  >
                    Canary rollout
                  </Checkbox>
                </div>
                <div className="hashti-dialog-footer" style={{ marginTop: "1rem" }}>
                  <Button variant="ghost" size="sm" onPress={() => setActiveFilters([])}>
                    Clear
                  </Button>
                  <Button variant="primary" size="sm" onPress={close}>
                    Apply filters
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
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
    const trigger = canvas.getByRole("button", { name: "Filter deployments" });
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

    await waitFor(() => {
      expect(document.querySelector(".hashti-popover")).toBeNull();
    });
    await expect(output).toHaveTextContent("Filters: prod, stage");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const FocusManagement: Story = {
  render: () => {
    return (
      <div className="overlay-story-stack">
        <DialogTrigger>
          <Button>Open contextual actions</Button>
          <Popover placement="bottom start">
            <Dialog>
              {({ close }) => (
                <>
                  <Heading slot="title">Quick actions</Heading>
                  <p>Tab through options or press Escape to dismiss and return focus.</p>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Button variant="ghost" onPress={close}>
                      Export snapshot
                    </Button>
                    <Button variant="ghost" onPress={close}>
                      Share report
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open contextual actions" });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });

    // Tab through actions
    await userEvent.tab();
    const firstAction = within(popover).getByRole("button", { name: "Export snapshot" });
    await expect(firstAction).toHaveFocus();

    // Escape returns focus to trigger
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector(".hashti-popover")).toBeNull();
    });
    await expect(trigger).toHaveFocus();
  },
};

function CustomStylingAndRefsExample() {
  const popoverRef = useRef<HTMLElement>(null);
  const [resolved, setResolved] = useState<boolean>(false);
  return (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button variant="secondary">Inspect popover ref</Button>
        <Popover ref={popoverRef} className="overlay-custom-surface" style={{ minWidth: "16rem" }}>
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Ref verification</Heading>
                <p>Verifies custom class name, inline styles, and element ref forwarding.</p>
                <div className="hashti-dialog-footer">
                  <Button
                    variant="secondary"
                    size="sm"
                    onPress={() => setResolved(popoverRef.current !== null)}
                  >
                    Check ref
                  </Button>
                  <Button variant="primary" size="sm" onPress={close}>
                    Done
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
      <output aria-label="Popover ref status">
        {resolved ? "Popover ref resolved correctly." : "Awaiting popover check."}
      </output>
    </div>
  );
}

export const CustomStylingAndRefs: Story = {
  render: () => <CustomStylingAndRefsExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Inspect popover ref" });
    const output = canvas.getByRole("status", { name: "Popover ref status" });

    await userEvent.click(trigger);
    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    await expect(popover).toHaveClass(/overlay-custom-surface/);

    const checkBtn = within(popover).getByRole("button", { name: "Check ref" });
    await userEvent.click(checkBtn);
    await expect(output).toHaveTextContent("Popover ref resolved correctly.");

    const doneBtn = within(popover).getByRole("button", { name: "Done" });
    await userEvent.click(doneBtn);
    await waitFor(() => {
      expect(document.querySelector(".hashti-popover")).toBeNull();
    });
  },
};

function LocalizedPopoverExamples() {
  const { theme } = useTheme();
  return (
    <div className="overlay-story-grid">
      <div className="overlay-story-case">
        <h2>Persian RTL popover</h2>
        <Theme theme={theme} locale="fa-IR">
          <DialogTrigger>
            <Button>فیلترهای پیشرفته سامانه</Button>
            <Popover placement="bottom start">
              <Dialog>
                <Heading slot="title">گزینه‌های دسترسی</Heading>
                <p>این پاپ‌اور در جهت راست‌به‌چپ با زبان فارسی و قلم یکپارچه نمایش داده می‌شود.</p>
                <div className="overlay-filter-list">
                  <Checkbox defaultSelected>خوشه اصلی تهران</Checkbox>
                  <Checkbox>پشتیبان فرانکفورت</Checkbox>
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </Theme>
      </div>

      <div className="overlay-story-case">
        <h2>German expanded text</h2>
        <DialogTrigger>
          <Button variant="secondary">Erweiterte Systeminformationen</Button>
          <Popover placement="bottom end">
            <Dialog>
              <Heading slot="title">Konfigurationsparameter</Heading>
              <p>
                Detaillierte Übersicht der aktiven Authentifizierungszertifikate und
                Verschlüsselungseinstellungen.
              </p>
            </Dialog>
          </Popover>
        </DialogTrigger>
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
    await waitFor(() => {
      expect(document.querySelector(".hashti-popover")).toBeNull();
    });
    await expect(trigger).toHaveFocus();
  },
};
