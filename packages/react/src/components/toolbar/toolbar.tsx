"use client";

import { createContext, useContext, type ComponentProps, type Ref } from "react";
import {
  Toolbar as RACToolbar,
  Group as RACGroup,
  Separator as RACSeparator,
  SeparatorContext as RACSeparatorContext,
  ToggleButtonGroupContext as RACToggleButtonGroupContext,
  type ToolbarProps as RACToolbarProps,
  type GroupProps as RACGroupProps,
  type SeparatorProps as RACSeparatorProps,
} from "react-aria-components";
import { classes, cx, type ControlSize } from "../../utils";

export interface ToolbarContextValue {
  size?: ControlSize;
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
}

export const ToolbarContext = createContext<ToolbarContextValue>({});

export interface ToolbarProps extends Omit<RACToolbarProps, "className"> {
  size?: ControlSize;
  orientation?: "horizontal" | "vertical";
  variant?: "flat" | "raised" | "floating";
  isDisabled?: boolean;
  className?: RACToolbarProps["className"];
  ref?: Ref<HTMLDivElement>;
}

export function ToolbarRoot({
  size = "md",
  orientation = "horizontal",
  variant = "flat",
  isDisabled,
  className,
  children,
  ...props
}: ToolbarProps) {
  const contextValue: ToolbarContextValue = {
    size,
    orientation,
    isDisabled,
  };

  const separatorOrientation = orientation === "vertical" ? "horizontal" : "vertical";

  return (
    <ToolbarContext.Provider value={contextValue}>
      <RACToggleButtonGroupContext.Provider value={{ orientation }}>
        <RACSeparatorContext.Provider value={{ orientation: separatorOrientation }}>
          <RACToolbar
            {...props}
            aria-disabled={isDisabled || undefined}
            data-disabled={isDisabled || undefined}
            orientation={orientation}
            data-size={size}
            data-orientation={orientation}
            data-variant={variant}
            className={classes("react-aria-Toolbar hashti-toolbar", className)}
          >
            {children}
          </RACToolbar>
        </RACSeparatorContext.Provider>
      </RACToggleButtonGroupContext.Provider>
    </ToolbarContext.Provider>
  );
}

export interface ToolbarGroupProps extends Omit<RACGroupProps, "className"> {
  ariaLabel?: string;
  className?: RACGroupProps["className"];
  ref?: Ref<HTMLDivElement>;
}

export function ToolbarGroup({
  ariaLabel,
  "aria-label": ariaLabelProp,
  className,
  children,
  ...props
}: ToolbarGroupProps) {
  return (
    <RACGroup
      {...props}
      aria-label={ariaLabel ?? ariaLabelProp}
      className={classes("hashti-toolbar-group", className)}
    >
      {children}
    </RACGroup>
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

export interface ToolbarSeparatorProps extends RACSeparatorProps {
  ref?: Ref<HTMLElement>;
}

export function ToolbarSeparator({ orientation, className, ...props }: ToolbarSeparatorProps) {
  const toolbarContext = useContext(ToolbarContext);
  const defaultOrientation = toolbarContext.orientation === "vertical" ? "horizontal" : "vertical";
  const resolvedOrientation = orientation ?? defaultOrientation;

  return (
    <RACSeparator
      {...props}
      orientation={resolvedOrientation}
      className={cx("react-aria-Separator", "hashti-toolbar-separator", className)}
    />
  );
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Item: ToolbarItem,
  Separator: ToolbarSeparator,
});
