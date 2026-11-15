import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Toolbar, Button, ToggleButton, Icon } from "@hashti/react";
import "./actions.css";

const meta = {
  title: "Actions/Toolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component:
          "Toolbar organizes command controls, toggle buttons, and separators into an accessible toolstrip with roving tabIndex and keyboard arrow navigation.",
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="action-story-stack">
      <Toolbar aria-label="Text formatting toolbar">
        <Toolbar.Group aria-label="Style formatting">
          <ToggleButton id="bold" aria-label="Bold">
            B
          </ToggleButton>
          <ToggleButton id="italic" aria-label="Italic">
            I
          </ToggleButton>
          <ToggleButton id="underline" aria-label="Underline">
            U
          </ToggleButton>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group aria-label="Actions">
          <Button variant="ghost" size="md">
            Cut
          </Button>
          <Button variant="ghost" size="md">
            Copy
          </Button>
          <Button variant="ghost" size="md">
            Paste
          </Button>
        </Toolbar.Group>
      </Toolbar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole("toolbar", { name: "Text formatting toolbar" });
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");

    const boldBtn = canvas.getByRole("button", { name: "Bold" });
    const italicBtn = canvas.getByRole("button", { name: "Italic" });
    const cutBtn = canvas.getByRole("button", { name: "Cut" });

    expect(boldBtn).toBeInTheDocument();
    expect(italicBtn).toBeInTheDocument();
    expect(cutBtn).toBeInTheDocument();

    // Toggle bold button
    await userEvent.click(boldBtn);
    expect(boldBtn).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(boldBtn);
    expect(boldBtn).toHaveAttribute("aria-pressed", "false");
  },
};

export const Variants: Story = {
  render: () => (
    <div className="action-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Flat (Default)</h4>
        <Toolbar variant="flat" aria-label="Flat toolbar">
          <Toolbar.Group aria-label="Group 1">
            <Button variant="ghost">Action 1</Button>
            <Button variant="ghost">Action 2</Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Button variant="secondary">Run</Button>
        </Toolbar>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Raised</h4>
        <Toolbar variant="raised" aria-label="Raised toolbar">
          <Toolbar.Group aria-label="Drawing tools">
            <Button variant="ghost">Select</Button>
            <Button variant="ghost">Pen</Button>
            <Button variant="ghost">Shape</Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Button variant="primary">Export</Button>
        </Toolbar>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Floating</h4>
        <Toolbar variant="floating" aria-label="Floating canvas bar">
          <Toolbar.Group aria-label="Canvas controls">
            <Button variant="ghost">100%</Button>
            <Button variant="ghost">Fit</Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Button variant="ghost">Share</Button>
        </Toolbar>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const flatBar = canvas.getByRole("toolbar", { name: "Flat toolbar" });
    const raisedBar = canvas.getByRole("toolbar", { name: "Raised toolbar" });
    const floatingBar = canvas.getByRole("toolbar", { name: "Floating canvas bar" });

    expect(flatBar).toHaveAttribute("data-variant", "flat");
    expect(raisedBar).toHaveAttribute("data-variant", "raised");
    expect(floatingBar).toHaveAttribute("data-variant", "floating");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="action-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Small (sm)</h4>
        <Toolbar size="sm" variant="raised" aria-label="Small toolbar">
          <Button size="sm" variant="ghost">
            View
          </Button>
          <Toolbar.Separator />
          <Button size="sm" variant="ghost">
            Filter
          </Button>
        </Toolbar>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Medium (md - standard)</h4>
        <Toolbar size="md" variant="raised" aria-label="Medium toolbar">
          <Button size="md" variant="ghost">
            View
          </Button>
          <Toolbar.Separator />
          <Button size="md" variant="ghost">
            Filter
          </Button>
        </Toolbar>
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Large (lg)</h4>
        <Toolbar size="lg" variant="raised" aria-label="Large toolbar">
          <Button size="lg" variant="ghost">
            View
          </Button>
          <Toolbar.Separator />
          <Button size="lg" variant="ghost">
            Filter
          </Button>
        </Toolbar>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smBar = canvas.getByRole("toolbar", { name: "Small toolbar" });
    const mdBar = canvas.getByRole("toolbar", { name: "Medium toolbar" });
    const lgBar = canvas.getByRole("toolbar", { name: "Large toolbar" });

    expect(smBar).toHaveAttribute("data-size", "sm");
    expect(mdBar).toHaveAttribute("data-size", "md");
    expect(lgBar).toHaveAttribute("data-size", "lg");
  },
};

export const VerticalOrientation: Story = {
  render: () => (
    <div className="action-story-stack">
      <Toolbar orientation="vertical" variant="floating" aria-label="Canvas sidebar tools">
        <Toolbar.Group aria-label="Primary tools">
          <Button variant="ghost" aria-label="Select tool">
            <Icon name="chevronRight" />
          </Button>
          <Button variant="ghost" aria-label="Settings tool">
            <Icon name="overflow" />
          </Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Item>
          <Button variant="ghost" aria-label="Close panel">
            <Icon name="close" />
          </Button>
        </Toolbar.Item>
      </Toolbar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole("toolbar", { name: "Canvas sidebar tools" });
    expect(toolbar).toHaveAttribute("aria-orientation", "vertical");
    expect(toolbar).toHaveAttribute("data-orientation", "vertical");
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="action-story-stack">
      <Toolbar isDisabled variant="raised" aria-label="Disabled toolbar">
        <Button variant="ghost">Action 1</Button>
        <Toolbar.Separator />
        <Button variant="ghost">Action 2</Button>
      </Toolbar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole("toolbar", { name: "Disabled toolbar" });
    expect(toolbar).toHaveAttribute("data-disabled", "true");
  },
};
