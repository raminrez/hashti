"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  SegmentedControl as UiSegmentedControl,
  SegmentedControlIndicator as UiSegmentedControlIndicator,
  SegmentedControlItem as UiSegmentedControlItem,
} from "@ui-sdk/react/segmented-control";

function SegmentedControl<T extends string = string>(
  props: ComponentProps<typeof UiSegmentedControl<T>>,
) {
  return (
    <UiSegmentedControl
      {...props}
      className={join("hashti-segmented-control", props.className)}
    />
  );
}

function SegmentedControlIndicator(
  props: ComponentProps<typeof UiSegmentedControlIndicator>,
) {
  return (
    <UiSegmentedControlIndicator
      {...props}
      className={join("hashti-segmented-control-indicator", props.className)}
    />
  );
}

function SegmentedControlItem(
  props: ComponentProps<typeof UiSegmentedControlItem>,
) {
  return (
    <UiSegmentedControlItem
      {...props}
      className={join("hashti-segmented-control-item", props.className)}
    />
  );
}

export { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem };
