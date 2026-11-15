import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@hashti/react";
import "./content.css";

const handlePress = fn();

const meta = {
  title: "Content/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "Card groups related information in a structured container with overflow clipping, elevation variants (flat, raised, overlay), and pressable interaction physics.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="content-story-stack">
      <Card elevation="flat" style={{ maxWidth: 420 }}>
        <CardHeader
          title="Project Blueprint"
          description="Architecture specification for Cinder 2.0"
        />
        <CardBody>
          <p style={{ margin: 0 }}>
            Every component adheres to rigorous accessibility standards with high-contrast forced
            colors and full internationalization.
          </p>
        </CardBody>
        <CardFooter style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="ghost" size="sm">
            Dismiss
          </Button>
          <Button variant="primary" size="sm">
            Review Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Project Blueprint")).toBeInTheDocument();
  },
};

export const Elevations: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-tile-grid">
        <Card elevation="flat">
          <CardHeader title="Flat Elevation" />
          <CardBody>Subtle 1px border without shadow</CardBody>
        </Card>

        <Card elevation="raised">
          <CardHeader title="Raised Elevation" />
          <CardBody>Elevated container with soft ambient shadow</CardBody>
        </Card>

        <Card elevation="overlay">
          <CardHeader title="Overlay Elevation" />
          <CardBody>High-contrast floating container for popouts</CardBody>
        </Card>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Flat Elevation")).toBeInTheDocument();
    expect(canvas.getByText("Raised Elevation")).toBeInTheDocument();
  },
};

function InteractiveCardDemo() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="content-story-stack">
      <Card
        isPressable
        elevation="raised"
        onPress={() => {
          setClicks((c) => c + 1);
          handlePress();
        }}
        style={{ maxWidth: 360 }}
      >
        <CardHeader title="Interactive Card" />
        <CardBody>
          <p style={{ margin: 0 }}>Click or press Enter/Space to activate. Clicks: {clicks}</p>
        </CardBody>
      </Card>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveCardDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: /Interactive Card/i });
    expect(card).toBeInTheDocument();
    await userEvent.click(card);
    expect(canvas.getByText(/Clicks: 1/)).toBeInTheDocument();
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="content-story-stack">
      <Card elevation="raised" style={{ maxWidth: 420 }}>
        <CardHeader
          title="پروژه طراحی سیستم"
          description="مستندات معماری کتابخانه کامپوننت سیندر"
        />
        <CardBody>
          <p style={{ margin: 0 }}>
            طراحی استاندارد بر پایه دسترس‌پذیری کامل و پشتیبانی بومی از زبان فارسی.
          </p>
        </CardBody>
        <CardFooter style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="primary" size="sm">
            تایید
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("پروژه طراحی سیستم")).toBeInTheDocument();
  },
};
