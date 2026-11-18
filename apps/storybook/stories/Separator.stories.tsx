import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, Separator } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/Separator",
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          "Separators divide content into clear distinct groups, horizontally or vertically, with optional centered label text.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <h4 className="content-card-title">Horizontal Separator</h4>
        <p>Section above the separator</p>
        <Separator />
        <p>Section below the separator</p>
      </div>

      <div className="content-card">
        <h4 className="content-card-title">Separator with Text Label</h4>
        <Button variant="primary">Sign in with SSO</Button>
        <Separator label="OR" />
        <Button variant="secondary">Sign in with Email</Button>
      </div>

      <div className="content-card">
        <h4 className="content-card-title">Vertical Separator</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", height: "2.5rem" }}>
          <span>Left Item</span>
          <Separator orientation="vertical" />
          <span>Center Item</span>
          <Separator orientation="vertical" />
          <span>Right Item</span>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("OR")).toBeInTheDocument();
    expect(canvas.getAllByRole("separator").length).toBeGreaterThan(0);
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="content-story-stack">
      <div className="content-card">
        <h4 className="content-card-title">خط جداکننده راست‌به‌چپ (RTL)</h4>
        <Button variant="primary">ورود با گذرواژه یکبار مصرف</Button>
        <Separator label="یا" />
        <Button variant="secondary">ورود با رمز عبور</Button>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("یا")).toBeInTheDocument();
  },
};
