import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  ColorWheel,
  ColorField,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@hashti/react";
import "./forms.css";

const meta = {
  title: "Forms/ColorPicker",
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component:
          "ColorPicker and color primitives suite for selecting and editing colors across HSB, HSL, and RGB color spaces with 2D areas, channel sliders, circular hue wheels, swatches, and swatch pickers.",
      },
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="form-story-stack">
      <ColorPicker defaultValue="#0f62fe" label="Accent Theme Color" showAlpha />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText("Accent Theme Color");
    expect(label).toBeInTheDocument();

    // RAC labels the 2D slider inputs, not the ColorArea group.
    const areaSlider = canvas.getByRole("slider", { name: "Color picker" });
    expect(areaSlider).toHaveAttribute("aria-roledescription", "2D slider");

    const hexInput = canvas.getByRole("textbox", { name: "Hex color" });
    expect(hexInput).toBeInTheDocument();
    expect(hexInput).toHaveValue("#0F62FE");

    await userEvent.clear(hexInput);
    await userEvent.type(hexInput, "da1e28");
    await userEvent.tab();
    await waitFor(() => expect(hexInput).toHaveValue("#DA1E28"));
  },
};

export const SwatchPicker: Story = {
  render: () => (
    <div className="form-story-stack">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Brand Palette Swatches</span>
        <ColorSwatchPicker defaultValue="#0f62fe" aria-label="Brand swatches">
          <ColorSwatchPickerItem color="#0f62fe" aria-label="IBM Blue" />
          <ColorSwatchPickerItem color="#198038" aria-label="Forest Green" />
          <ColorSwatchPickerItem color="#da1e28" aria-label="Crimson Red" />
          <ColorSwatchPickerItem color="#8a3ffc" aria-label="Purple" />
          <ColorSwatchPickerItem color="#ff832b" aria-label="Orange" />
          <ColorSwatchPickerItem color="#0072c3" aria-label="Cyan" />
          <ColorSwatchPickerItem color="#161616" aria-label="Charcoal Dark" />
          <ColorSwatchPickerItem color="#f4f4f4" aria-label="Soft Gray" />
        </ColorSwatchPicker>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const picker = canvas.getByRole("listbox", { name: "Brand swatches" });
    expect(picker).toBeInTheDocument();

    // The swatch items mount a tick after the listbox; wait rather than race them.
    const crimsonSwatch = await waitFor(() => canvas.getByRole("option", { name: /Crimson Red/ }));
    expect(crimsonSwatch).toBeInTheDocument();
    expect(crimsonSwatch).toHaveAttribute("aria-selected", "false");

    await userEvent.click(crimsonSwatch);
    await waitFor(() => expect(crimsonSwatch).toHaveAttribute("aria-selected", "true"));
  },
};

export const CustomComposition: Story = {
  render: () => (
    <div className="form-story-stack">
      <ColorPicker.Root defaultValue="hsl(210, 100%, 50%)">
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <ColorWheel aria-label="Hue ring" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "220px" }}>
            <ColorArea
              xChannel="saturation"
              yChannel="lightness"
              aria-label="Saturation and Lightness"
            />
            <ColorSlider channel="alpha" label="Opacity" showOutput />
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <ColorSwatch size="lg" aria-label="Active selection" />
              <ColorField label="Hex" />
            </div>
          </div>
        </div>
      </ColorPicker.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wheel = canvas.getByRole("slider", { name: "Hue ring" });
    expect(wheel).toBeInTheDocument();

    const swatch = canvas.getByRole("img", { name: /Active selection/ });
    expect(swatch).toBeInTheDocument();
  },
};

export const StandaloneSliders: Story = {
  render: () => (
    <div
      className="form-story-stack"
      style={{ maxWidth: "320px", display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      <ColorSlider channel="hue" defaultValue="hsl(0, 100%, 50%)" label="Hue Channel" showOutput />
      <ColorSlider
        channel="saturation"
        defaultValue="hsl(200, 80%, 50%)"
        label="Saturation Channel"
        showOutput
      />
      <ColorSlider
        channel="lightness"
        defaultValue="hsl(280, 100%, 60%)"
        label="Lightness Channel"
        showOutput
      />
      <ColorSlider
        channel="alpha"
        defaultValue="hsla(150, 100%, 40%, 0.75)"
        label="Alpha Channel"
        showOutput
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Hue Channel")).toBeInTheDocument();
    expect(canvas.getByText("Saturation Channel")).toBeInTheDocument();
    expect(canvas.getByText("Lightness Channel")).toBeInTheDocument();
    expect(canvas.getByText("Alpha Channel")).toBeInTheDocument();
  },
};

export const SwatchGallery: Story = {
  render: () => (
    <div
      className="form-story-stack"
      style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}
    >
      <ColorSwatch color="#0f62fe" size="sm" aria-label="Blue Small" />
      <ColorSwatch color="#0f62fe" size="md" aria-label="Blue Medium" />
      <ColorSwatch color="#0f62fe" size="lg" aria-label="Blue Large" />
      <ColorSwatch color="#da1e28" size="md" shape="circle" aria-label="Red Circle" />
      <ColorSwatch color="rgba(15, 98, 254, 0.4)" size="lg" aria-label="Translucent Blue" />
      <ColorSwatch
        color="rgba(218, 30, 40, 0.5)"
        size="lg"
        shape="circle"
        aria-label="Translucent Red Circle"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // ColorSwatch prefixes the generated color name to the supplied aria-label.
    expect(canvas.getByRole("img", { name: "vibrant cyan blue, Blue Small" })).toBeInTheDocument();
    expect(canvas.getByRole("img", { name: "vibrant cyan blue, Blue Large" })).toBeInTheDocument();
    expect(canvas.getByRole("img", { name: "vibrant red, Red Circle" })).toBeInTheDocument();
  },
};
