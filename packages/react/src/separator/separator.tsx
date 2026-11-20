"use client";

import type { ComponentProps } from "react";
import { Separator as UiSeparator } from "@ui-sdk/react/separator";

function Separator({
  className,
  ...props
}: ComponentProps<typeof UiSeparator>) {
  return (
    <UiSeparator
      className={`hashti-separator${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Separator };
