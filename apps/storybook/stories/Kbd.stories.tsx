import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Kbd, Theme } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/Kbd",
  component: Kbd,
  parameters: {
    docs: {
      description: {
        component:
          "Kbd renders tactile 3D keyboard keycaps with OS-aware symbol mapping (Command vs Ctrl) and 2px bottom bevel.",
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="content-story-stack">
      <div className="content-card">
        <h4 className="content-card-title">Keycaps & Combinations</h4>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <span>Command palette: </span>
            <Kbd keys={["mod", "k"]} />
          </div>

          <div>
            <span>Save: </span>
            <Kbd keys={["mod", "s"]} />
          </div>

          <div>
            <span>Force quit: </span>
            <Kbd keys={["mod", "alt", "escape"]} />
          </div>

          <div>
            <span>Cancel: </span>
            <Kbd>Esc</Kbd>
          </div>

          <div>
            <span>Newline: </span>
            <Kbd keys={["shift", "enter"]} />
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Esc").length).toBeGreaterThan(0);
  },
};

export const RTL: Story = {
  render: () => (
    <Theme dir="rtl">
      <div dir="rtl" className="content-story-stack">
        <div className="content-card">
          <h4 className="content-card-title">کلیدهای میانبر در راست‌به‌چپ (RTL)</h4>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <span>جستجوی سریع: </span>
              <Kbd keys={["mod", "k"]} />
            </div>
            <div>
              <span>ذخیره تغییرات: </span>
              <Kbd keys={["mod", "s"]} />
            </div>
            <div>
              <span>لغو عملیات: </span>
              <Kbd>Esc</Kbd>
            </div>
            <div>
              <span>سطر جدید: </span>
              <Kbd keys={["shift", "enter"]} />
            </div>
            <div>
              <span>بازگشت به عقب: </span>
              <Kbd keys={["mod", "z"]} />
            </div>
          </div>
        </div>
      </div>
    </Theme>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Esc").length).toBeGreaterThan(0);
  },
};
