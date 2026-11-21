import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatchItem,
  ColorPickerSwatches,
} from "./color-picker";

const presets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
];

const meta = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    defaultValue: "#0ea5e9",
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "text", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <ColorPicker
      {...args}
      aria-label="Brand color"
      style={{ maxInlineSize: 260 }}
    >
      <ColorPickerArea>
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerSlider channel="hue">
        <ColorPickerSliderThumb />
      </ColorPickerSlider>
      <ColorPickerInput aria-label="Hex" />
      <ColorPickerSwatches aria-label="Presets">
        {presets.map((preset) => (
          <ColorPickerSwatchItem key={preset} value={preset} />
        ))}
      </ColorPickerSwatches>
    </ColorPicker>
  ),
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
