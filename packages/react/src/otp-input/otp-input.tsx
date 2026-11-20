"use client"

import type { ComponentProps } from "react"
import {
  OTPInput as UiOTPInput,
  OTPInputGroup as UiOTPInputGroup,
  OTPInputSeparator as UiOTPInputSeparator,
  OTPInputSlot as UiOTPInputSlot,
} from "@ui-sdk/react/otp-input"

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

function OTPInput(props: ComponentProps<typeof UiOTPInput>) {
  return <UiOTPInput {...props} className={join("hashti-otp-input", props.className)} />
}

function OTPInputGroup(props: ComponentProps<typeof UiOTPInputGroup>) {
  return (
    <UiOTPInputGroup {...props} className={join("hashti-otp-input-group", props.className)} />
  )
}

function OTPInputSlot(props: ComponentProps<typeof UiOTPInputSlot>) {
  return (
    <UiOTPInputSlot {...props} className={join("hashti-otp-input-slot", props.className)} />
  )
}

function OTPInputSeparator(props: ComponentProps<typeof UiOTPInputSeparator>) {
  return (
    <UiOTPInputSeparator
      {...props}
      className={join("hashti-otp-input-separator", props.className)}
    />
  )
}

export { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot }
