import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "./slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 60,
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "number", table: { category: "Value" } },
    min: { control: "number", table: { category: "Value" } },
    max: { control: "number", table: { category: "Value" } },
    step: { control: "number", table: { category: "Value" } },
    largeStep: { control: "number", table: { category: "Value" } },
    minStepsBetweenThumbs: { control: "number", table: { category: "Value" } },
    defaultValue: { control: false, table: { category: "Value" } },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    format: { control: false, table: { category: "Value" } },
    onValueChange: { control: false, table: { category: "Events" } },
    onValueCommit: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value: number | number[] }>();
    return (
      <div style={{ inlineSize: 320 }}>
        <Slider
          {...args}
          value={value}
          aria-label="Volume"
          onValueChange={(next, details) => {
            args.onValueChange?.(next, details);
            updateArgs({ value: next });
          }}
        >
          <SliderValue />
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </div>
    );
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

// A two-thumb range picks a start and an end.
export const Range: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <Slider defaultValue={[20, 80]} aria-label="Price range">
        <SliderValue />
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb index={0} aria-label="Minimum price" />
            <SliderThumb index={1} aria-label="Maximum price" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  ),
};
