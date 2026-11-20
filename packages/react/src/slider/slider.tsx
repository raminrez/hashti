"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  Slider as UiSlider,
  SliderControl as UiSliderControl,
  SliderIndicator as UiSliderIndicator,
  SliderThumb as UiSliderThumb,
  SliderTrack as UiSliderTrack,
  SliderValue as UiSliderValue,
} from "@ui-sdk/react/slider"


function Slider(props: ComponentProps<typeof UiSlider>) {
  return <UiSlider {...props} className={join("hashti-slider", props.className)} />
}

function SliderValue(props: ComponentProps<typeof UiSliderValue>) {
  return <UiSliderValue {...props} className={join("hashti-slider__value", props.className)} />
}

function SliderControl(props: ComponentProps<typeof UiSliderControl>) {
  return <UiSliderControl {...props} className={join("hashti-slider-control", props.className)} />
}

function SliderTrack(props: ComponentProps<typeof UiSliderTrack>) {
  return <UiSliderTrack {...props} className={join("hashti-slider-track", props.className)} />
}

function SliderIndicator(props: ComponentProps<typeof UiSliderIndicator>) {
  return <UiSliderIndicator {...props} className={join("hashti-slider-indicator", props.className)} />
}

function SliderThumb(props: ComponentProps<typeof UiSliderThumb>) {
  return <UiSliderThumb {...props} className={join("hashti-slider-thumb", props.className)} />
}

export { Slider, SliderValue, SliderControl, SliderTrack, SliderIndicator, SliderThumb }
