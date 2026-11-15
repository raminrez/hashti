import { describe, expect, test } from "bun:test";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  ColorPicker,
  ColorPickerRoot,
  ColorPickerConvenience,
  ColorArea,
  ColorSlider,
  ColorWheel,
  ColorWheelTrack,
  ColorField,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  parseColor,
} from "../../packages/react/src";

describe("Phase 5: Color Primitives Suite unit tests", () => {
  describe("Component exports and compound anatomy", () => {
    test("exports all required Color components and subcomponents", () => {
      expect(typeof ColorPicker).toBe("function");
      expect(typeof ColorPickerConvenience).toBe("function");
      expect(typeof ColorPickerRoot).toBe("function");
      expect(typeof ColorArea).toBe("function");
      expect(typeof ColorSlider).toBe("function");
      expect(typeof ColorWheel).toBe("function");
      expect(typeof ColorWheelTrack).toBe("function");
      expect(typeof ColorField).toBe("function");
      expect(typeof ColorSwatch).toBe("function");
      expect(typeof ColorSwatchPicker).toBe("function");
      expect(typeof ColorSwatchPickerItem).toBe("function");
      expect(typeof ColorThumb).toBe("function");
      expect(typeof parseColor).toBe("function");
    });

    test("exposes complete compound namespacing on ColorPicker", () => {
      expect(ColorPicker.Root).toBe(ColorPickerRoot);
      expect(ColorPicker.Area).toBe(ColorArea);
      expect(ColorPicker.Slider).toBe(ColorSlider);
      expect(ColorPicker.Wheel).toBe(ColorWheel);
      expect(ColorPicker.Field).toBe(ColorField);
      expect(ColorPicker.Swatch).toBe(ColorSwatch);
      expect(ColorPicker.SwatchPicker).toBe(ColorSwatchPicker);
      expect(ColorPicker.Thumb).toBe(ColorThumb);
      expect(ColorSwatchPicker.Item).toBe(ColorSwatchPickerItem);
      expect(ColorWheel.Track).toBe(ColorWheelTrack);
    });
  });

  describe("ColorSwatch suite", () => {
    test("renders ColorSwatch with color preview and accessible role", () => {
      const html = ReactDOMServer.renderToString(
        <ColorSwatch color="#ff0000" aria-label="Crimson Red" />,
      );

      expect(html).toContain('role="img"');
      expect(html).toContain('aria-roledescription="color swatch"');
      expect(html).toContain("hashti-color-swatch");
      expect(html).toContain("rgba(255, 0, 0, 1)");
      expect(html).toContain('data-size="md"');
      expect(html).toContain('data-shape="square"');
    });

    test("supports size variants and circular shape", () => {
      const smHtml = ReactDOMServer.renderToString(
        <ColorSwatch color="#00ff00" size="sm" shape="circle" aria-label="Green Circle" />,
      );
      expect(smHtml).toContain("hashti-color-swatch--sm");
      expect(smHtml).toContain("hashti-color-swatch--circle");
      expect(smHtml).toContain('data-size="sm"');
      expect(smHtml).toContain('data-shape="circle"');

      const lgHtml = ReactDOMServer.renderToString(
        <ColorSwatch color="#0000ff" size="lg" aria-label="Blue Square" />,
      );
      expect(lgHtml).toContain("hashti-color-swatch--lg");
      expect(lgHtml).toContain('data-size="lg"');
    });
  });

  describe("ColorArea suite", () => {
    test("renders ColorArea with 2D gradient channels and default ColorThumb", () => {
      const html = ReactDOMServer.renderToString(
        <ColorArea
          defaultValue="hsb(210, 100%, 100%)"
          xChannel="saturation"
          yChannel="brightness"
        />,
      );

      expect(html).toContain("hashti-color-area");
      expect(html).toContain('role="group"');
      expect(html).toContain("hashti-color-thumb");
      expect(html).toContain('type="range"');
      expect(html).toContain('aria-roledescription="2D slider"');
    });

    test("supports disabled state on ColorArea", () => {
      const html = ReactDOMServer.renderToString(
        <ColorArea defaultValue="hsl(0, 100%, 50%)" isDisabled />,
      );

      expect(html).toContain("hashti-color-area");
      expect(html).toContain('data-disabled="true"');
    });
  });

  describe("ColorSlider suite", () => {
    test("renders horizontal ColorSlider with track, thumb, and label", () => {
      const html = ReactDOMServer.renderToString(
        <ColorSlider
          channel="hue"
          defaultValue="hsl(180, 100%, 50%)"
          label="Hue Channel"
          showOutput
        />,
      );

      expect(html).toContain("hashti-color-slider");
      expect(html).toContain("hashti-color-slider__label");
      expect(html).toContain("Hue Channel");
      expect(html).toContain("hashti-color-slider__track");
      expect(html).toContain("hashti-color-thumb");
      expect(html).toContain('data-orientation="horizontal"');
    });

    test("renders vertical ColorSlider", () => {
      const html = ReactDOMServer.renderToString(
        <ColorSlider
          channel="alpha"
          defaultValue="hsla(180, 100%, 50%, 0.8)"
          orientation="vertical"
          aria-label="Opacity"
        />,
      );

      expect(html).toContain("hashti-color-slider");
      expect(html).toContain('data-orientation="vertical"');
    });
  });

  describe("ColorWheel suite", () => {
    test("renders circular ColorWheel with track and thumb", () => {
      const html = ReactDOMServer.renderToString(
        <ColorWheel defaultValue="hsl(120, 100%, 50%)" aria-label="Hue Wheel" />,
      );

      expect(html).toContain("hashti-color-wheel");
      expect(html).toContain("hashti-color-wheel-track");
      expect(html).toContain("hashti-color-thumb");
      expect(html).toContain('type="range"');
    });
  });

  describe("ColorField suite", () => {
    test("renders ColorField with label and text input", () => {
      const html = ReactDOMServer.renderToString(
        <ColorField defaultValue="#4a90e2" label="Hex Code" />,
      );

      expect(html).toContain("hashti-color-field");
      expect(html).toContain("hashti-color-field__label");
      expect(html).toContain("Hex Code");
      expect(html).toContain("hashti-color-field__input");
      expect(html).toContain('value="#4A90E2"');
    });
  });

  describe("ColorSwatchPicker suite", () => {
    test("renders swatch picker grid with selectable items and checkmark on selection", () => {
      const html = ReactDOMServer.renderToString(
        <ColorSwatchPicker defaultValue="#ff0000" aria-label="Palette Swatches">
          <ColorSwatchPickerItem color="#ff0000" aria-label="Red" />
          <ColorSwatchPickerItem color="#00ff00" aria-label="Green" />
          <ColorSwatchPickerItem color="#0000ff" aria-label="Blue" />
        </ColorSwatchPicker>,
      );

      expect(html).toContain("hashti-color-swatch-picker");
      expect(html).toContain("hashti-color-swatch-picker--grid");
      expect(html).toContain('role="listbox"');
      expect(html).toContain("hashti-color-swatch-picker-item");
      expect(html).toContain('role="option"');
      expect(html).toContain('data-selected="true"');
      expect(html).toContain("hashti-color-swatch-picker-item__check");
    });

    test("supports stack layout and size variants", () => {
      const html = ReactDOMServer.renderToString(
        <ColorSwatchPicker
          defaultValue="#ffffff"
          layout="stack"
          size="sm"
          aria-label="Stacked swatches"
        >
          <ColorSwatchPickerItem color="#ffffff" aria-label="White" />
        </ColorSwatchPicker>,
      );

      expect(html).toContain("hashti-color-swatch-picker--stack");
      expect(html).toContain("hashti-color-swatch-picker--sm");
    });
  });

  describe("ColorPicker convenience composite suite", () => {
    test("renders default composite ColorPicker with area, hue slider, swatch, and hex field", () => {
      const html = ReactDOMServer.renderToString(
        <ColorPicker defaultValue="#3b82f6" label="Accent Color" showAlpha />,
      );

      expect(html).toContain("hashti-color-picker");
      expect(html).toContain("hashti-color-picker__label");
      expect(html).toContain("Accent Color");
      expect(html).toContain("hashti-color-picker__area");
      expect(html).toContain("hashti-color-area");
      expect(html).toContain("hashti-color-picker__controls");
      expect(html).toContain("hashti-color-picker__swatch");
      expect(html).toContain("hashti-color-slider");
      expect(html).toContain("hashti-color-field");
      expect(html).toContain('value="#3B82F6"');
    });

    test("supports custom composition via children", () => {
      const html = ReactDOMServer.renderToString(
        <ColorPicker defaultValue="hsl(300, 100%, 50%)">
          <ColorWheel aria-label="Wheel" />
          <ColorSwatch aria-label="Preview" />
        </ColorPicker>,
      );

      expect(html).toContain("hashti-color-picker");
      expect(html).toContain("hashti-color-wheel");
      expect(html).toContain("hashti-color-swatch");
    });
  });
});
