"use client"

import type { ComponentProps } from "react"
import {
  ColorPicker as UiColorPicker,
  ColorPickerArea as UiColorPickerArea,
  ColorPickerAreaCanvas as UiColorPickerAreaCanvas,
  ColorPickerAreaThumb as UiColorPickerAreaThumb,
  ColorPickerChannelInput as UiColorPickerChannelInput,
  ColorPickerEyeDropper as UiColorPickerEyeDropper,
  ColorPickerInput as UiColorPickerInput,
  ColorPickerSlider as UiColorPickerSlider,
  ColorPickerSliderThumb as UiColorPickerSliderThumb,
  ColorPickerSwatch as UiColorPickerSwatch,
  ColorPickerSwatchItem as UiColorPickerSwatchItem,
  ColorPickerSwatches as UiColorPickerSwatches,
} from "@ui-sdk/react/color-picker"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

function ColorPicker(props: ComponentProps<typeof UiColorPicker>) {
  return <UiColorPicker {...props} className={join("hashti-color-picker", props.className)} />
}

function ColorPickerArea(props: ComponentProps<typeof UiColorPickerArea>) {
  return <UiColorPickerArea {...props} className={join("hashti-color-picker-area", props.className)} />
}

function ColorPickerAreaCanvas(props: ComponentProps<typeof UiColorPickerAreaCanvas>) {
  return (
    <UiColorPickerAreaCanvas {...props} className={join("hashti-color-picker-area-canvas", props.className)} />
  )
}

function ColorPickerAreaThumb(props: ComponentProps<typeof UiColorPickerAreaThumb>) {
  return (
    <UiColorPickerAreaThumb {...props} className={join("hashti-color-picker-area-thumb", props.className)} />
  )
}

function ColorPickerSlider(props: ComponentProps<typeof UiColorPickerSlider>) {
  return <UiColorPickerSlider {...props} className={join("hashti-color-picker-slider", props.className)} />
}

function ColorPickerSliderThumb(props: ComponentProps<typeof UiColorPickerSliderThumb>) {
  return (
    <UiColorPickerSliderThumb {...props} className={join("hashti-color-picker-slider-thumb", props.className)} />
  )
}

function ColorPickerSwatch(props: ComponentProps<typeof UiColorPickerSwatch>) {
  return <UiColorPickerSwatch {...props} className={join("hashti-color-picker-swatch", props.className)} />
}

function ColorPickerSwatches(props: ComponentProps<typeof UiColorPickerSwatches>) {
  return (
    <UiColorPickerSwatches {...props} className={join("hashti-color-picker-swatches", props.className)} />
  )
}

function ColorPickerSwatchItem(props: ComponentProps<typeof UiColorPickerSwatchItem>) {
  return (
    <UiColorPickerSwatchItem {...props} className={join("hashti-color-picker-swatch-item", props.className)} />
  )
}

function ColorPickerInput(props: ComponentProps<typeof UiColorPickerInput>) {
  return <UiColorPickerInput {...props} className={join("hashti-color-picker-input", props.className)} />
}

function ColorPickerChannelInput(props: ComponentProps<typeof UiColorPickerChannelInput>) {
  return (
    <UiColorPickerChannelInput
      {...props}
      className={join("hashti-color-picker-channel-input", props.className)}
    />
  )
}

function ColorPickerEyeDropper(props: ComponentProps<typeof UiColorPickerEyeDropper>) {
  return (
    <UiColorPickerEyeDropper {...props} className={join("hashti-color-picker-eye-dropper", props.className)} />
  )
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  ColorPickerInput,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
}
