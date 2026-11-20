"use client";

import type { ComponentProps } from "react";
import {
  Meter as UiMeter,
  MeterIndicator as UiMeterIndicator,
  MeterLabel as UiMeterLabel,
  MeterTrack as UiMeterTrack,
  MeterValue as UiMeterValue,
} from "@ui-sdk/react/meter";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Meter({ className, ...props }: ComponentProps<typeof UiMeter>) {
  return <UiMeter className={join("hashti-meter", className)} {...props} />;
}

function MeterLabel({
  className,
  ...props
}: ComponentProps<typeof UiMeterLabel>) {
  return (
    <UiMeterLabel
      className={join("hashti-meter__label", className)}
      {...props}
    />
  );
}

function MeterValue({
  className,
  ...props
}: ComponentProps<typeof UiMeterValue>) {
  return (
    <UiMeterValue
      className={join("hashti-meter__value", className)}
      {...props}
    />
  );
}

function MeterTrack({
  className,
  ...props
}: ComponentProps<typeof UiMeterTrack>) {
  return (
    <UiMeterTrack
      className={join("hashti-meter-track", className)}
      {...props}
    />
  );
}

function MeterIndicator({
  className,
  ...props
}: ComponentProps<typeof UiMeterIndicator>) {
  return (
    <UiMeterIndicator
      className={join("hashti-meter-indicator", className)}
      {...props}
    />
  );
}

export { Meter, MeterLabel, MeterValue, MeterTrack, MeterIndicator };
