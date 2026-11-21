"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import { Textarea as UiTextarea } from "@ui-sdk/react/textarea";

function Textarea({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: ComponentProps<typeof UiTextarea>) {
  // Standalone (field-less) controls only get aria-invalid from the app; the
  // styles key on data-invalid, so mirror it. "false" means valid, not invalid.
  const invalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== "false";
  return (
    <UiTextarea
      className={join("hashti-textarea", className)}
      aria-invalid={ariaInvalid}
      data-invalid={invalid ? "" : undefined}
      {...props}
    />
  );
}

export { Textarea };
