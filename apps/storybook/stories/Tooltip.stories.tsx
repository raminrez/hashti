import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Icon,
  Theme,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  useTheme,
} from "@hashti/react";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    side: "top",
    sideOffset: 8,
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    sideOffset: { control: "number" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip wraps @ui-sdk/react Tooltip, providing contextual hints upon hover or keyboard focus without taking interaction focus. TooltipContent carries the portable Theme appearanceClassName across portals. Frame applies a control-radius, high-contrast inverse background, and a directional arrow.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (rawArgs) => {
    const args = rawArgs as { side?: "top" | "bottom" | "left" | "right"; sideOffset?: number };
    return (
      <div className="overlay-placement-canvas">
        <Tooltip delay={0}>
          <TooltipTrigger
            render={<Button variant="secondary">Hover or focus for tooltip</Button>}
          />
          <TooltipContent side={args.side} sideOffset={args.sideOffset}>
            Helpful contextual explanation
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

export const Placements: Story = {
  render: () => {
    return (
      <div className="overlay-story-grid">
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <div key={side} className="overlay-story-case">
            <h2>Side: {side}</h2>
            <div style={{ padding: "2rem 1rem" }}>
              <Tooltip delay={0}>
                <TooltipTrigger render={<Button variant="secondary">{`Trigger (${side})`}</Button>} />
                <TooltipContent side={side}>{`Tooltip on the ${side}`}</TooltipContent>
              </Tooltip>
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
      const el = document.querySelector<HTMLElement>(".hashti-tooltip[data-open]");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip).toHaveTextContent("Tooltip on the top");

    // Move focus away: the first tooltip closes (its content stays mounted, hidden).
    await userEvent.tab();
    await waitFor(() => {
      expect(tooltip).not.toHaveAttribute("data-open");
    });
  },
};

export const IconActions: Story = {
  render: () => {
    return (
      <div className="overlay-story-stack">
        <h2>Action toolbar with accessible tooltips</h2>
        <div className="overlay-row">
          <Tooltip delay={0}>
            <TooltipTrigger
              render={
                <Button variant="ghost" iconOnly aria-label="Copy identifier">
                  <Icon name="copy" />
                </Button>
              }
            />
            <TooltipContent>Copy identifier to clipboard</TooltipContent>
          </Tooltip>

          <Tooltip delay={0}>
            <TooltipTrigger
              render={
                <Button variant="ghost" iconOnly aria-label="Download export">
                  <Icon name="download" />
                </Button>
              }
            />
            <TooltipContent>Download audit export (JSON)</TooltipContent>
          </Tooltip>

          <Tooltip delay={0}>
            <TooltipTrigger
              render={
                <Button variant="ghost" iconOnly aria-label="Workspace settings">
                  <Icon name="settings" />
                </Button>
              }
            />
            <TooltipContent>Open workspace preferences</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole("button", { name: "Copy identifier" });
    copyBtn.focus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip[data-open]");
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
          <Tooltip delay={0}>
            <TooltipTrigger render={<Button>Inspect deployment logs</Button>} />
            <TooltipContent>Stream live cluster events and stderr traces</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Inspect deployment logs" });
    trigger.focus();

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-tooltip[data-open]");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(tooltip).not.toHaveAttribute("data-open");
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
        <Tooltip delay={0}>
          <TooltipTrigger render={<Button variant="secondary">Check tooltip element</Button>} />
          <TooltipContent
            ref={(node) => {
              if (node) setInspected(true);
            }}
            className="overlay-custom-surface"
          >
            Custom styled tooltip
          </TooltipContent>
        </Tooltip>
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
      const el = document.querySelector<HTMLElement>(".hashti-tooltip[data-open]");
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
        <Theme theme={theme} lang="fa-IR" dir="rtl">
          <div style={{ padding: "1rem" }}>
            <Tooltip delay={0}>
              <TooltipTrigger render={<Button>رونوشت نشانی خوشه</Button>} />
              <TooltipContent>
                نشانی اتصال مستقیم به خوشه سرور در حافظه موقت ذخیره خواهد شد.
              </TooltipContent>
            </Tooltip>
          </div>
        </Theme>
      </div>

      <div className="overlay-story-case">
        <h2>Multiline wrapping tooltip</h2>
        <div style={{ padding: "1rem" }}>
          <Tooltip delay={0}>
            <TooltipTrigger render={<Button variant="secondary">High-availability policy</Button>} />
            <TooltipContent style={{ maxWidth: "16rem" }}>
              Automatic failover routes traffic across three distinct availability zones with zero
              downtime SLA guarantee.
            </TooltipContent>
          </Tooltip>
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
      const el = document.querySelector<HTMLElement>(".hashti-tooltip[data-open]");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltip).toHaveTextContent(
      "نشانی اتصال مستقیم به خوشه سرور در حافظه موقت ذخیره خواهد شد.",
    );
  },
};
