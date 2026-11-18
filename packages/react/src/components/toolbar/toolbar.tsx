"use client";

import { createContext, type ComponentProps, type Ref } from "react";
import {
  Toolbar as UiSdkToolbar,
  ToolbarGroup as UiSdkToolbarGroup,
  ToolbarSeparator as UiSdkToolbarSeparator,
  type ToolbarGroupState,
  type ToolbarSeparatorState,
  type ToolbarState,
} from "@ui-sdk/react/toolbar";
import { cx, type ControlSize } from "../../utils";

export interface ToolbarContextValue {
  size?: ControlSize;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export const ToolbarContext = createContext<ToolbarContextValue>({});

export interface ToolbarProps extends ComponentProps<typeof UiSdkToolbar> {
  size?: ControlSize;
  variant?: "flat" | "raised" | "floating";
}

export function ToolbarRoot({
  size = "md",
  orientation = "horizontal",
  variant = "flat",
  disabled,
  className,
  children,
  ...props
}: ToolbarProps) {
  const contextValue: ToolbarContextValue = { size, orientation, disabled };

  const classHook =
    typeof className === "function"
      ? (state: ToolbarState) => cx("hashti-toolbar", className(state))
      : cx("hashti-toolbar", className);

  return (
    <ToolbarContext.Provider value={contextValue}>
      <UiSdkToolbar
        {...props}
        orientation={orientation}
        disabled={disabled}
        data-size={size}
        data-variant={variant}
        className={classHook}
      >
        {children}
      </UiSdkToolbar>
    </ToolbarContext.Provider>
  );
}

export interface ToolbarGroupProps extends ComponentProps<typeof UiSdkToolbarGroup> {
  ref?: Ref<HTMLDivElement>;
}

export function ToolbarGroup({ className, children, ...props }: ToolbarGroupProps) {
  const classHook =
    typeof className === "function"
      ? (state: ToolbarGroupState) => cx("hashti-toolbar-group", className(state))
      : cx("hashti-toolbar-group", className);

  return (
    <UiSdkToolbarGroup {...props} className={classHook}>
      {children}
    </UiSdkToolbarGroup>
  );
}

export interface ToolbarItemProps extends ComponentProps<"div"> {
  ref?: Ref<HTMLDivElement>;
}

export function ToolbarItem({ className, children, ...props }: ToolbarItemProps) {
  return (
    <div {...props} className={cx("hashti-toolbar-item", className)}>
      {children}
    </div>
  );
}

// The separator's line runs across the toolbar's axis; ui-sdk derives it from
// the toolbar's orientation.
export type ToolbarSeparatorProps = ComponentProps<typeof UiSdkToolbarSeparator>;

export function ToolbarSeparator({
  className,
  ...props
}: ComponentProps<typeof UiSdkToolbarSeparator>) {
  const classHook =
    typeof className === "function"
      ? (state: ToolbarSeparatorState) => cx("hashti-toolbar-separator", className(state))
      : cx("hashti-toolbar-separator", className);

  return <UiSdkToolbarSeparator {...props} className={classHook} />;
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Item: ToolbarItem,
  Separator: ToolbarSeparator,
});
