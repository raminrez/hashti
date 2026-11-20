"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  NumberInput as UiNumberInput,
  NumberInputControl as UiNumberInputControl,
  NumberInputDecrement as UiNumberInputDecrement,
  NumberInputGroup as UiNumberInputGroup,
  NumberInputIncrement as UiNumberInputIncrement,
} from "@ui-sdk/react/number-input"


function NumberInput(props: ComponentProps<typeof UiNumberInput>) {
  return <UiNumberInput {...props} className={join("hashti-number-input", props.className)} />
}

function NumberInputGroup(props: ComponentProps<typeof UiNumberInputGroup>) {
  return (
    <UiNumberInputGroup
      {...props}
      className={join("hashti-number-input-group", props.className)}
    />
  )
}

function NumberInputControl(props: ComponentProps<typeof UiNumberInputControl>) {
  return (
    <UiNumberInputControl
      {...props}
      className={join("hashti-number-input__control", props.className)}
    />
  )
}

function NumberInputDecrement(props: ComponentProps<typeof UiNumberInputDecrement>) {
  return (
    <UiNumberInputDecrement
      {...props}
      className={join("hashti-number-input__step", props.className)}
    />
  )
}

function NumberInputIncrement(props: ComponentProps<typeof UiNumberInputIncrement>) {
  return (
    <UiNumberInputIncrement
      {...props}
      className={join("hashti-number-input__step", props.className)}
    />
  )
}

export {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
}
