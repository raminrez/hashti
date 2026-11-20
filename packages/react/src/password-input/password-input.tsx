"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  PasswordInput as UiPasswordInput,
  PasswordInputControl as UiPasswordInputControl,
  PasswordInputToggle as UiPasswordInputToggle,
} from "@ui-sdk/react/password-input";

function PasswordInput(props: ComponentProps<typeof UiPasswordInput>) {
  return (
    <UiPasswordInput
      {...props}
      className={join("hashti-password-input", props.className)}
    />
  );
}

function PasswordInputControl(
  props: ComponentProps<typeof UiPasswordInputControl>,
) {
  return (
    <UiPasswordInputControl
      {...props}
      className={join("hashti-password-input__control", props.className)}
    />
  );
}

function PasswordInputToggle(
  props: ComponentProps<typeof UiPasswordInputToggle>,
) {
  return (
    <UiPasswordInputToggle
      {...props}
      className={join("hashti-password-input__toggle", props.className)}
    />
  );
}

export { PasswordInput, PasswordInputControl, PasswordInputToggle };
