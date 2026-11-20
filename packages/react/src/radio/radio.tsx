"use client";

import type { ComponentProps } from "react";
import {
  Radio as UiRadio,
  RadioGroup as UiRadioGroup,
  RadioIndicator as UiRadioIndicator,
} from "@ui-sdk/react/radio";

function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof UiRadioGroup>) {
  return (
    <UiRadioGroup
      className={`hashti-radio-group${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

function Radio({ className, ...props }: ComponentProps<typeof UiRadio>) {
  return (
    <UiRadio
      className={`hashti-radio${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

function RadioIndicator({
  className,
  ...props
}: ComponentProps<typeof UiRadioIndicator>) {
  return (
    <UiRadioIndicator
      className={`hashti-radio__indicator${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { RadioGroup, Radio, RadioIndicator };
