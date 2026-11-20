"use client"

import type { ComponentProps } from "react"
import {
  DatePicker as UiDatePicker,
  DatePickerContent as UiDatePickerContent,
  DatePickerHint as UiDatePickerHint,
  DatePickerInput as UiDatePickerInput,
  DatePickerTrigger as UiDatePickerTrigger,
} from "@ui-sdk/react/date-picker"

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

function DatePicker(props: ComponentProps<typeof UiDatePicker>) {
  return <UiDatePicker {...props} className={join("hashti-date-picker", props.className)} />
}

function DatePickerInput(props: ComponentProps<typeof UiDatePickerInput>) {
  return (
    <UiDatePickerInput
      {...props}
      className={join("hashti-date-picker-input", props.className)}
    />
  )
}

function DatePickerTrigger(props: ComponentProps<typeof UiDatePickerTrigger>) {
  return (
    <UiDatePickerTrigger
      {...props}
      className={join("hashti-date-picker-trigger", props.className)}
    />
  )
}

function DatePickerHint(props: ComponentProps<typeof UiDatePickerHint>) {
  return (
    <UiDatePickerHint
      {...props}
      className={join("hashti-date-picker-hint", props.className)}
    />
  )
}

function DatePickerContent(props: ComponentProps<typeof UiDatePickerContent>) {
  return (
    <UiDatePickerContent
      {...props}
      className={join("hashti-date-picker-content", props.className)}
    />
  )
}

export {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
}
