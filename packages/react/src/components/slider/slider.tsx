"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import {
  Slider as UiSdkSlider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider";
import { cx } from "../../utils";

export interface SliderProps
  extends Omit<ComponentProps<typeof UiSdkSlider>, "className" | "children"> {
  label?: ReactNode;
  /** Accessible names for each thumb, like "Minimum" / "Maximum". */
  thumbLabels?: string[];
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Slider({
  label,
  thumbLabels,
  children,
  className,
  value,
  defaultValue,
  ...props
}: SliderProps) {
  const initial = value ?? defaultValue;
  const thumbCount = Array.isArray(initial) ? initial.length : 1;
  return (
    <UiSdkSlider {...props} value={value} defaultValue={defaultValue} className={cx("hashti-slider", className)}>
      {children ?? (
        <>
          <div className="hashti-slider-label">
            {label}
            <SliderValue />
          </div>
          <SliderControl>
            <SliderTrack className="hashti-slider-track">
              <SliderIndicator className="hashti-slider-fill" />
              {Array.from({ length: thumbCount }, (_, index) => (
                <SliderThumb
                  key={index}
                  index={index}
                  className="hashti-slider-thumb"
                  aria-label={
                    thumbLabels?.[index] ??
                    (thumbCount > 1 ? (index === 0 ? "Minimum" : "Maximum") : undefined)
                  }
                />
              ))}
            </SliderTrack>
          </SliderControl>
        </>
      )}
    </UiSdkSlider>
  );
}
