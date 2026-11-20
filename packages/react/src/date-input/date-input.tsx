"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  DateInput as UiDateInput,
  DateInputSegment as UiDateInputSegment,
} from "@ui-sdk/react/date-input"


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
