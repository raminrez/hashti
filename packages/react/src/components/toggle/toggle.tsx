"use client";

import { createContext, useContext, type ComponentProps } from "react";
import {
  Toggle as UiSdkToggle,
  ToggleGroup as UiSdkToggleGroup,
} from "@ui-sdk/react/toggle";
import type { ToggleState, ToggleGroupState } from "@ui-sdk/react/toggle";
import { cx, type ControlSize } from "../../utils";

export interface ToggleProps extends ComponentProps<typeof UiSdkToggle> {
  size?: ControlSize;
}

const ContentSwitcherSizeContext = createContext<ControlSize>("md");

export function Toggle({ className, size, ...props }: ToggleProps) {
  const inheritedSize = useContext(ContentSwitcherSizeContext);
  const classHook =
    typeof className === "function"
      ? (state: ToggleState) => cx("hashti-toggle-button", className(state))
      : cx("hashti-toggle-button", className);

  return (
    <UiSdkToggle
      {...props}
      data-size={size ?? inheritedSize}
      className={classHook}
    />
  );
}

export interface ContentSwitcherProps
  extends Omit<ComponentProps<typeof UiSdkToggleGroup>, "multiple"> {
  size?: ControlSize;
}

export function ContentSwitcher({
  className,
  size = "md",
  ...props
}: ContentSwitcherProps) {
  const classHook =
    typeof className === "function"
      ? (state: ToggleGroupState<string>) => cx("hashti-content-switcher", className(state))
      : cx("hashti-content-switcher", className);

  return (
    <ContentSwitcherSizeContext.Provider value={size}>
      <UiSdkToggleGroup
        {...props}
        // A content switcher always keeps one option pressed.
        deselectable={false}
        data-size={size}
        className={classHook}
      />
    </ContentSwitcherSizeContext.Provider>
  );
}
