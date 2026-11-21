import type { Meta, StoryObj } from "@storybook/react-vite";

import { Resizable, ResizableHandle, ResizablePanel } from "./resizable";

const panelStyle = {
  padding: "0.75rem",
  fontSize: "0.875rem",
} as const;

const meta = {
  title: "Components/Resizable",
  component: Resizable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {},
  render: () => (
    <Resizable
      aria-label="Workspace"
      style={{ inlineSize: "100%", maxInlineSize: 640, blockSize: "12rem" }}
    >
      <ResizablePanel
        style={{ ...panelStyle, background: "var(--hashti-layer-02)" }}
      >
        Files
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel
        style={{ ...panelStyle, background: "var(--hashti-layer-01)" }}
      >
        Editor
      </ResizablePanel>
    </Resizable>
  ),
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
