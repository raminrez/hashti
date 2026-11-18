"use client";

import type { ComponentProps } from "react";
import { Toggle as UiSdkToggle } from "@ui-sdk/react/toggle";
import type { ToggleState } from "@ui-sdk/react/toggle";
import { cx, type ControlSize } from "../../utils";

export interface ToggleProps extends ComponentProps<typeof UiSdkToggle> {
  size?: ControlSize;
}

export function Toggle({ className, size, ...props }: ToggleProps) {
  const classHook =
    typeof className === "function"
      ? (state: ToggleState) => cx("hashti-toggle-button", className(state))
      : cx("hashti-toggle-button", className);

  return (
    <UiSdkToggle
      {...props}
      data-size={size}
      className={classHook}
    />
  );
}
