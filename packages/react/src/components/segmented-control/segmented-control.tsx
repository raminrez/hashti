"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
  SegmentedControl as UiSdkSegmentedControl,
  SegmentedControlIndicator as UiSdkSegmentedControlIndicator,
  SegmentedControlItem as UiSdkSegmentedControlItem,
  type SegmentedControlItemState,
  type SegmentedControlState,
} from "@ui-sdk/react/segmented-control";
import { cx, type ControlSize } from "../../utils";

const SegmentedControlSizeContext = createContext<ControlSize>("md");

export interface SegmentedControlProps<T extends string = string>
  extends Omit<
    ComponentProps<typeof UiSdkSegmentedControl<T>>,
    "children" | "className"
  > {
  size?: ControlSize;
  className?: string | ((state: SegmentedControlState) => string | undefined);
  children?: ReactNode;
}

export function SegmentedControlRoot<T extends string = string>({
  size = "md",
  className,
  children,
  ...props
}: SegmentedControlProps<T>) {
  const classHook =
    typeof className === "function"
      ? (state: SegmentedControlState) => cx("hashti-content-switcher", className(state))
      : cx("hashti-content-switcher", className);

  return (
    <SegmentedControlSizeContext.Provider value={size}>
      <UiSdkSegmentedControl<T>
        {...props}
        data-size={size}
        className={classHook}
      >
        {/* A Hashti segmented control always ships its sliding indicator. */}
        <UiSdkSegmentedControlIndicator />
        {children}
      </UiSdkSegmentedControl>
    </SegmentedControlSizeContext.Provider>
  );
}

export interface SegmentedControlItemProps
  extends ComponentProps<typeof UiSdkSegmentedControlItem> {
  size?: ControlSize;
}

export function SegmentedControlItem({
  size,
  className,
  ...props
}: SegmentedControlItemProps) {
  const inheritedSize = useContext(SegmentedControlSizeContext);
  const classHook =
    typeof className === "function"
      ? (state: SegmentedControlItemState) => cx("hashti-toggle-button", className(state))
      : cx("hashti-toggle-button", className);

  return (
    <UiSdkSegmentedControlItem
      {...props}
      className={classHook}
      data-size={size ?? inheritedSize}
    />
  );
}

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
});
