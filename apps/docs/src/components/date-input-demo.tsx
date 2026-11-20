"use client"

import { Field, FieldLabel } from "@hashti/react"
import { DateInput } from "@hashti/react"

export function DateInputDemo() {
  return (
    <Field name="delivery-date" style={{ maxWidth: 220 }}>
      <FieldLabel>Delivery date</FieldLabel>
      <DateInput required />
    </Field>
  )
}
