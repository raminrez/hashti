"use client"

import { Field, FieldLabel } from "@hashti/react"
import { TimeInput } from "@hashti/react"

export function TimeInputDemo() {
  return (
    <Field name="reminder-time" style={{ maxWidth: 200 }}>
      <FieldLabel>Reminder time</FieldLabel>
      <TimeInput required />
    </Field>
  )
}
