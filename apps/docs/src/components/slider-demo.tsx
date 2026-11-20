"use client";

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@hashti/react";

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
  );
}

export function SliderVerticalDemo() {
  return (
    <div style={{ display: "flex", gap: "1.5rem" }}>
      {[
        { label: "Red", value: 80 },
        { label: "Green", value: 45 },
        { label: "Blue", value: 20 },
      ].map((channel) => (
        <Slider
          key={channel.label}
          defaultValue={channel.value}
          orientation="vertical"
          aria-label={`${channel.label} channel`}
        >
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb />
            </SliderTrack>
          </SliderControl>
        </Slider>
      ))}
    </div>
  );
}
