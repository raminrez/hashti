"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  TimeInput as UiTimeInput,
  TimeInputSegment as UiTimeInputSegment,
} from "@ui-sdk/react/time-input"


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
