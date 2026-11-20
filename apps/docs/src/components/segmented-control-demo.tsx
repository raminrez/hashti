"use client";

import { useState } from "react";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@hashti/react";

export function SegmentedControlVerticalDemo() {
  const [align, setAlign] = useState<string | null>("middle");
  return (
    <SegmentedControl
      value={align}
      onValueChange={setAlign}
      orientation="vertical"
      aria-label="Vertical alignment"
    >
      <SegmentedControlIndicator />
      <SegmentedControlItem value="top">Top</SegmentedControlItem>
      <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
      <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
    </SegmentedControl>
  );
}

export function SegmentedControlDemo() {
  const [view, setView] = useState<string | null>("day");
  return (
    <SegmentedControl
      value={view}
      onValueChange={setView}
      aria-label="Calendar view"
      style={{ width: 320 }}
    >
      <SegmentedControlIndicator />
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  );
}
