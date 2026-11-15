"use client";

import { type ReactNode, type Ref } from "react";
import {
  ColorArea as RACColorArea,
  ColorField as RACColorField,
  ColorPicker as RACColorPicker,
  ColorSlider as RACColorSlider,
  ColorSwatch as RACColorSwatch,
  ColorSwatchPicker as RACColorSwatchPicker,
  ColorSwatchPickerItem as RACColorSwatchPickerItem,
  ColorThumb as RACColorThumb,
  ColorWheel as RACColorWheel,
  ColorWheelTrack as RACColorWheelTrack,
  Input,
  SliderOutput,
  SliderTrack,
  parseColor,
  type Color,
  type ColorAreaProps as RACColorAreaProps,
  type ColorAreaRenderProps,
  type ColorFieldProps as RACColorFieldProps,
  type ColorFieldRenderProps,
  type ColorPickerProps as RACColorPickerProps,
  type ColorPickerRenderProps,
  type ColorSliderProps as RACColorSliderProps,
  type ColorSliderRenderProps,
  type ColorSwatchProps as RACColorSwatchProps,
  type ColorSwatchRenderProps,
  type ColorSwatchPickerProps as RACColorSwatchPickerProps,
  type ColorSwatchPickerRenderProps,
  type ColorSwatchPickerItemProps as RACColorSwatchPickerItemProps,
  type ColorSwatchPickerItemRenderProps,
  type ColorThumbProps as RACColorThumbProps,
  type ColorThumbRenderProps,
  type ColorWheelProps as RACColorWheelProps,
  type ColorWheelRenderProps,
  type ColorWheelTrackProps as RACColorWheelTrackProps,
  type ColorWheelTrackRenderProps,
} from "react-aria-components";
import { Icon } from "../../icons";
import { Field } from "../field";
import { classes, cx, type ControlSize } from "../../utils";

function normalizeColor(color: string | Color | undefined): Color | undefined {
  if (!color) return undefined;
  const parsed = typeof color === "string" ? parseColor(color) : color;
  return parsed.getColorSpace() !== "hsb" ? parsed.toFormat("hsb") : parsed;
}

/* ------------------------------------------------------------------ */
/*  ColorThumb                                                        */
/* ------------------------------------------------------------------ */

export interface ColorThumbProps extends RACColorThumbProps {
  ref?: Ref<HTMLDivElement>;
}

