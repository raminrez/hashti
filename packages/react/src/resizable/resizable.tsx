"use client";

import type { ComponentProps } from "react";
import {
  Resizable as UiResizable,
  ResizableHandle as UiResizableHandle,
  ResizablePanel as UiResizablePanel,
} from "@ui-sdk/react/resizable";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Resizable({
  className,
  ...props
}: ComponentProps<typeof UiResizable>) {
  return (
    <UiResizable className={join("hashti-resizable", className)} {...props} />
  );
}

function ResizablePanel({
  className,
  ...props
}: ComponentProps<typeof UiResizablePanel>) {
  return (
    <UiResizablePanel
      className={join("hashti-resizable-panel", className)}
      {...props}
    />
  );
}

function ResizableHandle({
  className,
  ...props
}: ComponentProps<typeof UiResizableHandle>) {
  return (
    <UiResizableHandle
      className={join("hashti-resizable-handle", className)}
      {...props}
    />
  );
}

export { Resizable, ResizablePanel, ResizableHandle };
