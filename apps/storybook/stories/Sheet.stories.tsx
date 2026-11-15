import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, Heading, Sheet } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  parameters: {
    docs: {
      description: {
        component:
          "Sheet is a swipeable overlay that slides in from the edge of the viewport (bottom, top, left, or right) with physics-based gesture tracking and customizable snap points.",
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Sheet.Trigger>
        <Button variant="primary">Open Bottom Sheet</Button>
        <Sheet position="bottom" snapPoints={["320px", "600px"]} aria-label="Order summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Heading slot="title">Order Summary</Heading>
            <p style={{ color: "var(--hashti-text-secondary, #525252)", margin: 0 }}>
              Review your selected items and shipping details before completing payment.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem",
                borderRadius: "8px",
                background: "var(--hashti-layer-01, #f4f4f4)",
              }}
            >
              <span>Subtotal (3 items)</span>
              <strong>$89.00</strong>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button variant="primary">Checkout Now</Button>
            </div>
          </div>
        </Sheet>
      </Sheet.Trigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Bottom Sheet" });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => {
      const heading = body.getByText("Order Summary");
      expect(heading).toBeInTheDocument();
    });

    const checkoutBtn = body.getByRole("button", { name: "Checkout Now" });
    expect(checkoutBtn).toBeInTheDocument();
  },
};

export const SnapPoints: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Sheet.Trigger>
        <Button variant="secondary">Sheet with 3 Snap Points</Button>
        <Sheet
          position="bottom"
          snapPoints={["240px", "480px", "90%"]}
          aria-label="Multi-snap sheet"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Heading slot="title">Expanded Destinations</Heading>
            <p style={{ margin: 0 }}>
              Swipe up to see all available transit lines and stop details across the city.
            </p>
            <ul
              style={{
                paddingLeft: "1.25rem",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>Downtown Express - Platform 2 (Departing in 4 min)</li>
              <li>Airport Shuttle - Bay 14 (Departing in 12 min)</li>
              <li>Crosstown Line - Platform 5 (Departing in 18 min)</li>
              <li>Northside Local - Platform 1 (Departing in 25 min)</li>
            </ul>
          </div>
        </Sheet>
      </Sheet.Trigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Sheet with 3 Snap Points" });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Expanded Destinations")).toBeInTheDocument();
    });
  },
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Sheet.Trigger>
        <Button variant="secondary">Bottom Sheet</Button>
        <Sheet position="bottom" aria-label="Bottom position sheet">
          <Heading slot="title">Bottom Sheet</Heading>
          <p>Slides upwards from viewport bottom edge.</p>
        </Sheet>
      </Sheet.Trigger>

      <Sheet.Trigger>
        <Button variant="secondary">Top Sheet</Button>
        <Sheet position="top" aria-label="Top position sheet">
          <Heading slot="title">Top Sheet</Heading>
          <p>Slides downwards from viewport top edge.</p>
        </Sheet>
      </Sheet.Trigger>

      <Sheet.Trigger>
        <Button variant="secondary">Left Sheet</Button>
        <Sheet position="left" aria-label="Left position sheet">
          <Heading slot="title">Left Drawer Sheet</Heading>
          <p>Slides inwards from the left edge of the screen.</p>
        </Sheet>
      </Sheet.Trigger>

      <Sheet.Trigger>
        <Button variant="secondary">Right Sheet</Button>
        <Sheet position="right" aria-label="Right position sheet">
          <Heading slot="title">Right Sidebar Sheet</Heading>
          <p>Slides inwards from the right edge of the screen.</p>
        </Sheet>
      </Sheet.Trigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bottomBtn = canvas.getByRole("button", { name: "Bottom Sheet" });
    const topBtn = canvas.getByRole("button", { name: "Top Sheet" });
    const leftBtn = canvas.getByRole("button", { name: "Left Sheet" });
    const rightBtn = canvas.getByRole("button", { name: "Right Sheet" });

    expect(bottomBtn).toBeInTheDocument();
    expect(topBtn).toBeInTheDocument();
    expect(leftBtn).toBeInTheDocument();
    expect(rightBtn).toBeInTheDocument();
  },
};

export const PreventDismissal: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Sheet.Trigger>
        <Button variant="danger">Critical Action Sheet</Button>
        <Sheet position="bottom" preventDismissal aria-label="Critical confirmation">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Heading slot="title">Confirm Data Migration</Heading>
            <p style={{ margin: 0 }}>
              This sheet cannot be dismissed by swiping or clicking outside. You must explicitly
              choose an action.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="danger">Confirm Migration</Button>
            </div>
          </div>
        </Sheet>
      </Sheet.Trigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Critical Action Sheet" });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Confirm Data Migration")).toBeInTheDocument();
    });

    const confirmBtn = body.getByRole("button", { name: "Confirm Migration" });
    expect(confirmBtn).toBeInTheDocument();
  },
};

export const CompoundComposition: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Sheet.Trigger>
        <Button variant="secondary">Open Compound Sheet</Button>
        <Sheet.Overlay position="bottom">
          <Sheet.Backdrop />
          <Sheet.Root>
            <Sheet.Handle />
            <Sheet.Content>
              <Heading slot="title">Fine-grained Compound Sheet</Heading>
              <p>
                Composed using Sheet.Trigger, Sheet.Overlay, Sheet.Backdrop, Sheet.Root,
                Sheet.Handle, and Sheet.Content.
              </p>
            </Sheet.Content>
          </Sheet.Root>
        </Sheet.Overlay>
      </Sheet.Trigger>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Compound Sheet" });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Fine-grained Compound Sheet")).toBeInTheDocument();
    });
  },
};
