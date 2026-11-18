"use client";

import { Separator as UiSdkSeparator } from "@ui-sdk/react/separator";
import type { SeparatorState } from "@ui-sdk/react/separator";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";

export interface SeparatorProps extends ComponentProps<typeof UiSdkSeparator> {
  /** Centered text inside a horizontal separator (e.g. "or continue with email"). */
  label?: ReactNode;
}

export function Separator({ label, orientation = "horizontal", className, ...props }: SeparatorProps) {
  const classHook =
    typeof className === "function"
      ? (state: SeparatorState) => cx("hashti-separator", className(state))
      : cx("hashti-separator", className);

  if (label != null && orientation === "horizontal") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cx("hashti-separator-labeled", typeof className === "string" ? className : undefined)}
      >
        <span>{label}</span>
      </div>
    );
  }

  return <UiSdkSeparator {...props} orientation={orientation} className={classHook} />;
}
