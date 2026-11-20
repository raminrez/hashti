"use client"

import type { ComponentProps } from "react"
import {
  DateInput as UiDateInput,
  DateInputSegment as UiDateInputSegment,
} from "@ui-sdk/react/date-input"

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

function DateInput(props: ComponentProps<typeof UiDateInput>) {
  return <UiDateInput {...props} className={join("hashti-date-input", props.className)} />
}

function DateInputSegment(props: ComponentProps<typeof UiDateInputSegment>) {
  return (
    <UiDateInputSegment
      {...props}
      className={join("hashti-date-input__segment", props.className)}
    />
  )
}

export { DateInput, DateInputSegment }
