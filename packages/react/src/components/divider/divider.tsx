"use client";

import type { ReactNode, Ref } from "react";
import {
  Separator as RACSeparator,
  type SeparatorProps as RACSeparatorProps,
} from "react-aria-components";
import { cx } from "../../utils";

export interface DividerProps extends RACSeparatorProps {
  label?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export function Divider({
  label,
  orientation = "horizontal",
  className,
  ref,
  slot,
  ...props
}: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div
        {...props}
        slot={slot ?? undefined}
        ref={ref as Ref<HTMLDivElement>}
        role="separator"
        aria-orientation="horizontal"
        className={cx("hashti-divider-labeled", className)}
      >
        <span>{label}</span>
      </div>
    );
  }

  return (
    <RACSeparator
      {...props}
      slot={slot}
      ref={ref}
      orientation={orientation}
      className={cx("react-aria-Separator", "hashti-divider", className)}
    />
  );
}
