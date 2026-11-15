import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, Heading, Link, Popover, PreviewTrigger } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/PreviewTrigger",
  component: PreviewTrigger,
  args: {
    children: null as any,
  },
  parameters: {
    docs: {
      description: {
        component:
          "PreviewTrigger manages non-modal contextual preview popovers (HoverCards) that open when hovering or focusing a trigger element, with configurable delays.",
      },
    },
  },
} satisfies Meta<typeof PreviewTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <p style={{ margin: 0 }}>
        Collaborators on this document:{" "}
        <PreviewTrigger delay={200} closeDelay={150}>
          <Link
            href="#alice"
            style={{ fontWeight: 600, color: "var(--hashti-link-primary, #0f62fe)" }}
          >
            @alice_smith
          </Link>
          <Popover>
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
                  <Heading slot="title" style={{ fontSize: "1rem", margin: 0 }}>
                    Alice Smith
                  </Heading>
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
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem" }}>
                <span>
                  <strong>1.4k</strong> Following
                </span>
                <span>
                  <strong>12.8k</strong> Followers
                </span>
              </div>
            </div>
          </Popover>
        </PreviewTrigger>
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
      <PreviewTrigger delay={100} closeDelay={100}>
        <Button variant="ghost">Instant Preview (100ms)</Button>
        <Popover>
          <div style={{ padding: "0.5rem" }}>
            <strong>Instant Context</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
              Triggered with minimal latency.
            </p>
          </div>
        </Popover>
      </PreviewTrigger>

      <PreviewTrigger delay={600} closeDelay={300}>
        <Button variant="ghost">Deliberate Preview (600ms)</Button>
        <Popover>
          <div style={{ padding: "0.5rem" }}>
            <strong>Deliberate Context</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
              Triggered only on intentional dwell.
            </p>
          </div>
        </Popover>
      </PreviewTrigger>
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

export const CompoundComponents: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <PreviewTrigger.Root delay={200}>
        <Button variant="secondary">Preview Card</Button>
        <PreviewTrigger.Popover>
          <div style={{ padding: "0.75rem", width: "220px" }}>
            <Heading slot="title">Compound Preview</Heading>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>
              Uses PreviewTrigger.Root and PreviewTrigger.Popover namespaced compounds.
            </p>
          </div>
        </PreviewTrigger.Popover>
      </PreviewTrigger.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Preview Card" });
    expect(btn).toBeInTheDocument();

    await userEvent.hover(btn);

    const body = within(document.body);
    await waitFor(
      () => {
        expect(body.getByText("Compound Preview")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};
