"use client"

import type { ComponentProps } from "react"
import {
  TimeInput as UiTimeInput,
  TimeInputSegment as UiTimeInputSegment,
} from "@ui-sdk/react/time-input"

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

function TimeInput(props: ComponentProps<typeof UiTimeInput>) {
  return <UiTimeInput {...props} className={join("hashti-time-input", props.className)} />
}

function TimeInputSegment(props: ComponentProps<typeof UiTimeInputSegment>) {
  return (
    <UiTimeInputSegment
      {...props}
      className={join("hashti-time-input__segment", props.className)}
    />
  )
}

export { TimeInput, TimeInputSegment }
