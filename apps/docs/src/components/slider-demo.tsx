"use client"

import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack, SliderValue } from "@hashti/react"

export function SliderDemo() {
  return (
    <Slider defaultValue={60} aria-label="Volume">
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}
