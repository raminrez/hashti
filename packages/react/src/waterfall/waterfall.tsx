"use client";

import type { ComponentProps } from "react";
import {
  Waterfall as UiWaterfall,
  WaterfallAxis as UiWaterfallAxis,
  WaterfallBar as UiWaterfallBar,
  WaterfallCell as UiWaterfallCell,
  WaterfallColumnHeader as UiWaterfallColumnHeader,
  WaterfallHeaderRow as UiWaterfallHeaderRow,
  WaterfallIndicator as UiWaterfallIndicator,
  WaterfallMark as UiWaterfallMark,
  WaterfallRow as UiWaterfallRow,
  WaterfallRowHeader as UiWaterfallRowHeader,
  WaterfallTick as UiWaterfallTick,
} from "@ui-sdk/react/waterfall";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Waterfall({
  className,
  ...props
}: ComponentProps<typeof UiWaterfall>) {
  return (
    <UiWaterfall className={join("hashti-waterfall", className)} {...props} />
  );
}

function WaterfallHeaderRow({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallHeaderRow>) {
  return (
    <UiWaterfallHeaderRow
      className={join("hashti-waterfall__header-row", className)}
      {...props}
    />
  );
}

function WaterfallColumnHeader({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallColumnHeader>) {
  return (
    <UiWaterfallColumnHeader
      className={join("hashti-waterfall__column-header", className)}
      {...props}
    />
  );
}

function WaterfallAxis({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallAxis>) {
  return (
    <UiWaterfallAxis
      className={join("hashti-waterfall__axis", className)}
      {...props}
    />
  );
}

function WaterfallTick({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallTick>) {
  return (
    <UiWaterfallTick
      className={join("hashti-waterfall__tick", className)}
      {...props}
    />
  );
}

function WaterfallMark({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallMark>) {
  return (
    <UiWaterfallMark
      className={join("hashti-waterfall__mark", className)}
      {...props}
    />
  );
}

function WaterfallRow({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallRow>) {
  return (
    <UiWaterfallRow
      className={join("hashti-waterfall__row", className)}
      {...props}
    />
  );
}

function WaterfallRowHeader({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallRowHeader>) {
  return (
    <UiWaterfallRowHeader
      className={join("hashti-waterfall__row-header", className)}
      {...props}
    />
  );
}

function WaterfallIndicator({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallIndicator>) {
  return (
    <UiWaterfallIndicator
      className={join("hashti-waterfall__indicator", className)}
      {...props}
    />
  );
}

function WaterfallCell({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallCell>) {
  return (
    <UiWaterfallCell
      className={join("hashti-waterfall__cell", className)}
      {...props}
    />
  );
}

function WaterfallBar({
  className,
  ...props
}: ComponentProps<typeof UiWaterfallBar>) {
  return (
    <UiWaterfallBar
      className={join("hashti-waterfall__bar", className)}
      {...props}
    />
  );
}

export {
  Waterfall,
  WaterfallHeaderRow,
  WaterfallColumnHeader,
  WaterfallAxis,
  WaterfallTick,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
  WaterfallIndicator,
  WaterfallCell,
  WaterfallBar,
};
