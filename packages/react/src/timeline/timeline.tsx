"use client";

import type { ComponentProps } from "react";
import {
  Timeline as UiTimeline,
  TimelineConnector as UiTimelineConnector,
  TimelineDescription as UiTimelineDescription,
  TimelineItem as UiTimelineItem,
  TimelineMarker as UiTimelineMarker,
  TimelineTime as UiTimelineTime,
  TimelineTitle as UiTimelineTitle,
} from "@ui-sdk/react/timeline";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Timeline({ className, ...props }: ComponentProps<typeof UiTimeline>) {
  return (
    <UiTimeline className={join("hashti-timeline", className)} {...props} />
  );
}

function TimelineItem({
  className,
  ...props
}: ComponentProps<typeof UiTimelineItem>) {
  return (
    <UiTimelineItem
      className={join("hashti-timeline__item", className)}
      {...props}
    />
  );
}

function TimelineMarker({
  className,
  ...props
}: ComponentProps<typeof UiTimelineMarker>) {
  return (
    <UiTimelineMarker
      className={join("hashti-timeline__marker", className)}
      {...props}
    />
  );
}

function TimelineConnector({
  className,
  ...props
}: ComponentProps<typeof UiTimelineConnector>) {
  return (
    <UiTimelineConnector
      className={join("hashti-timeline__connector", className)}
      {...props}
    />
  );
}

function TimelineTitle({
  className,
  ...props
}: ComponentProps<typeof UiTimelineTitle>) {
  return (
    <UiTimelineTitle
      className={join("hashti-timeline__title", className)}
      {...props}
    />
  );
}

function TimelineTime({
  className,
  ...props
}: ComponentProps<typeof UiTimelineTime>) {
  return (
    <UiTimelineTime
      className={join("hashti-timeline__time", className)}
      {...props}
    />
  );
}

function TimelineDescription({
  className,
  ...props
}: ComponentProps<typeof UiTimelineDescription>) {
  return (
    <UiTimelineDescription
      className={join("hashti-timeline__description", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
};
