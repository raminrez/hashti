"use client"

import type { ComponentProps } from "react"
import {
  PasswordInput as UiPasswordInput,
  PasswordInputControl as UiPasswordInputControl,
  PasswordInputToggle as UiPasswordInputToggle,
} from "@ui-sdk/react/password-input"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

function PasswordInput(props: ComponentProps<typeof UiPasswordInput>) {
  return <UiPasswordInput {...props} className={join("hashti-password-input", props.className)} />
}

function PasswordInputControl(props: ComponentProps<typeof UiPasswordInputControl>) {
  return (
    <UiPasswordInputControl
      {...props}
      className={join("hashti-password-input__control", props.className)}
    />
  )
}

function PasswordInputToggle(props: ComponentProps<typeof UiPasswordInputToggle>) {
  return (
    <UiPasswordInputToggle
      {...props}
      className={join("hashti-password-input__toggle", props.className)}
    />
  )
}

export { PasswordInput, PasswordInputControl, PasswordInputToggle }
