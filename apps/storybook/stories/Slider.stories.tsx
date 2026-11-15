import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Slider, Theme, useTheme } from "@hashti/react";
import "./navigation.css";

const meta = {
  title: "Fields/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "Slider lets users choose a value (or range of values) by moving a thumb along a horizontal track. Supports single and multi-thumb range modes, step increments, and localized number formatting.",
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [value, setValue] = useState<number>(45);
  return (
    <div className="navigation-story-stack">
      <Slider
        label="Storage allocation (GB)"
        minValue={0}
        maxValue={100}
        value={value}
        onChange={(v) => setValue(v as number)}
      />
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const sliderThumb = canvas.getByRole("slider", { name: "Storage allocation (GB)" });
    expect(sliderThumb).toHaveValue("45");

    sliderThumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(sliderThumb).toHaveValue("46");

    await userEvent.keyboard("{ArrowLeft}");
    expect(sliderThumb).toHaveValue("45");
  },
};

function RangeSliderExample() {
  const [range, setRange] = useState<number[]>([25, 75]);
  return (
    <div className="navigation-story-stack">
      <Slider
        label="Throughput bounds (MB/s)"
        minValue={0}
        maxValue={100}
        value={range}
        thumbLabels={["Min bandwidth", "Max bandwidth"]}
        onChange={(v) => setRange(v as number[])}
      />
    </div>
  );
}

export const RangeSlider: Story = {
  render: () => <RangeSliderExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const minThumb = canvas.getByRole("slider", { name: /Min bandwidth/ });
    const maxThumb = canvas.getByRole("slider", { name: /Max bandwidth/ });

    expect(minThumb).toHaveValue("25");
    expect(maxThumb).toHaveValue("75");

    minThumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(minThumb).toHaveValue("26");

    maxThumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(maxThumb).toHaveValue("76");
  },
};

export const FormattedAndStep: Story = {
  render: () => (
    <div className="navigation-story-stack">
      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Step increment (step = 10)</h4>
        <Slider
          label="Cluster replica scale"
          minValue={10}
          maxValue={100}
          step={10}
          defaultValue={30}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Currency formatting</h4>
        <Slider
          label="Budget cap"
          minValue={100}
          maxValue={5000}
          step={50}
          defaultValue={1200}
          formatOptions={{ style: "currency", currency: "USD" }}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 0.5rem" }}>Disabled state</h4>
        <Slider
          label="Locked provisioned IOPS"
          minValue={1000}
          maxValue={10000}
          defaultValue={3000}
          isDisabled
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const stepThumb = canvas.getByRole("slider", { name: "Cluster replica scale" });
    expect(stepThumb).toHaveValue("30");

    stepThumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(stepThumb).toHaveValue("40");

    const disabledThumb = canvas.getByRole("slider", { name: "Locked provisioned IOPS" });
    expect(disabledThumb).toBeDisabled();
  },
};

function LocalizedSlider() {
  const { theme } = useTheme();
  const [val, setVal] = useState<number>(60);
  return (
    <div className="navigation-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <Slider
            label="ظرفیت حافظه موقت (مگابایت)"
            minValue={0}
            maxValue={100}
            value={val}
            onChange={(v) => setVal(v as number)}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedSlider />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const thumb = canvas.getByRole("slider", { name: "ظرفیت حافظه موقت (مگابایت)" });
    await waitFor(() => expect(thumb).toBeVisible());
    expect(thumb).toHaveValue("60");

    thumb.focus();
    expect(thumb).toHaveFocus();
  },
};
