"use client";

import { type ComponentProps } from "react";
import {
  Switch as UiSdkSwitch,
  SwitchThumb,
  type SwitchState,
} from "@ui-sdk/react/switch";
import { cx } from "../../utils";
import type { SelectionColor } from "../checkbox";

export interface SwitchProps extends ComponentProps<typeof UiSdkSwitch> {
  color?: SelectionColor;
  size?: "sm" | "md";
}

export function Switch({ className, children, size = "md", color, ...props }: SwitchProps) {
  const classHook =
    typeof className === "function"
      ? (state: SwitchState) => cx("hashti-switch", className(state))
      : cx("hashti-switch", className);
  return (
    <UiSdkSwitch {...props} data-size={size} data-color={color} className={classHook}>
      {(state) => (
        <>
          <span className="hashti-switch-track" aria-hidden="true">
            <SwitchThumb className="hashti-switch-thumb" />
          </span>
          {typeof children === "function"
            ? children(state)
            : children != null && <span>{children}</span>}
        </>
      )}
    </UiSdkSwitch>
  );
}
