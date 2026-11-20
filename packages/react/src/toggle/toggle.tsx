"use client";

import type { ComponentProps } from "react";
import {
  Toggle as UiToggle,
  ToggleGroup as UiToggleGroup,
  ToggleIcon as UiToggleIcon,
} from "@ui-sdk/react/toggle";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Toggle({ className, ...props }: ComponentProps<typeof UiToggle>) {
  return <UiToggle className={join("hashti-toggle", className)} {...props} />;
}

function ToggleGroup({
  className,
  ...props
}: ComponentProps<typeof UiToggleGroup>) {
  return (
    <UiToggleGroup
      className={join("hashti-toggle-group", className)}
      {...props}
    />
  );
}

function ToggleIcon({
  className,
  ...props
}: ComponentProps<typeof UiToggleIcon>) {
  return (
    <UiToggleIcon
      className={join("hashti-toggle-icon", className)}
      {...props}
    />
  );
}

export { Toggle, ToggleGroup, ToggleIcon };
