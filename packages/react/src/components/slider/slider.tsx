"use client";

import { type ReactNode, type Ref } from "react";
import {
  Slider as RACSlider,
  SliderOutput,
  SliderTrack,
  SliderFill,
  SliderThumb,
  Label,
  type SliderProps as RACSliderProps,
} from "react-aria-components";
import { classes, cx } from "../../utils";

export interface SliderProps<T extends number | number[] = number> extends RACSliderProps<T> {
  label?: ReactNode;
  thumbLabels?: string[];
  ref?: Ref<HTMLDivElement>;
}

export function Slider<T extends number | number[] = number>({
  label,
  thumbLabels,
  children,
  className,
  ...props
}: SliderProps<T>) {
  return (
    <RACSlider<T>
      {...props}
      aria-disabled={props.isDisabled || undefined}
      className={classes("hashti-slider", className)}
    >
      {children ?? (
        <>
          <div className="hashti-slider-label">
            <Label>{label}</Label>
            <SliderOutput>
              {({ state }) =>
                state.values.map((_, index) => state.getThumbValueLabel(index)).join(" – ")
              }
            </SliderOutput>
          </div>
          <SliderTrack className={cx("react-aria-SliderTrack", "hashti-slider-track")}>
            {({ state }) => (
              <>
                <SliderFill className={cx("react-aria-SliderFill", "hashti-slider-fill")} />
                {state.values.map((_, index) => (
                  <SliderThumb
                    key={index}
                    index={index}
                    className={cx("react-aria-SliderThumb", "hashti-slider-thumb")}
                    aria-label={
                      thumbLabels?.[index] ??
                      (state.values.length > 1 ? (index === 0 ? "Minimum" : "Maximum") : undefined)
                    }
                  />
                ))}
              </>
            )}
          </SliderTrack>
        </>
      )}
    </RACSlider>
  );
}
