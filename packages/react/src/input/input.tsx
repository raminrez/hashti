"use client";

import type { ComponentProps } from "react";
import { Input as UiInput } from "@ui-sdk/react/input";

function Input({ className, ...props }: ComponentProps<typeof UiInput>) {
  return (
    <UiInput
      className={`hashti-input${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Input };
