import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button, Icon, Theme, Tooltip, TooltipTrigger, useTheme } from "@hashti/react";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    placement: "top",
    offset: 8,
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right", "start", "end"],
    },
    offset: { control: "number" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip wraps RAC Tooltip and OverlayArrow, providing contextual hints upon hover or keyboard focus without taking interaction focus. Tooltip carries the portable Theme appearanceClassName across portals. Frame applies a 10px border-radius (var(--hashti-control-radius)), high-contrast inverse background, and directional arrow alignment.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="overlay-placement-canvas">
      <TooltipTrigger delay={0}>
        <Button variant="secondary">Hover or focus for tooltip</Button>
        <Tooltip {...args}>Helpful contextual explanation</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const Placements: Story = {
  render: () => {
    return (
      <div className="overlay-story-grid">
        {(["top", "bottom", "start", "end"] as const).map((placement) => (
          <div key={placement} className="overlay-story-case">
            <h2>Placement: {placement}</h2>
            <div style={{ padding: "2rem 1rem" }}>
              <TooltipTrigger delay={0}>
                <Button variant="secondary">{`Trigger (${placement})`}</Button>
                <Tooltip placement={placement}>{`Tooltip anchored at ${placement}`}</Tooltip>
              </TooltipTrigger>
            </div>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Trigger (top)" });
    await userEvent.tab();
    expect(trigger).toHaveFocus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip).toHaveTextContent("Tooltip anchored at top");

    // Move focus away
    await userEvent.tab();
    await waitFor(() => {
      // The first tooltip should hide or change
      const el = document.querySelector<HTMLElement>('.hashti-tooltip[data-placement="top"]');
      expect(el).toBeNull();
    });
  },
};

export const IconActions: Story = {
  render: () => {
    return (
      <div className="overlay-story-stack">
        <h2>Action toolbar with accessible tooltips</h2>
        <div className="overlay-row">
          <TooltipTrigger delay={0}>
            <Button variant="ghost" iconOnly aria-label="Copy identifier">
              <Icon name="copy" />
            </Button>
            <Tooltip>Copy identifier to clipboard</Tooltip>
          </TooltipTrigger>

          <TooltipTrigger delay={0}>
            <Button variant="ghost" iconOnly aria-label="Download export">
              <Icon name="download" />
            </Button>
            <Tooltip>Download audit export (JSON)</Tooltip>
          </TooltipTrigger>

          <TooltipTrigger delay={0}>
            <Button variant="ghost" iconOnly aria-label="Workspace settings">
              <Icon name="settings" />
            </Button>
            <Tooltip>Open workspace preferences</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole("button", { name: "Copy identifier" });
    copyBtn.focus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip");
      expect(el).not.toBeNull();
      return el!;
    });
    await expect(tooltip).toHaveTextContent("Copy identifier to clipboard");
  },
};

export const FocusAndHover: Story = {
  render: () => {
    return (
      <div className="overlay-story-stack">
        <h2>Keyboard and Escape interaction</h2>
        <p>Focus the trigger via Tab. Press Escape to immediately cancel the tooltip.</p>
        <div className="overlay-row">
          <TooltipTrigger delay={0}>
            <Button>Inspect deployment logs</Button>
            <Tooltip>Stream live cluster events and stderr traces</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Inspect deployment logs" });
    trigger.focus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector(".hashti-tooltip")).toBeNull();
    });
    await expect(trigger).toHaveFocus();
  },
};

function CustomStylingAndRefsExample() {
  const [inspected, setInspected] = useState<boolean>(false);
  return (
    <div className="overlay-story-stack">
      <h2>Ref forwarding and custom classes</h2>
      <div className="overlay-row">
        <TooltipTrigger delay={0}>
          <Button variant="secondary">Check tooltip element</Button>
          <Tooltip
            ref={(node) => {
              if (node) setInspected(true);
            }}
            className="overlay-custom-surface"
          >
            {(state) => <span>{`Custom styled tooltip (placement: ${state.placement})`}</span>}
          </Tooltip>
        </TooltipTrigger>
      </div>
      <output aria-label="Tooltip ref output">
        {inspected ? "Tooltip ref verified." : "Awaiting check."}
      </output>
    </div>
  );
}

export const CustomStylingAndRefs: Story = {
  render: () => <CustomStylingAndRefsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Check tooltip element" });
    const output = canvas.getByRole("status", { name: "Tooltip ref output" });

    trigger.focus();
    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip");
      expect(el).not.toBeNull();
      return el!;
    });
    await expect(tooltip).toHaveClass(/overlay-custom-surface/);
    await waitFor(() => {
      expect(output).toHaveTextContent("Tooltip ref verified.");
    });
  },
};

function LocalizedTooltipExamples() {
  const { theme } = useTheme();
  return (
    <div className="overlay-story-grid">
      <div className="overlay-story-case">
        <h2>Persian RTL tooltip</h2>
        <Theme theme={theme} locale="fa-IR">
          <div style={{ padding: "1rem" }}>
            <TooltipTrigger delay={0}>
              <Button>رونوشت نشانی خوشه</Button>
              <Tooltip>نشانی اتصال مستقیم به خوشه سرور در حافظه موقت ذخیره خواهد شد.</Tooltip>
            </TooltipTrigger>
          </div>
        </Theme>
      </div>

      <div className="overlay-story-case">
        <h2>Multiline wrapping tooltip</h2>
        <div style={{ padding: "1rem" }}>
          <TooltipTrigger delay={0}>
            <Button variant="secondary">High-availability policy</Button>
            <Tooltip style={{ maxWidth: "16rem" }}>
              Automatic failover routes traffic across three distinct availability zones with zero
              downtime SLA guarantee.
            </Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedTooltipExamples,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const persianTrigger = canvas.getByRole("button", { name: "رونوشت نشانی خوشه" });
    persianTrigger.focus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip).toHaveTextContent(
      "نشانی اتصال مستقیم به خوشه سرور در حافظه موقت ذخیره خواهد شد.",
    );
  },
};
