import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TriggerMenu,
  TriggerMenuInput,
  TriggerMenuStatus,
} from "./trigger-menu";

const people = ["Hollis Vance", "Priya Nair", "Tom Okafor", "Lena Fischer"];

const meta = {
  title: "Components/TriggerMenu",
  component: TriggerMenu,
  tags: ["autodocs"],
  // `triggers` is a data array a Controls panel can't drive; the root is render-only here.
  parameters: { layout: "padded", controls: { disable: true } },
  args: { triggers: [{ char: "@", items: people }] },
  render: (args) => (
    <div style={{ maxInlineSize: 320 }}>
      <TriggerMenu {...args}>
        <TriggerMenuInput
          aria-label="Message"
          placeholder="Mention someone with @…"
        />
        <TriggerMenuStatus className="sr-only" />
      </TriggerMenu>
    </div>
  ),
} satisfies Meta<typeof TriggerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
