"use client";

import type { ComponentProps } from "react";
import {
  Checkbox as UiCheckbox,
  CheckboxIndicator as UiCheckboxIndicator,
} from "@ui-sdk/react/checkbox";

function Checkbox({ className, ...props }: ComponentProps<typeof UiCheckbox>) {
  return (
    <UiCheckbox
      className={`hashti-checkbox${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

function CheckboxIndicator({
  className,
  ...props
}: ComponentProps<typeof UiCheckboxIndicator>) {
  return (
    <UiCheckboxIndicator
      className={`hashti-checkbox__indicator${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Checkbox, CheckboxIndicator };