export function ColorThumb({ className, ref, ...props }: ColorThumbProps) {
  return (
    <RACColorThumb
      {...props}
      ref={ref}
      className={classes("react-aria-ColorThumb hashti-color-thumb", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ColorArea                                                         */
/* ------------------------------------------------------------------ */

export interface ColorAreaProps extends RACColorAreaProps {
  ref?: Ref<HTMLDivElement>;
}

export function ColorArea({ className, children, ref, ...props }: ColorAreaProps) {
  return (
    <RACColorArea
      {...props}
      ref={ref}
      className={classes("react-aria-ColorArea hashti-color-area", className)}
    >
      {(renderProps) => {
        if (typeof children === "function") {
          return children(renderProps);
        }
        return children ?? <ColorThumb />;
      }}
    </RACColorArea>
  );
}

/* ------------------------------------------------------------------ */
/*  ColorSlider                                                       */
/* ------------------------------------------------------------------ */

export interface ColorSliderProps extends RACColorSliderProps {
  label?: ReactNode;
  showOutput?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function ColorSlider({
  className,
  label,
  showOutput = false,
  children,
  ref,
  ...props
}: ColorSliderProps) {
  return (
    <RACColorSlider
      {...props}
      ref={ref}
      className={classes("react-aria-ColorSlider hashti-color-slider", className)}
    >
      {(renderProps) => {
        if (typeof children === "function") {
          return children(renderProps);
        }
        if (children) {
          return children;
        }
        return (
          <>
            {(label || showOutput) && (
              <div className="hashti-color-slider__header">
                {label && <Field.Label className="hashti-color-slider__label">{label}</Field.Label>}
                {showOutput && <SliderOutput className="hashti-color-slider__output" />}
              </div>
            )}
            <SliderTrack className="hashti-color-slider__track">
              <ColorThumb />
            </SliderTrack>
          </>
        );
      }}
    </RACColorSlider>
  );
}

/* ------------------------------------------------------------------ */
/*  ColorWheel & ColorWheelTrack                                      */
/* ------------------------------------------------------------------ */

export interface ColorWheelTrackProps extends RACColorWheelTrackProps {
  ref?: Ref<HTMLDivElement>;
}

export function ColorWheelTrack({ className, ref, ...props }: ColorWheelTrackProps) {
  return (
    <RACColorWheelTrack
      {...props}
      ref={ref}
      className={classes("react-aria-ColorWheelTrack hashti-color-wheel-track", className)}
    />
  );
}

export interface ColorWheelProps extends Omit<RACColorWheelProps, "innerRadius" | "outerRadius"> {
  innerRadius?: number;
  outerRadius?: number;
  ref?: Ref<HTMLDivElement>;
}

export function ColorWheel({
  className,
  innerRadius = 74,
  outerRadius = 100,
  children,
  ref,
  ...props
}: ColorWheelProps) {
  return (
    <RACColorWheel
      {...props}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      ref={ref}
      className={classes("react-aria-ColorWheel hashti-color-wheel", className)}
    >
      {(renderProps) => {
        if (typeof children === "function") {
          return children(renderProps);
        }
        if (children) {
          return children;
        }
        return (
          <>
            <ColorWheelTrack className="hashti-color-wheel__track" />
            <ColorThumb />
          </>
        );
      }}
    </RACColorWheel>
  );
}

/* ------------------------------------------------------------------ */
/*  ColorField                                                        */
/* ------------------------------------------------------------------ */

export interface ColorFieldProps extends RACColorFieldProps {
  label?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function ColorField({ className, label, children, ref, ...props }: ColorFieldProps) {
  return (
    <RACColorField
      {...props}
      ref={ref}
      className={classes("react-aria-ColorField hashti-color-field", className)}
    >
      {(renderProps) => {
        if (typeof children === "function") {
          return children(renderProps);
        }
        if (children) {
          return children;
        }
        return (
          <>
            {label && <Field.Label className="hashti-color-field__label">{label}</Field.Label>}
            <Input className="hashti-color-field__input" />
          </>
        );
      }}
    </RACColorField>
  );
}

/* ------------------------------------------------------------------ */
/*  ColorSwatch                                                       */
/* ------------------------------------------------------------------ */

export interface ColorSwatchProps extends RACColorSwatchProps {
  size?: ControlSize;
  shape?: "square" | "circle";
  ref?: Ref<HTMLDivElement>;
}

export function ColorSwatch({
  className,
  size = "md",
  shape = "square",
  ref,
  ...props
}: ColorSwatchProps) {
  return (
    <RACColorSwatch
      {...props}
      ref={ref}
      data-size={size}
      data-shape={shape}
      className={classes(
        cx(
          "react-aria-ColorSwatch",
          "hashti-color-swatch",
          `hashti-color-swatch--${size}`,
          shape === "circle" ? "hashti-color-swatch--circle" : "",
        ),
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ColorSwatchPicker & ColorSwatchPickerItem                         */
/* ------------------------------------------------------------------ */

export interface ColorSwatchPickerItemProps extends RACColorSwatchPickerItemProps {
  ref?: Ref<HTMLDivElement>;
}

export function ColorSwatchPickerItem({
  className,
  children,
  ref,
  ...props
}: ColorSwatchPickerItemProps) {
  return (
    <RACColorSwatchPickerItem
      {...props}
      ref={ref}
      className={classes(
        "react-aria-ColorSwatchPickerItem hashti-color-swatch-picker-item",
        className,
      )}
    >
      {(renderProps) => {
        if (typeof children === "function") {
          return children(renderProps);
        }
        return (
          <>
            {children ?? <ColorSwatch />}
            {renderProps.isSelected && (
              <span className="hashti-color-swatch-picker-item__check" aria-hidden="true">
                <Icon name="check" size={16} />
              </span>
            )}
          </>
        );
      }}
    </RACColorSwatchPickerItem>
  );
}

export interface ColorSwatchPickerProps extends RACColorSwatchPickerProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

export function ColorSwatchPicker({
  className,
  size = "md",
  layout = "grid",
  ref,
  ...props
}: ColorSwatchPickerProps) {
  return (
    <RACColorSwatchPicker
      {...props}
      ref={ref}
      layout={layout}
      data-size={size}
      className={classes(
        cx(
          "react-aria-ColorSwatchPicker",
          "hashti-color-swatch-picker",
          `hashti-color-swatch-picker--${layout}`,
          `hashti-color-swatch-picker--${size}`,
        ),
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ColorPicker Coordinator & Convenience Composite                   */
/* ------------------------------------------------------------------ */

export interface ColorPickerRootProps extends RACColorPickerProps {}

export function ColorPickerRoot(props: ColorPickerRootProps) {
  return <RACColorPicker {...props} />;
}

export interface ColorPickerConvenienceProps extends Omit<
  RACColorPickerProps,
  "defaultValue" | "value" | "children"
> {
  defaultValue?: string | Color;
  value?: string | Color;
  className?: string;
  showAlpha?: boolean;
  showHexField?: boolean;
  showSwatch?: boolean;
  label?: ReactNode;
  children?: RACColorPickerProps["children"];
}

export type ColorPickerProps = ColorPickerConvenienceProps;

export function ColorPickerConvenience({
  className,
  defaultValue = "hsl(0, 100%, 50%)",
  value,
  showAlpha = false,
  showHexField = true,
  showSwatch = true,
  label,
  children,
  ...props
}: ColorPickerConvenienceProps) {
  const normalizedDefault = normalizeColor(defaultValue);
  const normalizedValue = normalizeColor(value);

  return (
    <RACColorPicker {...props} defaultValue={normalizedDefault} value={normalizedValue}>
      {(renderProps) => {
        if (typeof children === "function") {
          return (
            <div className={cx("hashti-color-picker", className)}>{children(renderProps)}</div>
          );
        }
        if (children) {
          return <div className={cx("hashti-color-picker", className)}>{children}</div>;
        }
        return (
          <div className={cx("hashti-color-picker", className)}>
            {label && <Field.Label className="hashti-color-picker__label">{label}</Field.Label>}
            <ColorArea
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
              className="hashti-color-picker__area"
            />
            <div className="hashti-color-picker__controls">
              {showSwatch && <ColorSwatch className="hashti-color-picker__swatch" size="lg" />}
              <div className="hashti-color-picker__sliders">
                <ColorSlider colorSpace="hsb" channel="hue" aria-label="Hue" />
                {showAlpha && <ColorSlider channel="alpha" aria-label="Alpha" />}
              </div>
            </div>
            {showHexField && (
              <div className="hashti-color-picker__fields">
                <ColorField aria-label="Hex color" />
              </div>
            )}
          </div>
        );
      }}
    </RACColorPicker>
  );
}

export const ColorPicker = Object.assign(ColorPickerConvenience, {
  Root: ColorPickerRoot,
  Area: ColorArea,
  Slider: ColorSlider,
  Wheel: Object.assign(ColorWheel, {
    Track: ColorWheelTrack,
  }),
  Field: ColorField,
  Swatch: ColorSwatch,
  SwatchPicker: Object.assign(ColorSwatchPicker, {
    Item: ColorSwatchPickerItem,
  }),
  Thumb: ColorThumb,
  Track: SliderTrack,
});

ColorSwatchPicker.Item = ColorSwatchPickerItem;
ColorWheel.Track = ColorWheelTrack;

export { parseColor, type Color };
export type {
  ColorAreaRenderProps,
  ColorFieldRenderProps,
  ColorPickerRenderProps,
  ColorSliderRenderProps,
  ColorSwatchRenderProps,
  ColorSwatchPickerRenderProps,
  ColorSwatchPickerItemRenderProps,
  ColorThumbRenderProps,
  ColorWheelRenderProps,
  ColorWheelTrackRenderProps,
};
