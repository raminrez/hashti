import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, Link, Popover } from "@hashti/react";
import "./overlays.css";

// TICK-007: PreviewTrigger was RAC-only and is deleted; TICK-016 replaces it with
// HoverCard. Until then, Popover's openOnHover + delay/closeDelay is the preview pattern.
const meta = {
  title: "Overlays/PreviewTrigger",
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "Hover previews are Popover with `openOnHover` and `delay`/`closeDelay` — resting the pointer on the trigger opens the preview, and moving into the content keeps it open. (The RAC PreviewTrigger component is gone; TICK-016 adds a dedicated HoverCard.)",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <p style={{ margin: 0 }}>
        Collaborators on this document:{" "}
        <Popover openOnHover delay={200} closeDelay={150}>
          <Popover.Trigger
            render={
              <Link
                href="#alice"
                style={{ fontWeight: 600, color: "var(--hashti-link-primary, #0f62fe)" }}
              />
            }
          >
            @alice_smith
          </Popover.Trigger>
          <Popover.Content sideOffset={8}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "260px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "var(--hashti-layer-accent-01, #0f62fe)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  AS
                </div>
                <div>
                  <Popover.Title style={{ fontSize: "1rem", margin: 0 }}>
                    Alice Smith
                  </Popover.Title>
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--hashti-text-secondary, #525252)" }}
                  >
                    @alice_smith
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", margin: 0 }}>
                Staff Systems Engineer working on distributed compilers and reactive primitives.
              </p>
            </div>
          </Popover.Content>
        </Popover>
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByText("@alice_smith");
    expect(link).toBeInTheDocument();

    await userEvent.hover(link);

    const body = within(document.body);
    await waitFor(
      () => {
        expect(body.getByText("Alice Smith")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(body.getByText(/Staff Systems Engineer/i)).toBeInTheDocument();
  },
};

export const DelayVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <Popover openOnHover delay={100} closeDelay={100}>
        <Popover.Trigger render={<Button variant="ghost">Instant Preview (100ms)</Button>} />
        <Popover.Content sideOffset={8}>
          <div style={{ padding: "0.5rem" }}>
            <strong>Instant Context</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
              Triggered with minimal latency.
            </p>
          </div>
        </Popover.Content>
      </Popover>

      <Popover openOnHover delay={600} closeDelay={300}>
        <Popover.Trigger render={<Button variant="ghost">Deliberate Preview (600ms)</Button>} />
        <Popover.Content sideOffset={8}>
          <div style={{ padding: "0.5rem" }}>
            <strong>Deliberate Context</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
              Triggered only on intentional dwell.
            </p>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const instantBtn = canvas.getByRole("button", { name: "Instant Preview (100ms)" });
    const deliberateBtn = canvas.getByRole("button", { name: "Deliberate Preview (600ms)" });

    expect(instantBtn).toBeInTheDocument();
    expect(deliberateBtn).toBeInTheDocument();

    await userEvent.hover(instantBtn);

    const body = within(document.body);
    await waitFor(
      () => {
        expect(body.getByText("Instant Context")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};
