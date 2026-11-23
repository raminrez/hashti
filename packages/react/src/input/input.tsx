"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import { Input as UiInput } from "@ui-sdk/react/input";

function Input({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: ComponentProps<typeof UiInput>) {
  // Standalone (field-less) controls only get aria-invalid from the app; the
  // styles key on data-invalid, so mirror it. "false" means valid, not invalid.
  const invalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== "false";
  return (
    <UiInput
      className={join("hashti-input", className)}
      aria-invalid={ariaInvalid}
      data-invalid={invalid ? "" : undefined}
      {...props}
    />
  );
}

export { Input };
